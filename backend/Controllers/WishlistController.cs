using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MaisonBlush.API.Data;
using MaisonBlush.API.DTOs;
using MaisonBlush.API.Models;

namespace MaisonBlush.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WishlistController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            return int.Parse(userIdStr!);
        }

        [HttpGet]
        public async Task<IActionResult> GetWishlist()
        {
            var userId = GetUserId();
            var wishlist = await _context.Wishlists
                .Include(w => w.Items)
                    .ThenInclude(i => i.Product)
                        .ThenInclude(p => p!.Images)
                .Include(w => w.Items)
                    .ThenInclude(i => i.Product)
                        .ThenInclude(p => p!.Variants)
                .Include(w => w.Items)
                    .ThenInclude(i => i.Product)
                        .ThenInclude(p => p!.Reviews)
                .FirstOrDefaultAsync(w => w.UserId == userId);

            if (wishlist == null)
            {
                return Ok(new List<ProductDto>());
            }

            var items = wishlist.Items.Select(i => new ProductDto
            {
                Id = i.Product!.Id,
                Name = i.Product.Name,
                Slug = i.Product.Slug,
                ShortDescription = i.Product.ShortDescription,
                BasePrice = i.Product.BasePrice,
                SalePrice = i.Product.SalePrice,
                CategoryId = i.Product.CategoryId,
                Badge = i.Product.Badge,
                PrimaryImageUrl = i.Product.Images.FirstOrDefault()?.ImageUrl ?? "",
                IsNewArrival = i.Product.IsNewArrival,
                IsFeatured = i.Product.IsFeatured,
                AverageRating = i.Product.Reviews.Any() ? Math.Round(i.Product.Reviews.Average(r => r.Rating), 1) : 5.0,
                ReviewCount = i.Product.Reviews.Count,
                TotalStock = i.Product.Variants.Sum(v => v.StockQuantity)
            }).ToList();

            return Ok(items);
        }

        [HttpPost("toggle/{productId:int}")]
        public async Task<IActionResult> ToggleWishlist(int productId)
        {
            var userId = GetUserId();
            var wishlist = await _context.Wishlists
                .Include(w => w.Items)
                .FirstOrDefaultAsync(w => w.UserId == userId);

            if (wishlist == null)
            {
                wishlist = new Wishlist { UserId = userId };
                _context.Wishlists.Add(wishlist);
                await _context.SaveChangesAsync();
            }

            var existingItem = wishlist.Items.FirstOrDefault(i => i.ProductId == productId);
            bool isInWishlist;

            if (existingItem != null)
            {
                _context.WishlistItems.Remove(existingItem);
                isInWishlist = false;
            }
            else
            {
                _context.WishlistItems.Add(new WishlistItem
                {
                    WishlistId = wishlist.Id,
                    ProductId = productId,
                    AddedAt = DateTime.UtcNow
                });
                isInWishlist = true;
            }

            await _context.SaveChangesAsync();
            return Ok(new { isInWishlist, message = isInWishlist ? "Added to wishlist." : "Removed from wishlist." });
        }
    }
}
