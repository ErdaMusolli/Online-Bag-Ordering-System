using Microsoft.EntityFrameworkCore;
using Corta.Models; 

namespace Corta.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<News> News { get; set; }
      public DbSet<Order> Orders { get; set; }
       public DbSet<OrderItem> OrderItems { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2); 
            base.OnModelCreating(modelBuilder);
        }

    
    }
}

