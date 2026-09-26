using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MaisonBlush.API.Data;
using MaisonBlush.API.DTOs;
using MaisonBlush.API.Models;
using MaisonBlush.API.Services;

namespace MaisonBlush.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICloudinaryService _cloudinaryService;

        public AdminController(ApplicationDbContext context, ICloudinaryService cloudinaryService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var paidAmounts = await _context.Orders.Where(o => o.PaymentStatus == "Paid").Select(o => o.TotalAmount).ToListAsync();
            var totalSales = paidAmounts.Sum();
            var totalOrders = await _context.Orders.CountAsync();
            var pendingOrders = await _context.Orders.CountAsync(o => o.OrderStatus == "Pending" || o.OrderStatus == "Processing");
            var completedOrders = await _context.Orders.CountAsync(o => o.OrderStatus == "Delivered");
            var totalCustomers = await _context.Users.CountAsync(u => u.Role == "Customer");
            var lowStockCount = await _context.ProductVariants.CountAsync(v => v.StockQuantity < 5);

            var recentOrders = await _context.Orders
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .Take(5)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    CustomerName = o.CustomerName,
                    CustomerEmail = o.CustomerEmail,
                    TotalAmount = o.TotalAmount,
                    PaymentStatus = o.PaymentStatus,
                    OrderStatus = o.OrderStatus,
                    CreatedAt = o.CreatedAt
                })
                .ToListAsync();

            return Ok(new DashboardStatsDto
            {
                TotalSales = totalSales,
                TotalOrders = totalOrders,
                PendingOrders = pendingOrders,
                CompletedOrders = completedOrders,
                TotalCustomers = totalCustomers,
                LowStockProductsCount = lowStockCount,
                RecentOrders = recentOrders
            });
        }

        // --- PRODUCT MANAGEMENT ---

        [HttpGet("products")]
        public async Task<IActionResult> GetAllAdminProducts()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Slug,
                    p.BasePrice,
                    p.SalePrice,
                    CategoryName = p.Category != null ? p.Category.Name : "",
                    p.Badge,
                    PrimaryImageUrl = p.Images.FirstOrDefault() != null ? p.Images.FirstOrDefault()!.ImageUrl : "",
                    p.IsActive,
                    p.IsFeatured,
                    p.IsNewArrival,
                    TotalStock = p.Variants.Sum(v => v.StockQuantity),
                    VariantsCount = p.Variants.Count
                })
                .ToListAsync();

            return Ok(products);
        }

        [HttpPost("products")]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            if (string.IsNullOrWhiteSpace(product.Slug))
            {
                product.Slug = product.Name.ToLower().Replace(" ", "-").Replace("'", "");
            }
            product.CreatedAt = DateTime.UtcNow;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product created successfully.", product.Id });
        }

        [HttpPut("products/{id:int}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product input)
        {
            var p = await _context.Products.Include(x => x.Variants).Include(x => x.Images).FirstOrDefaultAsync(x => x.Id == id);
            if (p == null) return NotFound();

            p.Name = input.Name;
            p.ShortDescription = input.ShortDescription;
            p.Description = input.Description;
            p.BasePrice = input.BasePrice;
            p.SalePrice = input.SalePrice;
            p.CategoryId = input.CategoryId;
            p.Sku = input.Sku;
            p.Material = input.Material;
            p.CareInstructions = input.CareInstructions;
            p.Badge = input.Badge;
            p.IsActive = input.IsActive;
            p.IsFeatured = input.IsFeatured;
            p.IsNewArrival = input.IsNewArrival;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Product updated successfully." });
        }

        [HttpDelete("products/{id:int}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.IsActive = false; // Soft delete
            await _context.SaveChangesAsync();
            return Ok(new { message = "Product deactivated successfully." });
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            var imageUrl = await _cloudinaryService.UploadImageAsync(file);
            return Ok(new { imageUrl });
        }

        // --- ORDER MANAGEMENT ---

        [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    CustomerName = o.CustomerName,
                    CustomerEmail = o.CustomerEmail,
                    CustomerPhone = o.CustomerPhone,
                    Subtotal = o.Subtotal,
                    DiscountAmount = o.DiscountAmount,
                    ShippingFee = o.ShippingFee,
                    TaxAmount = o.TaxAmount,
                    TotalAmount = o.TotalAmount,
                    PaymentStatus = o.PaymentStatus,
                    OrderStatus = o.OrderStatus,
                    TrackingNumber = o.TrackingNumber,
                    CreatedAt = o.CreatedAt,
                    Items = o.Items.Select(i => new OrderItemDto
                    {
                        Id = i.Id,
                        ProductName = i.ProductName,
                        VariantDescription = i.VariantDescription,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        TotalPrice = i.TotalPrice
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPut("orders/{id:int}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] JsonElement body)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            if (body.TryGetProperty("orderStatus", out var statusProp))
            {
                order.OrderStatus = statusProp.GetString() ?? order.OrderStatus;
            }

            if (body.TryGetProperty("trackingNumber", out var trackProp))
            {
                order.TrackingNumber = trackProp.GetString() ?? order.TrackingNumber;
            }

            if (body.TryGetProperty("paymentStatus", out var payProp))
            {
                order.PaymentStatus = payProp.GetString() ?? order.PaymentStatus;
            }

            order.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Order status updated successfully.", order.OrderStatus, order.PaymentStatus });
        }

        // --- CMS & BANNERS ---

        [HttpPost("banners")]
        public async Task<IActionResult> SaveBanner([FromBody] Banner banner)
        {
            if (banner.Id == 0)
            {
                _context.Banners.Add(banner);
            }
            else
            {
                _context.Banners.Update(banner);
            }
            await _context.SaveChangesAsync();
            return Ok(new { message = "Banner saved successfully." });
        }

        [HttpPost("announcements")]
        public async Task<IActionResult> SaveAnnouncement([FromBody] AnnouncementBar announcement)
        {
            if (announcement.Id == 0)
            {
                _context.AnnouncementBars.Add(announcement);
            }
            else
            {
                _context.AnnouncementBars.Update(announcement);
            }
            await _context.SaveChangesAsync();
            return Ok(new { message = "Announcement updated." });
        }

        // --- COUPONS ---

        [HttpGet("coupons")]
        public async Task<IActionResult> GetCoupons()
        {
            var coupons = await _context.Coupons.OrderByDescending(c => c.Id).ToListAsync();
            return Ok(coupons);
        }

        [HttpPost("coupons")]
        public async Task<IActionResult> CreateCoupon([FromBody] Coupon coupon)
        {
            coupon.Code = coupon.Code.ToUpper().Trim();
            _context.Coupons.Add(coupon);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Coupon created successfully." });
        }

        // --- CUSTOMERS ---

        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
        {
            var rawCustomers = await _context.Users
                .Include(u => u.Orders)
                .Where(u => u.Role == "Customer")
                .ToListAsync();

            var customers = rawCustomers.Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.Phone,
                u.CreatedAt,
                OrdersCount = u.Orders.Count,
                TotalSpent = u.Orders.Where(o => o.PaymentStatus == "Paid").Sum(o => o.TotalAmount)
            }).ToList();

            return Ok(customers);
        }
    }
}
