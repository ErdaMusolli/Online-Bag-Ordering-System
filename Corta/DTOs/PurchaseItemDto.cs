using Corta.DTOs;

namespace Corta.DTOs
{
    public class PurchaseItemDto
    {
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int ProductId { get; set; } 
    }
}
