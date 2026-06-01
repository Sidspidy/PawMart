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





Viewed seed.ts:1-27

Here is a step-by-step guide on how to obtain real values for each of these environment keys.

---

### 1. Email (Nodemailer with Gmail)
To use Gmail for sending automated OTP emails, Google requires you to use an **App Password** rather than your actual account password.

* **`SMTP_HOST`**: Set to `smtp.gmail.com`.
* **`SMTP_PORT`**: Set to `587` (uses TLS security).
* **`SMTP_USER`**: Your personal or business Gmail address (e.g., `yourbrand@gmail.com`).
* **`EMAIL_FROM`**: The sender header shown to customers (e.g., `PawMart <yourbrand@gmail.com>`).
* **`SMTP_PASS` (How to get it):**
  1. Go to your [Google Account Console](https://myaccount.google.com/).
  2. Click **Security** on the left menu.
  3. Ensure **2-Step Verification** is turned **ON** (this is required to generate App Passwords).
  4. Search for **"App passwords"** in the top search bar (or go directly to [Google App Passwords](https://myaccount.google.com/apppasswords)).
  5. Enter a name for the app (e.g., `"PawMart Server"`).
  6. Click **Create**. Copy the generated **16-character code** (it looks like `xxxx yyyy zzzz wwww`).
  7. Paste this code without spaces into `SMTP_PASS`!

---

### 2. Razorpay Credentials (Indian Payment Gateway)
Razorpay is ideal for domestic Indian transactions, supporting UPI, Card, Netbanking, etc.

* **`RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`:**
  1. Register or Log in to the [Razorpay Dashboard](https://dashboard.razorpay.com/).
  2. Switch to **Test Mode** (toggle at the top-right corner) for development.
  3. Navigate to **Account & Settings** in the left sidebar.
  4. Under **Website and App Settings**, click on **API Keys**.
  5. Click **Generate Key** to produce your unique `Key ID` and `Key Secret`.
  6. Copy both keys immediately (the Secret is only shown once).
  7. Switch to **Live Mode** later to generate production keys when ready to launch!

---

### 3. Stripe Credentials (International Credit Cards & Google Pay)
Stripe is the industry standard for credit cards and multi-currency global transactions.

* **`STRIPE_SECRET_KEY`:**
  1. Sign in to your [Stripe Dashboard](https://dashboard.stripe.com/).
  2. Toggle **"Test mode"** in the top-right header for secure debugging.
  3. Go to **Developers** ➔ **API Keys** tab.
  4. Under **Standard keys**, copy the **Secret key** (it starts with `sk_test_...`).
* **`STRIPE_WEBHOOK_SECRET`:**
  1. Under the **Developers** menu, click **Webhooks**.
  2. Click **Add endpoint**.
  3. Enter your local endpoint (e.g., using a tunneling tool like Ngrok: `https://your-ngrok-subdomain.ngrok-free.app/api/payment/webhook`) or your production domain URL.
  4. Select the event you want to listen to: `checkout.session.completed`.
  5. Click **Add endpoint**, then click **Reveal** under "Signing secret" to obtain your webhook secret key (starts with `whsec_...`).

---

### 4. Cashfree Credentials (Zero Setup Payment Gateway)
Cashfree offers UPI, Cards, and Netbanking, widely used in India with fast activation times.

* **`CASHFREE_APP_ID` & `CASHFREE_SECRET_KEY`:**
  1. Log in to the [Cashfree Merchant Dashboard](https://merchant.cashfree.com/).
  2. Click on **Payment Gateway** card.
  3. Locate the **Test** / **Sandbox** environment toggle in the header.
  4. On the left navigation panel, head to **Developer Suite** ➔ **API Keys**.
  5. Copy your **App ID** (often a string of numbers/letters) and **Secret Key**.
  6. Paste these values directly into `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY`!