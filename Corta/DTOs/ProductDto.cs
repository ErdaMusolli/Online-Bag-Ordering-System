namespace Corta.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string? ImageUrl { get; set; }
    public string? Size { get; set; }

    public DateTime CreatedAt { get; set; }
    public int PurchaseCount { get; set; }
    public decimal? OldPrice { get; set; }
        public List<ProductImageDto> ProductImages { get; set; } = new();
        public List<IFormFile>? AdditionalImages { get; set; }

    }
}
