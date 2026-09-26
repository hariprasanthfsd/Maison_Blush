using System;
using System.Collections.Generic;

namespace MaisonBlush.API.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public decimal? SalePrice { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string CategorySlug { get; set; } = string.Empty;
        public string Badge { get; set; } = string.Empty;
        public string PrimaryImageUrl { get; set; } = string.Empty;
        public bool IsNewArrival { get; set; }
        public bool IsFeatured { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
        public int TotalStock { get; set; }
        public bool IsInStock => TotalStock > 0;
    }

    public class ProductDetailDto : ProductDto
    {
        public string Description { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public string Material { get; set; } = string.Empty;
        public string CareInstructions { get; set; } = string.Empty;
        public List<ProductImageDto> Images { get; set; } = new List<ProductImageDto>();
        public List<ProductVariantDto> Variants { get; set; } = new List<ProductVariantDto>();
        public List<ReviewDto> Reviews { get; set; } = new List<ReviewDto>();
    }

    public class ProductImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class ProductVariantDto
    {
        public int Id { get; set; }
        public string Size { get; set; } = string.Empty;
        public string ColorName { get; set; } = string.Empty;
        public string ColorHex { get; set; } = string.Empty;
        public int StockQuantity { get; set; }
        public string Sku { get; set; } = string.Empty;
        public decimal AdditionalPrice { get; set; }
    }

    public class ProductQueryDto
    {
        public string? Category { get; set; }
        public string? Subcategory { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? Size { get; set; }
        public string? Color { get; set; }
        public bool? OnSale { get; set; }
        public bool? InStock { get; set; }
        public string? Search { get; set; }
        public string? Sort { get; set; } // "newest", "price_asc", "price_desc", "popularity"
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 12;
    }

    public class PaginatedListDto<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }
}
