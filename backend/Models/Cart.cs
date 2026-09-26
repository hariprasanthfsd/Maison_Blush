using System;
using System.Collections.Generic;

namespace MaisonBlush.API.Models
{
    public class Cart
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }

        public string SessionId { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }

    public class CartItem
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public Cart? Cart { get; set; }

        public int ProductId { get; set; }
        public Product? Product { get; set; }

        public int? ProductVariantId { get; set; }
        public ProductVariant? ProductVariant { get; set; }

        public int Quantity { get; set; } = 1;
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }

    public class Wishlist
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

        public ICollection<WishlistItem> Items { get; set; } = new List<WishlistItem>();
    }

    public class WishlistItem
    {
        public int Id { get; set; }
        public int WishlistId { get; set; }
        public Wishlist? Wishlist { get; set; }

        public int ProductId { get; set; }
        public Product? Product { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}
