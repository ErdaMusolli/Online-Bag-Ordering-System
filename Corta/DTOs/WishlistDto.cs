namespace Corta.DTOs
{
    public class WishlistDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductImageUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
