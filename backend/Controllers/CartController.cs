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
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int? GetCurrentUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (int.TryParse(userIdStr, out var id)) return id;
            return null;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart([FromQuery] string? sessionId)
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
            else if (!string.IsNullOrWhiteSpace(sessionId))
            {
                cart = await _context.Carts
                    .Include(c => c.Items)
                        .ThenInclude(i => i.Product)
                            .ThenInclude(p => p!.Images)
                    .Include(c => c.Items)
                        .ThenInclude(i => i.ProductVariant)
                    .FirstOrDefaultAsync(c => c.SessionId == sessionId);
            }

            if (cart == null)
            {
                return Ok(new CartDto { Id = 0, Items = new List<CartItemDto>(), Subtotal = 0, TotalQuantity = 0 });
            }

            var dto = MapToCartDto(cart);
            return Ok(dto);
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            var userId = GetCurrentUserId();
            Cart? cart = null;

            if (userId.HasValue)
            {
                cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == userId.Value);
                if (cart == null)
                {
                    cart = new Cart { UserId = userId.Value, SessionId = dto.SessionId, UpdatedAt = DateTime.UtcNow };
                    _context.Carts.Add(cart);
                    await _context.SaveChangesAsync();
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(dto.SessionId)) return BadRequest("Session ID is required for guest cart.");
                cart = await _context.Carts.FirstOrDefaultAsync(c => c.SessionId == dto.SessionId);
                if (cart == null)
                {
                    cart = new Cart { SessionId = dto.SessionId, UpdatedAt = DateTime.UtcNow };
                    _context.Carts.Add(cart);
                    await _context.SaveChangesAsync();
                }
            }

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null || !product.IsActive) return NotFound("Product not available.");

            ProductVariant? variant = null;
            if (dto.ProductVariantId.HasValue)
            {
                variant = await _context.ProductVariants.FindAsync(dto.ProductVariantId.Value);
                if (variant == null || variant.ProductId != dto.ProductId) return BadRequest("Invalid variant.");
            }

            var existingItem = await _context.CartItems.FirstOrDefaultAsync(i => 
                i.CartId == cart.Id && 
                i.ProductId == dto.ProductId && 
                i.ProductVariantId == dto.ProductVariantId);

            var requestedQty = dto.Quantity > 0 ? dto.Quantity : 1;
            var availableStock = variant != null ? variant.StockQuantity : await _context.ProductVariants.Where(v => v.ProductId == dto.ProductId).SumAsync(v => v.StockQuantity);

            if (existingItem != null)
            {
                if (existingItem.Quantity + requestedQty > availableStock)
                {
                    return BadRequest($"Cannot add more items. Maximum stock available is {availableStock}.");
                }
                existingItem.Quantity += requestedQty;
            }
            else
            {
                if (requestedQty > availableStock)
                {
                    return BadRequest($"Only {availableStock} units available in stock.");
                }

                var newItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = dto.ProductId,
                    ProductVariantId = dto.ProductVariantId,
                    Quantity = requestedQty,
                    AddedAt = DateTime.UtcNow
                };
                _context.CartItems.Add(newItem);
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await GetCart(dto.SessionId);
        }

        [HttpPut("items/{itemId:int}")]
        public async Task<IActionResult> UpdateCartItem(int itemId, [FromBody] int quantity)
        {
            var item = await _context.CartItems
                .Include(i => i.Cart)
                .Include(i => i.ProductVariant)
                .Include(i => i.Product)
                .FirstOrDefaultAsync(i => i.Id == itemId);

            if (item == null) return NotFound("Cart item not found.");

            // OWASP A01: Broken Access Control / IDOR Check
            var currentUserId = GetCurrentUserId();
            if (item.Cart?.UserId.HasValue == true)
            {
                if (!currentUserId.HasValue || currentUserId.Value != item.Cart.UserId.Value)
                {
                    return Forbid();
                }
            }

            if (quantity <= 0)
            {
                _context.CartItems.Remove(item);
            }
            else
            {
                // OWASP A04: Insecure Design - Enforce sensible limits per item
                if (quantity > 20)
                {
                    return BadRequest("Maximum 20 pieces allowed per item order.");
                }

                var availableStock = item.ProductVariant != null ? item.ProductVariant.StockQuantity : 20;
                if (quantity > availableStock)
                {
                    return BadRequest($"Only {availableStock} items in stock.");
                }
                item.Quantity = quantity;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cart updated successfully." });
        }

        [HttpDelete("items/{itemId:int}")]
        public async Task<IActionResult> RemoveCartItem(int itemId)
        {
            var item = await _context.CartItems
                .Include(i => i.Cart)
                .FirstOrDefaultAsync(i => i.Id == itemId);

            if (item == null) return NotFound();

            // OWASP A01: Broken Access Control / IDOR Check
            var currentUserId = GetCurrentUserId();
            if (item.Cart?.UserId.HasValue == true)
            {
                if (!currentUserId.HasValue || currentUserId.Value != item.Cart.UserId.Value)
                {
                    return Forbid();
                }
            }

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Item removed from cart." });
        }

        [HttpPost("sync")]
        public async Task<IActionResult> SyncGuestCart([FromBody] SyncCartDto dto)
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue || string.IsNullOrWhiteSpace(dto.SessionId)) return BadRequest();

            var guestCart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.SessionId == dto.SessionId && c.UserId == null);

            if (guestCart != null && guestCart.Items.Any())
            {
                var userCart = await _context.Carts
                    .Include(c => c.Items)
                    .FirstOrDefaultAsync(c => c.UserId == userId.Value);

                if (userCart == null)
                {
                    guestCart.UserId = userId.Value;
                }
                else
                {
                    foreach (var gItem in guestCart.Items)
                    {
                        var uItem = userCart.Items.FirstOrDefault(i => i.ProductId == gItem.ProductId && i.ProductVariantId == gItem.ProductVariantId);
                        if (uItem != null)
                        {
                            uItem.Quantity += gItem.Quantity;
                        }
                        else
                        {
                            userCart.Items.Add(new CartItem
                            {
                                CartId = userCart.Id,
                                ProductId = gItem.ProductId,
                                ProductVariantId = gItem.ProductVariantId,
                                Quantity = gItem.Quantity,
                                AddedAt = DateTime.UtcNow
                            });
                        }
                    }
                    _context.Carts.Remove(guestCart);
                }

                await _context.SaveChangesAsync();
            }

            return await GetCart(null);
        }

        private static CartDto MapToCartDto(Cart cart)
        {
            var items = cart.Items.Select(i =>
            {
                var unitPrice = i.Product?.SalePrice ?? i.Product?.BasePrice ?? 0;
                if (i.ProductVariant != null)
                {
                    unitPrice += i.ProductVariant.AdditionalPrice;
                }

                return new CartItemDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name ?? "Unknown Product",
                    ProductSlug = i.Product?.Slug ?? "",
                    ProductImageUrl = i.Product?.Images.FirstOrDefault()?.ImageUrl ?? "",
                    ProductVariantId = i.ProductVariantId,
                    Size = i.ProductVariant?.Size ?? "",
                    ColorName = i.ProductVariant?.ColorName ?? "",
                    ColorHex = i.ProductVariant?.ColorHex ?? "",
                    UnitPrice = unitPrice,
                    Quantity = i.Quantity,
                    AvailableStock = i.ProductVariant?.StockQuantity ?? 10
                };
            }).ToList();

            return new CartDto
            {
                Id = cart.Id,
                Items = items,
                Subtotal = items.Sum(i => i.TotalPrice),
                TotalQuantity = items.Sum(i => i.Quantity)
            };
        }
    }
}
