PawMart project blueprint :
overview : 
Three codebases : 
1. server
Node.js + Express + TypeScript. REST API + GraphQL optional. JWT auth, role-based guards, Mongoose ODM.

2. web
React + TypeScript. Customer storefront with category pages, cart, checkout, spin-wheel, points dashboard.

3. admin
React + TypeScript. Separate app. Shopify-style dashboard, product management, orders, analytics, roles.

Pet categories :
🐕 Dogs
Warm earth tones. Playful bold fonts. Muddy paw textures. Food, grooming, collars, beds, toys.

🐈 Cats
Elegant purple-lavender palette. Minimal aesthetic. Litter, scratchers, trees, interactive toys.

🐟 Fish
Ocean blues and teals. Fluid animations. Tanks, filters, food, decorations, lighting.

🐦 Birds
Sky blues and greens. Light airy feel. Cages, perches, food, toys, feeders.

🐹 Small pets
Soft warm pinks. Cute rounded UI. Hamsters, rabbits, guinea pigs — cages, bedding, wheels.

features :

Points + Spin wheel
Each order earns points. Points unlock spin attempts. Wheel prizes: coupons, free shipping, gift items, bonus points. Configurable from admin.
Multi-gateway payments
Razorpay (India), Stripe (international), Cashfree, Cash on Delivery. Webhook handlers for payment status sync.
Email OTP login
Passwordless auth via OTP. Nodemailer + Redis for OTP storage with TTL. Google OAuth optional fallback.
Role-based access (RBAC)
Roles: Super Admin, Admin, Manager, Staff, Customer. Middleware guards per route. Admin UI shows only permitted sections.
Coupon engine
Percentage or flat discount. Category-specific, user-specific, or global. Usage limits, expiry dates, min order value.
Admin analytics dashboard
Revenue charts, top products, order trends, customer growth. Date range filters like Shopify. CSV export.
Order management
Status flow: Placed → Confirmed → Packed → Shipped → Delivered. Admin updates status, customer gets email notification.
Search & filters
MongoDB text index or Algolia. Filter by category, price, brand, rating. Sort by relevance, price, newest.

------------------------
UI & Design : 

Font pairing
Display: Nunito (rounded, friendly). Body: Inter or DM Sans. Monospace for codes: JetBrains Mono.
Animations
Framer Motion for page transitions, card hovers, cart interactions. GSAP for scroll storytelling on home page. Lottie for loaders and empty states.
Web3-style scroll storytelling
Home page hero: parallax pet illustrations pinned while text scrolls. GSAP ScrollTrigger. Category sections animate in from sides. Pet characters "walk" across screen on scroll.
Category-specific theming
CSS variables swap on category change. Dog pages: warm browns + orange. Cat pages: lavender + cream. Fish: deep blue + cyan. Birds: sky blue + lime. Small pets: pink + peach.
Loaders & empty states
Skeleton screens for product cards. Lottie animations for empty cart (sad pet), no results (searching pet), loading (running paw). Custom 404 with animated pet.
Product card styles
Rounded organic shapes, soft shadows, hover 3D tilt effect (CSS perspective transform). Wishlist heart animates on click. Badge ribbons for sale/new/bestseller.

Tech : 
Backend
Node.js
Express
TypeScript
MongoDB
Mongoose
JWT
Frontend
React
TypeScript
Zustand
React Query
Framer Motion
GSAP
Payments
Razorpay
Stripe
Cashfree
COD
Storage
Cloudinary
AWS S3 alt
Email
Nodemailer
SendGrid
React Email
Testing
Jest
Supertest
Playwright