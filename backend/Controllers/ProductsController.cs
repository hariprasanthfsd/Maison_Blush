using System;
using System.Linq;
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
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] ProductQueryDto query)
        {
            var pQuery = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Subcategory)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .Include(p => p.Reviews)
                .Where(p => p.IsActive);

            // 1. Category Filter
            if (!string.IsNullOrWhiteSpace(query.Category))
            {
                var catSlug = query.Category.ToLower();
                if (catSlug == "dresses-and-accessories" || catSlug == "dresses-accessories")
                {
                    pQuery = pQuery.Where(p => p.Category != null && (p.Category.Slug.ToLower() == "dresses" || p.Category.Slug.ToLower() == "accessories"));
                }
                else
                {
                    pQuery = pQuery.Where(p => p.Category != null && p.Category.Slug.ToLower() == catSlug);
                }
            }

            // 2. Subcategory Filter
            if (!string.IsNullOrWhiteSpace(query.Subcategory))
            {
                var subSlug = query.Subcategory.ToLower();
                pQuery = pQuery.Where(p => p.Subcategory != null && p.Subcategory.Slug.ToLower() == subSlug);
            }

            // 3. Price Filter
            if (query.MinPrice.HasValue)
            {
                pQuery = pQuery.Where(p => (p.SalePrice ?? p.BasePrice) >= query.MinPrice.Value);
            }
            if (query.MaxPrice.HasValue)
            {
                pQuery = pQuery.Where(p => (p.SalePrice ?? p.BasePrice) <= query.MaxPrice.Value);
            }

            // 4. Size Filter
            if (!string.IsNullOrWhiteSpace(query.Size))
            {
                var size = query.Size.ToUpper();
                pQuery = pQuery.Where(p => p.Variants.Any(v => v.Size.ToUpper() == size && v.StockQuantity > 0));
            }

            // 5. Color Filter
            if (!string.IsNullOrWhiteSpace(query.Color))
            {
                var color = query.Color.ToLower();
                pQuery = pQuery.Where(p => p.Variants.Any(v => v.ColorName.ToLower().Contains(color)));
            }

            // 6. On Sale
            if (query.OnSale.HasValue && query.OnSale.Value)
            {
                pQuery = pQuery.Where(p => p.SalePrice.HasValue && p.SalePrice < p.BasePrice);
            }

            // 7. In Stock
            if (query.InStock.HasValue && query.InStock.Value)
            {
                pQuery = pQuery.Where(p => p.Variants.Any(v => v.StockQuantity > 0));
            }

            // 8. Keyword Search
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var s = query.Search.ToLower();
                pQuery = pQuery.Where(p => p.Name.ToLower().Contains(s) ||
                                           p.Description.ToLower().Contains(s) ||
                                           (p.Category != null && p.Category.Name.ToLower().Contains(s)) ||
                                           p.Material.ToLower().Contains(s) ||
                                           p.Badge.ToLower().Contains(s));
            }

            // 9. Sorting
            pQuery = query.Sort?.ToLower() switch
            {
                "price_asc" => pQuery.OrderBy(p => p.SalePrice ?? p.BasePrice),
                "price_desc" => pQuery.OrderByDescending(p => p.SalePrice ?? p.BasePrice),
                "popularity" => pQuery.OrderByDescending(p => p.Reviews.Count),
                _ => pQuery.OrderByDescending(p => p.CreatedAt) // "newest" default
            };

            var totalCount = await pQuery.CountAsync();
            var page = Math.Max(1, query.Page);
            var pageSize = Math.Max(1, query.PageSize);

            var products = await pQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Slug = p.Slug,
                    ShortDescription = p.ShortDescription,
                    BasePrice = p.BasePrice,
                    SalePrice = p.SalePrice,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.Name : "",
                    CategorySlug = p.Category != null ? p.Category.Slug : "",
                    Badge = p.Badge,
                    PrimaryImageUrl = p.Images.Where(i => i.IsPrimary).Select(i => i.ImageUrl).FirstOrDefault() 
                                     ?? p.Images.Select(i => i.ImageUrl).FirstOrDefault() ?? "",
                    IsNewArrival = p.IsNewArrival,
                    IsFeatured = p.IsFeatured,
                    AverageRating = p.Reviews.Any() ? Math.Round(p.Reviews.Average(r => r.Rating), 1) : 5.0,
                    ReviewCount = p.Reviews.Count,
                    TotalStock = p.Variants.Sum(v => v.StockQuantity)
                })
                .ToListAsync();

            return Ok(new PaginatedListDto<ProductDto>
            {
                Items = products,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var p = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .Include(p => p.Reviews.Where(r => r.Status == "Approved"))
                .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

            if (p == null) return NotFound(new { message = "Product not found." });

            var dto = MapToDetailDto(p);
            return Ok(dto);
        }

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetProductBySlug(string slug)
        {
            var p = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .Include(p => p.Reviews.Where(r => r.Status == "Approved"))
                .FirstOrDefaultAsync(p => p.Slug.ToLower() == slug.ToLower() && p.IsActive);

            if (p == null) return NotFound(new { message = "Product not found." });

            var dto = MapToDetailDto(p);
            return Ok(dto);
        }

        [HttpGet("{id:int}/related")]
        public async Task<IActionResult> GetRelatedProducts(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            var related = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .Include(p => p.Reviews)
                .Where(p => p.IsActive && p.Id != id && p.CategoryId == product.CategoryId)
                .Take(4)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Slug = p.Slug,
                    ShortDescription = p.ShortDescription,
                    BasePrice = p.BasePrice,
                    SalePrice = p.SalePrice,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.Name : "",
                    CategorySlug = p.Category != null ? p.Category.Slug : "",
                    Badge = p.Badge,
                    PrimaryImageUrl = p.Images.Where(i => i.IsPrimary).Select(i => i.ImageUrl).FirstOrDefault() ?? "",
                    IsNewArrival = p.IsNewArrival,
                    IsFeatured = p.IsFeatured,
                    AverageRating = p.Reviews.Any() ? Math.Round(p.Reviews.Average(r => r.Rating), 1) : 5.0,
                    ReviewCount = p.Reviews.Count,
                    TotalStock = p.Variants.Sum(v => v.StockQuantity)
                })
                .ToListAsync();

            return Ok(related);
        }

        private static ProductDetailDto MapToDetailDto(Product p)
        {
            return new ProductDetailDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Description = p.Description,
                ShortDescription = p.ShortDescription,
                BasePrice = p.BasePrice,
                SalePrice = p.SalePrice,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name ?? "",
                CategorySlug = p.Category?.Slug ?? "",
                Sku = p.Sku,
                Material = p.Material,
                CareInstructions = p.CareInstructions,
                Badge = p.Badge,
                PrimaryImageUrl = p.Images.Where(i => i.IsPrimary).Select(i => i.ImageUrl).FirstOrDefault() 
                                 ?? p.Images.Select(i => i.ImageUrl).FirstOrDefault() ?? "",
                IsNewArrival = p.IsNewArrival,
                IsFeatured = p.IsFeatured,
                AverageRating = p.Reviews.Any() ? Math.Round(p.Reviews.Average(r => r.Rating), 1) : 5.0,
                ReviewCount = p.Reviews.Count,
                TotalStock = p.Variants.Sum(v => v.StockQuantity),
                Images = p.Images.OrderBy(i => i.DisplayOrder).Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    IsPrimary = i.IsPrimary,
                    DisplayOrder = i.DisplayOrder
                }).ToList(),
                Variants = p.Variants.Select(v => new ProductVariantDto
                {
                    Id = v.Id,
                    Size = v.Size,
                    ColorName = v.ColorName,
                    ColorHex = v.ColorHex,
                    StockQuantity = v.StockQuantity,
                    Sku = v.Sku,
                    AdditionalPrice = v.AdditionalPrice
                }).ToList(),
                Reviews = p.Reviews.Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    ReviewerName = r.ReviewerName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    Status = r.Status,
                    CreatedAt = r.CreatedAt
                }).ToList()
            };
        }
    }
}
