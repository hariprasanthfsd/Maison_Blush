using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MaisonBlush.API.Data;
using MaisonBlush.API.DTOs;

namespace MaisonBlush.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Include(c => c.Subcategories)
                .Include(c => c.Products)
                .Where(c => c.IsActive && c.ParentCategoryId == null)
                .OrderBy(c => c.DisplayOrder)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug,
                    ImageUrl = c.ImageUrl,
                    Description = c.Description,
                    ParentCategoryId = c.ParentCategoryId,
                    DisplayOrder = c.DisplayOrder,
                    IsActive = c.IsActive,
                    ProductCount = c.Products.Count(p => p.IsActive),
                    Subcategories = c.Subcategories.Where(sub => sub.IsActive).Select(sub => new CategoryDto
                    {
                        Id = sub.Id,
                        Name = sub.Name,
                        Slug = sub.Slug,
                        ImageUrl = sub.ImageUrl,
                        Description = sub.Description,
                        ParentCategoryId = sub.ParentCategoryId,
                        DisplayOrder = sub.DisplayOrder,
                        IsActive = sub.IsActive,
                        ProductCount = sub.Products.Count(p => p.IsActive)
                    }).ToList()
                })
                .ToListAsync();

            return Ok(categories);
        }
    }
}
