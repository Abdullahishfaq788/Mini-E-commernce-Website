# 🛍️ Mini E-Commerce Website — Full-Stack MERN Monorepo

A modern, production-grade **Mini E-Commerce Web Application** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Features a sleek dark glassmorphism UI, JWT authentication, shopping cart, checkout flow, order tracking, and a complete REST API — all in one monorepo.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## ✨ Key Features

### 🎨 Frontend (React + Vite + Tailwind CSS)
- 🌙 **Dark Glassmorphism UI** — Premium translucent panels, hover animations, and gradient accents
- 🔍 **Product Discovery** — Live search, category filters, price sorting, and pagination
- 🛒 **Shopping Cart** — Real-time item count badge, quantity adjustments, subtotal/tax/shipping calculations
- 💳 **Checkout Flow** — Multi-step form with shipping address, payment method selector, and order placement
- 📦 **Order History** — Track orders with status badges (Pending → Processing → Shipped → Delivered)
- 🔐 **JWT Authentication** — Register, Login, Protected Routes, Profile management
- 📱 **Fully Responsive** — Mobile-first design with collapsible navigation
- ⚡ **Lazy Loading** — Code-split pages for optimal performance
- 🔔 **Toast Notifications** — Auto-dismiss success/error/info alerts

### ⚙️ Backend (Node.js + Express + MongoDB)
- 🗄️ **MongoDB + Mongoose** — Structured schemas for Users, Products, Cart, and Orders
- 🔑 **JWT Auth & bcrypt** — Secure password hashing and token-based authentication
- 🛡️ **Role-Based Access** — Admin-only product management endpoints
- ✅ **Input Validation** — Request validation with `express-validator`
- 🌱 **Auto-Seed Data** — Pre-loaded sample products for instant demo experience
- 🔄 **Memory Fallback** — Works seamlessly even without MongoDB running

---

## 🏗️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM, Tailwind CSS 4, Context API, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, express-validator |
| **Dev Tools** | Nodemon, Concurrently, dotenv, CORS |

---

## 📁 Project Structure

```
mini-ecommerce/
│
├── client/                          # ⚛️ React Frontend (Vite)
│   ├── src/
│   │   ├── components/              # Navbar, Footer, ProductCard, LoadingSpinner, EmptyCart, ProtectedRoute
│   │   ├── context/                 # AuthContext, CartContext, ToastContext
│   │   ├── layouts/                 # MainLayout wrapper
│   │   ├── pages/                   # Home, Products, ProductDetails, Cart, Checkout, Orders, Profile, Login, Register, 404
│   │   ├── routes/                  # AppRoutes.jsx (lazy loading + route guards)
│   │   ├── services/               # Axios API client & endpoint wrappers
│   │   └── styles/                  # Tailwind CSS & custom glassmorphism styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # 🟢 Node.js Backend (Express)
│   ├── config/                      # MongoDB connection (db.js)
│   ├── controllers/                 # authController, productController, cartController, orderController
│   ├── middleware/                  # JWT auth middleware, express-validator handler
│   ├── models/                      # User, Product, Cart, Order (Mongoose Schemas)
│   ├── routes/                      # authRoutes, productRoutes, cartRoutes, orderRoutes
│   ├── services/                    # seedService.js (mock data & auto-seeder)
│   ├── .env                         # Environment variables
│   ├── server.js                    # Express entry point
│   └── package.json
│
├── package.json                     # Root monorepo scripts (concurrently)
├── DOCUMENTATION.md                 # Full developer & API documentation
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Abdullahishfaq788/Mini-E-commernce-Website.git
cd Mini-E-commernce-Website
```

### 2. Install All Dependencies
```bash
npm run install:all
```

### 3. Configure Environment Variables
Create or edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mini_ecommerce_db
JWT_SECRET=your_super_secret_jwt_key_here
```

### 4. Run the Application
```bash
npm run dev
```
This launches both servers simultaneously:
- 🖥️ **Frontend** → [http://localhost:5173](http://localhost:5173)
- ⚙️ **Backend API** → [http://localhost:5000](http://localhost:5000)

---

## 📡 REST API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Login & receive JWT token |
| `GET` | `/api/auth/profile` | Protected | Get logged-in user profile |

### 📦 Products (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List all products (search, filter, sort, paginate) |
| `GET` | `/api/products/:id` | Public | Get single product details |
| `POST` | `/api/products` | Admin | Create new product |
| `PUT` | `/api/products/:id` | Admin | Update existing product |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |

### 🛒 Cart (`/api/cart`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Protected | Get user's cart items |
| `POST` | `/api/cart` | Protected | Add product to cart |
| `PUT` | `/api/cart/:id` | Protected | Update item quantity |
| `DELETE` | `/api/cart/:id` | Protected | Remove item from cart |

### 📋 Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Protected | Place a new order |
| `GET` | `/api/orders` | Protected | Get user order history |
| `GET` | `/api/orders/:id` | Protected | Get specific order details |
| `PUT` | `/api/orders/:id` | Admin | Update order status |
| `DELETE` | `/api/orders/:id` | Protected | Cancel an order |

---

## 🗄️ Database Models

### User
```javascript
{ name, email, password (hashed), role ('user' | 'admin'), timestamps }
```

### Product
```javascript
{ title, description, category, price, stock, image, timestamps }
```

### Cart
```javascript
{ user (ref), products: [{ product (ref), quantity }], timestamps }
```

### Order
```javascript
{ user (ref), items: [{ product, title, price, quantity, image }],
  totalPrice, shippingAddress: { address, city, postalCode, country },
  paymentMethod, orderStatus ('Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'),
  timestamps }
```

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start both frontend & backend simultaneously |
| `npm run client` | Start React frontend only (port 5173) |
| `npm run server` | Start Express backend only (port 5000) |
| `npm run install:all` | Install dependencies for root, server & client |

---

## 🔒 Security Features
- ✅ **JWT Authentication** — Stateless token-based auth with 30-day expiry
- ✅ **Password Hashing** — bcryptjs with 10 salt rounds
- ✅ **Environment Variables** — Secrets stored in `.env` (excluded from git)
- ✅ **Input Validation** — Server-side validation with express-validator
- ✅ **Protected Routes** — Both API middleware and frontend route guards
- ✅ **Role-Based Access** — Admin-only endpoints for product management

---

## 📱 Frontend Pages

| Page | Route | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| Home | `/` | No | Hero section, categories, featured products |
| Products | `/products` | No | Full catalog with search, filter, sort, pagination |
| Product Details | `/products/:id` | No | Single product view with add-to-cart |
| Cart | `/cart` | No | Shopping cart with quantity management |
| Checkout | `/checkout` | Yes | Shipping & payment form, place order |
| Orders | `/orders` | Yes | Order history with status tracking |
| Profile | `/profile` | Yes | User account information |
| Login | `/login` | No | Sign in form |
| Register | `/register` | No | Create account form |
| 404 | `*` | No | Not found error page |

---

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author
**Abdullah Ishfaq**
- GitHub: [@Abdullahishfaq788](https://github.com/Abdullahishfaq788)

---

> Built with ❤️ using the MERN Stack
