using Corta.DTOs;
using Corta.Models;
using Microsoft.EntityFrameworkCore;
using Corta.Data;

namespace Corta.Services
{
    public class ReviewService
    {
        private readonly ApplicationDbContext _context;

        public ReviewService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Review>> GetAllAsync()
        {
            return await _context.Reviews.ToListAsync();
        }

        public async Task<Review> AddAsync(Review review)
        {
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return review;
        }

        public async Task<List<ReviewDto>> GetAllWithUserEmailAsync()
        {
            return await _context.Reviews
                .Include(r => r)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    Rating = r.Rating,
                    UserEmail = r.UserEmail!,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }

       
        public async Task<bool> DeleteAsync(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return false;

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
