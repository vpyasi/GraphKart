using Neo4j.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSingleton<Neo4j.Server.Services.Neo4jService>();

// ✅ Configure Neo4j driver using appsettings.json
var neo4jSettings = builder.Configuration.GetSection("Neo4j");
var uri = neo4jSettings["Uri"];
var user = neo4jSettings["User"];
var password = neo4jSettings["Password"];

builder.Services.AddSingleton(GraphDatabase.Driver(uri, AuthTokens.Basic(user, password)));

// ✅ Add CORS service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy
            .WithOrigins("https://localhost:59548", "http://localhost:3000") // frontend dev URLs
            .SetIsOriginAllowed(_ => true) // <-- allow any origin dynamically (for prod flexibility)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets(); // Serves /assets or static SPA files

// ✅ Apply CORS before routing
app.UseCors("AllowAllOrigins");

// ✅ Only use HTTPS redirection in development (to avoid issues on Render)
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
    app.MapOpenApi();
}

// ✅ Use authorization/middleware
app.UseAuthorization();
app.MapControllers();

// ✅ Fallback for SPA routing
app.MapFallbackToFile("/index.html");

// ✅ Render-compatible port binding
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://*:{port}");

app.Run();
