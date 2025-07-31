using Neo4j.Driver;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSingleton<Neo4j.Server.Services.Neo4jService>();


var neo4jSettings = builder.Configuration.GetSection("Neo4j");
var uri = neo4jSettings["Uri"];
var user = neo4jSettings["User"];
var password = neo4jSettings["Password"];

builder.Services.AddSingleton(GraphDatabase.Driver(uri, AuthTokens.Basic(user, password)));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "https://localhost:59548",
                "http://localhost:3000",
                "https://graphkart.onrender.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();


app.UseDefaultFiles();
app.MapStaticAssets();

app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
    app.MapOpenApi();
}

app.UseAuthorization();
app.MapControllers();

app.MapFallbackToFile("/index.html");

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://*:{port}");

app.Run();
