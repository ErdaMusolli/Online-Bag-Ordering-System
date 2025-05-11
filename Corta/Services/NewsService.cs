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

        // Krijon një lajm të ri
        public async Task<News> CreateNewsAsync(News news)
        {
            _context.News.Add(news);
            await _context.SaveChangesAsync();
            return news;
        }

        // Merr të gjitha lajmet
        public async Task<List<News>> GetAllNewsAsync()
        {
            return await _context.News.ToListAsync();
        }

        // Merr një lajm përmes ID-së (mund të jetë null)
        public async Task<News?> GetNewsByIdAsync(int id)
        {
            return await _context.News.FindAsync(id);
        }

        // Përditëson një lajm ekzistues përmes ID-së
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

        // Fshin një lajm sipas ID-së
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
