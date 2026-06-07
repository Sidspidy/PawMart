/**
 * PawMart Full Data Seeder
 * Seeds: Super Admin, Categories, Products, Coupons, Spin Wheel Config
 *
 * Run order: Super Admin → Categories → Products (need category IDs) → Coupons → SpinConfig
 */

import mongoose from 'mongoose';
import { Admin, AdminRole } from '../models/Admin.model';
import { Customer } from '../models/Customer.model';
import { Category } from '../models/Category.model';
import { Product, PetCategory } from '../models/Product.model';
import { Coupon, CouponType, CouponScope } from '../models/Coupon.model';
import { SpinWheelConfig } from '../models/SpinWheelConfig.model';

// ── 1. Super Admin ─────────────────────────────────────────────────────────────
export const seedSuperAdmin = async (): Promise<void> => {
  try {
    const superAdminEmail = 'sidhart1010@gmail.com';
    const existing = await Admin.findOne({ email: superAdminEmail });

    if (!existing) {
      await Admin.create({
        email: superAdminEmail,
        name: 'Sidharth Super Admin',
        role: AdminRole.SUPER_ADMIN,
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
      existing.role = AdminRole.SUPER_ADMIN;
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

    // Seed a storefront customer for convenience
    const testCustomerEmail = 'customer@pawmart.in';
    const customerExists = await Customer.findOne({ email: testCustomerEmail });
    if (!customerExists) {
      await Customer.create({
        email: testCustomerEmail,
        name: 'Rahul Customer',
        phone: '9876543210',
        password: 'password123',
        pointsBalance: 500,
        totalSpins: 3,
      });
      console.log(`🌱  [Seed] ✅ Created sample customer: ${testCustomerEmail}`);
    } else {
      console.log(`🌱  [Seed] ✔️  Verified sample customer: ${testCustomerEmail}`);
    }
  } catch (error) {
    console.error('❌  [Seed] Failed to seed Super Admin or Customer:', error);
  }
};

// ── 2. Categories (14 Detailed Categories) ──────────────────────────────────────
const categoryData = [
  // DOGS
  {
    name: 'Dog Food',
    slug: 'dog-food',
    petCategory: PetCategory.DOGS,
    description: 'Premium nutrition and organic kibbles for active dogs.',
    sortOrder: 1,
    isActive: true,
    metaTitle: 'Dog Food | PawMart',
    metaDescription: 'Shop the best dog food — dry, wet, grain-free & more.',
  },
  {
    name: 'Dog Toys',
    slug: 'dog-toys',
    petCategory: PetCategory.DOGS,
    description: 'Durable rubber chew toys and interactive puzzle games.',
    sortOrder: 2,
    isActive: true,
    metaTitle: 'Dog Toys | PawMart',
    metaDescription: 'Explore durable chew toys, fetch balls, and puzzle feeders for dogs.',
  },
  {
    name: 'Dog Grooming',
    slug: 'dog-grooming',
    petCategory: PetCategory.DOGS,
    description: 'Organic shampoos, slicker brushes, and dynamic nail clippers.',
    sortOrder: 3,
    isActive: true,
    metaTitle: 'Dog Grooming | PawMart',
    metaDescription: 'Keep your dog looking fresh with professional grooming gear.',
  },
  {
    name: 'Dog Accessories',
    slug: 'dog-accessories',
    petCategory: PetCategory.DOGS,
    description: 'Ergonomic harness sets, leather collars, and memory foam beds.',
    sortOrder: 4,
    isActive: true,
    metaTitle: 'Dog Accessories | PawMart',
    metaDescription: 'Luxury dog beds, harness accessories, and travel accessories.',
  },
  // CATS
  {
    name: 'Cat Food',
    slug: 'cat-food',
    petCategory: PetCategory.CATS,
    description: 'Savory ocean fish wet patés and grain-free cat kibbles.',
    sortOrder: 5,
    isActive: true,
    metaTitle: 'Cat Food | PawMart',
    metaDescription: 'Shop dry, wet, and raw cat food for your feline companion.',
  },
  {
    name: 'Cat Toys',
    slug: 'cat-toys',
    petCategory: PetCategory.CATS,
    description: 'Feather wand teasers, catnip mice, and laser chase toys.',
    sortOrder: 6,
    isActive: true,
    metaTitle: 'Cat Toys | PawMart',
    metaDescription: 'Keep your cat active with interactive laser toys and teasers.',
  },
  {
    name: 'Cat Furniture',
    slug: 'cat-furniture',
    petCategory: PetCategory.CATS,
    description: 'Cozy cat trees, sisal scratching posts, and elevated condos.',
    sortOrder: 7,
    isActive: true,
    metaTitle: 'Cat Furniture | PawMart',
    metaDescription: 'Sisal scratching posts, cat condos, and elevated play towers.',
  },
  {
    name: 'Cat Care & Litter',
    slug: 'cat-care-litter',
    petCategory: PetCategory.CATS,
    description: 'Odor-locking clumping clay litter and self-cleaning pans.',
    sortOrder: 8,
    isActive: true,
    metaTitle: 'Cat Care & Litter | PawMart',
    metaDescription: 'Bentonite clumping clay litter, odor lock litters, and supplies.',
  },
  // FISH
  {
    name: 'Aquarium Systems',
    slug: 'aquarium-systems',
    petCategory: PetCategory.FISH,
    description: 'Seamless curved glass tanks, silent power filters, and LED lighting.',
    sortOrder: 9,
    isActive: true,
    metaTitle: 'Aquarium Systems | PawMart',
    metaDescription: 'Curved glass designer aquariums, LED tanks, and advanced filters.',
  },
  {
    name: 'Fish Supplies',
    slug: 'fish-supplies',
    petCategory: PetCategory.FISH,
    description: 'Tropical color-enhancing flakes, decor plants, and water conditioners.',
    sortOrder: 10,
    isActive: true,
    metaTitle: 'Fish Supplies | PawMart',
    metaDescription: 'Vibrant color-enhancing flakes and custom plants for tanks.',
  },
  // BIRDS
  {
    name: 'Bird Food',
    slug: 'bird-food',
    petCategory: PetCategory.BIRDS,
    description: 'Antioxidant-rich gourmet seed blends and dried fruit nut mixes.',
    sortOrder: 11,
    isActive: true,
    metaTitle: 'Bird Food | PawMart',
    metaDescription: 'Organic gourmet fruit and seed mixes for exotic parakeets.',
  },
  {
    name: 'Bird Accessories',
    slug: 'bird-accessories',
    petCategory: PetCategory.BIRDS,
    description: 'Steel playtop parrot mansions, wooden perches, and hanging swings.',
    sortOrder: 12,
    isActive: true,
    metaTitle: 'Bird Accessories | PawMart',
    metaDescription: 'Wrought iron parrot cages, perches, swings, and cage supplies.',
  },
  // SMALL PETS
  {
    name: 'Small Pet Food',
    slug: 'small-pet-food',
    petCategory: PetCategory.SMALL_PETS,
    description: 'Sweet sun-cured timothy mountain hay and high-fiber alfalfa pellets.',
    sortOrder: 13,
    isActive: true,
    metaTitle: 'Small Pet Food | PawMart',
    metaDescription: 'Sun-cured mountain timothy hay and active fiber pellets.',
  },
  {
    name: 'Small Pet Havens',
    slug: 'small-pet-havens',
    petCategory: PetCategory.SMALL_PETS,
    description: 'Multi-level acrylic tunnels, exercise wheels, and nesting beds.',
    sortOrder: 14,
    isActive: true,
    metaTitle: 'Small Pet Havens | PawMart',
    metaDescription: 'Hamster modular tubes, silent bearing running wheels, and nests.',
  },
];

// ── 3. Products (16 Highly Detailed Products with Variants & Multiple Images) ──
const buildProducts = (categoryMap: Record<string, mongoose.Types.ObjectId>) => [
  // 1. Royal Canin Adult Dog Food
  {
    name: 'Royal Canin Adult Dog Kibble',
    slug: 'royal-canin-adult-dog-kibble',
    description: 'Complete and balanced nutrition tailored specifically for adult dogs of all breeds. Formulated with high-quality, easily digestible proteins, optimal levels of dietary fiber, and dynamic Omega-3 & Omega-6 fatty acids to promote a lustrous coat and vibrant skin condition. Helps maintain a healthy weight and supports vital organ health.',
    shortDescription: 'Premium dry dog food for optimal adult vitality and coat shine.',
    category: categoryMap['dog-food'],
    petCategory: PetCategory.DOGS,
    brand: 'Royal Canin',
    tags: ['dog food', 'premium', 'dry kibble', 'adult dog', 'omega-3'],
    basePrice: 1299,
    comparePrice: 1599,
    sku: 'RC-DOG-ADULT',
    stock: 95,
    lowStockThreshold: 10,
    weight: 3000,
    isFeatured: true,
    isActive: true,
    isBestseller: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=400',
        publicId: 'rc-dog-food-1',
        alt: 'Royal Canin Adult Dog Food 3kg Pack',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
        publicId: 'rc-dog-food-2',
        alt: 'Golden Retriever eating kibble',
        isPrimary: false,
      }
    ],
    variants: [
      { sku: 'RC-DOG-ADULT-3KG', label: '3 kg Value Pack', price: 1299, comparePrice: 1599, stock: 50, weight: 3000 },
      { sku: 'RC-DOG-ADULT-10KG', label: '10 kg Professional Pack', price: 3899, comparePrice: 4499, stock: 30, weight: 10000 },
      { sku: 'RC-DOG-ADULT-15KG', label: '15 kg Breeder Jumbo Pack', price: 5499, comparePrice: 6299, stock: 15, weight: 15000 },
    ],
    metaTitle: 'Royal Canin Adult Dog Food | PawMart',
    metaDescription: 'Shop Royal Canin Adult Dog Food with different size options (3kg, 10kg, 15kg). Guaranteed quality.',
  },
  // 2. Kong Classic Chew Toy
  {
    name: 'Kong Classic Rubber Chew Toy',
    slug: 'kong-classic-rubber-chew-toy',
    description: 'The Gold Standard of dog toys for over forty years. Constructed from our highly durable, ultra-elastic natural red rubber compound, this stuffable chew toy bounces unpredictably, perfect for active fetching and engaging solo play. Can be filled with peanut butter, kibble, or treats to alleviate anxiety and reduce destructive gnawing behavior.',
    shortDescription: 'Super durable natural red rubber toy for fetching and chew relief.',
    category: categoryMap['dog-toys'],
    petCategory: PetCategory.DOGS,
    brand: 'Kong',
    tags: ['dog toy', 'chew toy', 'rubber', 'interactive', 'stuffable'],
    basePrice: 549,
    comparePrice: 699,
    sku: 'KONG-CLS',
    stock: 140,
    lowStockThreshold: 8,
    weight: 140,
    isFeatured: true,
    isActive: true,
    isBestseller: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&q=80&w=400',
        publicId: 'kong-toy-1',
        alt: 'Kong Classic Red Toy',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400',
        publicId: 'kong-toy-2',
        alt: 'Playful puppy holding toy',
        isPrimary: false,
      }
    ],
    variants: [
      { sku: 'KONG-CLS-SM', label: 'Small Size (Up to 9kg)', price: 399, comparePrice: 499, stock: 40, weight: 80 },
      { sku: 'KONG-CLS-MD', label: 'Medium Size (7kg to 16kg)', price: 549, comparePrice: 699, stock: 50, weight: 140 },
      { sku: 'KONG-CLS-LG', label: 'Large Size (13kg to 30kg)', price: 699, comparePrice: 899, stock: 35, weight: 280 },
      { sku: 'KONG-CLS-XL', label: 'Extra Large Size (27kg to 41kg)', price: 899, comparePrice: 1099, stock: 15, weight: 380 },
    ],
    metaTitle: 'Kong Classic Red Rubber Chew Toy | PawMart',
    metaDescription: 'Durable, puncture-resistant stuffable red rubber chew toys for dogs of all sizes.',
  },
  // 3. FurHaven Orthopedic Pet Bed
  {
    name: 'FurHaven Joint Support Orthopedic Bed',
    slug: 'furhaven-joint-support-orthopedic-bed',
    description: 'Give your companion therapeutic joint comfort. The FurHaven Orthopedic foam pet bed is loaded with medical-grade orthopedic foam designed to evenly distribute weight, soothe pressure points, and reduce stiffness in active senior dogs or growing pups. Highlights a removable cover with a soft velvet plush feel that is machine-washable.',
    shortDescription: 'Medical-grade joint support foam bed with machine-washable plush cover.',
    category: categoryMap['dog-accessories'],
    petCategory: PetCategory.DOGS,
    brand: 'FurHaven',
    tags: ['dog bed', 'orthopedic', 'accessories', 'plush', 'washable'],
    basePrice: 2499,
    comparePrice: 2999,
    sku: 'FH-BED-ORTHO',
    stock: 45,
    lowStockThreshold: 5,
    weight: 1800,
    isFeatured: true,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1591584563733-0fa60097514c?auto=format&fit=crop&q=80&w=400',
        publicId: 'fh-bed-1',
        alt: 'Grey FurHaven Plush Pet Bed',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1608454367599-c1139e652bfb?auto=format&fit=crop&q=80&w=400',
        publicId: 'fh-bed-2',
        alt: 'Dog resting on memory foam cushion',
        isPrimary: false,
      }
    ],
    variants: [
      { sku: 'FH-BED-MD', label: 'Medium - 28" x 20"', price: 2499, comparePrice: 2999, stock: 20, weight: 1800 },
      { sku: 'FH-BED-LG', label: 'Large - 36" x 28"', price: 3499, comparePrice: 4299, stock: 15, weight: 2600 },
      { sku: 'FH-BED-JB', label: 'Jumbo - 44" x 35"', price: 4899, comparePrice: 5699, stock: 10, weight: 3600 },
    ],
    metaTitle: 'FurHaven Orthopedic Memory Foam Pet Bed | PawMart',
    metaDescription: 'Medical grade orthopedic foam pet beds for joint support. Washable cover.',
  },
  // 4. PawMart Professional Grooming Slicker Brush
  {
    name: 'PawMart Grooming Slicker Brush',
    slug: 'pawmart-grooming-slicker-brush',
    description: 'A premium, professional-grade slicker brush with fine, curved stainless steel wire bristles. Penetrates deep into the undercoat to easily eliminate loose hairs, tangled mats, dander, and trapped dirt without scratching your pet\'s sensitive skin. Perfect for both long-haired and short-haired dogs and cats.',
    shortDescription: 'Fine curved wire brush for eliminating mats and loose undercoats.',
    category: categoryMap['dog-grooming'],
    petCategory: PetCategory.DOGS,
    brand: 'PawMart',
    tags: ['grooming brush', 'undercoat', 'dematting', 'pet grooming', 'slicker'],
    basePrice: 499,
    comparePrice: 699,
    sku: 'PM-BRUSH-SLK',
    stock: 120,
    lowStockThreshold: 10,
    weight: 220,
    isFeatured: false,
    isActive: true,
    isBestseller: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=400',
        publicId: 'pm-brush-1',
        alt: 'Slicker brush removing hair',
        isPrimary: true,
      }
    ],
    metaTitle: 'PawMart Professional Slicker Brush | PawMart',
    metaDescription: 'Eliminate mats, loose hair, and dirt from your pet coat with ease.',
  },
  // 5. Whiskas Wet Cat Food Pouches (12-Pack)
  {
    name: 'Whiskas Wet Cat Food (12-Pack)',
    slug: 'whiskas-wet-cat-food-12-pack',
    description: 'Spoil your feline royalty with Whiskas Gourmet Wet Pouches. Prepared with fresh flakes of real seafood or tender chicken chunks slow-cooked in a savory nutrient-rich gravy. Packed with vital vitamins, minerals, and optimal taurine to support healthy kidneys, brilliant eyesight, and cardiovascular health.',
    shortDescription: '12-Pack single-serve ocean seafood or chicken wet pouches in gravy.',
    category: categoryMap['cat-food'],
    petCategory: PetCategory.CATS,
    brand: 'Whiskas',
    tags: ['cat food', 'wet food', 'gravy pouches', 'whiskas', 'taurine'],
    basePrice: 499,
    comparePrice: 599,
    sku: 'WH-WET-12P',
    stock: 215,
    lowStockThreshold: 20,
    weight: 1020,
    isFeatured: true,
    isActive: true,
    isBestseller: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
        publicId: 'wh-wet-1',
        alt: 'Whiskas Wet Food box',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400',
        publicId: 'wh-wet-2',
        alt: 'Cute tabby cat licking whiskers',
        isPrimary: false,
      }
    ],
    variants: [
      { sku: 'WH-WET-TUNA', label: 'Ocean Tuna in Savory Gravy', price: 499, comparePrice: 599, stock: 80, weight: 1020 },
      { sku: 'WH-WET-CHIK', label: 'Tender Chicken in Warm Broth', price: 499, comparePrice: 599, stock: 75, weight: 1020 },
      { sku: 'WH-WET-SALM', label: 'Atlantic Salmon in Hydrated Jelly', price: 549, comparePrice: 649, stock: 60, weight: 1020 },
    ],
    metaTitle: 'Whiskas Gourmet Wet Cat Food 12-Pack Pouches | PawMart',
    metaDescription: 'Indulge your feline with rich gravy wet food pouches. Ocean tuna, salmon, chicken packs.',
  },
  // 6. Orijen Fit & Trim Grain-Free Cat Kibble
  {
    name: 'Orijen Fit & Trim Grain-Free Kibble',
    slug: 'orijen-fit-trim-grain-free-kibble',
    description: 'Formulated to cater to lean muscle maintenance and biological weight support in adult cats. Contains an incredibly rich ratio of 85% premium fresh animal ingredients, including free-run chicken, turkey, wild-caught herring, and northern pike. 100% grain-free, gluten-free, and contains zero synthetic fillers.',
    shortDescription: 'Biologically appropriate grain-free diet with 85% poultry & wild fish.',
    category: categoryMap['cat-food'],
    petCategory: PetCategory.CATS,
    brand: 'Orijen',
    tags: ['cat food', 'grain-free', 'dry kibble', 'orijen', 'high-protein'],
    basePrice: 2199,
    comparePrice: 2499,
    sku: 'OR-FIT',
    stock: 60,
    lowStockThreshold: 6,
    weight: 1800,
    isFeatured: false,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?auto=format&fit=crop&q=80&w=400',
        publicId: 'or-fit-1',
        alt: 'Orijen fit and trim pack',
        isPrimary: true,
      }
    ],
    variants: [
      { sku: 'OR-FIT-1.8', label: '1.8 kg Fresh Lock Bag', price: 2199, comparePrice: 2499, stock: 40, weight: 1800 },
      { sku: 'OR-FIT-5.4', label: '5.4 kg Mega Saver Bag', price: 5499, comparePrice: 6299, stock: 20, weight: 5400 },
    ],
    metaTitle: 'Orijen Fit & Trim Grain-Free dry Cat Food | PawMart',
    metaDescription: 'Premium grain-free wild caught fish and poultry diet for cats of all breeds.',
  },
  // 7. Catit Interactive Laser Chase & Feather Wand
  {
    name: 'Catit Interactive Laser & Wand',
    slug: 'catit-interactive-laser-wand',
    description: 'Unleash your cat\'s biological hunting instincts. This dual-purpose toy features an ergonomic safe LED red laser pointer and an interchangeable carbon-fiber feather wand tip. Perfect for high-speed chasing and leaping exercise sessions to keep indoor cats physically fit, alert, and thoroughly engaged.',
    shortDescription: 'LED red laser pointer and carbon feather wand interactive combo.',
    category: categoryMap['cat-toys'],
    petCategory: PetCategory.CATS,
    brand: 'Catit',
    tags: ['cat toy', 'laser pointer', 'feather wand', 'chasing', 'exercise'],
    basePrice: 349,
    comparePrice: 499,
    sku: 'CT-TOY-LSR',
    stock: 150,
    lowStockThreshold: 15,
    weight: 85,
    isFeatured: false,
    isActive: true,
    isBestseller: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&q=80&w=400',
        publicId: 'catit-laser-1',
        alt: 'Cute cat eyes tracking toy',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=400',
        publicId: 'catit-laser-2',
        alt: 'Cat playing with feather',
        isPrimary: false,
      }
    ],
    metaTitle: 'Catit Interactive Laser Pointer & Feather Wand | PawMart',
    metaDescription: 'Perfect interactive hunting and exercise toy for indoor cats.',
  },
  // 8. Frisco Multi-Level Cat Tree Condo
  {
    name: 'Frisco Multi-Level Cat Tree Condo',
    slug: 'frisco-multi-level-cat-tree-condo',
    description: 'The ultimate climbing, scratching, and sleeping palace for multi-cat households. Constructed with solid, heavy-duty engineered wood baseboards to prevent tipping. Wrapped in thick, skin-friendly plush faux carpet, featuring natural sisal scratch posts, double elevated sleep platforms, private hammocks, and dangling feather toys.',
    shortDescription: 'Sturdy engineered wood multi-level cat tree with scratching posts.',
    category: categoryMap['cat-furniture'],
    petCategory: PetCategory.CATS,
    brand: 'Frisco',
    tags: ['cat tree', 'cat condo', 'furniture', 'scratching post', 'sisal'],
    basePrice: 3899,
    comparePrice: 4599,
    sku: 'FR-TREE',
    stock: 25,
    lowStockThreshold: 3,
    weight: 12000,
    isFeatured: true,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=400',
        publicId: 'frisco-tree-1',
        alt: 'Cozy cat tower sitting in living room',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=400',
        publicId: 'frisco-tree-2',
        alt: 'White kitten peeking from condo hole',
        isPrimary: false,
      }
    ],
    variants: [
      { sku: 'FR-TREE-STD', label: 'Standard Playhouse (120 cm)', price: 3899, comparePrice: 4599, stock: 15, weight: 12000 },
      { sku: 'FR-TREE-DLX', label: 'Deluxe Kingdom (165 cm)', price: 5999, comparePrice: 6999, stock: 10, weight: 18000 },
    ],
    metaTitle: 'Frisco Multi-Level Cat Tree and Play Condo | PawMart',
    metaDescription: 'Sturdy natural sisal scratching posts and multi level viewing platforms for cats.',
  },
  // 9. Odor-Lock Clumping Clay Lavender Litter
  {
    name: 'Odor-Lock Clumping Lavender Litter',
    slug: 'odor-lock-clumping-lavender-litter',
    description: 'Ensure a fresh-smelling home. Powered with rapid odor-trap bentonite micro-clay particles, this litter forms instant, hard rock-solid clumps that locks moisture and neutralizes ammonia odors for up to 10 days guaranteed. Scented with premium, hypoallergenic lavender oils.',
    shortDescription: 'Rapid clumping bentonite lavender-scented dust-free clay litter.',
    category: categoryMap['cat-care-litter'],
    petCategory: PetCategory.CATS,
    brand: 'OdorLock',
    tags: ['cat litter', 'clumping clay', 'lavender', 'dust-free', 'hygiene'],
    basePrice: 799,
    comparePrice: 999,
    sku: 'OL-LTR',
    stock: 80,
    lowStockThreshold: 8,
    weight: 6000,
    isFeatured: false,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&q=80&w=400',
        publicId: 'odorlock-litter-1',
        alt: 'Cat litter pouring bentonite clay',
        isPrimary: true,
      }
    ],
    variants: [
      { sku: 'OL-LTR-6', label: '6 kg Easy Pour Box', price: 799, comparePrice: 999, stock: 50, weight: 6000 },
      { sku: 'OL-LTR-12', label: '12 kg Value Saver Bag', price: 1399, comparePrice: 1699, stock: 30, weight: 12000 },
    ],
    metaTitle: 'Odor-Lock Bentonite Clumping Lavender Litter | PawMart',
    metaDescription: 'Rock-solid clumps with lavender scent, 99.9% dust free sodium clay litter.',
  },
  // 10. Fluval Flex Curved Glass Aquarium Kit
  {
    name: 'Fluval Flex Curved Glass Aquarium',
    slug: 'fluval-flex-curved-glass-aquarium',
    description: 'Upgrade your aquascaping space with a luxurious seamless curved-front glass aquarium kit. Comes fully equipped with an adjustable, custom-tailored 3-stage internal filter, mechanical sponge block, bio-chemical foam cartridge, and an infra-red remote controlled LED light hood supporting multiple daytime spectrums and nocturnal moonlight blue modes.',
    shortDescription: 'Seamless 180-degree panoramic glass tank kit with LED & 3-stage filter.',
    category: categoryMap['aquarium-systems'],
    petCategory: PetCategory.FISH,
    brand: 'Fluval',
    tags: ['aquarium kit', 'curved glass', 'aquascaping', 'fluval flex', 'led lighting'],
    basePrice: 6499,
    comparePrice: 7999,
    sku: 'FL-FLEX',
    stock: 20,
    lowStockThreshold: 2,
    weight: 8000,
    isFeatured: true,
    isActive: true,
    isBestseller: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=400',
        publicId: 'fluval-flex-1',
        alt: 'Vibrant neon fish in aquascape tank',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400',
        publicId: 'fluval-flex-2',
        alt: 'LED lights glowing inside water',
        isPrimary: false,
      }
    ],
    variants: [
      { sku: 'FL-FLEX-34', label: '34 Liters Desktop Tank', price: 6499, comparePrice: 7999, stock: 12, weight: 8000 },
      { sku: 'FL-FLEX-57', label: '57 Liters Panoramic Tank', price: 9899, comparePrice: 11999, stock: 8, weight: 13000 },
    ],
    metaTitle: 'Fluval Flex Seamless Curved Glass Aquarium Kit | PawMart',
    metaDescription: '3-stage biological filtration, curved glass view, remote LED lights.',
  },
  // 11. Aqueon QuietFlow internal Power Filter
  {
    name: 'Aqueon QuietFlow Power Filter',
    slug: 'aqueon-quietflow-power-filter',
    description: 'Keep your aquarium pristine and clear with the Aqueon QuietFlow. Engineered with a specialized submersible motor that guarantees near-silent water cycle operation. High-performance 3-stage mechanical sponge filtration ensures all floating particulates and heavy suspended bio-wastes are trapped efficiently.',
    shortDescription: 'Submersible near-silent internal filter with 3-stage filtration cartridges.',
    category: categoryMap['aquarium-systems'],
    petCategory: PetCategory.FISH,
    brand: 'Aqueon',
    tags: ['aquarium filter', 'submersible', 'quietflow', 'clarity', 'internal filter'],
    basePrice: 1499,
    comparePrice: 1899,
    sku: 'AQ-FILTER-QF',
    stock: 90,
    lowStockThreshold: 5,
    weight: 750,
    isFeatured: false,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1635614822578-2a93cbf8e98a?auto=format&fit=crop&q=80&w=400',
        publicId: 'aqueon-filter-1',
        alt: 'Submerged water bubbles from filtration system',
        isPrimary: true,
      }
    ],
    metaTitle: 'Aqueon QuietFlow Submersible Aquarium Filter | PawMart',
    metaDescription: 'Submersible, self-priming aquarium power filter for crystal clean water.',
  },
  // 12. TetraMin Tropical Vibrance Flakes
  {
    name: 'TetraMin Tropical Vibrance Flakes',
    slug: 'tetramin-tropical-vibrance-flakes',
    description: 'Ensure beautiful, thriving tropical fish. Enriched with natural carotenoid color-boosters, organic spirulina proteins, and stabilized Vitamin C to build optimal metabolic immunity and enhance the natural neon glow of your guppies, tetras, and cichlids. Unique clean-water formula prevents flake suspension breakdown.',
    shortDescription: 'Immunity-boosting tropical flake food with natural color enhancers.',
    category: categoryMap['fish-supplies'],
    petCategory: PetCategory.FISH,
    brand: 'Tetra',
    tags: ['fish food', 'tropical fish', 'color flakes', 'immunity', 'clean-water'],
    basePrice: 249,
    comparePrice: 299,
    sku: 'TM-FLK',
    stock: 180,
    lowStockThreshold: 15,
    weight: 30,
    isFeatured: false,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1635614822578-2a93cbf8e98a?auto=format&fit=crop&q=80&w=400',
        publicId: 'tetra-flakes-1',
        alt: 'Goldfish swimming near bubbles',
        isPrimary: true,
      }
    ],
    variants: [
      { sku: 'TM-FLK-100', label: '100 ml Shaker Canister', price: 249, comparePrice: 299, stock: 100, weight: 30 },
      { sku: 'TM-FLK-250', label: '250 ml Value Canister', price: 489, comparePrice: 599, stock: 80, weight: 75 },
    ],
    metaTitle: 'TetraMin Tropical Color Enhancing Flakes | PawMart',
    metaDescription: 'Nutrient-rich daily fish flakes for guppies and tropical fish, clean water formula.',
  },
  // 13. Versele-Laga Prestige Gourmet Seed Blend
  {
    name: 'Versele-Laga Prestige Seed Blend',
    slug: 'versele-laga-prestige-seed-blend',
    description: 'A scientifically structured, multi-ingredient gourmet seed mix crafted exclusively for medium and large parrot species. Loaded with sun-ripened striped sunflower seeds, raw pumpkin seeds, dehydrated sweet banana chips, papaya bits, unsalted peanuts, and high-fiber extruded mineral pellets to support cardiac strength and metabolism.',
    shortDescription: 'Gourmet fruit, nut, and seed parrot mix with fortified minerals.',
    category: categoryMap['bird-food'],
    petCategory: PetCategory.BIRDS,
    brand: 'Versele-Laga',
    tags: ['bird food', 'parrot mix', 'gourmet seeds', 'plumage', 'energy'],
    basePrice: 499,
    comparePrice: 599,
    sku: 'VL-SEED',
    stock: 80,
    lowStockThreshold: 10,
    weight: 1000,
    isFeatured: false,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&q=80&w=400',
        publicId: 'versele-laga-1',
        alt: 'Beautiful green parrot close up',
        isPrimary: true,
      }
    ],
    variants: [
      { sku: 'VL-SEED-1', label: '1 kg Fresh Seal Pack', price: 499, comparePrice: 599, stock: 50, weight: 1000 },
      { sku: 'VL-SEED-2.5', label: '2.5 kg Breeding Pack', price: 1099, comparePrice: 1299, stock: 30, weight: 2500 },
    ],
    metaTitle: 'Versele-Laga Prestige Gourmet Parrot Seed Blend | PawMart',
    metaDescription: 'Whole grain and sun-cured nut parrot feed. Fortified vitamins, high protein.',
  },
  // 14. Prevue Wrought Iron Parrot Playtop Mansion
  {
    name: 'Prevue Wrought Iron Playtop Mansion',
    slug: 'prevue-wrought-iron-playtop-mansion',
    description: 'Give your bird a palace. Constructed with extremely robust, lead-free wrought iron and coated in non-toxic rustproof hammer-tone powder coating. Features an open playtop roof stand complete with steel climbing ladders, high perches, slide-out metal mess trays, seed guards, and double locking security front doors.',
    shortDescription: 'Heavy-duty wrought iron playtop parrot cage with rolling casters.',
    category: categoryMap['bird-accessories'],
    petCategory: PetCategory.BIRDS,
    brand: 'Prevue',
    tags: ['bird cage', 'parrot mansion', 'wrought iron', 'playtop', 'aviary'],
    basePrice: 11999,
    comparePrice: 14999,
    sku: 'PV-MANSION-IRON',
    stock: 15,
    lowStockThreshold: 2,
    weight: 22000,
    isFeatured: true,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&q=80&w=400',
        publicId: 'prevue-cage-1',
        alt: 'Exotic blue parrot in aviary stand',
        isPrimary: true,
      }
    ],
    metaTitle: 'Prevue Wrought Iron Parrot Playtop Cage | PawMart',
    metaDescription: 'Lead-free wrought iron aviary with open playtop ladders and perches.',
  },
  // 15. Oxbow Orchard Grass Mountain Timothy Hay
  {
    name: 'Oxbow Orchard Grass Timothy Hay',
    slug: 'oxbow-orchard-grass-timothy-hay',
    description: 'Ensure excellent digestion for small pets. Sweet sweet Orchard mountain Timothy Hay is carefully hand-selected, sun-cured, and double-compressed to maintain absolute freshness. Packed with high organic fibers critical to digest food and wear down small pets\' teeth.',
    shortDescription: 'High-fiber hand-sorted sweet sun-cured Timothy mountain hay.',
    category: categoryMap['small-pet-food'],
    petCategory: PetCategory.SMALL_PETS,
    brand: 'Oxbow',
    tags: ['timothy hay', 'small pet', 'rabbit food', 'hamster', 'high-fiber'],
    basePrice: 399,
    comparePrice: 499,
    sku: 'OX-HAY',
    stock: 100,
    lowStockThreshold: 10,
    weight: 500,
    isFeatured: false,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&q=80&w=400',
        publicId: 'oxbow-hay-1',
        alt: 'Sweet timothy mountain grass close up',
        isPrimary: true,
      }
    ],
    variants: [
      { sku: 'OX-HAY-500', label: '500 g Fresh Lock Pack', price: 399, comparePrice: 499, stock: 60, weight: 500 },
      { sku: 'OX-HAY-1200', label: '1.2 kg Jumbo Saver Pack', price: 799, comparePrice: 999, stock: 40, weight: 1200 },
    ],
    metaTitle: 'Oxbow Orchard Grass Mountain Timothy Hay | PawMart',
    metaDescription: '100% natural, sweet mountain orchard hay for rabbits, guinea pigs, hamsters.',
  },
  // 16. Niteangel Super-Silent Exercise Wheel
  {
    name: 'Niteangel Super-Silent Wheel',
    slug: 'niteangel-super-silent-wheel',
    description: 'Keep your hamsters active without the noise. Constructed with a premium dual-bearing drive that ensures completely silent rotating loops. Smooth anti-skid running tracks prevent paws from slipping during midnight runs.',
    shortDescription: 'Sub-decibel dual-bearing exercise running wheel for hamsters.',
    category: categoryMap['small-pet-havens'],
    petCategory: PetCategory.SMALL_PETS,
    brand: 'Niteangel',
    tags: ['hamster wheel', 'silent running', 'niteangel', 'cage toy', 'haven'],
    basePrice: 1299,
    comparePrice: 1599,
    sku: 'NA-WHL',
    stock: 43,
    lowStockThreshold: 4,
    weight: 600,
    isFeatured: true,
    isActive: true,
    isBestseller: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&q=80&w=400',
        publicId: 'niteangel-wheel-1',
        alt: 'Transparent bearing hamster wheel',
        isPrimary: true,
      }
    ],
    variants: [
      { sku: 'NA-WHL-MD', label: 'Medium - 22cm Track (Dwarf)', price: 1299, comparePrice: 1599, stock: 25, weight: 600 },
      { sku: 'NA-WHL-LG', label: 'Large - 28cm Track (Syrian)', price: 1899, comparePrice: 2299, stock: 18, weight: 950 },
    ],
    metaTitle: 'Niteangel Super-Silent Bearing Hamster Wheel | PawMart',
    metaDescription: 'Dual ball bearings, silent track running wheels for mice and Syrian hamsters.',
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
  console.log('\n🌱  [Seed] Starting PawMart large-scale data seed...');

  // Seed super admin first
  await seedSuperAdmin();

  // WIPE existing category/product entries so that we boot with pristine structure
  console.log('🌱  [Seed] 🧹 Wiping existing categories & products...');
  await Category.deleteMany({});
  await Product.deleteMany({});
  console.log('🌱  [Seed] 🧹 Wipe complete.');

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
  const adminUser = await Admin.findOne({ email: 'sidhart1010@gmail.com' });
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

  // ── Spin Wheel Config ───────────────────────────────────────────────────────
  console.log('🌱  [Seed] 🧹 Wiping spin wheel config...');
  await SpinWheelConfig.deleteMany({});
  console.log('🌱  [Seed] Seeding default spin wheel config...');
  const defaultPrizes = [
    { type: 'points', label: 'Bonus Points', value: 100, probability: 0.15, isActive: true },
    { type: 'free_shipping', label: 'Free Shipping', probability: 0.15, isActive: true },
    { type: 'gift', label: 'Gift Product', probability: 0.10, isActive: true },
    { type: 'coupon', label: '10% Coupon', value: 10, probability: 0.20, isActive: true },
    { type: 'coupon', label: '20% Coupon', value: 20, probability: 0.10, isActive: true },
    { type: 'gift', label: 'Mystery Reward', probability: 0.10, isActive: true },
    { type: 'gift', label: 'Extra Spin', probability: 0.10, isActive: true },
    { type: 'gift', label: 'Surprise Box', probability: 0.10, isActive: true },
  ];
  await SpinWheelConfig.create(defaultPrizes);
  console.log('🌱  [Seed] Spin wheel config seeded successfully.');

  console.log('\n🌱  [Seed] ✅ All seed data complete!\n');
};
