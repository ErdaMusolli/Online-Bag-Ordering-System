using Microsoft.AspNetCore.Mvc;
using Corta.DTOs;
using Corta.Models;
using Corta.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Corta.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly CartService _cartService;

        public CartController(CartService cartService)
        {
            _cartService = cartService;
        }
        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return null;
            }
            return userId;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var cart = await _cartService.GetCartByUserIdAsync(userId.Value);
            return Ok(cart);
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddOrUpdateItem([FromBody] AddCartItemRequest request)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            await _cartService.AddOrUpdateItemAsync(userId.Value, request.ProductId, request.Quantity);
            return NoContent();
        }

        [HttpDelete("items/{productId}")]
        public async Task<IActionResult> RemoveItem(int productId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            await _cartService.RemoveItemAsync(userId.Value, productId);
            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            await _cartService.ClearCartAsync(userId.Value);
            return NoContent();
        }
        [HttpPost("purchase")]
public async Task<IActionResult> PurchaseCart()
{
    var userId = GetUserId();
    if (userId == null) return Unauthorized();

    var success = await _cartService.PurchaseCartAsync(userId.Value);
    if (!success)
        return BadRequest("Cart is empty or does not exist.");

    return Ok("Purchase completed successfully.");
}
        
    }

    public class AddCartItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}