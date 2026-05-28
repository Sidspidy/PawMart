# 🐾 PawMart

> A full-stack pet e-commerce platform with category-specific theming, spin-wheel rewards, multi-gateway payments, and OTP authentication.

## Monorepo Structure

```
pawmart/
├── apps/
│   ├── server/    — Node.js + Express + TypeScript REST API
│   ├── web/       — React customer storefront
│   └── admin/     — React admin dashboard
├── packages/
│   └── shared/    — Shared TypeScript types + constants
├── turbo.json
└── package.json
```

## Getting Started

### Prerequisites
- Node.js >= 20
- npm >= 10
- MongoDB (local or Atlas)
- Redis (for OTP storage)

### Installation

```bash
# Install all dependencies
npm install

# Copy environment files
cp apps/server/.env.example apps/server/.env

# Start all apps in dev mode
npm run dev

# Or start individually
npm run dev:server
npm run dev:web
npm run dev:admin
```

## Apps

| App | Port | Description |
|-----|------|-------------|
| server | 5000 | REST API |
| web | 3000 | Customer storefront |
| admin | 3001 | Admin dashboard |

## Features
- 🔐 Email OTP passwordless authentication
- 👥 Role-based access control (Super Admin → Staff → Customer)
- 🎡 Spin wheel rewards system
- 💰 Multi-gateway payments (Razorpay, Stripe, Cashfree, COD)
- 🖼️ Cloudinary image upload
- 📊 Admin analytics dashboard
- 🎫 Coupon engine
- 📦 Full order management
