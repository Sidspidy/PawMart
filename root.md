Root : 
pawmart/                          monorepo root
├── apps/
│   ├── server/                    Node.js API
│   ├── web/                       Customer storefront
│   └── admin/                     Admin dashboard
├── packages/
│   └── shared/                    Shared TS types + utils
├── .github/workflows/            CI/CD pipelines
├── package.json                  Workspace root (npm workspaces)
├── turbo.json                    Turborepo task runner
└── README.md

server/ :

apps/server/
├── src/
│   ├── config/
│   │   ├── db.ts                 MongoDB connection
│   │   ├── cloudinary.ts         Image upload config
│   │   └── env.ts                Env vars with Zod validation
│   ├── models/
│   │   ├── User.model.ts
│   │   ├── Product.model.ts
│   │   ├── Category.model.ts
│   │   ├── Order.model.ts
│   │   ├── Cart.model.ts
│   │   ├── Coupon.model.ts
│   │   ├── Points.model.ts
│   │   ├── SpinResult.model.ts
│   │   └── Review.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── category.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── order.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── coupon.routes.ts
│   │   ├── points.routes.ts
│   │   ├── admin.routes.ts
│   │   └── upload.routes.ts
│   ├── controllers/            One file per route file
│   ├── services/               Business logic layer
│   │   ├── auth.service.ts
│   │   ├── otp.service.ts        Generate + store OTP in Redis
│   │   ├── payment.service.ts    Gateway-agnostic interface
│   │   ├── points.service.ts
│   │   ├── email.service.ts
│   │   └── spin.service.ts       Prize selection logic
│   ├── middlewares/
│   │   ├── auth.middleware.ts    JWT verify
│   │   ├── rbac.middleware.ts    Role guard factory
│   │   ├── error.middleware.ts
│   │   └── upload.middleware.ts   Multer + Cloudinary
│   ├── utils/
│   │   ├── apiResponse.ts        Standard { success, data, message }
│   │   ├── asyncHandler.ts       try/catch wrapper
│   │   └── validators/           Zod schemas per entity
│   ├── types/
│   │   └── express.d.ts          Extend req.user type
│   ├── app.ts                    Express setup, middleware mount
│   └── server.ts                 listen(), db connect
├── .env.example
├── tsconfig.json
└── package.json

web/ :

apps/web/
├── src/
│   ├── assets/                   Images, Lottie JSONs, fonts
│   ├── components/
│   │   ├── ui/                   Button, Input, Badge, Modal…
│   │   ├── layout/               Navbar, Footer, PageWrapper
│   │   ├── product/              ProductCard, ProductGrid…
│   │   ├── cart/                 CartDrawer, CartItem…
│   │   ├── spin/                 SpinWheel, PrizeModal
│   │   └── category/             CategoryHero, CategoryBanner
│   ├── pages/
│   │   ├── Home.tsx              GSAP scroll storytelling
│   │   ├── auth/
│   │   │   ├── Login.tsx         OTP flow
│   │   │   └── Register.tsx
│   │   ├── category/
│   │   │   ├── Dogs.tsx          Earthy warm theme
│   │   │   ├── Cats.tsx          Lavender elegant theme
│   │   │   ├── Fish.tsx          Ocean blue theme
│   │   │   ├── Birds.tsx         Sky theme
│   │   │   └── SmallPets.tsx     Soft pink theme
│   │   ├── ProductListing.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── checkout/
│   │   │   ├── Address.tsx
│   │   │   └── Payment.tsx
│   │   └── dashboard/
│   │       ├── Orders.tsx
│   │       ├── Points.tsx
│   │       └── SpinWheel.tsx
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   └── usePoints.ts
│   ├── store/                    Zustand stores
│   │   ├── cart.store.ts
│   │   └── auth.store.ts
│   ├── api/                      Axios instance + query fns
│   ├── styles/
│   │   ├── globals.css
│   │   ├── themes/               dogs.css cats.css fish.css…
│   │   └── animations.css
│   ├── types/                    Re-exports from shared package
│   └── main.tsx
├── index.html
├── vite.config.ts
└── tsconfig.json

admin/ :

apps/admin/
├── src/
│   ├── components/
│   │   ├── ui/                   Shared design system
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx       Collapsible nav
│   │   │   ├── Topbar.tsx
│   │   │   └── AdminLayout.tsx
│   │   ├── tables/
│   │   │   ├── DataTable.tsx     Generic table + pagination
│   │   │   ├── DateFilter.tsx    Shopify-style date range
│   │   │   └── ExportBtn.tsx     CSV export
│   │   └── charts/
│   │       ├── RevenueChart.tsx
│   │       ├── OrdersChart.tsx
│   │       └── TopProducts.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx         Analytics overview
│   │   ├── products/
│   │   │   ├── ProductList.tsx
│   │   │   └── ProductForm.tsx    Add / edit with image upload
│   │   ├── categories/
│   │   │   └── CategoryManager.tsx
│   │   ├── orders/
│   │   │   ├── OrderList.tsx
│   │   │   └── OrderDetail.tsx
│   │   ├── customers/
│   │   │   └── CustomerList.tsx
│   │   ├── coupons/
│   │   │   └── CouponManager.tsx
│   │   ├── spin/
│   │   │   └── SpinConfig.tsx    Prize editor, probabilities
│   │   └── settings/
│   │       └── Roles.tsx         Staff + permissions
│   ├── store/
│   │   └── admin.store.ts
│   ├── api/
│   └── main.tsx
├── vite.config.ts
└── tsconfig.json

shared/ :

packages/shared/
├── src/
│   ├── types/
│   │   ├── user.types.ts         IUser, UserRole enum
│   │   ├── product.types.ts      IProduct, ICategory
│   │   ├── order.types.ts        IOrder, OrderStatus enum
│   │   ├── cart.types.ts
│   │   ├── coupon.types.ts
│   │   ├── points.types.ts
│   │   └── api.types.ts          ApiResponse<T> generic
│   ├── constants/
│   │   ├── categories.ts         PET_CATEGORIES enum
│   │   ├── orderStatus.ts
│   │   └── roles.ts              ROLE hierarchy map
│   └── index.ts               Re-exports everything
├── package.json
└── tsconfig.json