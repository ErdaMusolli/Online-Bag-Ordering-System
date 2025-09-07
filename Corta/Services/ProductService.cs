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

         public async Task<List<Product>> GetAllAsync(string? categorySlug = null, string? material = null)
        {
            var q = _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(categorySlug))
            {
                q = q.Where(p => p.Category.Slug == categorySlug);
            }

         if (!string.IsNullOrWhiteSpace(material))
{
          var m = material.Trim().ToLower();
          q = q.Where(p => p.Material != null && p.Material.ToLower() == m);
}

            return await q.OrderByDescending(p => p.CreatedAt).ToListAsync();
        }

        public Task<List<Product>> GetAllAsync() => GetAllAsync(null, null);

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
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
                PurchaseCount = product.PurchaseCount,
                CategoryId = product.CategoryId, 
                Material = product.Material, 
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
                CreatedAt = DateTime.UtcNow,
                PurchaseCount = dto.PurchaseCount,
                CategoryId = dto.CategoryId,
                Material = dto.Material
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
             if (dto.OldPrice.HasValue && dto.OldPrice.Value > 0)
    {
        product.OldPrice = dto.OldPrice;

        product.Price = dto.Price;
    }
    else
    {
        product.OldPrice = null;
        product.Price = dto.Price;
    }

            product.Stock = dto.Stock;
            product.ImageUrl = dto.ImageUrl;
            product.Size = dto.Size;
            product.PurchaseCount = dto.PurchaseCount;

            product.CategoryId = dto.CategoryId;
            product.Material = dto.Material;

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
                PurchaseCount = product.PurchaseCount,
                CategoryId = product.CategoryId,    
                Material = product.Material,
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

        public async Task<bool> DecreaseStockAsync(int productId, int quantity)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null || product.Stock < quantity) return false;

            product.Stock -= quantity;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> IncreasePurchaseCountAsync(int productId, int quantity)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return false;

            product.PurchaseCount += quantity;
            await _context.SaveChangesAsync();
            return true;
    
    }
  }
}
