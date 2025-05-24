using Microsoft.AspNetCore.Mvc;
using Corta.DTOs;
using Corta.Models;
using Corta.Services;
 
namespace Corta.Controllers

{

    [ApiController]
[Route("api/[controller]")]
 public class ContactMessagesController : ControllerBase
   {
 private readonly ContactMessageService _service;
 public ContactMessagesController(ContactMessageService service)
    {
      _service = service;
    }
     [HttpGet]
public async Task<ActionResult<List<ContactMessage>>> GetAll()
    {
     return await _service.GetAllAsync();
    }
     [HttpPost]
 public async Task<ActionResult<ContactMessage>> Create(ContactMessageDto dto)
    {
 var message = new ContactMessage
     {
  FullName = dto.FullName,
   Email = dto.Email,
   Message = dto.Message

    };
 var result = await _service.AddAsync(message);
     return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
     }
        [HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id)
      {
var deleted = await _service.DeleteAsync(id);

            if (!deleted) return NotFound();

            return NoContent();

        }

    }

}

 