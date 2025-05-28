using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Corta.DTOs;
using Corta.Services;
using Corta.Models;
using System.Security.Claims;

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
    public async Task<ActionResult<Review>> Create(ReviewCreateDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);
        var email = User.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty;

        var review = new Review
        {
            ProductId = dto.ProductId,
            UserId = userId,
            Rating = dto.Rating,
            CreatedAt = DateTime.UtcNow,
            UserEmail = email
        };

        var result = await _service.AddAsync(review);
        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }

    
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}


 




