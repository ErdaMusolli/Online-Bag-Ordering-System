using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Corta.DTOs;
using Corta.Services;
using Corta.Models;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly ReviewService _service;

    public ReviewsController(ReviewService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<ReviewDto>>> GetAll()
    {
        var reviews = await _service.GetAllWithUserEmailAsync();
        return Ok(reviews);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Review>> Create(ReviewDto dto)
    {
        var userIdClaim = User.FindFirst("sub") ?? User.FindFirst("id");
        if (userIdClaim == null) return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);

        var review = new Review
        {
            ProductId = dto.ProductId,
            UserId = userId,
            Rating = dto.Rating,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _service.AddAsync(review);

        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }
}



