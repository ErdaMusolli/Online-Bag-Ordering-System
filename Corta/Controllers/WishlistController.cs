using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Corta.DTOs;
using Corta.Services;

namespace Corta.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class WishlistController : ControllerBase
    {
        private readonly WishlistService _wishlistService;

        public WishlistController(WishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserWishlist()
        {
            int userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");

            var wishlist = await _wishlistService.GetUserWishlistAsync(userId);
            return Ok(wishlist);
        }

        [HttpPost]
        public async Task<IActionResult> AddToWishlist([FromBody] WishlistDto dto)
        {
            int userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");

            var item = await _wishlistService.AddToWishlistAsync(userId, dto.ProductId);
            if (item == null)
                return BadRequest(new { message = "Product already in wishlist" });

            return Ok(item);
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            int userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");

            var result = await _wishlistService.RemoveFromWishlistAsync(userId, productId);
            if (!result) return NotFound(new { message = "Product not found in wishlist" });

            return Ok(new { message = "Product removed from wishlist", productId });
        }
    }
}
