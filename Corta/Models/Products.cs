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

        public DateTime CreatedAt { get; set; }
        public int PurchaseCount { get; set; }
        public decimal? OldPrice { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public string? Material { get; set; }  

        public ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
        public ICollection<PurchaseItem> PurchaseItems { get; set; } = new List<PurchaseItem>();
        public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    }
}
