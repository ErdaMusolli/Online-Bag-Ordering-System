using Corta.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Corta.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public CategoriesController(ApplicationDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var cats = await _db.Categories
                .OrderBy(c => c.Name)
                .Select(c => new { c.Id, c.Name, c.Slug, c.ImageUrl })
                .ToListAsync();

            return Ok(cats);
        }
    }
}
