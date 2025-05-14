using Corta.Data;

using Corta.Models;

using Microsoft.EntityFrameworkCore;
 
namespace Corta.Services

{

    public class ContactMessageService

    {

        private readonly ApplicationDbContext _context;
 
        public ContactMessageService(ApplicationDbContext context)

        {

            _context = context;

        }
 
        public async Task<List<ContactMessage>> GetAllAsync() =>

            await _context.ContactMessages.ToListAsync();
 
        public async Task<ContactMessage> AddAsync(ContactMessage message)

        {

            _context.ContactMessages.Add(message);

            await _context.SaveChangesAsync();

            return message;

        }
 
        public async Task<bool> DeleteAsync(int id)

        {

            var message = await _context.ContactMessages.FindAsync(id);

            if (message == null) return false;
 
            _context.ContactMessages.Remove(message);

            await _context.SaveChangesAsync();

            return true;

        }

    }

}

 