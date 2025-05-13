using Microsoft.AspNetCore.Mvc;
using Corta.Models;
using Corta.Services;

namespace Corta.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderItemsController : ControllerBase
    {
        private readonly OrderItemService _orderItemService;

        public OrderItemsController(OrderItemService orderItemService)
        {
            _orderItemService = orderItemService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _orderItemService.GetAllAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _orderItemService.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderItem item)
        {
            var created = await _orderItemService.CreateAsync(item);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] OrderItem updatedItem)
        {
            var success = await _orderItemService.UpdateAsync(id, updatedItem);
            if (!success) return NotFound();
            return Ok("Order item updated");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _orderItemService.DeleteAsync(id);
            if (!success) return NotFound();
            return Ok("Order item deleted");
        }
    }
}
