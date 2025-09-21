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
                .Include(r => r.Product)
                    .ThenInclude(p => p.ProductImages)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    ProductName = r.Product != null ? r.Product.Name : "Unknown",
                    ProductImageUrl = r.Product != null
                        ? (!string.IsNullOrEmpty(r.Product.ImageUrl)
                            ? r.Product.ImageUrl
                            : r.Product.ProductImages.FirstOrDefault() != null
                                ? r.Product.ProductImages.FirstOrDefault()!.ImageUrl
                                : null)
                        : null,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    UserEmail = r.UserEmail,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<List<ReviewDto>> GetByUserIdAsync(int userId)
        {
            return await _context.Reviews
                .Include(r => r.Product)
                    .ThenInclude(p => p.ProductImages)
                .Where(r => r.UserId == userId)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    ProductName = r.Product != null ? r.Product.Name : "Unknown",
                    ProductImageUrl = r.Product != null
                        ? (!string.IsNullOrEmpty(r.Product.ImageUrl)
                            ? r.Product.ImageUrl
                            : r.Product.ProductImages.FirstOrDefault() != null
                                ? r.Product.ProductImages.FirstOrDefault()!.ImageUrl
                                : null)
                        : null,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    UserEmail = r.UserEmail,
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
