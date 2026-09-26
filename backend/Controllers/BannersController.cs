using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using MaisonBlush.API.Data;
using MaisonBlush.API.DTOs;
using MaisonBlush.API.Models;

namespace MaisonBlush.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("hero")]
        public async Task<IActionResult> GetHeroBanners()
        {
            var banners = await _context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.SlideOrder)
                .Select(b => new BannerDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Subtitle = b.Subtitle,
                    Description = b.Description,
                    ImageUrl = b.ImageUrl,
                    ButtonText = b.ButtonText,
                    TargetUrl = b.TargetUrl,
                    SlideOrder = b.SlideOrder,
                    IsActive = b.IsActive
                })
                .ToListAsync();

            return Ok(banners);
        }

        [HttpGet("announcements")]
        public async Task<IActionResult> GetAnnouncements()
        {
            var announcements = await _context.AnnouncementBars
                .Where(a => a.IsActive)
                .OrderBy(a => a.DisplayOrder)
                .Select(a => new AnnouncementBarDto
                {
                    Id = a.Id,
                    Message = a.Message,
                    LinkUrl = a.LinkUrl,
                    DisplayOrder = a.DisplayOrder,
                    IsActive = a.IsActive
                })
                .ToListAsync();

            return Ok(announcements);
        }

        [HttpGet("benefits")]
        public async Task<IActionResult> GetStoreBenefits()
        {
            var benefits = await _context.StoreBenefits
                .Where(b => b.IsActive)
                .OrderBy(b => b.DisplayOrder)
                .Select(b => new StoreBenefitDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    IconName = b.IconName,
                    Description = b.Description,
                    DisplayOrder = b.DisplayOrder,
                    IsActive = b.IsActive
                })
                .ToListAsync();

            return Ok(benefits);
        }

        [EnableRateLimiting("AuthPolicy")]
        [HttpPost("subscribe")]
        public async Task<IActionResult> SubscribeNewsletter([FromBody] string email)
        {
            if (string.IsNullOrWhiteSpace(email) || !Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                return BadRequest(new { message = "Please enter a valid email address." });
            }

            var cleanEmail = email.Trim().ToLower();
            var existing = await _context.Subscribers.FirstOrDefaultAsync(s => s.Email == cleanEmail);
            if (existing != null)
            {
                return Ok(new { message = "You are already subscribed to the Maison Blush newsletter!" });
            }

            _context.Subscribers.Add(new Subscriber
            {
                Email = cleanEmail,
                SubscribedAt = DateTime.UtcNow,
                IsActive = true
            });
            await _context.SaveChangesAsync();

            return Ok(new { message = "Welcome to the Maison Blush inner circle! Check your inbox for exclusive boutique offers." });
        }
    }
}
