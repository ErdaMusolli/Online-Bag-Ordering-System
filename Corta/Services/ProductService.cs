using Corta.DTOs;
using Corta.Models;
using Microsoft.EntityFrameworkCore;
using Corta.Data;

namespace Corta.Services
{
    public class ProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllAsync() =>
            await _context.Products
                .Include(p => p.ProductImages) 
                .ToListAsync();

        public async Task<ProductDto?> GetByIdAsync(int id)
{
    var product = await _context.Products
        .Include(p => p.ProductImages)
        .FirstOrDefaultAsync(p => p.Id == id);

    if (product == null) return null;

        return new ProductDto
    {
        Id = product.Id,
        Name = product.Name,
        Description = product.Description ?? "",
        Price = product.Price,
        Stock = product.Stock,
        ImageUrl = product.ImageUrl,
        Size = product.Size,
        IsNewArrival = product.IsNewArrival,
        IsBestseller = product.IsBestseller,
        IsSpecialOffer = product.IsSpecialOffer,
        ProductImages = product.ProductImages
            .Select(pi => new ProductImageDto
            {
                Id = pi.Id,
                ProductId = pi.ProductId,
                ImageUrl = pi.ImageUrl
            })
            .ToList() 
    };

}
        public async Task<Product> CreateAsync(ProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                ImageUrl = dto.ImageUrl,
                Size = dto.Size 
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> UpdateAsync(int id, ProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.ImageUrl = dto.ImageUrl;
            product.Size = dto.Size; 

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}