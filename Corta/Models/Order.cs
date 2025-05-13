namespace Corta.Models
{
    public class Order
    {
        public int Id { get; set; }  // Primary Key
        public string CustomerName { get; set; } = string.Empty;
        public DateTime DatePlaced { get; set; }

        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
