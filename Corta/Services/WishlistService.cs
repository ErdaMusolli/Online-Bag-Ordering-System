using Corta.DTOs;
using Corta.Models;
using Microsoft.EntityFrameworkCore;
using Corta.Data;

namespace Corta.Services
{
    public class WishlistService
    {
        private readonly ApplicationDbContext _context;

        public WishlistService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<WishlistDto>> GetUserWishlistAsync(int userId)
        {
            var wishlist = await _context.Wishlists
                .Include(w => w.Product)
                .Where(w => w.UserId == userId)
                .ToListAsync();

            return wishlist.Select(w => new WishlistDto
            {
                ProductId = w.ProductId,
                ProductName = w.Product!.Name,
                ProductImageUrl = w.Product.ImageUrl ?? "",
                Price = w.Product.Price,
                CreatedAt = w.CreatedAt
            }).ToList();
        }

        public async Task<WishlistDto?> AddToWishlistAsync(int userId, int productId)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            throw new Exception($"User me Id {userId} nuk ekziston!");

            if (await _context.Wishlists.AnyAsync(w => w.UserId == userId && w.ProductId == productId))
                return null;

            var wishlistItem = new Wishlist
            {
                UserId = userId,
                ProductId = productId
            };

            _context.Wishlists.Add(wishlistItem);
            await _context.SaveChangesAsync();

            var product = await _context.Products.FindAsync(productId);

            return new WishlistDto
            {
                ProductId = productId,
                ProductName = product!.Name,
                ProductImageUrl = product.ImageUrl ?? "",
                Price = product.Price,
                CreatedAt = wishlistItem.CreatedAt
            };
        }

        public async Task<bool> RemoveFromWishlistAsync(int userId, int productId)
        {
            var wishlistItem = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

            if (wishlistItem == null) return false;

            _context.Wishlists.Remove(wishlistItem);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
