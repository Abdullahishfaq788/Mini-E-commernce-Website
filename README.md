# Full-Stack Mini E-Commerce Monorepo Application

A modern, full-stack Mini E-Commerce web application built with the MERN stack (Node.js, Express, MongoDB, React.js with Vite and Tailwind CSS) packaged in a clean monorepo structure.

---

## 🚀 Key Features

### 🛒 Frontend (React + Vite + Tailwind CSS)
- **Modern UI & Animations**: Glassmorphism aesthetic, subtle transitions, reactive hover states.
- **Product Catalog & Discovery**: Live search, category pills, price filtering, sorting (price low-high, high-low, newest), and pagination.
- **Shopping Cart**: Real-time item count badge, quantity adjustment, subtotal/tax/shipping calculations, and instant notifications.
- **Checkout & Order History**: Multi-step checkout form, payment method selector, order status tracking (Pending, Processing, Shipped, Delivered).
- **Authentication**: JWT authentication flow with user profile management and protected routes.

### ⚡ Backend (Node.js + Express + MongoDB)
- **RESTful API Architecture**: Modular controllers, models, and routes.
- **JWT Auth & Security**: Password hashing via `bcryptjs`, JWT bearer token validation middleware, and role checks (`user`, `admin`).
- **Data Validation**: Input field validation using `express-validator`.
- **Auto-Seeding Mock Fallback**: Pre-built seed engine ensuring the store works out of the box even before configuring local MongoDB.

---

## 🛠️ Tech Stack Matrix

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Vite, React Router DOM, Tailwind CSS, Context API, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `express-validator` |
| **Monorepo** | `concurrently` script orchestrator |

---

## 📁 Monorepo Folder Structure

```
mini-ecommerce/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # AuthContext, CartContext, ToastContext
│   │   ├── hooks/             # Custom React Hooks
│   │   ├── layouts/           # Page Wrappers & Layouts
│   │   ├── pages/             # Route views (Home, Products, Cart, etc.)
│   │   ├── routes/            # AppRoutes.jsx
│   │   ├── services/          # Axios API wrappers
│   │   ├── styles/            # Tailwind CSS & custom styles
│   │   ├── utils/             # Formatters & utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Node.js Express Backend
│   ├── config/                # Mongoose db connection
│   ├── controllers/           # Auth, Product, Cart, Order business logic
│   ├── middleware/            # Auth & Validator middlewares
│   ├── models/                # User, Product, Cart, Order Mongoose Schemas
│   ├── routes/                # Express API endpoint definitions
│   ├── services/              # Database Seeder
│   ├── uploads/               # Asset uploads
│   ├── .env                   # Server environment variables
│   ├── server.js              # Server entry point
│   └── package.json
│
├── package.json               # Root monorepo launcher
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Install Dependencies
Run the install command from the root directory to install dependencies for root, server, and client:
```bash
npm run install:all
```

### 2. Environment Setup
Create a `.env` file inside the `server/` folder (or edit existing):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mini_ecommerce_db
JWT_SECRET=super_secret_jwt_key_mini_ecommerce_2026
```

### 3. Run the Monorepo
Start both the Express backend server (`localhost:5000`) and Vite frontend client (`localhost:5173`) with a single command:
```bash
npm run dev
```

---

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & receive JWT
- `GET /api/auth/profile` - Get logged-in user profile (Protected)

### Products (`/api/products`)
- `GET /api/products` - List products (Search, category filter, sort, paginate)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart (`/api/cart`)
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:id` - Update item quantity (Protected)
- `DELETE /api/cart/:id` - Remove item / clear cart (Protected)

### Orders (`/api/orders`)
- `POST /api/orders` - Place new order (Protected)
- `GET /api/orders` - List user orders (Protected)
- `GET /api/orders/:id` - View order details (Protected)
- `PUT /api/orders/:id` - Update status (Protected/Admin)
- `DELETE /api/orders/:id` - Cancel order (Protected)
