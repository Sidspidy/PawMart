# 🐾 PawMart

> A premium, full-stack pet e-commerce platform and administrative ecosystem. PawMart features category-specific theming, spin-wheel rewards, multi-gateway payments, OTP authentication, custom 3D avatar selections, and an advanced management console.

---

## 🏗️ Monorepo Architecture

This project is organized as a monorepo managed by **Turborepo** and **npm workspaces**, ensuring clean boundary separation, shared types, and fast caching.

```text
PawMart/
├── apps/
│   ├── server/    — Node.js + Express + TypeScript REST API
│   ├── web/       — React + Vite customer storefront
│   └── admin/     — React + Vite administrative dashboard
├── packages/
│   └── shared/    — Shared TypeScript interfaces & validation schemas
├── turbo.json     — Turborepo compilation & build pipelines
└── package.json   — Monorepo root configuration & scripts
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Storefront** | React (Vite), TypeScript, Tailwind CSS, Zustand, Framer Motion, GSAP |
| **Admin Dashboard** | React (Vite), TypeScript, Recharts, Lucide Icons |
| **Backend API** | Node.js, Express, TypeScript, Mongoose (MongoDB), Redis (OTP storage) |
| **Authentication** | Passwordless Email OTP Authentication |
| **Payment Gateways** | Razorpay (Default), Stripe, Cashfree, Cash on Delivery (COD) |
| **Image Storage** | Cloudinary |

---

## 🌟 Key Features & Recent Enhancements

### 👤 Cozy 3D Avatar System
*   Users can select their profile avatar directly from their Storefront Profile.
*   Supports choice of **Male Owner**, **Female Owner**, or a **Cozy Pet**.
*   Avatar preferences sync in real-time across the storefront navbar, dashboard layouts, and the admin customer list.

### 📊 Advanced Admin Analytics
*   Interactive **Sales Performance** chart with a toggle to switch seamlessly between **Line Chart** and **Bar Chart** views.
*   Custom themed, claymorphic Recharts Tooltips for beautiful data inspection on hover.
*   Interactive donut charts summarizing top-selling categories dynamically.

### 🔍 Unified Global Header Search (Admin)
*   A global fuzzy-search bar in the admin header indexing **Products**, **Orders**, and **Customers** simultaneously.
*   Grouped list results with keyboard or click triggers that redirect instantly to item editing/details views.

### 🚨 Live Order Alert Polling
*   Admin header notification bell displays a live, pulsing count of all orders currently in `pending` (Placed) status.
*   Polls the server periodically to ensure team members are immediately aware of new incoming requests.

### 🛠️ Storefront Maintenance Mode
*   Toggleable directly from the Admin Settings tab.
*   When active, the customer storefront displays a friendly fullscreen maintenance page preventing public checkouts while the team performs updates.

---

## 🚀 Getting Started

### 📋 Prerequisites
*   **Node.js**: `>= 20.0.0`
*   **npm**: `>= 10.0.0`
*   **MongoDB**: Local installation or Atlas cluster
*   **Redis**: Local instance running (used for OTP rate limiting & storage)

### 🔧 Environment Setup

Create `.env` files for each app based on their templates:

1.  **Backend (`apps/server/.env`)**
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/pawmart
    REDIS_URL=redis://localhost:6379
    JWT_SECRET=your_jwt_secret_here
    JWT_EXPIRE=30d
    
    # Nodemailer Config (For OTP emails)
    SMTP_HOST=smtp.mailtrap.io
    SMTP_PORT=2525
    SMTP_USER=your_smtp_user
    SMTP_PASS=your_smtp_pass
    FROM_EMAIL=noreply@pawmart.com
    FROM_NAME=PawMart
    
    # Payment Gateways Keys
    RAZORPAY_KEY_ID=rzp_test_T1RddoPTP5VqQf
    RAZORPAY_KEY_SECRET=99dPn7ZgxMdx5V62f6XBdmDK
    STRIPE_SECRET_KEY=sk_test_51Ti9PtRzP4mLpwIesvybTUyL4EFtVaeNvX849kB2j30slAJFjkZOethq1098VchyqCahErMZfVNNKZ3DMYPdhBsR00yB1qqLdQ
    CASHFREE_APP_ID=TEST11106766736accce05f0a621fba666760111
    CASHFREE_SECRET_KEY=cfsk_ma_test_9a9948e8c10a5d7b334d46210693ee9e_c988fe15
    CASHFREE_ENV=TEST
    ```

2.  **Web Storefront (`apps/web/.env`)**
    ```env
    VITE_API_URL=http://localhost:5000/api
    VITE_RAZORPAY_KEY_ID=rzp_test_T1RddoPTP5VqQf
    VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
    ```

3.  **Admin Dashboard (`apps/admin/.env`)**
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

### 💻 Installation & Execution

```bash
# 1. Install dependencies at root
npm install

# 2. Run all applications in development mode simultaneously
npm run dev
```

Alternatively, you can run individual workspaces:
*   **Backend Server**: `npm run dev:server` (Port `5000`)
*   **Web Storefront**: `npm run dev:web` (Port `3000`)
*   **Admin Dashboard**: `npm run dev:admin` (Port `3001`)

---

## 🧪 Development Commands

*   **Typecheck all codebases**:
    ```bash
    npm run type-check
    ```
*   **Build production bundles**:
    ```bash
    npm run build
    ```
*   **Format codebase**:
    ```bash
    npm run lint
    ```
*   **Clean build artifacts and node_modules**:
    ```bash
    npm run clean
    ```

---

## 🔒 Security & Code Integrity
*   Inputs are strictly validated using **Zod** schema guards at both the shared package level and controller endpoints.
*   Sensitive settings modifications and dashboard controllers are locked behind **RBAC (Role-Based Access Control)** middleware verification.
