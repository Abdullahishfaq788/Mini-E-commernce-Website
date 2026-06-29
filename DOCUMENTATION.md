# Full-Stack Mini E-Commerce Developer & System Documentation

Welcome to the comprehensive documentation for the **Mini E-Commerce Monorepo Application**. This document provides an in-depth technical breakdown of the architecture, data models, API endpoints, state management, UI components, and deployment workflows.

---

## 📐 1. System Architecture Overview

The application follows a clean full-stack monorepo architecture separating the client (frontend SPA) and server (RESTful API service) into isolated directories while maintaining single-command development orchestration.

```
mini-ecommerce/
│
├── client/                    # Vite + React 18 SPA + Tailwind CSS
│   ├── src/
│   │   ├── components/        # Reusable presentation components
│   │   ├── context/           # React Context API global state stores
│   │   ├── layouts/           # Page wrappers (MainLayout)
│   │   ├── pages/             # Route views (Home, Catalog, Cart, etc.)
│   │   ├── routes/            # AppRoutes.jsx with lazy loading & route guards
│   │   ├── services/          # Axios instance & API wrapper calls
│   │   └── styles/            # Tailwind CSS directives & glassmorphism system
│   └── package.json
│
├── server/                    # Node.js + Express REST API Server
│   ├── config/                # Database connections (MongoDB / Mongoose)
│   ├── controllers/           # Business logic & request handlers
│   ├── middleware/            # JWT authentication & validation handlers
│   ├── models/                # Mongoose Schemas (User, Product, Cart, Order)
│   ├── routes/                # Express API endpoint definitions
│   ├── services/              # Mock seed service & fallback data
│   └── package.json
│
├── package.json               # Monorepo launcher (concurrently)
└── README.md
```

---

## ⚡ 2. Getting Started & Running Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB (Optional: an automatic in-memory seed fallback runs seamlessly if MongoDB is offline)

### Installation
From the root project directory, install all dependencies for root, server, and client simultaneously:
```bash
npm run install:all
```

### Environment Variables (`server/.env`)
Create or verify the `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mini_ecommerce_db
JWT_SECRET=super_secret_jwt_key_mini_ecommerce_2026_dev_key
```

### Launching the Application
To launch both backend API (`http://localhost:5000`) and React frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

---

## 🗄️ 3. Database Data Models (Mongoose Schemas)

### 👤 User Model (`server/models/User.js`)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto Generated | Primary key |
| `name` | String | Required, Trim | Full name of the user |
| `email` | String | Required, Unique, Lowercase | User email login |
| `password` | String | Required, Min 6 chars | Bcrypt hashed password |
| `role` | String | Enum: `['user', 'admin']` | User permissions (Default: `user`) |
| `createdAt` | Date | Auto Timestamp | Account creation timestamp |

### 📦 Product Model (`server/models/Product.js`)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | Required, Trim | Product name |
| `description` | String | Required | Detailed product description |
| `category` | String | Required, Trim | Department (`Electronics`, `Fashion`, etc.) |
| `price` | Number | Required, Min 0 | Item price in USD |
| `stock` | Number | Required, Min 0 | Inventory quantity |
| `image` | String | Required | Image URL |

### 🛒 Cart Model (`server/models/Cart.js`)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `user` | ObjectId | Ref: `User`, Unique | Associated user account |
| `products` | Array | `[{ product, quantity }]` | Cart items with references to Product |

### 📋 Order Model (`server/models/Order.js`)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `user` | ObjectId | Ref: `User`, Required | Customer reference |
| `items` | Array | Objects snapshot | Embedded array of ordered items |
| `totalPrice` | Number | Required | Final calculated total |
| `shippingAddress` | Object | Required | `{ address, city, postalCode, country }` |
| `paymentMethod` | String | Required | Payment choice (`Credit Card`, etc.) |
| `orderStatus` | String | Enum | `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled` |

---

## 📡 4. REST API Reference

### Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register`: Register new user account. Returns user details & JWT token.
- `POST /api/auth/login`: Authenticate existing user. Returns JWT token.
- `GET /api/auth/profile`: (Protected) Fetch logged-in user profile data.

### Product Endpoints (`/api/products`)
- `GET /api/products`: Fetch product list with query parameters:
  - `search` (String): Filter by product title.
  - `category` (String): Filter by category name.
  - `sort` (String): `price-asc`, `price-desc`, `newest`.
  - `page` (Number), `limit` (Number): Pagination parameters.
- `GET /api/products/:id`: Fetch single product by ID.
- `POST /api/products`: (Protected/Admin) Create new product.
- `PUT /api/products/:id`: (Protected/Admin) Update existing product.
- `DELETE /api/products/:id`: (Protected/Admin) Remove product.

### Cart Endpoints (`/api/cart`)
- `GET /api/cart`: (Protected) Retrieve user cart items.
- `POST /api/cart`: (Protected) Add product or increase quantity (`{ productId, quantity }`).
- `PUT /api/cart/:id`: (Protected) Update specific product quantity in cart.
- `DELETE /api/cart/:id`: (Protected) Remove item or clear cart (`:id = 'clear'`).

### Order Endpoints (`/api/orders`)
- `POST /api/orders`: (Protected) Place new purchase order.
- `GET /api/orders`: (Protected) Get user order history (or all orders if Admin).
- `GET /api/orders/:id`: (Protected) Fetch specific order breakdown.
- `PUT /api/orders/:id`: (Protected/Admin) Update order fulfillment status.

---

## ⚛️ 5. Frontend Architecture & State Management

### Context API Architecture
1. **`AuthContext`** ([AuthContext.jsx](file:///c:/React%20Js/mini-ecommernce-website/client/src/context/AuthContext.jsx)): Manages authenticated user state, JWT persistence in `localStorage`, login, registration, and logout routines.
2. **`CartContext`** ([CartContext.jsx](file:///c:/React%20Js/mini-ecommernce-website/client/src/context/CartContext.jsx)): Controls item quantities, syncing with API when logged in or localStorage guest mode, computing subtotal, shipping cost, taxes, and grand total.
3. **`ToastContext`** ([ToastContext.jsx](file:///c:/React%20Js/mini-ecommernce-website/client/src/context/ToastContext.jsx)): Renders toast notifications with success/error auto-dismiss animations.

### Component Map
- `Navbar.jsx`: Glassmorphic navigation header with search redirect, active cart counter badge, and user dropdown.
- `ProductCard.jsx`: Interactive catalog card with hover lift, price display, and instant cart actions.
- `ProtectedRoute.jsx`: Authentication wrapper blocking unauthenticated access to checkout, orders, and profile pages.

---

## 🛠️ 6. Design System & Styling Guidelines

The application employs a custom dark aesthetic powered by Tailwind CSS directives and custom CSS utilities ([index.css](file:///c:/React%20Js/mini-ecommernce-website/client/src/styles/index.css)):
- **Glassmorphism Panels (`.glass-panel`)**: Translucent backdrops (`backdrop-filter: blur(16px)`) with subtle borders.
- **Interactive Cards (`.glass-card`)**: Responsive hover animations and dynamic indigo border highlights.
- **Typography**: Clean hierarchy utilizing Google font standards.
