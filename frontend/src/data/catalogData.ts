import { Product, Category, Banner, AnnouncementBar, StoreBenefit } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Dresses',
    slug: 'dresses',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    description: 'Ethereal maxis, flowing midis, and romantic slip dresses for all occasions.',
    displayOrder: 1,
    isActive: true,
    productCount: 14,
  },
  {
    id: 2,
    name: 'Tops',
    slug: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80',
    description: 'Linen blouses, scalloped camis, soft knits, and tailored corset tops.',
    displayOrder: 2,
    isActive: true,
    productCount: 6,
  },
  {
    id: 3,
    name: 'Bottoms',
    slug: 'bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
    description: 'Pleated trousers, high-waisted skirts, and relaxed linen shorts.',
    displayOrder: 3,
    isActive: true,
    productCount: 6,
  },
  {
    id: 4,
    name: 'Accessories',
    slug: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    description: 'Chic clutches, pearl earrings, silk scarves, and handmade leather belts.',
    displayOrder: 4,
    isActive: true,
    productCount: 8,
  },
  {
    id: 5,
    name: 'Sale',
    slug: 'sale',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    description: 'Exclusive discounts on last-chance boutique favorites.',
    displayOrder: 5,
    isActive: true,
    productCount: 10,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- 1. DRESSES (14 Haute Couture Items) ---
  {
    id: 1,
    name: 'Aura Blush Satin Maxi Dress',
    slug: 'aura-blush-satin-maxi-dress',
    shortDescription: 'Liquid-soft champagne blush satin cowl-neck maxi gown.',
    description: 'Crafted from liquid-soft champagne blush satin, the Aura Maxi features a soft cowl neckline, adjustable delicate shoulder straps, and a romantic side slit that flows effortlessly with every movement. Ideal for evening receptions, garden weddings, and formal celebrations.',
    basePrice: 4499,
    salePrice: 3899,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-001',
    material: '100% Pure Mulberry Satin Silk',
    careInstructions: 'Dry clean only. Gentle low iron on reverse.',
    badge: 'Bestseller',
    primaryImageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 38,
    totalStock: 24,
    isInStock: true,
    images: [
      { id: 101, imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 },
      { id: 102, imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80', isPrimary: false, displayOrder: 2 }
    ],
    variants: [
      { id: 1, size: 'XS', colorName: 'Blush Pink', colorHex: '#F4C2C2', stockQuantity: 6, sku: 'MB-DR-001-XS', additionalPrice: 0 },
      { id: 2, size: 'S', colorName: 'Blush Pink', colorHex: '#F4C2C2', stockQuantity: 8, sku: 'MB-DR-001-S', additionalPrice: 0 },
      { id: 3, size: 'M', colorName: 'Blush Pink', colorHex: '#F4C2C2', stockQuantity: 7, sku: 'MB-DR-001-M', additionalPrice: 0 },
      { id: 4, size: 'L', colorName: 'Blush Pink', colorHex: '#F4C2C2', stockQuantity: 3, sku: 'MB-DR-001-L', additionalPrice: 0 }
    ]
  },
  {
    id: 5,
    name: 'Isla Floral Chiffon Tiered Sundress',
    slug: 'isla-floral-chiffon-tiered-sundress',
    shortDescription: 'Romantic tiered floral chiffon dress with ruffled cap sleeves.',
    description: 'Brimming with vintage romance, the Isla Sundress is tailored from whisper-weight crinkled chiffon featuring delicate hand-painted botanical watercolors. Tiered skirt layers dance as you walk.',
    basePrice: 3899,
    salePrice: 3299,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-005',
    material: 'Crinkle Silk Chiffon with Cotton Lawn Lining',
    careInstructions: 'Dry clean or gentle hand wash in cold water.',
    badge: 'New Arrival',
    primaryImageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 26,
    totalStock: 18,
    isInStock: true,
    images: [
      { id: 501, imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 51, size: 'S', colorName: 'Rose Floral', colorHex: '#E8A598', stockQuantity: 8, sku: 'MB-DR-005-S', additionalPrice: 0 },
      { id: 52, size: 'M', colorName: 'Rose Floral', colorHex: '#E8A598', stockQuantity: 6, sku: 'MB-DR-005-M', additionalPrice: 0 },
      { id: 53, size: 'L', colorName: 'Rose Floral', colorHex: '#E8A598', stockQuantity: 4, sku: 'MB-DR-005-L', additionalPrice: 0 }
    ]
  },
  {
    id: 7,
    name: 'Vivienne Embellished Velvet Gala Gown',
    slug: 'vivienne-embellished-velvet-gala-gown',
    shortDescription: 'Deep rosewood micro-velvet evening gown with hand-sewn pearl trim.',
    description: 'An architectural silhouette crafted in rich rosewood velvet. Features an off-the-shoulder sculpted portrait neckline and subtle mermaid contour, finished with seed-pearl waistline accents.',
    basePrice: 7999,
    salePrice: undefined,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-007',
    material: 'Plush Silk-Rayon Velvet',
    careInstructions: 'Specialist dry clean only.',
    badge: 'Exclusive',
    primaryImageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 19,
    totalStock: 12,
    isInStock: true,
    images: [
      { id: 701, imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 71, size: 'XS', colorName: 'Rosewood', colorHex: '#652A2D', stockQuantity: 3, sku: 'MB-DR-007-XS', additionalPrice: 0 },
      { id: 72, size: 'S', colorName: 'Rosewood', colorHex: '#652A2D', stockQuantity: 5, sku: 'MB-DR-007-S', additionalPrice: 0 },
      { id: 73, size: 'M', colorName: 'Rosewood', colorHex: '#652A2D', stockQuantity: 4, sku: 'MB-DR-007-M', additionalPrice: 0 }
    ]
  },
  {
    id: 8,
    name: 'Genevieve French Chantilly Lace Gown',
    slug: 'genevieve-french-chantilly-lace-gown',
    shortDescription: 'Breathtaking ivory and champagne lace gown with scalloped train.',
    description: 'Woven on heritage French looms, this Chantilly lace masterpiece features sheer corset illusion paneling, sweetheart bodice, and a scalloped hem with an ethereal chapel train.',
    basePrice: 8999,
    salePrice: 7999,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-008',
    material: 'Authentic French Chantilly Lace & Silk Georgette',
    careInstructions: 'Delicate dry clean only.',
    badge: 'Atelier Couture',
    primaryImageUrl: 'https://images.unsplash.com/photo-1549570652-97324981a6fd?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 31,
    totalStock: 8,
    isInStock: true,
    images: [
      { id: 801, imageUrl: 'https://images.unsplash.com/photo-1549570652-97324981a6fd?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 81, size: 'S', colorName: 'Champagne Lace', colorHex: '#F7E7CE', stockQuantity: 4, sku: 'MB-DR-008-S', additionalPrice: 0 },
      { id: 82, size: 'M', colorName: 'Champagne Lace', colorHex: '#F7E7CE', stockQuantity: 4, sku: 'MB-DR-008-M', additionalPrice: 0 }
    ]
  },
  {
    id: 9,
    name: 'Camille Sunburst Pleated Slip Dress',
    slug: 'camille-sunburst-pleated-slip-dress',
    shortDescription: 'Micro-pleated rosewater slip dress with shimmer finish.',
    description: 'Radiating subtle metallic luster under evening lights, the Camille slip dress features permanent sunburst micro-pleats that expand gracefully as you move. Finished with slender crossover straps.',
    basePrice: 4299,
    salePrice: 3599,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-009',
    material: 'Lustrous Japanese Georgette',
    careInstructions: 'Hand wash cold or steam clean.',
    badge: 'Popular',
    primaryImageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 4.8,
    reviewCount: 22,
    totalStock: 15,
    isInStock: true,
    images: [
      { id: 901, imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 91, size: 'XS', colorName: 'Rosewater', colorHex: '#FADBD8', stockQuantity: 5, sku: 'MB-DR-009-XS', additionalPrice: 0 },
      { id: 92, size: 'S', colorName: 'Rosewater', colorHex: '#FADBD8', stockQuantity: 6, sku: 'MB-DR-009-S', additionalPrice: 0 },
      { id: 93, size: 'M', colorName: 'Rosewater', colorHex: '#FADBD8', stockQuantity: 4, sku: 'MB-DR-009-M', additionalPrice: 0 }
    ]
  },
  {
    id: 10,
    name: 'Odette Corset Tulle Ballgown',
    slug: 'odette-corset-tulle-ballgown',
    shortDescription: 'Multi-layered pastel blush tulle gown with structured boned corset.',
    description: 'Turn heads at your grand soirée in the Odette Ballgown. Featuring 16 flexible interior boning channels for waist definition and twelve whisper-light tiers of gathered English tulle.',
    basePrice: 9499,
    salePrice: undefined,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-010',
    material: 'Fine English Tulle over Satin Foundation',
    careInstructions: 'Specialist dry clean only.',
    badge: 'Runway Edition',
    primaryImageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 15,
    totalStock: 6,
    isInStock: true,
    images: [
      { id: 1001, imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 101, size: 'S', colorName: 'Cloud Blush', colorHex: '#FCE4EC', stockQuantity: 3, sku: 'MB-DR-010-S', additionalPrice: 0 },
      { id: 102, size: 'M', colorName: 'Cloud Blush', colorHex: '#FCE4EC', stockQuantity: 3, sku: 'MB-DR-010-M', additionalPrice: 0 }
    ]
  },
  {
    id: 11,
    name: 'Colette Silk Halter Neck Maxi',
    slug: 'colette-silk-halter-neck-maxi',
    shortDescription: 'Minimalist high-neck halter maxi dress in pale mauve silk.',
    description: 'Clean modern lines merge with opulent 22-momme Mulberry silk. The high halter neckline fastens with delicate covered silk buttons behind the neck, tumbling into a dramatic low open back.',
    basePrice: 4899,
    salePrice: 4199,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-011',
    material: '22-Momme Mulberry Silk',
    careInstructions: 'Dry clean only.',
    badge: 'Trending',
    primaryImageUrl: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 4.8,
    reviewCount: 20,
    totalStock: 16,
    isInStock: true,
    images: [
      { id: 1101, imageUrl: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 111, size: 'XS', colorName: 'Mauve Silk', colorHex: '#D8BFD8', stockQuantity: 4, sku: 'MB-DR-011-XS', additionalPrice: 0 },
      { id: 112, size: 'S', colorName: 'Mauve Silk', colorHex: '#D8BFD8', stockQuantity: 7, sku: 'MB-DR-011-S', additionalPrice: 0 },
      { id: 113, size: 'M', colorName: 'Mauve Silk', colorHex: '#D8BFD8', stockQuantity: 5, sku: 'MB-DR-011-M', additionalPrice: 0 }
    ]
  },
  {
    id: 12,
    name: 'Marguerite Embroidered Organza Gown',
    slug: 'marguerite-embroidered-organza-gown',
    shortDescription: 'Delicate botanical threadwork on sheer ivory silk organza.',
    description: 'Each Marguerite gown represents over 40 hours of artisanal hand embroidery. Delicate ivory florets cascade down shimmering sheer organza over a champagne silk lining.',
    basePrice: 8499,
    salePrice: undefined,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-012',
    material: '100% Silk Organza',
    careInstructions: 'Professional dry clean.',
    badge: 'Artisanal',
    primaryImageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 17,
    totalStock: 9,
    isInStock: true,
    images: [
      { id: 1201, imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 121, size: 'S', colorName: 'Ivory Flora', colorHex: '#FFFFF0', stockQuantity: 5, sku: 'MB-DR-012-S', additionalPrice: 0 },
      { id: 122, size: 'M', colorName: 'Ivory Flora', colorHex: '#FFFFF0', stockQuantity: 4, sku: 'MB-DR-012-M', additionalPrice: 0 }
    ]
  },
  {
    id: 13,
    name: 'Juliette Cowl-Back Bias Slip Dress',
    slug: 'juliette-cowl-back-bias-slip-dress',
    shortDescription: 'Liquid champagne silk with dramatic plunging cowl back.',
    description: 'Cut on the true bias to skim and flatter feminine curves without clinging. A delicate plunging cowl backline makes a quiet yet unforgettable entrance.',
    basePrice: 4199,
    salePrice: 3499,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-013',
    material: 'Silk Charmeuse',
    careInstructions: 'Hand wash in cold water or dry clean.',
    badge: 'Sale ✨',
    primaryImageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 42,
    totalStock: 14,
    isInStock: true,
    images: [
      { id: 1301, imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 131, size: 'XS', colorName: 'Champagne Gold', colorHex: '#F7E7CE', stockQuantity: 4, sku: 'MB-DR-013-XS', additionalPrice: 0 },
      { id: 132, size: 'S', colorName: 'Champagne Gold', colorHex: '#F7E7CE', stockQuantity: 6, sku: 'MB-DR-013-S', additionalPrice: 0 },
      { id: 133, size: 'M', colorName: 'Champagne Gold', colorHex: '#F7E7CE', stockQuantity: 4, sku: 'MB-DR-013-M', additionalPrice: 0 }
    ]
  },
  {
    id: 14,
    name: 'Giselle Cascading Ruffle Midi Dress',
    slug: 'giselle-cascading-ruffle-midi-dress',
    shortDescription: 'Peachy blush georgette midi with flirty asymmetric ruffles.',
    description: 'A whimsical silhouette for high tea and cocktail celebrations. Features a wrap-style V-neckline and cascading diagonal ruffles along the hemline.',
    basePrice: 3699,
    salePrice: 2999,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-014',
    material: 'Georgette Silk Blend',
    careInstructions: 'Dry clean recommended.',
    badge: 'Popular',
    primaryImageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: false,
    averageRating: 4.7,
    reviewCount: 14,
    totalStock: 20,
    isInStock: true,
    images: [
      { id: 1401, imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 141, size: 'S', colorName: 'Soft Peach', colorHex: '#FFDAB9', stockQuantity: 8, sku: 'MB-DR-014-S', additionalPrice: 0 },
      { id: 142, size: 'M', colorName: 'Soft Peach', colorHex: '#FFDAB9', stockQuantity: 7, sku: 'MB-DR-014-M', additionalPrice: 0 },
      { id: 143, size: 'L', colorName: 'Soft Peach', colorHex: '#FFDAB9', stockQuantity: 5, sku: 'MB-DR-014-L', additionalPrice: 0 }
    ]
  },
  {
    id: 15,
    name: 'Rosalie Metallic Floral Jacquard Dress',
    slug: 'rosalie-metallic-floral-jacquard-dress',
    shortDescription: 'Structured rose gold woven jacquard cocktail dress.',
    description: 'Woven with subtle metallic filaments, the Rosalie dress catches golden hour light with breathtaking elegance. Features side in-seam pockets and a pleated bell skirt.',
    basePrice: 5299,
    salePrice: undefined,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-015',
    material: 'Metallic Floral Jacquard with Cupro Lining',
    careInstructions: 'Dry clean only.',
    badge: 'Limited Drop',
    primaryImageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 11,
    totalStock: 10,
    isInStock: true,
    images: [
      { id: 1501, imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 151, size: 'XS', colorName: 'Rose Gold', colorHex: '#B76E79', stockQuantity: 3, sku: 'MB-DR-015-XS', additionalPrice: 0 },
      { id: 152, size: 'S', colorName: 'Rose Gold', colorHex: '#B76E79', stockQuantity: 4, sku: 'MB-DR-015-S', additionalPrice: 0 },
      { id: 153, size: 'M', colorName: 'Rose Gold', colorHex: '#B76E79', stockQuantity: 3, sku: 'MB-DR-015-M', additionalPrice: 0 }
    ]
  },
  {
    id: 16,
    name: 'Seraphine Off-Shoulder Velvet Maxi',
    slug: 'seraphine-off-shoulder-velvet-maxi',
    shortDescription: 'Midnight plum stretch velvet with gathered sweetheart neckline.',
    description: 'Indulge in tactile luxury with the Seraphine gown. Premium plush velvet hugs the contours and gives full ease of movement, highlighted by an off-shoulder foldover neckline.',
    basePrice: 6499,
    salePrice: 5499,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-016',
    material: 'Silk Velvet with 5% Elastane',
    careInstructions: 'Professional dry clean.',
    badge: 'Sale ✨',
    primaryImageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: false,
    averageRating: 4.8,
    reviewCount: 18,
    totalStock: 12,
    isInStock: true,
    images: [
      { id: 1601, imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 161, size: 'S', colorName: 'Midnight Plum', colorHex: '#301934', stockQuantity: 5, sku: 'MB-DR-016-S', additionalPrice: 0 },
      { id: 162, size: 'M', colorName: 'Midnight Plum', colorHex: '#301934', stockQuantity: 4, sku: 'MB-DR-016-M', additionalPrice: 0 },
      { id: 163, size: 'L', colorName: 'Midnight Plum', colorHex: '#301934', stockQuantity: 3, sku: 'MB-DR-016-L', additionalPrice: 0 }
    ]
  },
  {
    id: 17,
    name: 'Hélène Plisse Accordion Cocktail Dress',
    slug: 'helene-plisse-accordion-cocktail-dress',
    shortDescription: 'Champagne plisse pleating with waist sash and flutter sleeves.',
    description: 'An effervescent silhouette designed for twilight champagne celebrations. Features accordion-pleated chiffon, graceful bell flutter sleeves, and a self-tying silk sash belt.',
    basePrice: 4799,
    salePrice: undefined,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-017',
    material: 'Plisse Chiffon with Satin Slip',
    careInstructions: 'Dry clean only.',
    badge: 'New',
    primaryImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: false,
    averageRating: 4.9,
    reviewCount: 16,
    totalStock: 14,
    isInStock: true,
    images: [
      { id: 1701, imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 171, size: 'S', colorName: 'Champagne Plisse', colorHex: '#F5DEB3', stockQuantity: 6, sku: 'MB-DR-017-S', additionalPrice: 0 },
      { id: 172, size: 'M', colorName: 'Champagne Plisse', colorHex: '#F5DEB3', stockQuantity: 5, sku: 'MB-DR-017-M', additionalPrice: 0 },
      { id: 173, size: 'L', colorName: 'Champagne Plisse', colorHex: '#F5DEB3', stockQuantity: 3, sku: 'MB-DR-017-L', additionalPrice: 0 }
    ]
  },
  {
    id: 18,
    name: 'Clémentine Open-Back Linen Sundress',
    slug: 'clementine-open-back-linen-sundress',
    shortDescription: 'Crisp organic flax linen sundress with cross-back tie bow.',
    description: 'Ideal for sun-drenched coastal escapes. Made from sustainable Normandy flax linen that softens with every wear, featuring an open back tied with a dramatic linen sash bow.',
    basePrice: 3499,
    salePrice: 2899,
    categoryId: 1,
    categoryName: 'Dresses',
    categorySlug: 'dresses',
    sku: 'MB-DR-018',
    material: '100% Certified Organic French Linen',
    careInstructions: 'Machine wash gentle cold, hang to dry.',
    badge: 'Organic',
    primaryImageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: false,
    averageRating: 4.8,
    reviewCount: 29,
    totalStock: 22,
    isInStock: true,
    images: [
      { id: 1801, imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 181, size: 'XS', colorName: 'Oatmeal Natural', colorHex: '#E0D6C3', stockQuantity: 6, sku: 'MB-DR-018-XS', additionalPrice: 0 },
      { id: 182, size: 'S', colorName: 'Oatmeal Natural', colorHex: '#E0D6C3', stockQuantity: 9, sku: 'MB-DR-018-S', additionalPrice: 0 },
      { id: 183, size: 'M', colorName: 'Oatmeal Natural', colorHex: '#E0D6C3', stockQuantity: 7, sku: 'MB-DR-018-M', additionalPrice: 0 }
    ]
  },

  // --- 2. TOPS & BLOUSE EDITS (6 Luxury Items) ---
  {
    id: 2,
    name: 'Celeste Embroidered Linen Blouse',
    slug: 'celeste-embroidered-linen-blouse',
    shortDescription: 'Breathable organic linen blouse with tonal floral embroidery.',
    description: 'The Celeste Blouse captures effortless bohemian sophistication with intricate tonal floral embroidery across the sleeves and neckline. Breathable organic linen keeps you fresh all day long.',
    basePrice: 2899,
    salePrice: 2399,
    categoryId: 2,
    categoryName: 'Tops',
    categorySlug: 'tops',
    sku: 'MB-TP-002',
    material: '100% Organic French Linen',
    careInstructions: 'Hand wash in cold water with gentle detergent.',
    badge: 'Bestseller',
    primaryImageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 28,
    totalStock: 25,
    isInStock: true,
    images: [
      { id: 201, imageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 21, size: 'XS', colorName: 'Pristine Ivory', colorHex: '#FFFDF9', stockQuantity: 6, sku: 'MB-TP-002-XS', additionalPrice: 0 },
      { id: 22, size: 'S', colorName: 'Pristine Ivory', colorHex: '#FFFDF9', stockQuantity: 10, sku: 'MB-TP-002-S', additionalPrice: 0 },
      { id: 23, size: 'M', colorName: 'Pristine Ivory', colorHex: '#FFFDF9', stockQuantity: 9, sku: 'MB-TP-002-M', additionalPrice: 0 }
    ]
  },
  {
    id: 19,
    name: 'Aurelia Scalloped Silk Camisole',
    slug: 'aurelia-scalloped-silk-camisole',
    shortDescription: '100% pure Mulberry silk camisole with scalloped lace hem.',
    description: 'An essential foundation for every capsule wardrobe. Cut from pure 19-momme silk charmeuse, finished with scalloped Chantilly lace detailing and adjustable gold sliders.',
    basePrice: 2299,
    salePrice: 1899,
    categoryId: 2,
    categoryName: 'Tops',
    categorySlug: 'tops',
    sku: 'MB-TP-019',
    material: '100% Mulberry Silk',
    careInstructions: 'Hand wash in cool water with silk wash.',
    badge: 'Essential',
    primaryImageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 35,
    totalStock: 30,
    isInStock: true,
    images: [
      { id: 1901, imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 191, size: 'XS', colorName: 'Champagne Blush', colorHex: '#F7E7CE', stockQuantity: 8, sku: 'MB-TP-019-XS', additionalPrice: 0 },
      { id: 192, size: 'S', colorName: 'Champagne Blush', colorHex: '#F7E7CE', stockQuantity: 12, sku: 'MB-TP-019-S', additionalPrice: 0 },
      { id: 193, size: 'M', colorName: 'Champagne Blush', colorHex: '#F7E7CE', stockQuantity: 10, sku: 'MB-TP-019-M', additionalPrice: 0 }
    ]
  },
  {
    id: 20,
    name: 'Blanche Structured Corset Blouse',
    slug: 'blanche-structured-corset-blouse',
    shortDescription: 'Tailored boned corset top in ivory cotton faille with sweetheart neck.',
    description: 'Sculptural elegance meets day-to-night versatility. Interior structure provides contouring without restriction, paired effortlessly with trousers or silk skirts.',
    basePrice: 3299,
    salePrice: undefined,
    categoryId: 2,
    categoryName: 'Tops',
    categorySlug: 'tops',
    sku: 'MB-TP-020',
    material: 'Cotton Faille with Satin Lining',
    careInstructions: 'Dry clean only.',
    badge: 'Trending',
    primaryImageUrl: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 4.8,
    reviewCount: 19,
    totalStock: 18,
    isInStock: true,
    images: [
      { id: 2001, imageUrl: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 201, size: 'S', colorName: 'Ivory Cream', colorHex: '#FFFFF0', stockQuantity: 8, sku: 'MB-TP-020-S', additionalPrice: 0 },
      { id: 202, size: 'M', colorName: 'Ivory Cream', colorHex: '#FFFFF0', stockQuantity: 6, sku: 'MB-TP-020-M', additionalPrice: 0 },
      { id: 203, size: 'L', colorName: 'Ivory Cream', colorHex: '#FFFFF0', stockQuantity: 4, sku: 'MB-TP-020-L', additionalPrice: 0 }
    ]
  },
  {
    id: 21,
    name: 'Florence Bishop Sleeve Chiffon Top',
    slug: 'florence-bishop-sleeve-chiffon-top',
    shortDescription: 'Dramatic sheer puff-sleeve top with covered button cuffs.',
    description: 'Airy romanticism in pure form. The Florence top features voluminous sheer bishop sleeves with elongated six-button cuffs and a soft pleated neck tie.',
    basePrice: 2999,
    salePrice: 2499,
    categoryId: 2,
    categoryName: 'Tops',
    categorySlug: 'tops',
    sku: 'MB-TP-021',
    material: 'Silk Georgette Chiffon',
    careInstructions: 'Dry clean or gentle hand wash.',
    badge: 'Sale ✨',
    primaryImageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: false,
    averageRating: 4.7,
    reviewCount: 14,
    totalStock: 15,
    isInStock: true,
    images: [
      { id: 2101, imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 211, size: 'S', colorName: 'Rose Smoke', colorHex: '#D4B2B2', stockQuantity: 6, sku: 'MB-TP-021-S', additionalPrice: 0 },
      { id: 212, size: 'M', colorName: 'Rose Smoke', colorHex: '#D4B2B2', stockQuantity: 5, sku: 'MB-TP-021-M', additionalPrice: 0 }
    ]
  },
  {
    id: 22,
    name: 'Delphine High-Collar Ruffled Poet Blouse',
    slug: 'delphine-high-collar-ruffled-poet-blouse',
    shortDescription: 'Victorian-inspired standing ruffle collar with mother-of-pearl buttons.',
    description: 'A tribute to classical Parisian atelier craftsmanship. Features pin-tucked front pleating, delicate neck frills, and iridescent Australian mother-of-pearl buttons.',
    basePrice: 3499,
    salePrice: undefined,
    categoryId: 2,
    categoryName: 'Tops',
    categorySlug: 'tops',
    sku: 'MB-TP-022',
    material: 'Egyptian Cotton Batiste',
    careInstructions: 'Gentle warm iron, machine wash delicate.',
    badge: 'Atelier',
    primaryImageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: false,
    averageRating: 5.0,
    reviewCount: 12,
    totalStock: 16,
    isInStock: true,
    images: [
      { id: 2201, imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 221, size: 'XS', colorName: 'Snow White', colorHex: '#FFFFFF', stockQuantity: 4, sku: 'MB-TP-022-XS', additionalPrice: 0 },
      { id: 222, size: 'S', colorName: 'Snow White', colorHex: '#FFFFFF', stockQuantity: 7, sku: 'MB-TP-022-S', additionalPrice: 0 },
      { id: 223, size: 'M', colorName: 'Snow White', colorHex: '#FFFFFF', stockQuantity: 5, sku: 'MB-TP-022-M', additionalPrice: 0 }
    ]
  },
  {
    id: 23,
    name: 'Madeleine Asymmetric Draped Satin Top',
    slug: 'madeleine-asymmetric-draped-satin-top',
    shortDescription: 'Single-shoulder cowl drape in antique rose liquid satin.',
    description: 'An asymmetrical masterpiece designed to turn heads. Liquid satin cascades from one shoulder across the torso into a soft side tuck, creating statuesque proportions.',
    basePrice: 3199,
    salePrice: 2699,
    categoryId: 2,
    categoryName: 'Tops',
    categorySlug: 'tops',
    sku: 'MB-TP-023',
    material: 'Heavyweight Silk-Rayon Satin',
    careInstructions: 'Dry clean only.',
    badge: 'Popular',
    primaryImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 4.8,
    reviewCount: 21,
    totalStock: 19,
    isInStock: true,
    images: [
      { id: 2301, imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 231, size: 'S', colorName: 'Antique Rose', colorHex: '#B76E79', stockQuantity: 9, sku: 'MB-TP-023-S', additionalPrice: 0 },
      { id: 232, size: 'M', colorName: 'Antique Rose', colorHex: '#B76E79', stockQuantity: 7, sku: 'MB-TP-023-M', additionalPrice: 0 },
      { id: 233, size: 'L', colorName: 'Antique Rose', colorHex: '#B76E79', stockQuantity: 3, sku: 'MB-TP-023-L', additionalPrice: 0 }
    ]
  },

  // --- 3. BOTTOMS (6 Tailored Items) ---
  {
    id: 3,
    name: 'Sienna High-Waisted Pleated Trouser',
    slug: 'sienna-high-waisted-pleated-trouser',
    shortDescription: 'Tailored wide-leg trousers in muted nude rose with deep front pleats.',
    description: 'Tailored to perfection, the Sienna Trouser offers a flattering high waist, deep front pleats, and wide-leg silhouette. Styled effortlessly with a fitted cami or relaxed linen blouse.',
    basePrice: 3499,
    salePrice: 2999,
    categoryId: 3,
    categoryName: 'Bottoms',
    categorySlug: 'bottoms',
    sku: 'MB-BT-003',
    material: 'Cotton-Viscose Luxe Crepe Blend',
    careInstructions: 'Dry clean or delicate cycle cold.',
    badge: 'Bestseller',
    primaryImageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: true,
    averageRating: 4.8,
    reviewCount: 33,
    totalStock: 22,
    isInStock: true,
    images: [
      { id: 301, imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 31, size: 'XS', colorName: 'Muted Rose', colorHex: '#D9A09A', stockQuantity: 5, sku: 'MB-BT-003-XS', additionalPrice: 0 },
      { id: 32, size: 'S', colorName: 'Muted Rose', colorHex: '#D9A09A', stockQuantity: 9, sku: 'MB-BT-003-S', additionalPrice: 0 },
      { id: 33, size: 'M', colorName: 'Muted Rose', colorHex: '#D9A09A', stockQuantity: 8, sku: 'MB-BT-003-M', additionalPrice: 0 }
    ]
  },
  {
    id: 24,
    name: 'Clara Tiered Silk Charmeuse Skirt',
    slug: 'clara-tiered-silk-charmeuse-skirt',
    shortDescription: 'Ballet pink silk maxi skirt with concealed elastic waistband.',
    description: 'Designed to flutter with each stride. Cut on the true bias from heavyweight 22-momme silk charmeuse, falling into an effortless A-line ankle length.',
    basePrice: 3999,
    salePrice: 3399,
    categoryId: 3,
    categoryName: 'Bottoms',
    categorySlug: 'bottoms',
    sku: 'MB-BT-024',
    material: '100% Silk Charmeuse',
    careInstructions: 'Specialist dry clean.',
    badge: 'Popular',
    primaryImageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 24,
    totalStock: 16,
    isInStock: true,
    images: [
      { id: 2401, imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 241, size: 'S', colorName: 'Ballet Pink', colorHex: '#FADADD', stockQuantity: 7, sku: 'MB-BT-024-S', additionalPrice: 0 },
      { id: 242, size: 'M', colorName: 'Ballet Pink', colorHex: '#FADADD', stockQuantity: 6, sku: 'MB-BT-024-M', additionalPrice: 0 },
      { id: 243, size: 'L', colorName: 'Ballet Pink', colorHex: '#FADADD', stockQuantity: 3, sku: 'MB-BT-024-L', additionalPrice: 0 }
    ]
  },
  {
    id: 25,
    name: 'Vivienne Tailored Cigarette Pant',
    slug: 'vivienne-tailored-cigarette-pant',
    shortDescription: 'Crisp ankle-length cigarette pants in ivory structured crepe.',
    description: 'The epitome of refined tailoring. Crisp front pressed creases, discreet side-zip closure, and a slim ankle silhouette that frames heels and mules flawlessly.',
    basePrice: 3699,
    salePrice: undefined,
    categoryId: 3,
    categoryName: 'Bottoms',
    categorySlug: 'bottoms',
    sku: 'MB-BT-025',
    material: 'Italian Stretch Crepe (92% Wool, 8% Lycra)',
    careInstructions: 'Dry clean only.',
    badge: 'Tailored',
    primaryImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: false,
    averageRating: 4.8,
    reviewCount: 17,
    totalStock: 14,
    isInStock: true,
    images: [
      { id: 2501, imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 251, size: 'XS', colorName: 'Alabaster Ivory', colorHex: '#FDFBF7', stockQuantity: 4, sku: 'MB-BT-025-XS', additionalPrice: 0 },
      { id: 252, size: 'S', colorName: 'Alabaster Ivory', colorHex: '#FDFBF7', stockQuantity: 6, sku: 'MB-BT-025-S', additionalPrice: 0 },
      { id: 253, size: 'M', colorName: 'Alabaster Ivory', colorHex: '#FDFBF7', stockQuantity: 4, sku: 'MB-BT-025-M', additionalPrice: 0 }
    ]
  },
  {
    id: 26,
    name: 'Penelope Pleated Palazzo Trousers',
    slug: 'penelope-pleated-palazzo-trousers',
    shortDescription: 'Flowing dramatic wide-leg palazzo pant with tie-sash belt.',
    description: 'Impossibly breezy and majestic. Double knife pleats at the waist open into voluminous palazzo legs that mimic the flow of a maxi skirt while offering trouser comfort.',
    basePrice: 3899,
    salePrice: 3199,
    categoryId: 3,
    categoryName: 'Bottoms',
    categorySlug: 'bottoms',
    sku: 'MB-BT-026',
    material: 'Silky Modal Crepe',
    careInstructions: 'Gentle cold wash, steam iron.',
    badge: 'Sale ✨',
    primaryImageUrl: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 19,
    totalStock: 20,
    isInStock: true,
    images: [
      { id: 2601, imageUrl: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 261, size: 'S', colorName: 'Champagne Taupe', colorHex: '#D8C2B0', stockQuantity: 8, sku: 'MB-BT-026-S', additionalPrice: 0 },
      { id: 262, size: 'M', colorName: 'Champagne Taupe', colorHex: '#D8C2B0', stockQuantity: 7, sku: 'MB-BT-026-M', additionalPrice: 0 },
      { id: 263, size: 'L', colorName: 'Champagne Taupe', colorHex: '#D8C2B0', stockQuantity: 5, sku: 'MB-BT-026-L', additionalPrice: 0 }
    ]
  },
  {
    id: 27,
    name: 'Beatrice Embroidered Maxi Skirt',
    slug: 'beatrice-embroidered-maxi-skirt',
    shortDescription: 'Linen-blend maxi skirt with scalloped embroidered eyelet hem.',
    description: 'Features subtle broderie anglaise floral eyelets along the lower tier and a structured high waist with horn buttons down the center front.',
    basePrice: 3599,
    salePrice: undefined,
    categoryId: 3,
    categoryName: 'Bottoms',
    categorySlug: 'bottoms',
    sku: 'MB-BT-027',
    material: '70% French Linen, 30% Cotton',
    careInstructions: 'Machine wash delicate, hang dry in shade.',
    badge: 'Organic',
    primaryImageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: false,
    averageRating: 4.7,
    reviewCount: 15,
    totalStock: 18,
    isInStock: true,
    images: [
      { id: 2701, imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 271, size: 'S', colorName: 'Natural Flax', colorHex: '#EDE6D6', stockQuantity: 8, sku: 'MB-BT-027-S', additionalPrice: 0 },
      { id: 272, size: 'M', colorName: 'Natural Flax', colorHex: '#EDE6D6', stockQuantity: 6, sku: 'MB-BT-027-M', additionalPrice: 0 },
      { id: 273, size: 'L', colorName: 'Natural Flax', colorHex: '#EDE6D6', stockQuantity: 4, sku: 'MB-BT-027-L', additionalPrice: 0 }
    ]
  },
  {
    id: 28,
    name: 'Eleanor Satin Bias Slip Skirt',
    slug: 'eleanor-satin-bias-slip-skirt',
    shortDescription: 'Heavyweight silk satin midi skirt in shimmering champagne.',
    description: 'A cult-favorite wardrobe foundation. Weighty silk satin cut on the bias creates a smooth, liquid contour that transitions seamlessly from daylight meetings to evening cocktails.',
    basePrice: 3299,
    salePrice: 2799,
    categoryId: 3,
    categoryName: 'Bottoms',
    categorySlug: 'bottoms',
    sku: 'MB-BT-028',
    material: 'Liquid Silk Satin',
    careInstructions: 'Dry clean or cool hand wash.',
    badge: 'Popular',
    primaryImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 37,
    totalStock: 25,
    isInStock: true,
    images: [
      { id: 2801, imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 281, size: 'XS', colorName: 'Champagne Silk', colorHex: '#F7E7CE', stockQuantity: 6, sku: 'MB-BT-028-XS', additionalPrice: 0 },
      { id: 282, size: 'S', colorName: 'Champagne Silk', colorHex: '#F7E7CE', stockQuantity: 11, sku: 'MB-BT-028-S', additionalPrice: 0 },
      { id: 283, size: 'M', colorName: 'Champagne Silk', colorHex: '#F7E7CE', stockQuantity: 8, sku: 'MB-BT-028-M', additionalPrice: 0 }
    ]
  },

  // --- 4. ACCESSORIES & FINE JEWELRY (8 Luxury Items) ---
  {
    id: 4,
    name: 'Flora Freshwater Pearl Drop Earrings',
    slug: 'flora-freshwater-pearl-drop-earrings',
    shortDescription: 'Baroque freshwater pearls suspended from 18k gold vermeil botanical studs.',
    description: 'Each baroque pearl is hand-selected for its organic iridescence and luminous luster. Set on nickel-free, hypoallergenic 18k gold vermeil floral studs with secure butterfly backs.',
    basePrice: 1899,
    salePrice: 1599,
    categoryId: 4,
    categoryName: 'Accessories',
    categorySlug: 'accessories',
    sku: 'MB-AC-004',
    material: 'Natural Baroque Pearls, 18k Gold Vermeil on 925 Sterling Silver',
    careInstructions: 'Avoid direct contact with perfume and sprays. Store in suede pouch.',
    badge: 'Handcrafted',
    primaryImageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 45,
    totalStock: 35,
    isInStock: true,
    images: [
      { id: 401, imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 41, size: 'One Size', colorName: 'Gold / Pearl', colorHex: '#F8F6F0', stockQuantity: 35, sku: 'MB-AC-004-OS', additionalPrice: 0 }
    ]
  },
  {
    id: 6,
    name: 'Gilded Rose Woven Leather Clutch',
    slug: 'gilded-rose-woven-leather-clutch',
    shortDescription: 'Hand-woven Italian blush nappa leather with polished gold frame clasp.',
    description: 'Handcrafted by Florentine artisans from buttery Italian nappa lambskin. The soft cloud silhouette features an artisanal intrecciato weave, magnetic frame closure, and detachable snake chain.',
    basePrice: 4999,
    salePrice: 4299,
    categoryId: 4,
    categoryName: 'Accessories',
    categorySlug: 'accessories',
    sku: 'MB-AC-006',
    material: '100% Italian Nappa Lambskin with Grosgrain Lining',
    careInstructions: 'Protect from heavy rain and direct heat. Clean with leather balm.',
    badge: 'Artisanal',
    primaryImageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 29,
    totalStock: 18,
    isInStock: true,
    images: [
      { id: 601, imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 61, size: 'One Size', colorName: 'Blush Nappa', colorHex: '#F4C2C2', stockQuantity: 18, sku: 'MB-AC-006-OS', additionalPrice: 0 }
    ]
  },
  {
    id: 29,
    name: 'Palais Hand-Rolled Silk Twill Scarf',
    slug: 'palais-hand-rolled-silk-twill-scarf',
    shortDescription: '90cm pure Mulberry silk twill scarf with hand-rolled French hems.',
    description: 'An heirloom keepsake featuring bespoke atelier botanical watercolor prints. Hand-screened onto weighty 16-momme silk twill and finished with hand-rolled French hems.',
    basePrice: 2499,
    salePrice: 1999,
    categoryId: 4,
    categoryName: 'Accessories',
    categorySlug: 'accessories',
    sku: 'MB-AC-029',
    material: '100% Pure Silk Twill',
    careInstructions: 'Dry clean only. Store flat.',
    badge: 'Bestseller',
    primaryImageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 31,
    totalStock: 25,
    isInStock: true,
    images: [
      { id: 2901, imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 291, size: '90x90 cm', colorName: 'Rose Floral', colorHex: '#E8A598', stockQuantity: 25, sku: 'MB-AC-029-OS', additionalPrice: 0 }
    ]
  },
  {
    id: 30,
    name: 'Aurelie Crystal Floral Bridal Hair Comb',
    slug: 'aurelie-crystal-floral-bridal-hair-comb',
    shortDescription: 'Hand-wired freshwater pearls and Austrian crystals on 18k gold comb.',
    description: 'Handcrafted floral sprigs set with lustrous rice pearls, marquise Austrian crystals, and hand-enameled champagne blossoms. Flexible wire allows custom contouring to bridal hairstyles.',
    basePrice: 2199,
    salePrice: undefined,
    categoryId: 4,
    categoryName: 'Accessories',
    categorySlug: 'accessories',
    sku: 'MB-AC-030',
    material: 'Austrian Crystals, Rice Pearls, 18k Gold Plated Brass',
    careInstructions: 'Wipe with soft jewelers cloth.',
    badge: 'Bridal',
    primaryImageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: false,
    averageRating: 5.0,
    reviewCount: 18,
    totalStock: 20,
    isInStock: true,
    images: [
      { id: 3001, imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 301, size: 'One Size', colorName: 'Gold / Pearl', colorHex: '#FDFBF7', stockQuantity: 20, sku: 'MB-AC-030-OS', additionalPrice: 0 }
    ]
  },
  {
    id: 31,
    name: 'Vivienne Hammered Medallion Pendant',
    slug: 'vivienne-hammered-medallion-pendant',
    shortDescription: '18k gold vermeil coin pendant with cabochon rose quartz center.',
    description: 'Inspired by ancient Mediterranean amulets. A hand-hammered 18k gold vermeil medallion cradles a faceted natural rose quartz stone, suspended on a 50cm paperclip chain with 5cm extender.',
    basePrice: 2799,
    salePrice: 2299,
    categoryId: 4,
    categoryName: 'Accessories',
    categorySlug: 'accessories',
    sku: 'MB-AC-031',
    material: '18k Gold Vermeil (3 Microns on 925 Silver), Natural Rose Quartz',
    careInstructions: 'Keep dry. Store in tarnish-resistant pouch.',
    badge: 'Fine Jewelry',
    primaryImageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 22,
    totalStock: 16,
    isInStock: true,
    images: [
      { id: 3101, imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 311, size: '50cm Chain', colorName: 'Rose Quartz / Gold', colorHex: '#FFC0CB', stockQuantity: 16, sku: 'MB-AC-031-OS', additionalPrice: 0 }
    ]
  },
  {
    id: 32,
    name: 'Maison Signature Sculpted Leather Belt',
    slug: 'maison-signature-sculpted-leather-belt',
    shortDescription: 'Italian vachetta leather waist belt with sculpted organic gold buckle.',
    description: 'The defining accessory to cinch flowing maxi dresses and tailored trousers. Hand-burnished Italian calf leather finished with a hand-cast sculpted buckle inspired by organic river stones.',
    basePrice: 2299,
    salePrice: 1899,
    categoryId: 4,
    categoryName: 'Accessories',
    categorySlug: 'accessories',
    sku: 'MB-AC-032',
    material: 'Full-Grain Italian Vachetta Leather, Solid Cast Brass',
    careInstructions: 'Wipe with damp cloth and condition periodically.',
    badge: 'Essential',
    primaryImageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: false,
    averageRating: 4.8,
    reviewCount: 15,
    totalStock: 24,
    isInStock: true,
    images: [
      { id: 3201, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 321, size: 'S (70-80cm)', colorName: 'Cognac Tan', colorHex: '#9E5B32', stockQuantity: 8, sku: 'MB-AC-032-S', additionalPrice: 0 },
      { id: 322, size: 'M (80-90cm)', colorName: 'Cognac Tan', colorHex: '#9E5B32', stockQuantity: 10, sku: 'MB-AC-032-M', additionalPrice: 0 },
      { id: 323, size: 'L (90-100cm)', colorName: 'Cognac Tan', colorHex: '#9E5B32', stockQuantity: 6, sku: 'MB-AC-032-L', additionalPrice: 0 }
    ]
  },
  {
    id: 33,
    name: 'Elysian Freshwater Pearl Choker',
    slug: 'elysian-freshwater-pearl-choker',
    shortDescription: 'Graduated potato freshwater pearls with magnetic 18k rose gold clasp.',
    description: 'Modern classicism redefined. Graduated near-round freshwater pearls hand-knotted on pure silk thread, secured with an innovative concealed magnetic rosette clasp.',
    basePrice: 3299,
    salePrice: 2799,
    categoryId: 4,
    categoryName: 'Accessories',
    categorySlug: 'accessories',
    sku: 'MB-AC-033',
    material: 'Natural AAA Freshwater Pearls on Silk Thread',
    careInstructions: 'Restring every 2 years. Keep away from water and cosmetics.',
    badge: 'Sale ✨',
    primaryImageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 27,
    totalStock: 14,
    isInStock: true,
    images: [
      { id: 3301, imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 331, size: '40cm Choker', colorName: 'White Pearl / Rose Clasp', colorHex: '#FAF0E6', stockQuantity: 14, sku: 'MB-AC-033-OS', additionalPrice: 0 }
    ]
  },
  {
    id: 34,
    name: 'Petite Rose Quilted Lambskin Crossbody',
    slug: 'petite-rose-quilted-lambskin-crossbody',
    shortDescription: 'Ultra-soft diamond quilted lambskin bag with interwoven gold chain strap.',
    description: 'The companion to every evening outing. Crafted from cloud-soft French lambskin with custom diamond padding, turn-lock closure, and dual interior card slots.',
    basePrice: 5999,
    salePrice: 4999,
    categoryId: 4,
    categoryName: 'Accessories',
    categorySlug: 'accessories',
    sku: 'MB-AC-034',
    material: '100% French Lambskin, Gold-Tone Alloy Chain',
    careInstructions: 'Store in dust bag with tissue paper stuffing.',
    badge: 'Popular',
    primaryImageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: false,
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 39,
    totalStock: 12,
    isInStock: true,
    images: [
      { id: 3401, imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80', isPrimary: true, displayOrder: 1 }
    ],
    variants: [
      { id: 341, size: 'One Size (19x13cm)', colorName: 'Rose Petal', colorHex: '#F7C8C8', stockQuantity: 12, sku: 'MB-AC-034-OS', additionalPrice: 0 }
    ]
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 1,
    title: 'Elegance in Every Thread',
    subtitle: "THE SPRING / SUMMER '26 COLLECTION",
    description: 'Embrace soft pastels, effortless silhouettes, and ethereal fabrics handcrafted for the modern woman.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'Explore Collection',
    targetUrl: '/shop',
    slideOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'Romantic Silk & Satin',
    subtitle: 'FEATURED DRESSES & GOWNS',
    description: 'From sunset cocktail parties to serene garden soirées, discover your signature look.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'Shop Dresses',
    targetUrl: '/shop?category=dresses',
    slideOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    title: 'Timeless Accessories',
    subtitle: 'THE FINISHING TOUCH',
    description: 'Handpicked gold jewelry, woven leather clutches, and silk scarves designed to elevate any ensemble.',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'Discover Accessories',
    targetUrl: '/shop?category=accessories',
    slideOrder: 3,
    isActive: true,
  },
];

export const INITIAL_ANNOUNCEMENTS: AnnouncementBar[] = [
  { id: 1, message: '✨ Complimentary Express Shipping Across India on Orders Over ₹2,999', linkUrl: '#collection', displayOrder: 1, isActive: true },
  { id: 2, message: '🌸 New Haute Couture Spring Drop: 30+ Handcrafted Silks & Gowns', linkUrl: '#collection', displayOrder: 2, isActive: true },
  { id: 3, message: '🛍️ Use Code ATELIER10 at Checkout for 10% Off Your First Order', linkUrl: '#collection', displayOrder: 3, isActive: true },
  { id: 4, message: '💎 Verified 100% Pure Mulberry Silk & Certified Organic French Linen', linkUrl: '#about', displayOrder: 4, isActive: true }
];

export const INITIAL_BENEFITS: StoreBenefit[] = [
  { id: 1, title: 'Complimentary Express Dispatch', iconName: 'Truck', description: 'Delivered in signature archival keepsake packaging within 2-4 business days.', displayOrder: 1, isActive: true },
  { id: 2, title: 'Female Owned & Designed', iconName: 'Heart', description: 'Every silhouette is thoughtfully conceived and cut by female atelier artisans.', displayOrder: 2, isActive: true },
  { id: 3, title: 'Artisanal Haute Couture', iconName: 'Sparkles', description: 'Small-batch luxury craftsmanship made with French linen and Mulberry silk.', displayOrder: 3, isActive: true },
  { id: 4, title: '14-Day Boutique Exchange', iconName: 'RotateCcw', description: 'Complimentary door-step return pick-ups and instant atelier store credits.', displayOrder: 4, isActive: true }
];
