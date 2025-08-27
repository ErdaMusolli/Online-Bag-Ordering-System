namespace Corta.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? ImageUrl { get; set; }
        public string? Size { get; set; }
        public bool IsNewArrival { get; set; }
        public bool IsBestseller { get; set; }
        public bool IsSpecialOffer { get; set; }
        public List<ProductImageDto> ProductImages { get; set; } = new();
        public List<IFormFile>? AdditionalImages { get; set; }

    }
}
