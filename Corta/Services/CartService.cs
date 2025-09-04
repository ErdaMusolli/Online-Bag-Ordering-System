using Corta.Data;
using Corta.DTOs;
using Corta.Models;
using Microsoft.EntityFrameworkCore;

namespace Corta.Services
{
    public class CartService
    {
        private readonly ApplicationDbContext _context;

        public CartService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CartDto> GetCartByUserIdAsync(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return new CartDto();

            return new CartDto
            {
                Items = cart.Items.Select(i => new CartItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name,
                    Price = i.Product?.Price,
                    ImageUrl = i.Product?.ImageUrl,
                    Quantity = i.Quantity,
                }).ToList()
            };
        }

        public async Task AddOrUpdateItemAsync(int userId, int productId, int quantity)
        {
            if (quantity <= 0) return;

            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            var cartItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            if (cartItem != null) cartItem.Quantity += quantity;
            else cart.Items.Add(new CartItem { CartId = cart.Id, ProductId = productId, Quantity = quantity });

            await _context.SaveChangesAsync();
        }

        public async Task RemoveItemAsync(int userId, int productId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return;

            var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            if (item != null)
            {
                cart.Items.Remove(item);
                _context.CartItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }

        public async Task ClearCartAsync(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart != null)
            {
                _context.CartItems.RemoveRange(cart.Items);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> PurchaseCartAsync(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.Items.Any())
                return false;

            foreach (var cartItem in cart.Items)
            {
                var product = cartItem.Product;
                if (product == null || product.Stock < cartItem.Quantity)
                    return false;
            }

            var purchase = new Purchase
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                TotalAmount = 0m,
                PurchaseItems = new List<PurchaseItem>()
            };

            foreach (var cartItem in cart.Items)
            {
                var product = cartItem.Product!;
                product.Stock -= cartItem.Quantity;
                product.PurchaseCount += cartItem.Quantity;

                var purchaseItem = new PurchaseItem
                {
                    ProductName = product.Name,
                    Quantity = cartItem.Quantity,
                    Price = product.Price,
                    ProductId = product.Id
                };
                purchase.PurchaseItems.Add(purchaseItem);
                purchase.TotalAmount += purchaseItem.Price * purchaseItem.Quantity;
            }

            _context.Purchases.Add(purchase);
            _context.CartItems.RemoveRange(cart.Items);

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
