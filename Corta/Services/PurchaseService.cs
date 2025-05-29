using Microsoft.EntityFrameworkCore;
using Corta.Data;
using Corta.Models;
using Corta.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Corta.Services
{
    public class PurchaseService
    {
        private readonly ApplicationDbContext _context;

        public PurchaseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Purchase>> GetAllAsync()
        {
            return await _context.Purchases.Include(p => p.PurchaseItems).ToListAsync();
        }

        public async Task<Purchase?> GetByIdAsync(int id)
        {
            return await _context.Purchases
                .Include(p => p.PurchaseItems)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Purchase> CreateAsync(PurchaseDto purchaseDto)
{
    if (purchaseDto.PurchaseItems == null || !purchaseDto.PurchaseItems.Any())
{
    throw new ArgumentException("Purchase must have at least one item.");
}
    Console.WriteLine($"UserId: {purchaseDto.UserId}, TotalAmount: {purchaseDto.TotalAmount}");
    foreach(var item in purchaseDto.PurchaseItems)
    {
        Console.WriteLine($"Item: ProductName={item.ProductName}, Quantity={item.Quantity}, Price={item.Price}");
    }

    var purchase = new Purchase
    {
        UserId = purchaseDto.UserId,
        CreatedAt = DateTime.UtcNow,
        TotalAmount = purchaseDto.TotalAmount,
        PurchaseItems = purchaseDto.PurchaseItems.Select(item => new PurchaseItem
        {
            ProductName = item.ProductName,
            Quantity = item.Quantity,
            Price = item.Price
        }).ToList()
    };

    _context.Purchases.Add(purchase);
    await _context.SaveChangesAsync();

    return purchase;
}

        public async Task<bool> UpdateAsync(int id, PurchaseDto purchaseDto)
        {
            var purchase = await _context.Purchases.Include(p => p.PurchaseItems).FirstOrDefaultAsync(p => p.Id == id);
            if (purchase == null) return false;

            purchase.UserId = purchaseDto.UserId;
            purchase.TotalAmount = purchaseDto.TotalAmount;

            _context.PurchaseItems.RemoveRange(purchase.PurchaseItems);
            purchase.PurchaseItems = purchaseDto.PurchaseItems.Select(item => new PurchaseItem
            {
                ProductName = item.ProductName,
                Quantity = item.Quantity,
                Price = item.Price
            }).ToList();

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var purchase = await _context.Purchases.Include(p => p.PurchaseItems).FirstOrDefaultAsync(p => p.Id == id);
            if (purchase == null) return false;

            _context.PurchaseItems.RemoveRange(purchase.PurchaseItems);
            _context.Purchases.Remove(purchase);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
