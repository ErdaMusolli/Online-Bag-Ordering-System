using Corta.DTOs;
using Corta.Models;
using Corta.Services;
using Microsoft.AspNetCore.Mvc;

namespace Corta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly NewsService _newsService;

        public NewsController(NewsService newsService)
        {
            _newsService = newsService;
        }

        // GET: api/news
        [HttpGet]
        public async Task<ActionResult<List<News>>> GetNews()
        {
            var news = await _newsService.GetAllNewsAsync();
            return Ok(news);
        }

        // GET: api/news/5
        [HttpGet("{id}")]
        public async Task<ActionResult<News>> GetNewsById(int id)
        {
            var news = await _newsService.GetNewsByIdAsync(id);
            if (news == null)
            {
                return NotFound();
            }
            return Ok(news);
        }

        // POST: api/news
        [HttpPost]
        public async Task<ActionResult<News>> CreateNews(NewsDto newsDto)
        {
            var news = new News
            {
                Title = newsDto.Title,
                Content = newsDto.Content,
                DatePublished = newsDto.DatePublished,
                Author = newsDto.Author
            };

            var createdNews = await _newsService.CreateNewsAsync(news);
            return CreatedAtAction(nameof(GetNewsById), new { id = createdNews.Id }, createdNews);
        }

        // PUT: api/news/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNews(int id, NewsDto newsDto)
        {
            var news = new News
            {
                Title = newsDto.Title,
                Content = newsDto.Content,
                DatePublished = newsDto.DatePublished,
                Author = newsDto.Author
            };

            var updatedNews = await _newsService.UpdateNewsAsync(id, news);
            if (updatedNews == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/news/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNews(int id)
        {
            await _newsService.DeleteNewsAsync(id);
            return NoContent();
        }
    }
}
