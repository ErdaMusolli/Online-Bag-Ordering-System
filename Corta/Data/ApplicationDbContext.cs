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
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<Purchase> Purchases{ get; set; }
        public DbSet<PurchaseItem> PurchaseItems { get; set; }
        public DbSet<Review> Reviews { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        
         
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PurchaseItem>()
                .HasOne(pi => pi.Purchase)
                .WithMany(p => p.PurchaseItems)
                .HasForeignKey(pi => pi.PurchaseId);

            modelBuilder.Entity<Purchase>()
                .Property(p => p.TotalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PurchaseItem>()
                .Property(pi => pi.Price)
                .HasPrecision(18, 2);
        }
    }
}




