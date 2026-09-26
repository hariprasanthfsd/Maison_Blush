using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MaisonBlush.API.Data;
using MaisonBlush.API.DTOs;
using MaisonBlush.API.Models;
using MaisonBlush.API.Services;

namespace MaisonBlush.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IRazorpayService _razorpayService;

        public PaymentsController(ApplicationDbContext context, IRazorpayService razorpayService)
        {
            _context = context;
            _razorpayService = razorpayService;
        }

        [HttpPost("create-razorpay-order")]
        public async Task<IActionResult> CreateRazorpayOrder([FromBody] CreateRazorpayOrderDto dto)
        {
            var order = await _context.Orders.FindAsync(dto.OrderId);
            if (order == null) return NotFound(new { message = "Order not found." });

            var razorpayOrderId = await _razorpayService.CreateOrderAsync(order.OrderNumber, order.TotalAmount);

            order.RazorpayOrderId = razorpayOrderId;
            order.PaymentStatus = "Pending";
            await _context.SaveChangesAsync();

            return Ok(new RazorpayOrderResponseDto
            {
                RazorpayOrderId = razorpayOrderId,
                Amount = order.TotalAmount,
                Currency = "INR",
                KeyId = _razorpayService.GetKeyId(),
                BusinessName = "Maison Blush Boutique",
                CustomerName = order.CustomerName,
                CustomerEmail = order.CustomerEmail,
                CustomerPhone = order.CustomerPhone
            });
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentDto dto)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == dto.OrderId);

            if (order == null) return NotFound(new { message = "Order not found." });

            bool isValidSignature = _razorpayService.VerifySignature(dto.RazorpayOrderId, dto.RazorpayPaymentId, dto.RazorpaySignature);

            if (!isValidSignature)
            {
                order.PaymentStatus = "Failed";
                order.OrderStatus = "Cancelled";
                await _context.SaveChangesAsync();

                _context.Payments.Add(new Payment
                {
                    OrderId = order.Id,
                    RazorpayOrderId = dto.RazorpayOrderId,
                    RazorpayPaymentId = dto.RazorpayPaymentId,
                    Amount = order.TotalAmount,
                    Currency = "INR",
                    Status = "Failed",
                    ErrorMessage = "Invalid payment signature verification failed on server.",
                    CreatedAt = DateTime.UtcNow
                });
                await _context.SaveChangesAsync();

                return BadRequest(new { message = "Payment verification failed. Signature mismatch." });
            }

            // Payment verification success!
            order.RazorpayPaymentId = dto.RazorpayPaymentId;
            order.RazorpaySignature = dto.RazorpaySignature;
            order.PaymentStatus = "Paid";
            order.OrderStatus = "Confirmed";
            order.UpdatedAt = DateTime.UtcNow;

            // Audit Payment record
            _context.Payments.Add(new Payment
            {
                OrderId = order.Id,
                RazorpayOrderId = dto.RazorpayOrderId,
                RazorpayPaymentId = dto.RazorpayPaymentId,
                Amount = order.TotalAmount,
                Currency = "INR",
                Status = "Success",
                PaymentMethod = "Razorpay Standard Checkout",
                CreatedAt = DateTime.UtcNow
            });

            // Decrement Stock safely
            foreach (var item in order.Items)
            {
                var variants = await _context.ProductVariants
                    .Where(v => v.ProductId == item.ProductId)
                    .ToListAsync();

                if (variants.Any())
                {
                    var matchingVariant = variants.FirstOrDefault(v => item.VariantDescription.Contains(v.Size) && item.VariantDescription.Contains(v.ColorName))
                                         ?? variants.First();

                    matchingVariant.StockQuantity = Math.Max(0, matchingVariant.StockQuantity - item.Quantity);
                }
            }

            // Clear Cart for user/session
            if (order.UserId.HasValue)
            {
                var cart = await _context.Carts.Include(c => c.Items).FirstOrDefaultAsync(c => c.UserId == order.UserId.Value);
                if (cart != null)
                {
                    _context.CartItems.RemoveRange(cart.Items);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Payment verified successfully. Order confirmed!",
                order.Id,
                order.OrderNumber,
                order.PaymentStatus,
                order.OrderStatus
            });
        }
    }
}
