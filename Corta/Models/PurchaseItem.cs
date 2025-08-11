using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Corta.Models;


namespace Corta.Models
{
    public class PurchaseItem
    {
        public int Id { get; set; }
        public int PurchaseId { get; set; }

        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public string ProductImageUrl { get; set; } = string.Empty;

        [JsonIgnore]  
   public Purchase? Purchase { get; set; }
}
}