namespace Corta.DTOs
{
    public class PurchaseItemDto
    {
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int ProductId { get; set; } 
        public string ProductImageUrl { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Neighborhood { get; set; } = string.Empty;
        public string Street { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
