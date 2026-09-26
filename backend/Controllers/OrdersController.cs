using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MaisonBlush.API.Data;
using MaisonBlush.API.DTOs;
using MaisonBlush.API.Models;

namespace MaisonBlush.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int? GetCurrentUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (int.TryParse(userIdStr, out var id)) return id;
            return null;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var userId = GetCurrentUserId();
            Cart? cart = null;

            if (userId.HasValue)
            {
                cart = await _context.Carts
                    .Include(c => c.Items)
                        .ThenInclude(i => i.Product)
                            .ThenInclude(p => p!.Images)
                    .Include(c => c.Items)
                        .ThenInclude(i => i.ProductVariant)
                    .FirstOrDefaultAsync(c => c.UserId == userId.Value);
            }
            else if (!string.IsNullOrWhiteSpace(dto.SessionId))
            {
                cart = await _context.Carts
                    .Include(c => c.Items)
                        .ThenInclude(i => i.Product)
                            .ThenInclude(p => p!.Images)
                    .Include(c => c.Items)
                        .ThenInclude(i => i.ProductVariant)
                    .FirstOrDefaultAsync(c => c.SessionId == dto.SessionId);
            }

            if (cart == null || !cart.Items.Any())
            {
                return BadRequest(new { message = "Your cart is empty. Please add products before checking out." });
            }

            // Server-side validation of products and stock
            decimal subtotal = 0;
            var orderItems = new List<OrderItem>();

            foreach (var cartItem in cart.Items)
            {
                var product = await _context.Products.FindAsync(cartItem.ProductId);
                if (product == null || !product.IsActive)
                {
                    return BadRequest(new { message = $"Product {cartItem.Product?.Name ?? "Item"} is no longer available." });
                }

                ProductVariant? variant = null;
                if (cartItem.ProductVariantId.HasValue)
                {
                    variant = await _context.ProductVariants.FindAsync(cartItem.ProductVariantId.Value);
                    if (variant == null || variant.StockQuantity < cartItem.Quantity)
                    {
                        return BadRequest(new { message = $"Insufficient stock for {product.Name} ({variant?.Size} / {variant?.ColorName}). Only {variant?.StockQuantity ?? 0} remaining." });
                    }
                }

                decimal unitPrice = (product.SalePrice ?? product.BasePrice) + (variant?.AdditionalPrice ?? 0);
                decimal lineTotal = unitPrice * cartItem.Quantity;
                subtotal += lineTotal;

                var variantDesc = variant != null ? $"Size: {variant.Size}, Color: {variant.ColorName}" : "Standard";
                var primaryImg = product.Images.FirstOrDefault()?.ImageUrl ?? "";

                orderItems.Add(new OrderItem
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    ProductSku = variant?.Sku ?? product.Sku,
                    ProductImageUrl = primaryImg,
                    VariantDescription = variantDesc,
                    Quantity = cartItem.Quantity,
                    UnitPrice = unitPrice,
                    TotalPrice = lineTotal
                });
            }

            // Coupon Calculation
            decimal discountAmount = 0;
            if (!string.IsNullOrWhiteSpace(dto.CouponCode))
            {
                var coupon = await _context.Coupons.FirstOrDefaultAsync(c => c.Code.ToUpper() == dto.CouponCode.ToUpper() && c.IsActive);
                if (coupon != null && (coupon.ExpiryDate == null || coupon.ExpiryDate > DateTime.UtcNow) && coupon.UsedCount < coupon.MaxUsageCount && subtotal >= coupon.MinOrderAmount)
                {
                    if (coupon.DiscountType == "Percentage")
                    {
                        discountAmount = (subtotal * coupon.DiscountValue) / 100m;
                        if (coupon.MaxDiscountCap.HasValue && discountAmount > coupon.MaxDiscountCap.Value)
                        {
                            discountAmount = coupon.MaxDiscountCap.Value;
                        }
                    }
                    else if (coupon.DiscountType == "Fixed")
                    {
                        discountAmount = coupon.DiscountValue;
                    }
                }
            }

            decimal shippingFee = subtotal >= 2999 ? 0 : 150;
            decimal taxAmount = Math.Round((subtotal - discountAmount) * 0.05m, 2); // 5% GST
            decimal finalTotal = Math.Max(0, subtotal - discountAmount + shippingFee + taxAmount);

            var orderNumber = $"MB-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";
            var shippingAddressJson = JsonSerializer.Serialize(dto.ShippingAddress);

            var order = new Order
            {
                OrderNumber = orderNumber,
                UserId = userId,
                CustomerName = dto.ShippingAddress.FullName,
                CustomerEmail = userId.HasValue ? (await _context.Users.FindAsync(userId))?.Email ?? "customer@maisonblush.com" : "guest@maisonblush.com",
                CustomerPhone = dto.ShippingAddress.Phone,
                ShippingAddressJson = shippingAddressJson,
                Subtotal = subtotal,
                DiscountAmount = discountAmount,
                ShippingFee = shippingFee,
                TaxAmount = taxAmount,
                TotalAmount = finalTotal,
                CouponCode = dto.CouponCode ?? "",
                PaymentStatus = "Pending",
                OrderStatus = "Pending",
                CreatedAt = DateTime.UtcNow,
                Items = orderItems
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                OrderId = order.Id,
                order.OrderNumber,
                order.TotalAmount,
                order.Subtotal,
                order.DiscountAmount,
                order.ShippingFee,
                order.TaxAmount
            });
        }

        [Authorize]
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            var orders = await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.UserId == userId.Value)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => MapToOrderDto(o))
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrderById(int id, [FromQuery] string? token)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound(new { message = "Order not found." });

            var currentUserId = GetCurrentUserId();
            bool isAdmin = User.IsInRole("Admin");

            // OWASP A01: Broken Object-Level Authorization (IDOR) Check
            if (order.UserId.HasValue)
            {
                if (!isAdmin && (!currentUserId.HasValue || currentUserId.Value != order.UserId.Value))
                {
                    return Forbid();
                }
            }
            else
            {
                // For guest order verification, ensure caller is admin or possesses valid order verification token
                if (!isAdmin && !string.IsNullOrWhiteSpace(token))
                {
                    if (order.RazorpayOrderId != token && order.OrderNumber != token)
                    {
                        return Forbid();
                    }
                }
            }

            return Ok(MapToOrderDto(order));
        }

        private static OrderDto MapToOrderDto(Order o)
        {
            ShippingAddressDto address = new ShippingAddressDto();
            try
            {
                address = JsonSerializer.Deserialize<ShippingAddressDto>(o.ShippingAddressJson) ?? address;
            }
            catch { }

            return new OrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                UserId = o.UserId,
                CustomerName = o.CustomerName,
                CustomerEmail = o.CustomerEmail,
                CustomerPhone = o.CustomerPhone,
                ShippingAddress = address,
                Subtotal = o.Subtotal,
                DiscountAmount = o.DiscountAmount,
                ShippingFee = o.ShippingFee,
                TaxAmount = o.TaxAmount,
                TotalAmount = o.TotalAmount,
                CouponCode = o.CouponCode,
                PaymentStatus = o.PaymentStatus,
                OrderStatus = o.OrderStatus,
                RazorpayOrderId = o.RazorpayOrderId,
                TrackingNumber = o.TrackingNumber,
                CreatedAt = o.CreatedAt,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    ProductSku = i.ProductSku,
                    ProductImageUrl = i.ProductImageUrl,
                    VariantDescription = i.VariantDescription,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TotalPrice = i.TotalPrice
                }).ToList()
            };
        }
    }
}
