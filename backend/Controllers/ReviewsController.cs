using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MaisonBlush.API.Data;
using MaisonBlush.API.DTOs;
using MaisonBlush.API.Models;

namespace MaisonBlush.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("product/{productId:int}")]
        public async Task<IActionResult> GetProductReviews(int productId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId && r.Status == "Approved")
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    ReviewerName = r.ReviewerName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    Status = r.Status,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeaturedReviews()
        {
            var reviews = await _context.Reviews
                .Include(r => r.Product)
                .Where(r => r.Status == "Approved" && r.Rating >= 4)
                .OrderByDescending(r => r.CreatedAt)
                .Take(8)
                .Select(r => new
                {
                    r.Id,
                    r.ProductId,
                    ProductName = r.Product != null ? r.Product.Name : "Atelier Haute Couture",
                    r.ReviewerName,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpPost]
        public async Task<IActionResult> SubmitReview([FromBody] CreateReviewDto dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5) return BadRequest("Rating must be between 1 and 5.");
            if (string.IsNullOrWhiteSpace(dto.Comment)) return BadRequest("Review comment cannot be empty.");

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null) return NotFound("Product not found.");

            int? userId = null;
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (int.TryParse(userIdStr, out var id)) userId = id;

            // OWASP A03: Injection & Stored XSS Prevention
            var cleanComment = System.Net.WebUtility.HtmlEncode(dto.Comment.Trim());
            if (cleanComment.Length > 500) cleanComment = cleanComment.Substring(0, 500);

            var cleanName = System.Net.WebUtility.HtmlEncode(
                (string.IsNullOrWhiteSpace(dto.ReviewerName) ? "Verified Buyer" : dto.ReviewerName).Trim()
            );
            if (cleanName.Length > 100) cleanName = cleanName.Substring(0, 100);

            var review = new Review
            {
                ProductId = dto.ProductId,
                UserId = userId,
                ReviewerName = cleanName,
                Rating = dto.Rating,
                Comment = cleanComment,
                Status = "Approved",
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Thank you! Your review has been submitted.", review.Id });
        }
    }
}
