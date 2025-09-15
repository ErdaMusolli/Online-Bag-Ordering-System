using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Corta.DTOs;
using Corta.Services;
using System.Security.Claims;

namespace Corta.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    [Produces("application/json")]
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
              try
            {
                if (!int.TryParse(User.FindFirst("UserId")?.Value, out var userId) || userId <= 0)
                    return Unauthorized(new ProblemDetails { Title = "Missing or invalid user id", Status = 401 });

                var wishlist = await _wishlistService.GetUserWishlistAsync(userId);
                return Ok(wishlist);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ProblemDetails {
                    Title = "Wishlist retrieval error",
                    Detail = ex.Message,
                    Status = 500
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddToWishlist([FromBody] WishlistDto dto)
        {
            try
            {
            if (!int.TryParse(User.FindFirst("UserId")?.Value, out var userId) || userId <= 0)
                return Unauthorized(new ProblemDetails { Title = "Missing or invalid user id", Status = 401 });

            var item = await _wishlistService.AddToWishlistAsync(userId, dto.ProductId);
            if (item == null)
                return BadRequest(new { message = "Product already in wishlist" });

            return Ok(item);
        }
        catch (Exception ex)
            {
                return StatusCode(500, new ProblemDetails {
                    Title = "Wishlist add error",
                    Detail = ex.Message,
                    Status = 500
                });
            }
        }

        [HttpDelete("{productId:int}")]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            try
            {
            if (!int.TryParse(User.FindFirst("UserId")?.Value, out var userId) || userId <= 0)
                return Unauthorized(new ProblemDetails { Title = "Missing or invalid user id", Status = 401 });
            var result = await _wishlistService.RemoveFromWishlistAsync(userId, productId);
            if (!result) return NotFound(new { message = "Product not found in wishlist" });

            return Ok(new { message = "Product removed from wishlist", productId });
        }
               catch (Exception ex)
            {
                return StatusCode(500, new ProblemDetails {
                    Title = "Wishlist remove error",
                    Detail = ex.Message,
                    Status = 500
                });
            }
        }
    }
}

