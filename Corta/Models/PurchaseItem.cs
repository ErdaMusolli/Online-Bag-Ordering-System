using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Corta.Models
{
    public class PurchaseItem
    {
        public int Id { get; set; }
        public int PurchaseId { get; set; }

        [ForeignKey(nameof(Product))]
public int ProductId { get; set; } 


        public string ProductName { get; set; } = string.Empty;
        public string ProductImageUrl { get; set; } = string.Empty;
        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [JsonIgnore]
        public Purchase? Purchase { get; set; }

        [JsonIgnore]
        public Product? Product { get; set; }
    }
}
