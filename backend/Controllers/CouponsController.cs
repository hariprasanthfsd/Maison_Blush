using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using MaisonBlush.API.Data;
using MaisonBlush.API.DTOs;

namespace MaisonBlush.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CouponsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CouponsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [EnableRateLimiting("AuthPolicy")]
        [HttpPost("validate")]
        public async Task<IActionResult> ValidateCoupon([FromBody] ValidateCouponDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Code))
            {
                return BadRequest(new CouponResultDto { IsValid = false, Message = "Please enter a coupon code." });
            }

            var coupon = await _context.Coupons.FirstOrDefaultAsync(c => c.Code.ToUpper() == dto.Code.Trim().ToUpper());
            if (coupon == null || !coupon.IsActive)
            {
                return Ok(new CouponResultDto { IsValid = false, Message = "Invalid or expired coupon code." });
            }

            if (coupon.ExpiryDate.HasValue && coupon.ExpiryDate < DateTime.UtcNow)
            {
                return Ok(new CouponResultDto { IsValid = false, Message = "This coupon code has expired." });
            }

            if (coupon.UsedCount >= coupon.MaxUsageCount)
            {
                return Ok(new CouponResultDto { IsValid = false, Message = "Coupon usage limit reached." });
            }

            if (dto.OrderSubtotal < coupon.MinOrderAmount)
            {
                return Ok(new CouponResultDto { IsValid = false, Message = $"Minimum order amount of ₹{coupon.MinOrderAmount:N0} required for code {coupon.Code}." });
            }

            decimal calculatedDiscount = 0;
            if (coupon.DiscountType == "Percentage")
            {
                calculatedDiscount = (dto.OrderSubtotal * coupon.DiscountValue) / 100m;
                if (coupon.MaxDiscountCap.HasValue && calculatedDiscount > coupon.MaxDiscountCap.Value)
                {
                    calculatedDiscount = coupon.MaxDiscountCap.Value;
                }
            }
            else if (coupon.DiscountType == "Fixed")
            {
                calculatedDiscount = coupon.DiscountValue;
            }

            return Ok(new CouponResultDto
            {
                IsValid = true,
                Message = $"Coupon '{coupon.Code}' applied successfully!",
                Code = coupon.Code,
                DiscountType = coupon.DiscountType,
                DiscountValue = coupon.DiscountValue,
                CalculatedDiscount = Math.Min(dto.OrderSubtotal, Math.Round(calculatedDiscount, 2))
            });
        }
    }
}
