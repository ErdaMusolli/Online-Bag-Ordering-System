using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
       public async Task<IActionResult> GetById(int id)
{
    var product = await _productService.GetByIdAsync(id);
    if (product == null)
        return NotFound();

    var response = new
    {
        product.Id,
        product.Name,
        product.Description,
        product.Price,
        product.Stock,
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
        public async Task<IActionResult> Create([FromBody] ProductDto dto)
        {
            var product = await _productService.CreateAsync(dto);
            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductDto dto)
        {
            var success = await _productService.UpdateAsync(id, dto);
            if (!success) return NotFound();
            return Ok("Product updated");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _productService.DeleteAsync(id);
            if (!success) return NotFound();
            return Ok("Product deleted");
        }
    }
}
