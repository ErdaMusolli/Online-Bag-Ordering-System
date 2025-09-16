using System;
using System.Collections.Generic;

namespace Corta.DTOs
{
    public class PurchaseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public UserDto? User { get; set; } 
        public DateTime CreatedAt  { get; set; } 
        public decimal TotalAmount { get; set; } 
        public string Status { get; set; } = "In Process";
        public List<PurchaseItemDto> PurchaseItems { get; set; } = new List<PurchaseItemDto>();
    }
}
