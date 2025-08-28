using Microsoft.AspNetCore.Mvc;
using Corta.DTOs;
using Corta.Services;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System;

namespace Corta.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseController : ControllerBase
    {
        private readonly PurchaseService _purchaseService;

        public PurchaseController(PurchaseService purchaseService)
        {
            _purchaseService = purchaseService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var purchases = await _purchaseService.GetAllDtoAsync();
            return Ok(purchases);
        }

        [HttpGet("my")]
        [Authorize]
        public async Task<IActionResult> GetMyPurchases()
        {
            try
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
                if (userIdClaim == null)
                    return Unauthorized(new { error = "User not authorized" });

                int userId = int.Parse(userIdClaim.Value);
                var purchases = await _purchaseService.GetAllDtoAsync(userId);
                return Ok(purchases);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var purchase = await _purchaseService.GetByIdAsync(id);
            if (purchase == null) return NotFound();

            var dto = new PurchaseDto
            {
                UserId = purchase.UserId,
                CreatedAt = purchase.CreatedAt,
                TotalAmount = purchase.TotalAmount,
                Status = purchase.Status,
                PurchaseItems = purchase.PurchaseItems.Select(pi => new PurchaseItemDto
                {
                    ProductId = pi.ProductId,
                    ProductName = pi.ProductName,
                    Quantity = pi.Quantity,
                    Price = pi.Price,
                    ProductImageUrl = pi.ProductImageUrl
                }).ToList()
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PurchaseDto dto)
        {
            try
            {
                var purchase = await _purchaseService.CreateAsync(dto);
                return Ok(purchase);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PurchaseDto dto)
        {
            var success = await _purchaseService.UpdateAsync(id, dto);
            if (!success) return NotFound();
            return Ok("Purchase updated");
        }

[HttpPut("{id}/status")]
public async Task<IActionResult> UpdateStatus(int id, [FromBody] string newStatus)
{
    var purchase = await _purchaseService.GetByIdAsync(id);
    if (purchase == null) return NotFound();

    purchase.Status = newStatus;
    await _purchaseService.UpdateAsync(id, new PurchaseDto
    {
        UserId = purchase.UserId,
        TotalAmount = purchase.TotalAmount,
        Status = newStatus,
        PurchaseItems = purchase.PurchaseItems.Select(pi => new PurchaseItemDto
        {
            ProductId = pi.ProductId,
            ProductName = pi.ProductName,
            Quantity = pi.Quantity,
            Price = pi.Price,
            ProductImageUrl = pi.ProductImageUrl
        }).ToList()
    });

    return Ok(new { message = "Status updated" });
}

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _purchaseService.DeleteAsync(id);
            if (!success) return NotFound();
            return Ok("Purchase deleted");
        }
    }
}
