using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Corta.Data;
using Corta.Models;
namespace Corta.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("admin-stats")]
        public IActionResult GetAdminStats()
        {
            var stats = new
            {
                users = _context.Users.Count(),
                products = _context.Products.Count(),
                news = _context.News.Count(),
                contact = _context.ContactMessages.Count(),
                purchase = _context.Purchases.Count()
            };
            return Ok(stats);
        }
    }
}