using Corta.DTOs;
using Corta.Services;
using Microsoft.AspNetCore.Mvc;
using Corta.Models;
 
namespace Corta.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly NewsService _newsService;
 
        public NewsController(NewsService newsService)
        {
            _newsService = newsService;
        }
 
      
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var newsList = await _newsService.GetAllAsync();
            return Ok(newsList);
        }
 

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var news = await _newsService.GetByIdAsync(id);
            if (news == null) return NotFound();
            return Ok(news);
        }
 

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NewsDto dto)
        {
            var news = await _newsService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = news.Id }, news);
        }
 
       
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] NewsDto dto)
        {
            var updated = await _newsService.UpdateAsync(id, dto);
            return updated ? NoContent() : NotFound();
        }
 
  
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _newsService.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}