using MimeKit;
using BCrypt.Net;
using MailKit.Net.Smtp;
using Neo4j.Driver;
using Neo4j.Server.Models;
using Org.BouncyCastle.Crypto.Generators;
using System.Net.Mail;
using System.Security.Cryptography;

namespace Neo4j.Server.Services
{
    public class Neo4jService
    {
        private readonly IDriver _driver;

        public Neo4jService(IConfiguration config)
        {
            _driver = GraphDatabase.Driver(
                config["Neo4j:Uri"],
                AuthTokens.Basic(config["Neo4j:User"], config["Neo4j:Password"])
            );
        }

        public async Task<List<string>> GetProductNames()
        {
            var session = _driver.AsyncSession();
            var result = await session.RunAsync("MATCH (p:Product) RETURN p.name AS name");
            var names = await result.ToListAsync(r => r["name"].As<string>());
            await session.CloseAsync();
            return names;
        }

        public async Task<List<ProductDto>> GetProductsAsync(string? sortBy = null, bool desc = false, string? category = null)
        {
            var products = new List<ProductDto>();
            var session = _driver.AsyncSession();

            try
            {
                string sortField = sortBy?.ToLower() switch
                {
                    "price" => "p.price",
                    "name" => "p.name",
                    _ => ""
                };

                string sortClause = !string.IsNullOrEmpty(sortField)
                    ? $"ORDER BY {sortField} {(desc ? "DESC" : "")}"
                    : "";

                string query = category != null
                    ? @$"MATCH (p:Product)-[:BELONGS_TO]->(c:Category {{name: $category}})
                         RETURN p {sortClause}"
                    : @$"MATCH (p:Product)
                         RETURN p {sortClause}";

                var parameters = new Dictionary<string, object>();
                if (category != null)
                    parameters["category"] = category;

                var cursor = await session.RunAsync(query, parameters);

                await cursor.ForEachAsync(record =>
                {
                    var node = record["p"].As<INode>();

                    var rawImage = node.Properties["imageUrl"].As<string>();
                    var normalizedImageUrl = Path.GetFileName(rawImage);

                    var product = new ProductDto
                    {
                        Id = node.Properties["id"].As<string>(),
                        Name = node.Properties["name"].As<string>(),
                        Price = Convert.ToDouble(node.Properties["price"]),
                        ImageUrl = normalizedImageUrl,
                        Description = node.Properties.ContainsKey("description")
                            ? node.Properties["description"].As<string>()
                            : "",
                        Tags = node.Properties.ContainsKey("tags")
                            ? node.Properties["tags"].As<List<object>>().Select(t => t.ToString()).ToList()
                            : new List<string>()
                    };

                    products.Add(product);
                });
            }
            finally
            {
                await session.CloseAsync();
            }

            return products;
        }

        public async Task<bool> RegisterUserAsync(UserDto user)
        {
            var session = _driver.AsyncSession();
            try
            {
                var checkQuery = @"MATCH (u:User) WHERE toLower(u.email) = toLower($email) RETURN u";
                
                var checkCursor = await session.RunAsync(checkQuery, new { email = user.Email });
                if (await checkCursor.FetchAsync()) return false;

                var token = Guid.NewGuid().ToString();

                var createQuery = @"
            CREATE (u:User {
                username: $username,
                email: $email,
                password: $password,
                token: $token,
                verified: false
            })
        ";

                await session.RunAsync(createQuery, new
                {
                    username = user.Username,
                    email = user.Email,
                    password = user.Password,
                    token
                });

                await SendVerificationEmail(user.Email, token);

                return true;
            }
            finally
            {
                await session.CloseAsync();
            }
        }



        public async Task CreateCategoryAsync(CategoryDto category)
        {
            var session = _driver.AsyncSession();
            try
            {
                await session.RunAsync(@"
            MERGE (:Category {name: $name})
        ", new { name = category.Name });
            }
            finally
            {
                await session.CloseAsync();
            }
        }



        public async Task<bool> VerifyEmailAsync(string token)
        {
            await using var session = _driver.AsyncSession();
            try
            {               
                var checkQuery = "MATCH (u:User {token: $token}) RETURN u";
                var result = await session.RunAsync(checkQuery, new { token });

                if (!await result.FetchAsync())
                    return false;

                var updateQuery = @"
            MATCH (u:User {token: $token})
            SET u.verified = true
            REMOVE u.token";

                await session.WriteTransactionAsync(tx =>
                    tx.RunAsync(updateQuery, new { token })
                );

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Verification error: " + ex.Message);
                return false;
            }
            finally
            {
                await session.CloseAsync();
            }
        }


        public async Task SendVerificationEmail(string recipientEmail, string token)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("TechTrolly", "vikashgupta.it45@gmail.com"));
            message.To.Add(MailboxAddress.Parse(recipientEmail));
            message.Subject = "Welcome to Techtrolly - Verify your email";

            string verificationUrl = $"https://graphkart.onrender.com/verify?token={token}";


            message.Body = new TextPart("plain")
            {
                Text = $"Hello {recipientEmail},\n\nWelcome to Arbeit Search!\nPlease verify your email by clicking the link below:\n\n{verificationUrl}\n\nThanks,\nTechTrolly Team"
            };

            using var smtp = new MailKit.Net.Smtp.SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync("vikashgupta.it45@gmail.com", "imzfljfezqepszjg");
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }

        public async Task<LoginValidationResult> ValidateUserAsync(string email, string password)
        {
            var query = @"
MATCH (u:User)
WHERE toLower(u.email) = toLower($email)
RETURN u.password AS password, u.verified AS isVerified
";

            using var session = _driver.AsyncSession();
            var result = await session.RunAsync(query, new { email });
            var record = (await result.ToListAsync()).FirstOrDefault();

            if (record == null)
            {
                Console.WriteLine($"No user found with email: {email}");
                return new LoginValidationResult { Exists = false };
            }

            string storedPassword = record["password"]?.As<string>() ?? string.Empty;

            bool isVerified = record.Keys.Contains("isVerified") && record["isVerified"] is not null
                ? record["isVerified"].As<bool>()
                : false;

            bool passwordMatch = storedPassword == password;

            return new LoginValidationResult
            {
                Exists = true,
                IsVerified = isVerified,
                PasswordMatch = passwordMatch
            };
        }





        public async Task CreateProductAsync(ProductDto product)
        {
            var session = _driver.AsyncSession();
            try
            {
                var productId = Guid.NewGuid().ToString();

                var query = @"
            CREATE (p:Product {
                id: $id,
                name: $name,
                price: $price,
                imageUrl: $imageUrl,
                description: $description,
                tags: $tags
            })";

                var parameters = new Dictionary<string, object>
        {
            { "id", productId },
            { "name", product.Name },
            { "price", product.Price },
            { "imageUrl", product.ImageUrl },
            { "description", product.Description ?? "" },
            { "tags", product.Tags ?? new List<string>() }
        };

                await session.RunAsync(query, parameters);
            }
            finally
            {
                await session.CloseAsync();
            }
        }



        public async Task CreateViewedRelationAsync(string username, string productId)
        {
            var query = @"
        MERGE (u:User {username: $username})
        MERGE (p:Product {id: $productId})
        MERGE (u)-[:VIEWED]->(p)
    ";

            var session = _driver.AsyncSession();
            try
            {
                await session.RunAsync(query, new { username, productId });
            }
            finally
            {
                await session.CloseAsync();
            }
        }

        public async Task CreateProductWithCategoryAsync(ProductDto product, string categoryName)
        {
            var session = _driver.AsyncSession();
            try
            {
                var query = @"
                    MERGE (c:Category {name: $categoryName})
                    CREATE (p:Product {
                        id: $id,
                        name: $name,
                        price: $price,
                        imageUrl: $imageUrl,
                        description: $description,
                        tags: $tags
                    })
                    MERGE (p)-[:BELONGS_TO]->(c)";

                var parameters = new Dictionary<string, object>
                {
                    { "id", product.Id },
                    { "name", product.Name },
                    { "price", product.Price },
                    { "imageUrl", product.ImageUrl },
                    { "description", product.Description ?? "" },
                    { "tags", product.Tags ?? new List<string>() },
                    { "categoryName", categoryName }
                };

                await session.RunAsync(query, parameters);
            }
            finally
            {
                await session.CloseAsync();
            }
        }

        public async Task<List<ProductDto>> GetProductsByCategoryAsync(string categoryName)
        {
            return await GetProductsAsync(null, false, categoryName);
        }

        public async Task<ProductDto?> GetProductByIdAsync(string id)
        {
            var query = "MATCH (n:Product) WHERE n.id = $id RETURN n";

            try
            {
                await using var session = _driver.AsyncSession();

                var cursor = await session.RunAsync(query, new { id });

                if (await cursor.FetchAsync())
                {
                    var node = cursor.Current["n"].As<INode>();

                    return new ProductDto
                    {
                        Id = node.Properties["id"].As<string>(),
                        Name = node.Properties["name"].As<string>(),
                        Price = node.Properties["price"].As<double>(),
                        ImageUrl = node.Properties["imageUrl"].As<string>(),
                        Description = node.Properties.ContainsKey("description")
                                        ? node.Properties["description"].As<string>()
                                        : "",
                        Tags = node.Properties.ContainsKey("tags")
                                ? node.Properties["tags"].As<List<string>>()
                                : new List<string>()
                    };
                }

                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Neo4j Error: " + ex.Message);
                return null;
            }
        }

        public async Task<bool> AddProductToWishlistAsync(string productId, string userName)
        {
            var session = _driver.AsyncSession();
            try
            {
                var query = @"
            MATCH (p:Product {id: $productId})
            MERGE (u:User {name: $userName})
            MERGE (u)-[:OWNS]->(w:Wishlist {name: $wishlistName})
            MERGE (w)-[:HAS]->(p)
        ";

                string wishlistName = $"{userName}_wishlist";
                var parameters = new Dictionary<string, object>
        {
            { "productId", productId },
            { "userName", userName },
            { "wishlistName", wishlistName }
        };

                await session.RunAsync(query, parameters);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Wishlist add error: {ex.Message}");
                return false;
            }
            finally
            {
                await session.CloseAsync();
            }
        }
    }

    public static class BCrypt
    {
        public static string HashPassword(string password)
        {
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            using (var rfc2898 = new Rfc2898DeriveBytes(password, salt, 10000))
            {
                byte[] hash = rfc2898.GetBytes(20);

                byte[] hashBytes = new byte[36];
                Array.Copy(salt, 0, hashBytes, 0, 16);
                Array.Copy(hash, 0, hashBytes, 16, 20);

                return Convert.ToBase64String(hashBytes);
            }
        }
    }
}
