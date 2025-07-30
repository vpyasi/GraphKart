using Microsoft.AspNetCore.Mvc;
using Neo4j.Server.Models;
using Neo4j.Server.Services;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly Neo4jService _neo4j;

    public CategoriesController(Neo4jService neo4j)
    {
        _neo4j = neo4j;
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryDto category)
    {
        try
        {
            await _neo4j.CreateCategoryAsync(category);
            return Ok(new { message = "Category created successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
