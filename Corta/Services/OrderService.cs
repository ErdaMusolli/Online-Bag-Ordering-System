using Corta.DTOs;
using Corta.Models;
using Microsoft.EntityFrameworkCore;
using Corta.Data;

namespace Corta.Services
{
    public class OrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Order>> GetAllAsync() =>
            await _context.Order.Include(o => o.OrderItems).ToListAsync();

        public async Task<Order?> GetByIdAsync(int id) =>
            await _context.Order.Include(o => o.OrderItems)
                                 .FirstOrDefaultAsync(o => o.Id == id);

        public async Task<Order> CreateAsync(Order order)
        {
            _context.Order.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<bool> UpdateAsync(int id, Order updatedOrder)
        {
            var order = await _context.Order.Include(o => o.OrderItems)
                                              .FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return false;

            order.CustomerName = updatedOrder.CustomerName;
            order.DatePlaced = updatedOrder.DatePlaced;

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var order = await _context.Order.FindAsync(id);
            if (order == null) return false;

            _context.Order.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
