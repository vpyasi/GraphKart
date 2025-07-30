namespace Neo4j.Server.Models
{
    public class ProductDto
    {
        public string Id { get; set; } 
        public string Name { get; set; }
        public double Price { get; set; }
        public string ImageUrl { get; set; }
        public string Description { get; set; }
        public List<string> Tags { get; set; }
        public string Category { get; set; } 
    }

}
