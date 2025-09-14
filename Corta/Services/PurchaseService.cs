using Microsoft.EntityFrameworkCore;
using Corta.Data;
using Corta.Models;
using Corta.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace Corta.Services
{
    public class PurchaseService
    {
        private readonly ApplicationDbContext _context;

        public PurchaseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PurchaseDto>> GetAllDtoAsync(int? userId = null)
        {
            var query = _context.Purchases
                .Include(p => p.PurchaseItems)
                .AsQueryable();

            if (userId.HasValue)
                query = query.Where(p => p.UserId == userId.Value);

            var purchases = await query.ToListAsync();

            var purchaseDtos = purchases.Select(p => new PurchaseDto
            {
                Id = p.Id,
                UserId = p.UserId,
                User = null, 
                CreatedAt = p.CreatedAt,
                TotalAmount = p.TotalAmount,
                Status = p.Status,
                PurchaseItems = p.PurchaseItems.Select(pi => new PurchaseItemDto
                {
                    ProductId = pi.ProductId,
                    ProductName = pi.ProductName,
                    Quantity = pi.Quantity,
                    Price = pi.Price,
                    ProductImageUrl = pi.ProductImageUrl,
                    City = pi.City,
                    Neighborhood = pi.Neighborhood,
                    Street = pi.Street,
                    PhoneNumber = pi.PhoneNumber
                }).ToList()
            }).ToList() ?? new List<PurchaseDto>();

            return purchaseDtos;
        }

        public async Task<Purchase?> GetByIdAsync(int id)
        {
            return await _context.Purchases
                .Include(p => p.PurchaseItems)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        
        public async Task<UserDto?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new UserDto
                {
                    Username = u.Username,
                    Email = u.Email
                })
                .FirstOrDefaultAsync();
        }

        public async Task<Purchase> CreateAsync(PurchaseDto purchaseDto)
        {
            if (purchaseDto.PurchaseItems == null || !purchaseDto.PurchaseItems.Any())
                throw new ArgumentException("Purchase must have at least one item.");

            var purchaseItems = new List<PurchaseItem>();

            foreach (var itemDto in purchaseDto.PurchaseItems)
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null)
                    throw new ArgumentException($"Product with ID {itemDto.ProductId} does not exist.");
                if (product.Stock < itemDto.Quantity)
                    throw new ArgumentException($"Not enough stock for {product.Name}");

                product.Stock -= itemDto.Quantity; 
                _context.Products.Update(product);

                purchaseItems.Add(new PurchaseItem
                {
                    ProductId = product.Id,
                    ProductName = itemDto.ProductName,
                    Quantity = itemDto.Quantity,
                    Price = itemDto.Price,
                    ProductImageUrl = product.ImageUrl!,
                    City = itemDto.City,
                    Neighborhood = itemDto.Neighborhood,
                    Street = itemDto.Street,
                    PhoneNumber = itemDto.PhoneNumber
                });
            }

            var purchase = new Purchase
            {
                UserId = purchaseDto.UserId,
                CreatedAt = DateTime.UtcNow,
                TotalAmount = purchaseDto.TotalAmount,
                Status = purchaseDto.Status ?? "Pending",
                PurchaseItems = purchaseItems
            };

            _context.Purchases.Add(purchase);
            await _context.SaveChangesAsync();

            return purchase;
        }

        public async Task<bool> UpdateAsync(int id, PurchaseDto purchaseDto)
        {
            var purchase = await _context.Purchases
                .Include(p => p.PurchaseItems)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (purchase == null) return false;

            purchase.UserId = purchaseDto.UserId;
            purchase.TotalAmount = purchaseDto.TotalAmount;
            purchase.Status = purchaseDto.Status ?? purchase.Status;

            _context.PurchaseItems.RemoveRange(purchase.PurchaseItems);

            var updatedItems = new List<PurchaseItem>();
            foreach (var itemDto in purchaseDto.PurchaseItems)
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null)
                    throw new ArgumentException($"Product with ID {itemDto.ProductId} does not exist.");

                updatedItems.Add(new PurchaseItem
                {
                    PurchaseId = purchase.Id,
                    ProductId = product.Id,
                    ProductName = itemDto.ProductName,
                    Quantity = itemDto.Quantity,
                    Price = itemDto.Price,
                    ProductImageUrl = product.ImageUrl!,
                    City = itemDto.City,
                    Neighborhood = itemDto.Neighborhood,
                    Street = itemDto.Street,
                    PhoneNumber = itemDto.PhoneNumber
                });
            }

            purchase.PurchaseItems = updatedItems;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var purchase = await _context.Purchases
                .Include(p => p.PurchaseItems)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (purchase == null) return false;

            _context.PurchaseItems.RemoveRange(purchase.PurchaseItems);
            _context.Purchases.Remove(purchase);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
