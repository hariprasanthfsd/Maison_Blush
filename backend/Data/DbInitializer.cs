using System;
using System.Collections.Generic;
using System.Linq;
using MaisonBlush.API.Models;

namespace MaisonBlush.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any())
            {
                return; // DB has been seeded
            }

            // 1. Seed Users
            var admin = new User
            {
                Name = "Maison Admin",
                Email = "admin@maisonblush.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Phone = "+91 9876543210",
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            };

            var customer = new User
            {
                Name = "Sophia Rose",
                Email = "customer@maisonblush.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Phone = "+91 9876543211",
                Role = "Customer",
                CreatedAt = DateTime.UtcNow
            };

            context.Users.AddRange(admin, customer);
            context.SaveChanges();

            // Seed Address for Customer
            var address = new Address
            {
                UserId = customer.Id,
                FullName = "Sophia Rose",
                Phone = "+91 9876543211",
                Street = "45 Rosewood Villa, Bandra West",
                City = "Mumbai",
                State = "Maharashtra",
                Country = "India",
                PostalCode = "400050",
                IsDefault = true
            };
            context.Addresses.Add(address);

            // 2. Seed Announcement Bar Messages
            var announcements = new List<AnnouncementBar>
            {
                new AnnouncementBar { Message = "✨ Free Express Shipping on Orders Over ₹2,999", LinkUrl = "/shop", DisplayOrder = 1, IsActive = true },
                new AnnouncementBar { Message = "🌸 New Spring Bloom Collection Just Dropped", LinkUrl = "/shop?category=dresses", DisplayOrder = 2, IsActive = true },
                new AnnouncementBar { Message = "💕 Women Owned & Independently Operated", LinkUrl = "/about", DisplayOrder = 3, IsActive = true },
                new AnnouncementBar { Message = "🛍️ Use Code WELCOME10 for 10% Off Your First Order", LinkUrl = "/shop", DisplayOrder = 4, IsActive = true }
            };
            context.AnnouncementBars.AddRange(announcements);

            // 3. Seed Hero Banners
            var banners = new List<Banner>
            {
                new Banner
                {
                    Title = "Elegance in Every Thread",
                    Subtitle = "THE SPRING / SUMMER '26 COLLECTION",
                    Description = "Embrace soft pastels, effortless silhouettes, and ethereal fabrics handcrafted for the modern woman.",
                    ImageUrl = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
                    ButtonText = "Explore Collection",
                    TargetUrl = "/shop",
                    SlideOrder = 1,
                    IsActive = true
                },
                new Banner
                {
                    Title = "Romantic Silk & Satin",
                    Subtitle = "FEATURED DRESSES",
                    Description = "From sunset cocktail parties to serene garden soirées, discover your signature look.",
                    ImageUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80",
                    ButtonText = "Shop Dresses",
                    TargetUrl = "/shop?category=dresses",
                    SlideOrder = 2,
                    IsActive = true
                },
                new Banner
                {
                    Title = "Timeless Accessories",
                    Subtitle = "THE FINISHING TOUCH",
                    Description = "Handpicked gold jewelry, woven leather clutches, and silk scarves designed to elevate any ensemble.",
                    ImageUrl = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=80",
                    ButtonText = "Discover Accessories",
                    TargetUrl = "/shop?category=accessories",
                    SlideOrder = 3,
                    IsActive = true
                }
            };
            context.Banners.AddRange(banners);

            // 4. Seed Store Benefits
            var benefits = new List<StoreBenefit>
            {
                new StoreBenefit { Title = "Fast & Free Shipping", IconName = "Truck", Description = "Complimentary courier delivery on all orders above ₹2,999 across India.", DisplayOrder = 1, IsActive = true },
                new StoreBenefit { Title = "Women Owned & Crafted", IconName = "Heart", Description = "Founded and operated by female designers passionate about timeless style.", DisplayOrder = 2, IsActive = true },
                new StoreBenefit { Title = "Affordable Luxury", IconName = "Sparkles", Description = "Boutique quality craftsmanship offered at accessible direct-to-consumer prices.", DisplayOrder = 3, IsActive = true },
                new StoreBenefit { Title = "Easy 14-Day Returns", IconName = "RotateCcw", Description = "Hassle-free return policy with instant store credit or full refunds.", DisplayOrder = 4, IsActive = true }
            };
            context.StoreBenefits.AddRange(benefits);

            // 5. Seed Categories & Subcategories
            var catDresses = new Category
            {
                Name = "Dresses",
                Slug = "dresses",
                ImageUrl = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
                Description = "Ethereal maxis, flowing midis, and romantic slip dresses for all occasions.",
                DisplayOrder = 1,
                IsActive = true
            };

            var catTops = new Category
            {
                Name = "Tops",
                Slug = "tops",
                ImageUrl = "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80",
                Description = "Linen blouses, scalloped camis, soft knits, and tailored corset tops.",
                DisplayOrder = 2,
                IsActive = true
            };

            var catBottoms = new Category
            {
                Name = "Bottoms",
                Slug = "bottoms",
                ImageUrl = "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80",
                Description = "Pleated trousers, high-waisted skirts, and relaxed linen shorts.",
                DisplayOrder = 3,
                IsActive = true
            };

            var catAccessories = new Category
            {
                Name = "Accessories",
                Slug = "accessories",
                ImageUrl = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
                Description = "Chic clutches, pearl earrings, silk scarves, and handmade leather belts.",
                DisplayOrder = 4,
                IsActive = true
            };

            var catSale = new Category
            {
                Name = "Sale",
                Slug = "sale",
                ImageUrl = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
                Description = "Exclusive discounts on last-chance boutique favorites.",
                DisplayOrder = 5,
                IsActive = true
            };

            context.Categories.AddRange(catDresses, catTops, catBottoms, catAccessories, catSale);
            context.SaveChanges();

            // 6. Seed Products with Images and Variants
            var p1 = new Product
            {
                Name = "Aura Blush Satin Maxi Dress",
                Slug = "aura-blush-satin-maxi-dress",
                Description = "Crafted from liquid-soft champagne blush satin, the Aura Maxi Dress features a soft cowl neckline, adjustable delicate shoulder straps, and a romantic side slit that flows effortlessly with every movement. Ideal for evening receptions, garden weddings, and formal celebrations.",
                ShortDescription = "Elegant cowl-neck satin maxi dress in dusty blush pink.",
                BasePrice = 3999,
                SalePrice = 3499,
                CategoryId = catDresses.Id,
                Sku = "MB-DR-001",
                Material = "100% Premium Satin Silk",
                CareInstructions = "Dry clean only. Gentle low iron on reverse.",
                Badge = "Bestseller",
                IsActive = true,
                IsFeatured = true,
                IsNewArrival = true,
                CreatedAt = DateTime.UtcNow
            };

            var p2 = new Product
            {
                Name = "Celeste Embroidered Linen Blouse",
                Slug = "celeste-embroidered-linen-blouse",
                Description = "The Celeste Blouse captures effortless bohemian sophistication with intricate tonal floral embroidery across the sleeves and neckline. Breathable organic linen keeps you fresh and chic all day long.",
                ShortDescription = "Breathable organic linen blouse with intricate floral embroidery.",
                BasePrice = 2499,
                SalePrice = null,
                CategoryId = catTops.Id,
                Sku = "MB-TP-002",
                Material = "100% Organic French Linen",
                CareInstructions = "Hand wash in cold water with gentle detergent.",
                Badge = "New",
                IsActive = true,
                IsFeatured = true,
                IsNewArrival = true,
                CreatedAt = DateTime.UtcNow
            };

            var p3 = new Product
            {
                Name = "Sienna High-Waisted Pleated Trouser",
                Slug = "sienna-high-waisted-pleated-trouser",
                Description = "Tailored to perfection, the Sienna Trouser offers a flattering high waist, deep front pleats, and wide-leg silhouette. Styled effortlessly with a fitted cami or relaxed linen blouse.",
                ShortDescription = "Sophisticated wide-leg pleated trousers in muted nude rose.",
                BasePrice = 3299,
                SalePrice = 2799,
                CategoryId = catBottoms.Id,
                Sku = "MB-BT-003",
                Material = "Cotton-Viscose Luxe Blend",
                CareInstructions = "Machine wash cold inside out. Hang dry.",
                Badge = "Sale",
                IsActive = true,
                IsFeatured = false,
                IsNewArrival = true,
                CreatedAt = DateTime.UtcNow
            };

            var p4 = new Product
            {
                Name = "Flora Freshwater Pearl Drop Earrings",
                Slug = "flora-freshwater-pearl-drop-earrings",
                Description = "Genuine Baroque freshwater pearls suspended from 18k gold-plated brass hoops. Each pearl is uniquely shaped by nature, giving every pair a one-of-a-kind organic beauty.",
                ShortDescription = "Handcrafted 18k gold-plated hoops with natural baroque pearls.",
                BasePrice = 1499,
                SalePrice = null,
                CategoryId = catAccessories.Id,
                Sku = "MB-AC-004",
                Material = "18k Gold Plated Brass & Natural Pearl",
                CareInstructions = "Avoid contact with perfume and water.",
                Badge = "New",
                IsActive = true,
                IsFeatured = true,
                IsNewArrival = true,
                CreatedAt = DateTime.UtcNow
            };

            var p5 = new Product
            {
                Name = "Isla Floral Chiffon Tiered Sundress",
                Slug = "isla-floral-chiffon-tiered-sundress",
                Description = "Features tiered ruffled skirts, a smocked bodice, and subtle metallic lurex threads that catch the sunlight beautifully. Perfectly airy for weekend brunches or coastal getaways.",
                ShortDescription = "Tiered floral sundress with smocked bodice and metallic accents.",
                BasePrice = 3799,
                SalePrice = 2999,
                CategoryId = catDresses.Id,
                Sku = "MB-DR-005",
                Material = "Polyester Chiffon with Soft Cotton Lining",
                CareInstructions = "Hand wash cold. Line dry in shade.",
                Badge = "Sale",
                IsActive = true,
                IsFeatured = true,
                IsNewArrival = true,
                CreatedAt = DateTime.UtcNow
            };

            var p6 = new Product
            {
                Name = "Gilded Rose Woven Leather Clutch",
                Slug = "gilded-rose-woven-leather-clutch",
                Description = "Hand-woven soft vegan leather clutch with a magnetic closure and detachable gold chain strap. Spacious interior fully lined in satin blush fabric with card slots.",
                ShortDescription = "Hand-woven cream leather clutch with detachable gold chain.",
                BasePrice = 2899,
                SalePrice = 2299,
                CategoryId = catAccessories.Id,
                Sku = "MB-AC-006",
                Material = "Premium Vegan Leather & Satin",
                CareInstructions = "Wipe clean with a soft damp cloth.",
                Badge = "Bestseller",
                IsActive = true,
                IsFeatured = false,
                IsNewArrival = false,
                CreatedAt = DateTime.UtcNow
            };

            context.Products.AddRange(p1, p2, p3, p4, p5, p6);
            context.SaveChanges();

            // Seed Product Images
            var productImages = new List<ProductImage>
            {
                new ProductImage { ProductId = p1.Id, ImageUrl = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 },
                new ProductImage { ProductId = p1.Id, ImageUrl = "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80", IsPrimary = false, DisplayOrder = 2 },
                new ProductImage { ProductId = p2.Id, ImageUrl = "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 },
                new ProductImage { ProductId = p3.Id, ImageUrl = "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 },
                new ProductImage { ProductId = p4.Id, ImageUrl = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 },
                new ProductImage { ProductId = p5.Id, ImageUrl = "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 },
                new ProductImage { ProductId = p6.Id, ImageUrl = "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 }
            };
            context.ProductImages.AddRange(productImages);

            // Seed Product Variants
            var variants = new List<ProductVariant>
            {
                // P1 Variants
                new ProductVariant { ProductId = p1.Id, Size = "XS", ColorName = "Blush Pink", ColorHex = "#F4E3DF", StockQuantity = 5, Sku = "MB-DR-001-XS-BL" },
                new ProductVariant { ProductId = p1.Id, Size = "S", ColorName = "Blush Pink", ColorHex = "#F4E3DF", StockQuantity = 12, Sku = "MB-DR-001-S-BL" },
                new ProductVariant { ProductId = p1.Id, Size = "M", ColorName = "Blush Pink", ColorHex = "#F4E3DF", StockQuantity = 15, Sku = "MB-DR-001-M-BL" },
                new ProductVariant { ProductId = p1.Id, Size = "L", ColorName = "Champagne Gold", ColorHex = "#E6D7C3", StockQuantity = 8, Sku = "MB-DR-001-L-CG" },
                
                // P2 Variants
                new ProductVariant { ProductId = p2.Id, Size = "S", ColorName = "Cream", ColorHex = "#FFFDFB", StockQuantity = 10, Sku = "MB-TP-002-S-CR" },
                new ProductVariant { ProductId = p2.Id, Size = "M", ColorName = "Cream", ColorHex = "#FFFDFB", StockQuantity = 14, Sku = "MB-TP-002-M-CR" },
                new ProductVariant { ProductId = p2.Id, Size = "L", ColorName = "Sage Green", ColorHex = "#C8D3C5", StockQuantity = 6, Sku = "MB-TP-002-L-SG" },
                
                // P3 Variants
                new ProductVariant { ProductId = p3.Id, Size = "S", ColorName = "Dusty Rose", ColorHex = "#D8A79B", StockQuantity = 7, Sku = "MB-BT-003-S-DR" },
                new ProductVariant { ProductId = p3.Id, Size = "M", ColorName = "Dusty Rose", ColorHex = "#D8A79B", StockQuantity = 9, Sku = "MB-BT-003-M-DR" },
                
                // P4 Accessories (One size)
                new ProductVariant { ProductId = p4.Id, Size = "One Size", ColorName = "18k Gold", ColorHex = "#D4AF37", StockQuantity = 25, Sku = "MB-AC-004-OS-GD" },
                
                // P5 Variants
                new ProductVariant { ProductId = p5.Id, Size = "S", ColorName = "Blush Floral", ColorHex = "#E8C4C0", StockQuantity = 4, Sku = "MB-DR-005-S-BF" },
                new ProductVariant { ProductId = p5.Id, Size = "M", ColorName = "Blush Floral", ColorHex = "#E8C4C0", StockQuantity = 8, Sku = "MB-DR-005-M-BF" },
                
                // P6 Variants
                new ProductVariant { ProductId = p6.Id, Size = "One Size", ColorName = "Ivory Cream", ColorHex = "#FAF6F0", StockQuantity = 15, Sku = "MB-AC-006-OS-IV" }
            };
            context.ProductVariants.AddRange(variants);

            // 7. Seed Reviews
            var reviews = new List<Review>
            {
                new Review { ProductId = p1.Id, UserId = customer.Id, ReviewerName = "Sophia Rose", Rating = 5, Comment = "Absolute perfection! The satin material feels so luxurious and high-end. I wore this to a seaside wedding and received endless compliments.", Status = "Approved", CreatedAt = DateTime.UtcNow.AddDays(-5) },
                new Review { ProductId = p1.Id, ReviewerName = "Elena Vance", Rating = 5, Comment = "The color is a soft romantic rose blush. Fits like a dream, true to size!", Status = "Approved", CreatedAt = DateTime.UtcNow.AddDays(-12) },
                new Review { ProductId = p2.Id, ReviewerName = "Maya Patel", Rating = 4, Comment = "Beautiful embroidery work. Very breathable fabric for warm days.", Status = "Approved", CreatedAt = DateTime.UtcNow.AddDays(-3) }
            };
            context.Reviews.AddRange(reviews);

            // 8. Seed Coupons
            var coupons = new List<Coupon>
            {
                new Coupon { Code = "WELCOME10", Description = "10% off your first boutique purchase", DiscountType = "Percentage", DiscountValue = 10, MinOrderAmount = 1000, MaxDiscountCap = 500, MaxUsageCount = 1000, IsActive = true },
                new Coupon { Code = "BLUSH20", Description = "Flat ₹500 off on orders above ₹2,500", DiscountType = "Fixed", DiscountValue = 500, MinOrderAmount = 2500, MaxDiscountCap = null, MaxUsageCount = 500, IsActive = true }
            };
            context.Coupons.AddRange(coupons);

            context.SaveChanges();
        }
    }
}
