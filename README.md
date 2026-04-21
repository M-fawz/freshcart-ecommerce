# 🛒 FreshCart - E-Commerce App

A full-featured e-commerce web application built with React + Vite, connected to Route Academy's API.

## 🚀 Getting Started

```bash
npm install
npm run dev     # → http://localhost:5173
npm run build   # Production build
```

## ✅ Features Implemented

| Page | Description |
|------|-------------|
| 🏠 **Home** | Hero slider, category carousel, promo banners, featured products |
| 🛍️ **Products** | Grid view, search, category filter, sort, pagination |
| 📦 **Product Details** | Image gallery, add to cart, wishlist, related products |
| 📂 **Categories** | All categories + subcategories on click |
| 🏷️ **Brands** | All brands with search + detail modal |
| 🛒 **Cart** | Add/remove/update qty, order summary, promo code |
| ❤️ **Wishlist** | Saved products, move to cart |
| 💳 **Checkout** | Cash on delivery OR online payment (Stripe) |
| 📋 **My Orders** | Full order history with status |
| 🔐 **Auth** | Login, Register, Forget/Verify/Reset Password |

## 🔑 Auth Flow

1. Register → verify email → Login
2. Forgot password → verify 6-digit code → reset password

## 🌐 API

Base URL: `https://ecommerce.routemisr.com`  
Auth header: `token: <JWT>`

## 🧱 Tech Stack

- React 18 + Vite
- React Router DOM v6
- Axios (HTTP)
- Formik + Yup (forms & validation)
- Bootstrap 5 + Font Awesome 6
- React Slick (sliders)
- React Hot Toast (notifications)
- Context API (Auth, Cart, Wishlist state)
