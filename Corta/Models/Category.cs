namespace Corta.Models
{
    public class Category
    {
        public int Id { get; set; }
        required public string Name { get; set; }
        required public string Slug { get; set; }  
        public string? ImageUrl { get; set; }     

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
