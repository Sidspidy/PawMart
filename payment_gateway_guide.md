# Payment Gateway Test Keys Guide

This guide describes how to obtain sandbox/test mode credentials for the payment gateways supported by PawMart: **Stripe**, **Razorpay**, and **Cashfree**.

---

## 1. Razorpay Credentials (India)

Razorpay is used for domestic Indian transactions, supporting UPI, Card, Netbanking, wallets, etc.

### Configuration Environment Variables
* `RAZORPAY_KEY_ID`
* `RAZORPAY_KEY_SECRET`

### Steps to Obtain Test Keys:
1. Register or Log in to the [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. In the top-right corner, toggle the mode from **Live** to **Test Mode**.
3. Go to **Account & Settings** in the left sidebar.
4. Under **Website and App Settings**, click on **API Keys**.
5. Click **Generate Key** to produce your unique `Key ID` and `Key Secret`.
6. Copy both keys immediately (the Secret is only displayed once).

---

## 2. Stripe Credentials (International)

Stripe is the industry standard for credit cards and multi-currency global transactions.

### Configuration Environment Variables
* `STRIPE_SECRET_KEY`
* `STRIPE_WEBHOOK_SECRET`

### Steps to Obtain Test Keys:
1. Sign in to your [Stripe Dashboard](https://dashboard.stripe.com/).
2. Toggle **Test mode** in the top-right header for sandbox operations.
3. Go to the **Developers ➔ API Keys** tab.
4. Under **Standard keys**, copy the **Secret key** (starts with `sk_test_...`).

### Steps to Setup Stripe Webhook:
1. Under the **Developers** menu, click **Webhooks**.
2. Click **Add endpoint**.
3. Set your endpoint URL (e.g. using Ngrok for local testing: `https://your-subdomain.ngrok-free.app/api/payment/webhook` or your production domain).
4. Select the event to listen to: `checkout.session.completed`.
5. Click **Add endpoint**, then click **Reveal** under "Signing secret" to obtain your webhook secret key (starts with `whsec_...`).

---

## 3. Cashfree Credentials (India)

Cashfree offers UPI, Cards, and Netbanking, widely used in India with rapid merchant verification.

### Configuration Environment Variables
* `CASHFREE_APP_ID`
* `CASHFREE_SECRET_KEY`

### Steps to Obtain Test Keys:
1. Log in to the [Cashfree Merchant Dashboard](https://merchant.cashfree.com/).
2. Click on the **Payment Gateway** option.
3. Locate the **Test** / **Sandbox** environment toggle in the header.
4. On the left navigation panel, click **Developer Suite ➔ API Keys**.
5. Copy your **App ID** and **Secret Key**.
