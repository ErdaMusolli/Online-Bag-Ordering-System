using Corta.DTOs;
using Corta.Models;
using Microsoft.EntityFrameworkCore;
using Corta.Data;


namespace Corta.Services
{
    public class OrderItemService
    {
        private readonly ApplicationDbContext _context;

        public OrderItemService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<OrderItem>> GetAllAsync() =>
            await _context.OrderItem.ToListAsync(); 

        public async Task<OrderItem?> GetByIdAsync(int id) =>
            await _context.OrderItem.FindAsync(id);

        public async Task<OrderItem> CreateAsync(OrderItem item)
        {
            _context.OrderItem.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<bool> UpdateAsync(int id, OrderItem updatedItem)
        {
            var item = await _context.OrderItem.FindAsync(id);
            if (item == null) return false;

            item.ProductId = updatedItem.ProductId;
            item.OrderId = updatedItem.OrderId;
            item.Quantity = updatedItem.Quantity;
            item.Price = updatedItem.Price;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var item = await _context.OrderItem.FindAsync(id);
            if (item == null) return false;

            _context.OrderItem.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
