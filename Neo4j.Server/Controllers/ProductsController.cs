using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver;
using Neo4j.Server.Models;
using Neo4j.Server.Services;
using Newtonsoft.Json;
using Neo4j.Driver;
using YourProjectNamespace.Models;

namespace Neo4j.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly Neo4jService _neo4j;
        private readonly IDriver _driver;

        public ProductsController(Neo4jService neo4j, IDriver driver)
        {
            _neo4j = neo4j;
            _driver = driver;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> GetProducts(
            [FromQuery] string? sortBy,
            [FromQuery] bool desc = false,
            [FromQuery] string? category = null)
        {
            var products = await _neo4j.GetProductsAsync(sortBy, desc, category);
            return Ok(products);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto user)
        {
            try
            {
                var success = await _neo4j.RegisterUserAsync(user);
                if (!success)
                    return BadRequest(new { message = "Username already exists." });

                return Ok(new { message = "Registration successful! Please check your email to verify your account." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Register Error] {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPost("Add")]
        public async Task<IActionResult> CreateProduct([FromBody] ProductDto product)
        {
            try
            {
                await _neo4j.CreateProductAsync(product);
                return Ok(new { message = "Product created successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpGet("verify")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required." });

            var success = await _neo4j.VerifyEmailAsync(token);
            if (!success)
                return BadRequest(new { message = "Invalid or expired token." });

            return Ok(new { message = "Email verified successfully!" });
        }





        [HttpGet("names")]
        public async Task<ActionResult<List<string>>> GetNames()
        {
            var names = await _neo4j.GetProductNames();
            return Ok(names);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(
            [FromBody] ProductDto product,
            [FromQuery] string? categoryName = null)
        {
            if (product == null)
                return BadRequest("Product data is required.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!string.IsNullOrWhiteSpace(categoryName))
            {
                await _neo4j.CreateProductWithCategoryAsync(product, categoryName);
            }
            else
            {
                await _neo4j.CreateProductAsync(product);
            }

            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(string id)
        {
            var product = await _neo4j.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPost("wishlist")]
        public async Task<IActionResult> AddToWishlist([FromBody] WishlistRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.ProductId) || string.IsNullOrWhiteSpace(request.UserName))
                return BadRequest("User name and Product ID are required.");

            var added = await _neo4j.AddProductToWishlistAsync(request.ProductId, request.UserName);
            if (!added)
                return StatusCode(500, "Failed to add product to wishlist.");

            return Ok(new { message = "Product added to wishlist." });
        }

        [HttpPost("viewed")]
        public async Task<IActionResult> MarkProductAsViewed([FromBody] ViewRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.ProductId))
            {
                return BadRequest("Username and ProductId are required.");
            }

            try
            {
                await _neo4j.CreateViewedRelationAsync(request.Username, request.ProductId);
                return Ok(new { message = "View relationship created successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating view relationship: {ex.Message}");
            }
        }

    }
}
