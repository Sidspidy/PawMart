export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  category: 'dogs' | 'cats' | 'fish' | 'birds' | 'small_pets';
  subcategory: 'food' | 'toys' | 'accessories' | 'care';
  description: string;
  features: string[];
  sizes?: string[];
  flavors?: string[];
  badge?: 'sale' | 'new' | 'bestseller' | null;
  specs: Record<string, string>;
  reviews: ProductReview[];
  dbCategory?: any;
  brand?: string;
  sku?: string;
  stock?: number;
  lowStockThreshold?: number;
  tags?: string[];
  variants?: any[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  shortDescription?: string;
  basePrice?: number;
  comparePrice?: number;
  soldCount?: number;
  weight?: number;
}

export const mockProducts: Product[] = [
  {
    id: 'dog-1',
    name: 'Premium Grain-Free Salmon Kibble',
    slug: 'premium-grain-free-salmon-kibble',
    price: 1899,
    originalPrice: 2299,
    rating: 4.8,
    reviewCount: 124,
    image: '/images/hero/dog.png',
    images: ['/images/hero/dog.png', '/images/hero/puppy.png', '/images/hero/dog.png'],
    category: 'dogs',
    subcategory: 'food',
    description: 'A complete and balanced grain-free nutrition formula crafted with premium quality wild-caught salmon, sweet potatoes, and organic greens. Tailored to foster healthy digestion, vibrant coats, and active muscles for dogs of all breeds and life stages.',
    features: [
      'Real wild-caught salmon is the #1 ingredient',
      'Grain-free formula with prebiotic fibers for sensitive stomachs',
      'Packed with Omega-3 and Omega-6 fatty acids for healthy skin and coat',
      'Gluten-free, zero artificial colors, flavors, or chemical preservatives'
    ],
    sizes: ['2.5 kg', '5 kg', '12 kg'],
    flavors: ['Wild Salmon', 'Free-Range Chicken', 'Grass-Fed Lamb'],
    badge: 'bestseller',
    specs: {
      'Breed Size': 'All Breed Sizes',
      'Life Stage': 'All Life Stages',
      'Primary Flavor': 'Salmon',
      'Special Diet': 'Grain-Free, Sensitive Digestion',
      'Origin': 'Made in India'
    },
    reviews: [
      { id: 'r1', author: 'Sarah M.', rating: 5, date: '2026-05-12', comment: 'My golden retriever absolutely loves this kibble! His coat has never been shinier and his digestion is perfect.', verified: true },
      { id: 'r2', author: 'Rohan K.', rating: 4, date: '2026-04-29', comment: 'Excellent quality ingredients. A bit premium but worth the price for healthy pet food.', verified: true }
    ]
  },
  {
    id: 'dog-2',
    name: 'Orthopedic Memory Foam Pet Bed',
    slug: 'orthopedic-memory-foam-pet-bed',
    price: 3499,
    originalPrice: 4299,
    rating: 4.9,
    reviewCount: 88,
    image: '/images/hero/puppy.png',
    images: ['/images/hero/puppy.png', '/images/hero/dog.png', '/images/hero/puppy.png'],
    category: 'dogs',
    subcategory: 'accessories',
    description: 'Designed to give your furry companion unmatched joint comfort. Renders medical-grade therapeutic support for senior pets and growing dogs. Features a machine-washable waterproof cover with a non-slip bottom base.',
    features: [
      'Joint support with 4-inch high-density therapeutic memory foam',
      'Removable waterproof cover that is fully machine-washable',
      'Non-skid bottom to prevent shifting on hardwood floors',
      'Hypoallergenic fabrics, ultra-soft luxurious bolsters'
    ],
    sizes: ['Medium (28"x20")', 'Large (36"x28")', 'XL (44"x35")'],
    badge: 'sale',
    specs: {
      'Material': 'Memory Foam, Plush Velvet Cover',
      'Washable': 'Yes, Removable Cover',
      'Waterproof Lining': 'Yes, Included',
      'Best For': 'Senior dogs, Joint relief, arthritis'
    },
    reviews: [
      { id: 'r3', author: 'Michael T.', rating: 5, date: '2026-05-20', comment: 'My senior lab instantly fell in love with this bed. He moves much easier in the morning now.', verified: true }
    ]
  },
  {
    id: 'dog-3',
    name: 'Ultra-Durable Natural Rubber Chew Toy',
    slug: 'ultra-durable-natural-rubber-chew-toy',
    price: 799,
    rating: 4.6,
    reviewCount: 57,
    image: '/images/hero/dog.png',
    images: ['/images/hero/dog.png'],
    category: 'dogs',
    subcategory: 'toys',
    description: 'Constructed from highly durable, non-toxic natural rubber for aggressive chewers. Helps clean teeth, freshen breath, and massage gums during playful gnawing. Can be filled with peanut butter or treats for added engagement.',
    features: [
      '100% natural puncture-resistant non-toxic rubber',
      'Hollow core perfect for stuffing treats, spreads, or kibble',
      'Built-in safety textures to promote dental hygiene on contact',
      'Bounces unpredictably for engaging fetching sessions'
    ],
    sizes: ['Medium', 'Large'],
    badge: 'new',
    specs: {
      'Material': '100% Biodegradable Natural Rubber',
      'Dishwasher Safe': 'Yes, top rack',
      'Toxicity': 'Free of BPA, Phthalates, and Lead',
      'Chew Strength': 'Heavy / Aggressive Chewers'
    },
    reviews: [
      { id: 'r4', author: 'Vikram S.', rating: 5, date: '2026-05-18', comment: 'Unbelievably tough! Usually chew toys last 2 days, but this is going strong after a month.', verified: true }
    ]
  },
  {
    id: 'cat-1',
    name: 'Interactive Multi-Level Scratch Tree',
    slug: 'interactive-multi-level-scratch-tree',
    price: 4599,
    originalPrice: 5499,
    rating: 4.7,
    reviewCount: 92,
    image: '/images/hero/kitten.png',
    images: ['/images/hero/kitten.png', '/images/hero/cat.png'],
    category: 'cats',
    subcategory: 'toys',
    description: 'An all-in-one scratching and playing sanctuary for cats of all sizes. Crafted with natural sisal scratching posts, hanging feather toys, deep sleeping hammocks, and cozy raised viewing condos to satisfy feline climbing instincts.',
    features: [
      'Natural eco-friendly sisal posts to keep claws off furniture',
      'Sturdy heavy-duty engineered wood base to prevent tipping',
      'Ultra-plush fabric cover for supreme resting comfort',
      'Includes 3 hanging toys and a private hiding condo'
    ],
    sizes: ['Standard (120 cm)', 'Premium (155 cm)'],
    badge: 'bestseller',
    specs: {
      'Height': '145 cm',
      'Post Material': '100% Sisal Fiber',
      'Fabric Cover': 'Faux Fur Plush Carpet',
      'Capacity': 'Up to 3 cats concurrently'
    },
    reviews: [
      { id: 'r5', author: 'James R.', rating: 5, date: '2026-05-02', comment: 'All three of my cats climb on this daily. Very stable, cozy condos. High-quality purchase.', verified: true }
    ]
  },
  {
    id: 'cat-2',
    name: 'Gourmet Tuna & Salmon Wet Paté',
    slug: 'gourmet-tuna-salmon-wet-pate',
    price: 99,
    originalPrice: 120,
    rating: 4.8,
    reviewCount: 205,
    image: '/images/hero/cat.png',
    images: ['/images/hero/cat.png', '/images/hero/kitten.png'],
    category: 'cats',
    subcategory: 'food',
    description: 'Indulge your feline royalty with our premium culinary wet paté. Made from high-quality flakes of real tuna and Atlantic salmon, slow-simmered in rich nutrient-dense bone broth. Ensures essential hydration and daily taurine needs.',
    features: [
      'Real seafood proteins are always the first two ingredients',
      'Slow-cooked savory gravy adds moisture for kidney health',
      'Includes optimal daily taurine for clear vision and cardiac health',
      'No animal by-products, grain-free, zero chemical thickeners'
    ],
    flavors: ['Tuna & Atlantic Salmon', 'Chicken Paté', 'Turkey & Salmon'],
    badge: 'bestseller',
    specs: {
      'Life Stage': 'Adult Cats (1+ years)',
      'Texture': 'Smooth Paté in Gravy',
      'Moisture Content': '82%',
      'Package Unit': '85g Easy-Peel Can'
    },
    reviews: [
      { id: 'r6', author: 'Emily C.', rating: 5, date: '2026-05-15', comment: 'My fussy cat cleans her plate every time with this paté. Will order in bulk.', verified: true }
    ]
  },
  {
    id: 'cat-3',
    name: 'Advanced Odor-Lock Clumping Clay Litter',
    slug: 'advanced-odor-lock-clumping-clay-litter',
    price: 899,
    rating: 4.5,
    reviewCount: 64,
    image: '/images/hero/kitten.png',
    images: ['/images/hero/kitten.png'],
    category: 'cats',
    subcategory: 'care',
    description: 'Say goodbye to lingering litter box odors. Powered with multi-odor lock carbon technology, this high-performance bentonite clay litter clumps instantly, creating solid scoops that do not crumble, keeping your house pristine.',
    features: [
      'Locks odors instantly for up to 10 days guaranteed',
      'Bentonite clay creates quick, rock-solid easy-scooping clumps',
      '99.9% dust-free formula to safeguard pet respiration',
      'Lightly scented with fresh lavender, hypoallergenic'
    ],
    sizes: ['5 kg', '10 kg'],
    specs: {
      'Material': 'Natural Bentonite Sodium Clay',
      'Dust Level': '99.9% Dust-Free',
      'Fragrance': 'Fresh Lavender / Scent-Free',
      'Eco-Friendliness': '100% Natural Earth Clay'
    },
    reviews: [
      { id: 'r7', author: 'Priya D.', rating: 4, date: '2026-04-10', comment: 'Clumps exceptionally well. Scent is very subtle and not overpowering at all.', verified: true }
    ]
  },
  {
    id: 'fish-1',
    name: 'Dynamic LED Curved Glass Aquarium Kit',
    slug: 'dynamic-led-curved-glass-aquarium-kit',
    price: 6499,
    originalPrice: 7999,
    rating: 4.8,
    reviewCount: 39,
    image: '/images/hero/fish.png',
    images: ['/images/hero/fish.png'],
    category: 'fish',
    subcategory: 'accessories',
    description: 'An elegant glass aquarium designed for aquarists who want a premium panoramic viewing experience. Equipped with a curved seamless glass front, multi-mode LED hood lights (daylight white and night moonlight blue), and a silent internal power filter.',
    features: [
      'Panoramic 180-degree seamless bent glass corner design',
      'Adjustable 3-stage power filter with filter cartridge',
      'Energy-efficient LED system with two lighting color profiles',
      'Durable hinged glass lid prevents moisture evaporation'
    ],
    sizes: ['15 Liters', '30 Liters', '60 Liters'],
    badge: 'bestseller',
    specs: {
      'Capacity': '30 Liters',
      'Lighting System': 'Energy Efficient LED (Day/Night modes)',
      'Filter Flow Rate': '180 Liters per hour',
      'Glass Thickness': '5 mm curved glass'
    },
    reviews: [
      { id: 'r8', author: 'Amit B.', rating: 5, date: '2026-05-14', comment: 'Absolutely beautiful aquarium. The curved front creates an incredible depth view. Silent filter.', verified: true }
    ]
  },
  {
    id: 'fish-2',
    name: 'Pro-Vibrance Tropical Flakes Food',
    slug: 'pro-vibrance-tropical-flakes-food',
    price: 349,
    originalPrice: 420,
    rating: 4.7,
    reviewCount: 82,
    image: '/images/hero/fish.png',
    images: ['/images/hero/fish.png'],
    category: 'fish',
    subcategory: 'food',
    description: 'A scientifically formulated flake food that supports healthy growth, strong immune systems, and brings out the brilliant natural colors of your tropical fish. Packed with spirulina, krill meal, and critical multi-vitamins.',
    features: [
      'Contains natural color enhancers like krill and carotenoids',
      'Clean-water formula: flake design minimizes waste suspension',
      'Enriched with stabilized vitamin C to support immune function',
      'Highly digestible proteins keep internal water cleaner'
    ],
    sizes: ['50g', '100g'],
    badge: 'sale',
    specs: {
      'Target Species': 'All Tropical Aquarium Fish',
      'Flake Type': 'Slow-Sinking Flakes',
      'Key Ingredients': 'Spirulina, Krill Meal, Wheat Germ',
      'Crude Protein': 'Min 46%'
    },
    reviews: [
      { id: 'r9', author: 'Karan J.', rating: 5, date: '2026-05-01', comment: 'My tetras and guppies feed happily. Colors look very vibrant after feeding this for two weeks.', verified: true }
    ]
  },
  {
    id: 'bird-1',
    name: 'Double-Decker Steel Parrot Mansion Cage',
    slug: 'double-decker-steel-parrot-mansion-cage',
    price: 8999,
    originalPrice: 10999,
    rating: 4.9,
    reviewCount: 22,
    image: '/images/hero/puppy.png', // Fallback, we will use general styles
    images: ['/images/hero/puppy.png'],
    category: 'birds',
    subcategory: 'accessories',
    description: 'A luxurious open-playtop habitat constructed from heavy-duty powder-coated wrought steel. Provides a secure home for African Greys, Cockatiels, and Conures. Features easy-clean trays, feeder doors, secure safety latches, and smooth rolling casters.',
    features: [
      'Wrought iron steel frame with non-toxic lead-free paint coating',
      'Open-playtop stand equipped with steel ladder and perches',
      'Slide-out metal trays and grates for effortless cleanups',
      'Equipped with 4 locks, solid side seed guards'
    ],
    badge: 'bestseller',
    specs: {
      'Dimensions': '65 x 65 x 156 cm',
      'Bar Spacing': '1.5 cm secure gap',
      'Material': 'Wrought Iron, Powder Coated Steel',
      'Included Perches': '3 Natural Hardwood Perches'
    },
    reviews: [
      { id: 'r10', author: 'Neha P.', rating: 5, date: '2026-04-20', comment: 'Amazing cage! Extremely solid, easy to put together, and incredibly spacious for my conure.', verified: true }
    ]
  },
  {
    id: 'bird-2',
    name: 'Organic Fruit & Nut Gourmet Blend',
    slug: 'organic-fruit-nut-gourmet-blend',
    price: 499,
    rating: 4.6,
    reviewCount: 43,
    image: '/images/hero/kitten.png',
    images: ['/images/hero/kitten.png'],
    category: 'birds',
    subcategory: 'food',
    description: 'Ensure your feathered friends receive gourmet nourishment. Rich, premium seed blend packed with sun-ripened nuts, papaya chunks, organic banana slices, raw pumpkin seeds, and fortified mineral pellets for daily health and stamina.',
    features: [
      '100% natural organic mix, zero synthetic chemicals',
      'Fortified with amino acids and minerals for vibrant plumage',
      'Rich in antioxidants to aid metabolism and overall energy',
      'Excellent variety of shapes and textures to prevent cage boredom'
    ],
    sizes: ['1 kg', '2.5 kg'],
    badge: 'new',
    specs: {
      'Target Species': 'Parrots, Cockatiels, Parakeets',
      'Allergy Warning': 'Contains Tree Nuts',
      'Fortified': 'Yes, Mineral Pellets Included',
      'Net Weight': '1 kg'
    },
    reviews: [
      { id: 'r11', author: 'Dinesh R.', rating: 4, date: '2026-05-10', comment: 'My African Grey picks out the almonds and banana chips first! Very clean mix, no dust.', verified: true }
    ]
  },
  {
    id: 'small-1',
    name: 'Deluxe Multi-Level Hamster Adventure Haven',
    slug: 'deluxe-multi-level-hamster-adventure-haven',
    price: 2499,
    originalPrice: 2999,
    rating: 4.7,
    reviewCount: 31,
    image: '/images/hero/kitten.png',
    images: ['/images/hero/kitten.png'],
    category: 'small_pets',
    subcategory: 'accessories',
    description: 'An interactive multi-level hamster villa designed to support endless fun and exploration. Comes fully packed with running wheels, curved plastic adventure tunnels, transparent play tubes, feeding bowls, water bottles, and comfortable cozy sleeping platforms.',
    features: [
      'Modular expandable connections: attach multiple tunnels',
      'Ultra-silent bearing exercise wheel (no clicking sounds)',
      'Deep plastic bottom base holds bedding without spillage',
      'Hinged wire top roof for high-ventilation air supply'
    ],
    badge: 'bestseller',
    specs: {
      'Dimensions': '45 x 30 x 48 cm',
      'Material': 'Acrylic Transparent Panels, Iron Grids',
      'Suitable For': 'Dwarf Hamsters, Syrian Hamsters, Gerbils',
      'Tunnels Included': '6 segment modular tubes'
    },
    reviews: [
      { id: 'r12', author: 'Michael O.', rating: 5, date: '2026-05-09', comment: 'My dwarf hamster loves this cage! The wheel is completely silent, which is a lifesaver at night.', verified: true }
    ]
  },
  {
    id: 'small-2',
    name: 'Sun-Cured Mountain Timothy Hay',
    slug: 'sun-cured-mountain-timothy-hay',
    price: 349,
    rating: 4.8,
    reviewCount: 110,
    image: '/images/hero/puppy.png',
    images: ['/images/hero/puppy.png'],
    category: 'small_pets',
    subcategory: 'food',
    description: 'Premium sweet mountain timothy hay, hand-selected, double-compressed, and sweet sun-cured. Provides a critical high-fiber digestive aid for rabbits, guinea pigs, and chinchillas, while keeping growing teeth healthy.',
    features: [
      'Double-compressed sweet Timothy Hay directly from mountain farms',
      'High essential fiber content aids gastrointestinal function',
      'Encourages vital natural chewing wear for small pets\' teeth',
      '100% preservative-free, hand-sorted for rich color and leaves'
    ],
    sizes: ['500g', '1 kg'],
    badge: 'bestseller',
    specs: {
      'Target Species': 'Rabbits, Guinea Pigs, Chinchillas',
      'Fiber Content': 'Crude Fiber Min 32%',
      'Curing Method': 'Sun-Cured on Mountain Farms',
      'Dust Content': 'Double-dusted, low allergens'
    },
    reviews: [
      { id: 'r13', author: 'Ananya S.', rating: 5, date: '2026-05-22', comment: 'Super fresh, green, and smells sweet. My guinea pigs literally squeak with joy when they get a fresh handful.', verified: true }
    ]
  }
];

export const adaptDbProduct = (dbProduct: any): Product => {
  if (!dbProduct) return {} as Product;
  
  const mainImage = dbProduct.images?.find((img: any) => img.isPrimary)?.url || 
                    dbProduct.images?.[0]?.url || 
                    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop';
  
  const imageList = dbProduct.images?.map((img: any) => typeof img === 'string' ? img : img.url) || [];
  if (imageList.length === 0 && mainImage) {
    imageList.push(mainImage);
  }

  // Generate dynamic features list from tags/brand
  const features = dbProduct.tags ? [...dbProduct.tags] : [];
  if (dbProduct.brand) features.unshift(`Official ${dbProduct.brand} product`);
  features.push('100% genuine and vet-approved');

  // Convert categories object or string
  const categoryName = typeof dbProduct.category === 'object' && dbProduct.category !== null 
    ? dbProduct.category.name 
    : 'Essentials';

  // Construct specifications table
  const specs: Record<string, string> = {
    'Brand': dbProduct.brand || 'PawMart',
    'Base SKU': dbProduct.sku || 'N/A',
    'Base Price': `₹${dbProduct.basePrice?.toLocaleString('en-IN')}`,
    'Stock Status': dbProduct.stock > 0 ? `In Stock (${dbProduct.stock} items)` : 'Out of Stock',
    'Category': categoryName,
    'Pet Type': dbProduct.petCategory?.replace('_', ' ').toUpperCase() || 'ALL'
  };

  if (dbProduct.weight) {
    specs['Weight'] = dbProduct.weight >= 1000 ? `${(dbProduct.weight / 1000).toFixed(1)} kg` : `${dbProduct.weight} g`;
  }

  return {
    id: dbProduct._id,
    _id: dbProduct._id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    price: dbProduct.basePrice,
    originalPrice: dbProduct.comparePrice,
    rating: dbProduct.averageRating || 4.8,
    reviewCount: dbProduct.reviewCount || 0,
    image: mainImage,
    images: imageList,
    category: dbProduct.petCategory || 'dogs',
    dbCategory: dbProduct.category,
    subcategory: categoryName,
    description: dbProduct.description || dbProduct.shortDescription || '',
    shortDescription: dbProduct.shortDescription,
    brand: dbProduct.brand,
    tags: dbProduct.tags || [],
    features: features,
    variants: dbProduct.variants || [],
    basePrice: dbProduct.basePrice,
    comparePrice: dbProduct.comparePrice,
    sku: dbProduct.sku,
    stock: dbProduct.stock,
    lowStockThreshold: dbProduct.lowStockThreshold || 0,
    weight: dbProduct.weight,
    isFeatured: dbProduct.isFeatured || false,
    isBestseller: dbProduct.isBestseller || false,
    soldCount: dbProduct.soldCount || 0,
    specs: specs,
    reviews: dbProduct.reviews || [
      { id: 'r1', author: 'Rahul S.', rating: 5, date: '2026-05-24', comment: 'Excellent quality, exactly as described! Quick delivery.', verified: true },
      { id: 'r2', author: 'Preeti M.', rating: 4, date: '2026-05-18', comment: 'My pet loved it instantly. Highly recommended brand.', verified: true }
    ]
  };
};
