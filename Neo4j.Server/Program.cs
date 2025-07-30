using Neo4j.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSingleton<Neo4j.Server.Services.Neo4jService>();

// ✅ Configure Neo4j driver using appsettings.json
var neo4jSettings = builder.Configuration.GetSection("Neo4j");
var uri = neo4jSettings["Uri"];
var user = neo4jSettings["User"];
var password = neo4jSettings["Password"];

builder.Services.AddSingleton(GraphDatabase.Driver(uri, AuthTokens.Basic(user, password)));

builder.Services.AddSingleton(GraphDatabase.Driver(uri, AuthTokens.Basic(user, password)));

// ✅ Add CORS service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy
            .WithOrigins("https://localhost:59548", "http://localhost:3000") // include all possible frontend origins
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials(); // if you're using cookies/auth
    });
});

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets(); // make sure this serves your /assets folder correctly

// ✅ Apply CORS before routing, authorization, etc.
app.UseCors("AllowAllOrigins");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
