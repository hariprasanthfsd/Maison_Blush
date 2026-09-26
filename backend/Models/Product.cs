using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MaisonBlush.API.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(220)]
        public string Slug { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [MaxLength(300)]
        public string ShortDescription { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal BasePrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? SalePrice { get; set; }

        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        public int? SubcategoryId { get; set; }
        public Category? Subcategory { get; set; }

        [MaxLength(50)]
        public string Sku { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Material { get; set; } = string.Empty;

        [MaxLength(300)]
        public string CareInstructions { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Badge { get; set; } = string.Empty; // "New", "Sale", "Bestseller", "Limited Stock"

        public bool IsActive { get; set; } = true;
        public bool IsFeatured { get; set; } = false;
        public bool IsNewArrival { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }

    public class ProductVariant
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }

        [Required, MaxLength(20)]
        public string Size { get; set; } = "M"; // XS, S, M, L, XL, XXL

        [Required, MaxLength(50)]
        public string ColorName { get; set; } = "Blush Pink";

        [MaxLength(20)]
        public string ColorHex { get; set; } = "#F4E3DF";

        public int StockQuantity { get; set; } = 10;

        [MaxLength(60)]
        public string Sku { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal AdditionalPrice { get; set; } = 0;
    }

    public class ProductImage
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }

        [Required, MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [MaxLength(100)]
        public string PublicId { get; set; } = string.Empty;

        public bool IsPrimary { get; set; } = false;
        public int DisplayOrder { get; set; } = 0;
    }
}
