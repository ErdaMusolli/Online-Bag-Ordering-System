using Corta.Data;
using Corta.Models;
using Microsoft.EntityFrameworkCore;

namespace Corta.Services
{
    public class NewsService
    {
        private readonly ApplicationDbContext _context;

        public NewsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<News> CreateNewsAsync(News news)
        {
            _context.News.Add(news);
            await _context.SaveChangesAsync();
            return news;
        }

        public async Task<List<News>> GetAllNewsAsync()
        {
            return await _context.News.ToListAsync();
        }

        public async Task<News?> GetNewsByIdAsync(int id)
        {
            return await _context.News.FindAsync(id);
        }

        public async Task<News?> UpdateNewsAsync(int id, News news)
        {
            var existingNews = await _context.News.FindAsync(id);
            if (existingNews != null)
            {
                existingNews.Title = news.Title;
                existingNews.Content = news.Content;
                existingNews.DatePublished = news.DatePublished;
                existingNews.Author = news.Author;

                await _context.SaveChangesAsync();
            }
            return existingNews;
        }

        public async Task<bool> DeleteNewsAsync(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news != null)
            {
                _context.News.Remove(news);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
