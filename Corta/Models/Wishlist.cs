using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Corta.Models
{
    public class Wishlist
    {
        public int Id { get; set; }

        public int UserId { get; set; }          
        public int ProductId { get; set; }       

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
    }
}
