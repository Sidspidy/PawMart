/**
 * PawMart Full Data Seeder
 * Seeds: Super Admin, Categories, Products, Coupons, Spin Wheel Config
 *
 * Run order: Super Admin → Categories → Products (need category IDs) → Coupons → SpinConfig
 */

import mongoose from 'mongoose';
import { User, UserRole, AuthProvider } from '../models/User.model';
import { Category } from '../models/Category.model';
import { Product, PetCategory } from '../models/Product.model';
import { Coupon, CouponType, CouponScope } from '../models/Coupon.model';

// ── 1. Super Admin ─────────────────────────────────────────────────────────────
export const seedSuperAdmin = async (): Promise<void> => {
  try {
    const superAdminEmail = 'sidhart1010@gmail.com';
    const existing = await User.findOne({ email: superAdminEmail });

    if (!existing) {
      await User.create({
        email: superAdminEmail,
        name: 'Sidharth Super Admin',
        role: UserRole.SUPER_ADMIN,
        provider: AuthProvider.EMAIL,
        isEmailVerified: true,
        isActive: true,
        permissions: {
          products: true,
          orders: true,
          spinWheel: true,
          staffLogs: true,
        },
      });
      console.log(`\n🌱  [Seed] ✅ Created Super Admin: ${superAdminEmail}`);
    } else {
      existing.role = UserRole.SUPER_ADMIN;
      existing.isActive = true;
      existing.permissions = {
        products: true,
        orders: true,
        spinWheel: true,
        staffLogs: true,
      };
      await existing.save();
      console.log(`\n🌱  [Seed] ✔️  Verified Super Admin: ${superAdminEmail}`);
    }
  } catch (error) {
    console.error('❌  [Seed] Failed to seed Super Admin:', error);
  }
};

// ── 2. Categories ──────────────────────────────────────────────────────────────
const categoryData = [
  {
    name: 'Dog Food',
    slug: 'dog-food',
    petCategory: PetCategory.DOGS,
    description: 'Premium nutrition and meals for dogs of all breeds.',
    sortOrder: 1,
    isActive: true,
    metaTitle: 'Dog Food | PawMart',
    metaDescription: 'Shop the best dog food — dry, wet, grain-free & more.',
  },
  {
    name: 'Dog Toys',
    slug: 'dog-toys',
    petCategory: PetCategory.DOGS,
    description: 'Interactive toys and chew items to keep your dog engaged.',
    sortOrder: 2,
    isActive: true,
    metaTitle: 'Dog Toys | PawMart',
    metaDescription: 'Explore durable chew toys, fetch balls, and puzzle feeders for dogs.',
  },
  {
    name: 'Cat Food',
    slug: 'cat-food',
    petCategory: PetCategory.CATS,
    description: 'Balanced and delicious meals crafted for cats.',
    sortOrder: 3,
    isActive: true,
    metaTitle: 'Cat Food | PawMart',
    metaDescription: 'Shop dry, wet, and raw cat food for your feline companion.',
  },
  {
    name: 'Cat Accessories',
    slug: 'cat-accessories',
    petCategory: PetCategory.CATS,
    description: 'Collars, litter boxes, and grooming essentials for cats.',
    sortOrder: 4,
    isActive: true,
    metaTitle: 'Cat Accessories | PawMart',
    metaDescription: 'Everything your cat needs — litter, beds, and scratching posts.',
  },
  {
    name: 'Fish Supplies',
    slug: 'fish-supplies',
    petCategory: PetCategory.FISH,
    description: 'Aquarium decor, fish food, and tank care products.',
    sortOrder: 5,
    isActive: true,
    metaTitle: 'Fish Supplies | PawMart',
    metaDescription: 'Aquarium essentials including filters, fish food, and decorations.',
  },
  {
    name: 'Bird Supplies',
    slug: 'bird-supplies',
    petCategory: PetCategory.BIRDS,
    description: 'Cages, seed mixes, and perches for pet birds.',
    sortOrder: 6,
    isActive: true,
    metaTitle: 'Bird Supplies | PawMart',
    metaDescription: 'Bird cages, seed mixes, and accessories for parrots and finches.',
  },
  {
    name: 'Small Pet Supplies',
    slug: 'small-pet-supplies',
    petCategory: PetCategory.SMALL_PETS,
    description: 'Everything for hamsters, rabbits, guinea pigs, and more.',
    sortOrder: 7,
    isActive: true,
    metaTitle: 'Small Pet Supplies | PawMart',
    metaDescription: 'Cages, bedding, and food for hamsters, rabbits, and guinea pigs.',
  },
];

// ── 3. Products (created after categories so we have real ObjectIds) ────────────
const buildProducts = (categoryMap: Record<string, mongoose.Types.ObjectId>) => [
  {
    name: 'Royal Canin Adult Dog Food 3kg',
    slug: 'royal-canin-adult-dog-food-3kg',
    description:
      'Complete and balanced nutrition for adult dogs. Rich in proteins and essential minerals for optimal health and vitality. Supports digestive health and maintains a healthy weight.',
    shortDescription: 'Premium adult dog kibble — 3kg pack with balanced nutrition.',
    category: categoryMap['dog-food'],
    petCategory: PetCategory.DOGS,
    brand: 'Royal Canin',
    tags: ['dog food', 'premium', 'adult', 'dry food'],
    basePrice: 1299,
    comparePrice: 1599,
    sku: 'RC-DOG-ADULT-3KG',
    stock: 120,
    lowStockThreshold: 10,
    weight: 3000,
    isFeatured: true,
    isActive: true,
    isBestseller: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=400',
        publicId: 'rc-dog-food-1',
        alt: 'Royal Canin Adult Dog Food',
        isPrimary: true,
      },
    ],
    metaTitle: 'Royal Canin Adult Dog Food 3kg | PawMart',
    metaDescription: 'Buy Royal Canin Adult Dog Food 3kg at the best price. Complete nutrition for your dog.',
  },
  {
    name: 'Kong Classic Chew Toy – Large',
    slug: 'kong-classic-chew-toy-large',
    description:
      'The KONG Classic is made from durable natural red rubber. Stuffable with treats to keep your dog entertained for hours. Unpredictable bounce makes playtime exciting.',
    shortDescription: 'Durable red rubber chew toy — stuff with treats for endless fun.',
    category: categoryMap['dog-toys'],
    petCategory: PetCategory.DOGS,
    brand: 'Kong',
    tags: ['dog toy', 'chew toy', 'rubber', 'interactive'],
    basePrice: 699,
    comparePrice: 899,
    sku: 'KONG-CLS-LG-001',
    stock: 75,
    lowStockThreshold: 8,
    weight: 280,
    isFeatured: true,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&q=80&w=400',
        publicId: 'kong-toy-1',
        alt: 'Kong Classic Chew Toy',
        isPrimary: true,
      },
    ],
    metaTitle: 'Kong Classic Chew Toy Large | PawMart',
    metaDescription: 'Buy the Kong Classic chew toy for large dogs. Durable rubber, stuffable with treats.',
  },
  {
    name: 'Whiskas Tuna Adult Cat Food 1.2kg',
    slug: 'whiskas-tuna-adult-cat-food-1-2kg',
    description:
      'Whiskas Ocean Fish dry food provides complete nutrition for adult cats. Rich in protein with a crunchy texture that cats love. Supports healthy teeth and gums.',
    shortDescription: 'Tuna-flavoured dry cat food with complete nutrition.',
    category: categoryMap['cat-food'],
    petCategory: PetCategory.CATS,
    brand: 'Whiskas',
    tags: ['cat food', 'tuna', 'adult', 'dry food'],
    basePrice: 449,
    comparePrice: 549,
    sku: 'WHISK-TUNA-1.2KG',
    stock: 200,
    lowStockThreshold: 20,
    weight: 1200,
    isFeatured: false,
    isActive: true,
    isBestseller: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
        publicId: 'whiskas-cat-1',
        alt: 'Whiskas Adult Cat Food',
        isPrimary: true,
      },
    ],
    metaTitle: 'Whiskas Tuna Adult Cat Food 1.2kg | PawMart',
    metaDescription: 'Whiskas tuna flavour adult cat food. Complete nutrition, great taste cats love.',
  },
  {
    name: 'Catit Scratching Post with Catnip',
    slug: 'catit-scratching-post-with-catnip',
    description:
      'Natural sisal scratching post with a cozy perch on top. Infused with catnip to attract your cat. Sturdy base prevents tipping during rough play.',
    shortDescription: 'Sisal scratching post with catnip and cozy perch for cats.',
    category: categoryMap['cat-accessories'],
    petCategory: PetCategory.CATS,
    brand: 'Catit',
    tags: ['cat accessories', 'scratching post', 'catnip', 'furniture'],
    basePrice: 899,
    comparePrice: 1099,
    sku: 'CATIT-SCRATCH-001',
    stock: 45,
    lowStockThreshold: 5,
    weight: 1500,
    isFeatured: false,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
        publicId: 'catit-scratch-1',
        alt: 'Catit Scratching Post',
        isPrimary: true,
      },
    ],
    metaTitle: 'Catit Scratching Post | PawMart',
    metaDescription: 'Catit sisal scratching post with catnip. Natural fibers, sturdy base for cats.',
  },
  {
    name: 'Tetra Fish Flakes 200ml',
    slug: 'tetra-fish-flakes-200ml',
    description:
      'Tetra Min Tropical Flakes provide balanced nutrition for all tropical fish. High-quality proteins, vitamins, and minerals promote vibrant colours and healthy growth.',
    shortDescription: 'Premium tropical fish flakes for vibrant colors and growth.',
    category: categoryMap['fish-supplies'],
    petCategory: PetCategory.FISH,
    brand: 'Tetra',
    tags: ['fish food', 'tropical', 'flakes', 'aquarium'],
    basePrice: 299,
    comparePrice: 349,
    sku: 'TETRA-FLAKE-200ML',
    stock: 300,
    lowStockThreshold: 30,
    weight: 45,
    isFeatured: false,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1635614822578-2a93cbf8e98a?auto=format&fit=crop&q=80&w=400',
        publicId: 'tetra-flakes-1',
        alt: 'Tetra Fish Flakes',
        isPrimary: true,
      },
    ],
    metaTitle: 'Tetra Fish Flakes 200ml | PawMart',
    metaDescription: 'Buy Tetra tropical fish flakes for healthy vibrant aquarium fish.',
  },
  {
    name: 'Versele-Laga Prestige Parrot Mix 1kg',
    slug: 'versele-laga-prestige-parrot-mix-1kg',
    description:
      'Premium seed mix for large parrots. Contains sunflower seeds, peanuts, dried fruits, and pellets. Ensures a varied and balanced diet for your feathered friend.',
    shortDescription: 'Premium parrot seed mix with fruits and pellets — 1kg.',
    category: categoryMap['bird-supplies'],
    petCategory: PetCategory.BIRDS,
    brand: 'Versele-Laga',
    tags: ['bird food', 'parrot', 'seed mix', 'premium'],
    basePrice: 599,
    comparePrice: 749,
    sku: 'VL-PARROT-MIX-1KG',
    stock: 80,
    lowStockThreshold: 8,
    weight: 1000,
    isFeatured: false,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&q=80&w=400',
        publicId: 'parrot-mix-1',
        alt: 'Versele-Laga Parrot Mix',
        isPrimary: true,
      },
    ],
    metaTitle: 'Versele-Laga Parrot Seed Mix 1kg | PawMart',
    metaDescription: 'Premium parrot seed and fruit mix for large parrots. Balanced nutrition.',
  },
  {
    name: 'Savic Hamster Heaven Nordic Cage',
    slug: 'savic-hamster-heaven-nordic-cage',
    description:
      'Spacious Nordic-style cage for hamsters with multiple levels, tunnels, and a sand bath area. Deep base prevents litter scatter. Includes exercise wheel and food bowl.',
    shortDescription: 'Spacious multi-level hamster cage with exercise wheel & sand bath.',
    category: categoryMap['small-pet-supplies'],
    petCategory: PetCategory.SMALL_PETS,
    brand: 'Savic',
    tags: ['hamster cage', 'small pet', 'nordic', 'exercise wheel'],
    basePrice: 3499,
    comparePrice: 4199,
    sku: 'SAVIC-HAM-NORDIC',
    stock: 25,
    lowStockThreshold: 3,
    weight: 4500,
    isFeatured: true,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&q=80&w=400',
        publicId: 'hamster-cage-1',
        alt: 'Savic Hamster Heaven Cage',
        isPrimary: true,
      },
    ],
    metaTitle: 'Savic Hamster Heaven Nordic Cage | PawMart',
    metaDescription: 'Large multi-level hamster cage with wheel, tunnels, and sand bath. Free delivery.',
  },
  {
    name: 'PawMart Grooming Kit (5-in-1)',
    slug: 'pawmart-grooming-kit-5-in-1',
    description:
      'Complete grooming set including slicker brush, nail clippers, dematting comb, ear cleaner drops, and a pet toothbrush. Works for both dogs and cats.',
    shortDescription: '5-piece grooming set for dogs & cats — brush, clippers, comb & more.',
    category: categoryMap['dog-toys'],
    petCategory: PetCategory.DOGS,
    brand: 'PawMart',
    tags: ['grooming', 'brush', 'nail clipper', 'pet care', 'dogs', 'cats'],
    basePrice: 799,
    comparePrice: 999,
    sku: 'PM-GROOM-KIT-5IN1',
    stock: 60,
    lowStockThreshold: 6,
    weight: 450,
    isFeatured: false,
    isActive: true,
    isBestseller: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=400',
        publicId: 'grooming-kit-1',
        alt: 'PawMart Grooming Kit',
        isPrimary: true,
      },
    ],
    metaTitle: 'PawMart 5-in-1 Grooming Kit | PawMart',
    metaDescription: 'All-in-one grooming kit for dogs and cats. Includes brush, nail clipper, comb, ear cleaner.',
  },
];

// ── 4. Coupons ─────────────────────────────────────────────────────────────────
const buildCoupons = (adminId: mongoose.Types.ObjectId) => [
  {
    code: 'WELCOME20',
    description: 'Welcome discount for new customers',
    type: CouponType.PERCENTAGE,
    scope: CouponScope.GLOBAL,
    value: 20,
    minOrderValue: 499,
    maxDiscount: 300,
    usageLimit: 0,
    usagePerUser: 1,
    usedCount: 0,
    isActive: true,
    startsAt: new Date(),
    expiresAt: new Date(Date.now() + 365 * 86400000),
    createdBy: adminId,
  },
  {
    code: 'PAWSUMMER',
    description: 'Summer special — flat ₹150 off',
    type: CouponType.FLAT,
    scope: CouponScope.GLOBAL,
    value: 150,
    minOrderValue: 799,
    usageLimit: 500,
    usagePerUser: 2,
    usedCount: 0,
    isActive: true,
    startsAt: new Date(),
    expiresAt: new Date(Date.now() + 90 * 86400000),
    createdBy: adminId,
  },
  {
    code: 'FREESHIP99',
    description: 'Free shipping on orders above ₹299',
    type: CouponType.FREE_SHIPPING,
    scope: CouponScope.GLOBAL,
    value: 0,
    minOrderValue: 299,
    usageLimit: 0,
    usagePerUser: 3,
    usedCount: 0,
    isActive: true,
    startsAt: new Date(),
    expiresAt: new Date(Date.now() + 180 * 86400000),
    createdBy: adminId,
  },
  {
    code: 'SPINWIN10',
    description: 'Spin wheel reward coupon — 10% off',
    type: CouponType.PERCENTAGE,
    scope: CouponScope.GLOBAL,
    value: 10,
    minOrderValue: 199,
    maxDiscount: 200,
    usageLimit: 0,
    usagePerUser: 1,
    usedCount: 0,
    isActive: true,
    startsAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 86400000),
    createdBy: adminId,
  },
];

// ── Main export ────────────────────────────────────────────────────────────────
export const seedAll = async (): Promise<void> => {
  console.log('\n🌱  [Seed] Starting PawMart full data seed...');

  // Seed super admin first
  await seedSuperAdmin();

  // ── Categories ──────────────────────────────────────────────────────────────
  const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
  for (const catData of categoryData) {
    const existing = await Category.findOne({ slug: catData.slug });
    if (!existing) {
      const cat = await Category.create(catData);
      categoryMap[catData.slug] = cat._id as mongoose.Types.ObjectId;
      console.log(`🌱  [Seed] ✅ Category created: ${catData.name}`);
    } else {
      categoryMap[catData.slug] = existing._id as mongoose.Types.ObjectId;
      console.log(`🌱  [Seed] ✔️  Category exists: ${catData.name}`);
    }
  }

  // ── Products ────────────────────────────────────────────────────────────────
  const products = buildProducts(categoryMap);
  for (const productData of products) {
    const existing = await Product.findOne({ sku: productData.sku });
    if (!existing) {
      await Product.create(productData);
      console.log(`🌱  [Seed] ✅ Product created: ${productData.name}`);
    } else {
      console.log(`🌱  [Seed] ✔️  Product exists: ${productData.name}`);
    }
  }

  // ── Coupons ─────────────────────────────────────────────────────────────────
  const adminUser = await User.findOne({ email: 'sidhart1010@gmail.com' });
  if (adminUser) {
    const coupons = buildCoupons(adminUser._id as mongoose.Types.ObjectId);
    for (const couponData of coupons) {
      const existing = await Coupon.findOne({ code: couponData.code });
      if (!existing) {
        await Coupon.create(couponData);
        console.log(`🌱  [Seed] ✅ Coupon created: ${couponData.code}`);
      } else {
        console.log(`🌱  [Seed] ✔️  Coupon exists: ${couponData.code}`);
      }
    }
  } else {
    console.warn('🌱  [Seed] ⚠️  Could not find admin to create coupons');
  }

  console.log('\n🌱  [Seed] ✅ All seed data complete!\n');
};
