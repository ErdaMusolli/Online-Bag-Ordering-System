using Microsoft.AspNetCore.Mvc;
using Corta.DTOs;
using Corta.Services;

namespace Corta.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductsController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? category, [FromQuery] string? fabric)
        {
            var products = await _productService.GetAllAsync(
                 categorySlug: category,
        material: fabric
            );
       
            var response = products.Select(p => new
            {
                p.Id,
                p.Name,
                p.Description,
                p.Price,
                p.OldPrice,
                p.Stock,
                IsOutOfStock = p.Stock <= 0,
                p.PurchaseCount,
                p.ImageUrl,
                p.Size,
                Category = new { p.CategoryId, p.Category.Name, p.Category.Slug },
                p.Material,
                ProductImages = p.ProductImages.Select(pi => new
                {
                    pi.Id,
                    pi.ProductId,
                    pi.ImageUrl
                }).ToList()
            });

            return Ok(response);
        }

        [HttpGet("bestsellers")]
        public async Task<IActionResult> GetBestsellers()
        {
            var products = await _productService.GetAllAsync();
            var bestsellers = products
                .OrderByDescending(p => p.PurchaseCount)
                .Take(4)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.OldPrice,
                    p.Stock,
                    IsOutOfStock = p.Stock <= 0,
                    p.ImageUrl,
                    p.Size,
                    p.PurchaseCount,
                    ProductImages = p.ProductImages.Select(pi => new
                    {
                        pi.Id,
                        pi.ProductId,
                        pi.ImageUrl
                    }).ToList()
                });
            return Ok(bestsellers);
        }

        [HttpGet("newarrivals")]
        public async Task<IActionResult> GetNewArrivals()
        {
            var products = await _productService.GetAllAsync();
            var tenDaysAgo = DateTime.UtcNow.AddDays(-30);
            var newArrivals = products
                .Where(p => p.CreatedAt >= tenDaysAgo)
                .OrderByDescending(p => p.CreatedAt)
                .Take(30)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.OldPrice,
                    p.Stock,
                    IsOutOfStock = p.Stock <= 0,
                    p.PurchaseCount,
                    p.ImageUrl,
                    p.Size,
                    ProductImages = p.ProductImages.Select(pi => new
                    {
                        pi.Id,
                        pi.ProductId,
                        pi.ImageUrl
                    }).ToList()
                });
            return Ok(newArrivals);
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null) return NotFound();

            var response = new
            {
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.OldPrice,
                product.Stock,
                IsOutOfStock = product.Stock <= 0,
                product.PurchaseCount,
                product.ImageUrl,
                product.Size,
                ProductImages = product.ProductImages.Select(pi => new
                {
                    pi.Id,
                    pi.ProductId,
                    pi.ImageUrl
                }).ToList()
            };

            return Ok(response);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductDto dto, IFormFile? image, [FromForm] List<IFormFile>? additionalImages)
        {
            if (image != null && image.Length > 0)
            {
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                Directory.CreateDirectory(uploadsPath);
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(uploadsPath, fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await image.CopyToAsync(stream);
                dto.ImageUrl = $"/images/{fileName}";
            }

            if (additionalImages != null && additionalImages.Any())
            {
                var productImages = new List<ProductImageDto>();
                foreach (var img in additionalImages)
                {
                    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                    Directory.CreateDirectory(uploadsPath);
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(img.FileName);
                    var filePath = Path.Combine(uploadsPath, fileName);
                    using var stream = new FileStream(filePath, FileMode.Create);
                    await img.CopyToAsync(stream);
                    productImages.Add(new ProductImageDto { ImageUrl = $"/images/{fileName}" });
                }
                dto.ProductImages = productImages;
            }

            var product = await _productService.CreateAsync(dto);
            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductDto dto, IFormFile? image, [FromForm] List<IFormFile>? additionalImages, [FromForm] string? existingMainImageUrl)
        {
            if (image != null && image.Length > 0)
            {
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                Directory.CreateDirectory(uploadsPath);
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(uploadsPath, fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await image.CopyToAsync(stream);
                dto.ImageUrl = $"/images/{fileName}";
            }
            else if (!string.IsNullOrEmpty(existingMainImageUrl))
            {
                dto.ImageUrl = existingMainImageUrl;
            }

            if (additionalImages != null && additionalImages.Any())
            {
                var productImages = new List<ProductImageDto>();
                foreach (var img in additionalImages)
                {
                    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                    Directory.CreateDirectory(uploadsPath);
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(img.FileName);
                    var filePath = Path.Combine(uploadsPath, fileName);
                    using var stream = new FileStream(filePath, FileMode.Create);
                    await img.CopyToAsync(stream);
                    productImages.Add(new ProductImageDto { ImageUrl = $"/images/{fileName}" });
                }
                dto.ProductImages = productImages;
            }

            var updatedProduct = await _productService.UpdateAsync(id, dto);
            if (updatedProduct == null) return NotFound();

            return Ok(updatedProduct);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _productService.DeleteAsync(id);
            if (!success) return NotFound();

            return Ok(new { message = "Product deleted", productId = id });
        }
    }
}
