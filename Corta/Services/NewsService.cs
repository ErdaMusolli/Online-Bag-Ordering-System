using Corta.DTOs;
using Corta.Models;
using Microsoft.EntityFrameworkCore;
using Corta.Data;

namespace Corta.Services
{
    public class NewsService
    {
        private readonly ApplicationDbContext _context;

        public NewsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<News>> GetAllAsync() =>
            await _context.News.OrderByDescending(n => n.DatePublished).ToListAsync();

        public async Task<News?> GetByIdAsync(int id) =>
            await _context.News.FindAsync(id);

        public async Task<News> CreateAsync(NewsDto dto)
        {
            var news = new News
            {
                Title = dto.Title,
                Content = dto.Content,
                Author = dto.Author,
                ImageUrl = dto.ImageUrl,
                DatePublished = DateTime.UtcNow
            };

            _context.News.Add(news);
            await _context.SaveChangesAsync();
            return news;
        }

        public async Task<bool> UpdateAsync(int id, NewsDto dto)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null) return false;

            news.Title = dto.Title;
            news.Content = dto.Content;
            news.Author = dto.Author;
            news.ImageUrl = dto.ImageUrl;
            news.DatePublished = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null) return false;

            _context.News.Remove(news);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

 