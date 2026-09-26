using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MaisonBlush.API.Models
{
    public class Coupon
    {
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Code { get; set; } = string.Empty;

        [MaxLength(250)]
        public string Description { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string DiscountType { get; set; } = "Percentage"; // "Percentage" or "Fixed"

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountValue { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal MinOrderAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxDiscountCap { get; set; }

        public int MaxUsageCount { get; set; } = 1000;
        public int UsedCount { get; set; } = 0;
        public int PerUserLimit { get; set; } = 1;

        public DateTime? ExpiryDate { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class CouponUsage
    {
        public int Id { get; set; }
        public int CouponId { get; set; }
        public Coupon? Coupon { get; set; }

        public int UserId { get; set; }
        public int OrderId { get; set; }

        public DateTime UsedAt { get; set; } = DateTime.UtcNow;
    }

    public class Review
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }

        public int? UserId { get; set; }
        public User? User { get; set; }

        [Required, MaxLength(100)]
        public string ReviewerName { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; } = 5;

        [Required, MaxLength(1000)]
        public string Comment { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string Status { get; set; } = "Approved"; // Approved, Pending, Rejected

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Banner
    {
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(200)]
        public string Subtitle { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required, MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [MaxLength(50)]
        public string ButtonText { get; set; } = "Shop New Arrivals";

        [MaxLength(200)]
        public string TargetUrl { get; set; } = "/shop";

        public int SlideOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class AnnouncementBar
    {
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string Message { get; set; } = string.Empty;

        [MaxLength(200)]
        public string LinkUrl { get; set; } = string.Empty;

        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class StoreBenefit
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string IconName { get; set; } = "Truck"; // Lucide icon name

        [Required, MaxLength(200)]
        public string Description { get; set; } = string.Empty;

        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class Subscriber
    {
        public int Id { get; set; }

        [Required, EmailAddress, MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
    }
}
