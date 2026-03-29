```
██████╗ ██████╗  █████╗ ██████╗ ███████╗
██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝
██║  ██║██████╔╝███████║██████╔╝█████╗
██║  ██║██╔══██╗██╔══██║██╔═══╝ ██╔══╝
██████╔╝██║  ██║██║  ██║██║     ███████╗
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚══════╝
Fashion Forward — India's Modern Style Destination
```

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?logo=sqlite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-State-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

**Drape** is a production-grade Myntra-style fashion e-commerce platform built as a full-stack portfolio project. It features a complete shopping experience with auth, product browsing, cart, wishlist, checkout, and order tracking.

---

## ⚡ Quick Start

```bash
# 1. Clone / unzip the project
cd drape

# 2. Install all dependencies (root + client + server)
npm run install:all

# 3. Seed the database with 60+ products
npm run seed

# 4. Start both frontend and backend
npm run dev
```

- **Frontend:** http://localhost:5173  
- **Backend API:** http://localhost:5000/api  
- **Demo login:** `demo@drape.com` / `password123`  
- **Coupon code:** `DRAPE10` (10% off)

---

## 🛠 Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| Vite + React 18 | Build tool & UI framework |
| TailwindCSS | Utility-first styling |
| React Router v6 | Client-side routing |
| Zustand | Global state (auth, cart, wishlist) |
| TanStack Query | Server state & caching |
| Axios | HTTP client |
| react-hot-toast | Toast notifications |
| react-icons | Icon library |

### Backend
| Tool | Purpose |
|------|---------|
| Express.js | HTTP server & routing |
| better-sqlite3 | Synchronous SQLite driver |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth tokens |
| Zod | Request body validation |
| Multer | File upload handling |
| Morgan | HTTP request logging |

---

## ✅ Feature Checklist

### Auth
- [x] Register with name, email, password
- [x] Login with JWT stored in localStorage
- [x] Protected routes with login redirect
- [x] Profile view and edit (name, avatar)
- [x] Change password

### Products
- [x] Browse all 60+ products with pagination (12/page)
- [x] Filter by category, gender, brand, price range, size, discount %, rating
- [x] Sort by price ↑↓, rating, newest, best discount
- [x] Full-text search across name, brand, subcategory
- [x] Product detail page with image gallery (zoom on hover)
- [x] Size and colour selection before adding to bag
- [x] Star rating + review form (logged-in users)
- [x] Rating breakdown bar chart on product page
- [x] Similar products section

### Cart
- [x] Add / remove / update quantity
- [x] Cart persisted server-side per user
- [x] Apply coupon code (DRAPE10 = 10% off)
- [x] Full price breakdown (MRP, discount, delivery, total)
- [x] Move to wishlist from cart

### Wishlist
- [x] Toggle wishlist (instant UI update via Zustand)
- [x] View full wishlist page
- [x] Move to bag from wishlist

### Orders
- [x] Multi-step checkout (Address → Payment → Review)
- [x] Order placed confirmation page with animated checkmark
- [x] Order history with status badge and progress tracker
- [x] Expandable order detail with items and delivery address
- [x] Cancel order (Placed status only)

### UX Polish
- [x] Fully responsive — mobile, tablet, desktop
- [x] Skeleton loaders on all data-fetching views
- [x] Toast notifications for every user action
- [x] Empty states with illustrations on cart, wishlist, orders
- [x] 404 page
- [x] Image lazy loading with fallback placeholder
- [x] Debounced live search with dropdown results (300ms)
- [x] Active filter chips (removable) above product grid
- [x] All filter state synced to URL query params (shareable links)
- [x] Sticky navbar with scroll shadow
- [x] Mobile hamburger sidebar menu
- [x] Product image hover to show second image
- [x] Quick "Add to Bag" button on product card hover
- [x] Pincode delivery checker on product page
- [x] Wishlist heart badge count in navbar

---

## 📁 Project Structure

```
drape/
├── client/                     # Vite + React frontend
│   ├── src/
│   │   ├── api/                # Axios API functions (5 modules)
│   │   ├── components/
│   │   │   ├── cart/           # CartItem, CartSummary
│   │   │   ├── home/           # HeroBanner, CategoryStrip, TrendingSection
│   │   │   ├── layout/         # Navbar, Footer, Layout
│   │   │   ├── product/        # ProductCard, ProductGrid, FilterSidebar, SortDropdown
│   │   │   └── ui/             # Button, Badge, Spinner, Modal, StarRating, Toast
│   │   ├── hooks/              # useProducts, useCart, useWishlist
│   │   ├── pages/              # 12 pages
│   │   ├── store/              # Zustand stores (auth, cart, wishlist)
│   │   └── utils/              # formatCurrency, toastHelper
│   └── public/
│       └── placeholder.jpg
├── server/                     # Express backend
│   ├── controllers/            # 5 controllers
│   ├── db/                     # database.js + seed.js
│   ├── middleware/             # auth, error, validate
│   ├── routes/                 # 5 route files
│   └── uploads/                # static image storage
└── package.json                # root scripts
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✓ | Get current user |
| PUT | `/api/auth/profile` | ✓ | Update name/avatar |
| PUT | `/api/auth/password` | ✓ | Change password |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | — | List with filters & pagination |
| GET | `/api/products/featured` | — | 8 featured products |
| GET | `/api/products/categories` | — | All categories + subcategories |
| GET | `/api/products/brands` | — | All brand names |
| GET | `/api/products/:id` | — | Single product + reviews |
| POST | `/api/products/:id/review` | ✓ | Submit/update review |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | ✓ | Get cart items |
| POST | `/api/cart` | ✓ | Add item |
| PUT | `/api/cart/:id` | ✓ | Update quantity |
| DELETE | `/api/cart/:id` | ✓ | Remove item |
| DELETE | `/api/cart/clear` | ✓ | Clear entire cart |

### Wishlist
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/wishlist` | ✓ | Get wishlist items |
| GET | `/api/wishlist/ids` | ✓ | Get wishlist product IDs |
| POST | `/api/wishlist` | ✓ | Toggle (add/remove) |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/orders` | ✓ | All user orders |
| POST | `/api/orders` | ✓ | Create order from cart |
| GET | `/api/orders/:id` | ✓ | Single order |
| PUT | `/api/orders/:id/cancel` | ✓ | Cancel placed order |

---

## 🗃 Database Schema

6 tables: `users`, `categories`, `products`, `cart`, `wishlist`, `orders`, `reviews`

SQLite via `better-sqlite3` — zero config, file-based, runs anywhere.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary (pink) | `#FF3F6C` |
| Dark | `#282C3F` |
| Muted | `#696B79` |
| Light bg | `#F4F4F5` |
| Success | `#03A685` |
| Display font | Playfair Display |
| Body font | DM Sans |

---

## 📸 Screenshots

> Add screenshots to this section after running the app locally.

| Page | Description |
|------|-------------|
| Home | Hero carousel, category strip, trending products |
| Product Listing | Filters sidebar, sort, active chips, grid |
| Product Detail | Gallery with zoom, size/colour picker, reviews |
| Cart | Items list, price summary, coupon input |
| Checkout | 3-step: Address → Payment → Review |
| Orders | History with progress tracker |

---

## 📄 License

MIT — free to use for portfolio, learning, and commercial projects.
