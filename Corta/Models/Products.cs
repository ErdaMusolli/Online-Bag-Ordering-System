namespace Corta.Models
{
    public class Product
    {
        public int Id { get; set; }
        required public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? ImageUrl { get; set; }
        public string? Size { get; set; }
        public bool IsNewArrival { get; set; } = false;
        public bool IsBestseller { get; set; } = false;
        public bool IsSpecialOffer { get; set; } = false;
    public ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

}
}