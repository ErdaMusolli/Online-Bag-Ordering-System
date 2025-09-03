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
                OldPrice = product.OldPrice,
                Stock = product.Stock,
                ImageUrl = product.ImageUrl,
                Size = product.Size,
        
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
                OldPrice = dto.OldPrice,
                Stock = dto.Stock,
                ImageUrl = dto.ImageUrl,
                Size = dto.Size,
                CreatedAt = DateTime.UtcNow
             
            };

            if (dto.ProductImages != null)
            {
                foreach (var img in dto.ProductImages)
                {
                    product.ProductImages.Add(new ProductImage
                    {
                        ImageUrl = img.ImageUrl
                    });
                }
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

      public async Task<ProductDto?> UpdateAsync(int id, ProductDto dto)
{
    var product = await _context.Products
        .Include(p => p.ProductImages)
        .FirstOrDefaultAsync(p => p.Id == id);

    if (product == null) return null;

    product.Name = dto.Name;
    product.Description = dto.Description;
    product.Price = dto.Price;
    product.OldPrice = dto.OldPrice;
    product.Stock = dto.Stock;
    product.ImageUrl = dto.ImageUrl;
    product.Size = dto.Size;

    if (dto.ProductImages != null && dto.ProductImages.Any())
    {
        foreach (var img in dto.ProductImages)
        {
            if (!product.ProductImages.Any(pi => pi.ImageUrl == img.ImageUrl))
            {
                product.ProductImages.Add(new ProductImage
                {
                    ImageUrl = img.ImageUrl
                });
            }
        }
    }

    await _context.SaveChangesAsync();

    return new ProductDto
    {
        Id = product.Id,
        Name = product.Name,
        Description = product.Description,
        Price = product.Price,
        OldPrice = product.OldPrice,
        Stock = product.Stock,
        ImageUrl = product.ImageUrl,
        Size = product.Size,
        ProductImages = product.ProductImages
            .Select(pi => new ProductImageDto
            {
                Id = pi.Id,
                ProductId = pi.ProductId,
                ImageUrl = pi.ImageUrl
            }).ToList()
    };
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
