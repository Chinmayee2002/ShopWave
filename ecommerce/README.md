# 🛒 ShopWave — Full-Stack E-Commerce Application

A modern, production-ready full-stack e-commerce platform built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Features a full shopping experience with an admin panel, JWT authentication, cart, wishlist, orders, and more.

---

## 🚀 Live Features

| Feature | Details |
|---|---|
| 🔐 Authentication | Register, Login, Logout with JWT |
| 🛍️ Products | Browse, search, filter by category & price, sort |
| 🛒 Cart | Add, remove, update quantity, auto-calculate total |
| ❤️ Wishlist | Save and manage favourite products |
| 📦 Orders | Place orders, track status, view history |
| 💳 Payment | Dummy payment (easy to swap in Stripe/Razorpay) |
| 👤 Profile | Edit name, email, phone, address, password |
| 🔧 Admin Panel | Dashboard, manage products, orders, users |
| 📤 Image Upload | Multer-powered product image upload |
| 📱 Responsive | Works perfectly on mobile, tablet, desktop |

---

## 🗂️ Folder Structure

```
ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, getMe
│   │   ├── userController.js      # Profile, CRUD (admin)
│   │   ├── productController.js   # Products CRUD, reviews
│   │   ├── categoryController.js  # Categories CRUD
│   │   ├── cartController.js      # Cart operations
│   │   ├── wishlistController.js  # Wishlist operations
│   │   ├── orderController.js     # Orders, payment, status
│   │   └── adminController.js     # Dashboard stats
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect + admin check
│   │   └── errorMiddleware.js     # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── generateToken.js       # JWT token generator
│   │   └── seeder.js              # Seed dummy data
│   ├── uploads/                   # Uploaded product images
│   ├── server.js                  # Express app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── admin/
        │   │   └── AdminLayout.js     # Admin sidebar + layout
        │   ├── common/
        │   │   ├── AdminRoute.js      # Admin-only route guard
        │   │   ├── Loader.js          # Loading spinner
        │   │   ├── ProductCard.js     # Reusable product card
        │   │   └── ProtectedRoute.js  # Auth route guard
        │   └── layout/
        │       ├── Navbar.js          # Top navigation
        │       └── Footer.js          # Site footer
        ├── pages/
        │   ├── admin/
        │   │   ├── AdminDashboard.js  # Stats & overview
        │   │   ├── AdminProducts.js   # Product list & delete
        │   │   ├── AdminProductForm.js # Add/edit product
        │   │   ├── AdminOrders.js     # Order management
        │   │   └── AdminUsers.js      # User management
        │   ├── HomePage.js
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   ├── ProductsPage.js        # With filters & pagination
        │   ├── ProductDetailPage.js   # Reviews, add to cart
        │   ├── CartPage.js
        │   ├── WishlistPage.js
        │   ├── CheckoutPage.js        # 3-step checkout
        │   ├── OrderSuccessPage.js
        │   ├── ProfilePage.js         # Edit profile/address/password
        │   ├── MyOrdersPage.js
        │   └── OrderDetailPage.js
        ├── store/
        │   ├── store.js               # Redux store config
        │   └── slices/
        │       ├── authSlice.js
        │       ├── productSlice.js
        │       ├── cartSlice.js
        │       ├── wishlistSlice.js
        │       └── orderSlice.js
        ├── utils/
        │   └── axios.js               # Axios instance + interceptors
        ├── App.js                     # Routes
        └── index.js                   # Entry point
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/shopwave.git
cd shopwave
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=30d
NODE_ENV=development
```

#### MongoDB Atlas (Cloud) Setup
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Click **Connect** → **Connect your application**
4. Copy the connection string
5. Replace `MONGO_URI` in your `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   ```

#### Seed the Database (Optional but Recommended)

```bash
npm run seed
```

This creates:
- **6 categories** (Electronics, Clothing, Books, etc.)
- **12 sample products** with real images
- **Admin account**: `admin@shopwave.com` / `admin123`
- **Test user**: `john@example.com` / `admin123`

#### Start Backend

```bash
npm run dev      # Development (with nodemon)
npm start        # Production
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Start Frontend

```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products (filters, pagination) | Public |
| GET | `/api/products/featured` | Get featured products | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| POST | `/api/products/:id/reviews` | Add review | Private |

### Cart
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cart` | Get user cart | Private |
| POST | `/api/cart` | Add item to cart | Private |
| PUT | `/api/cart/:productId` | Update item quantity | Private |
| DELETE | `/api/cart/:productId` | Remove item | Private |
| DELETE | `/api/cart` | Clear cart | Private |

### Wishlist
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/wishlist` | Get wishlist | Private |
| POST | `/api/wishlist/:productId` | Add to wishlist | Private |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist | Private |

### Orders
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders` | Create order | Private |
| GET | `/api/orders/my-orders` | Get my orders | Private |
| GET | `/api/orders/:id` | Get order by ID | Private |
| PUT | `/api/orders/:id/pay` | Mark as paid (dummy) | Private |
| GET | `/api/orders` | Get all orders | Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |

### Users (Admin)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| PUT | `/api/users/profile` | Update own profile | Private |

### Upload
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/upload` | Upload single image | Admin |
| POST | `/api/upload/multiple` | Upload multiple images | Admin |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/dashboard` | Get dashboard stats | Admin |

---

## 💳 Payment Integration

Currently uses a **dummy payment** system. To integrate a real payment gateway:

**Stripe** — Update `orderController.js` → `updateOrderToPaid`:

```js
// Install: npm install stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(order.totalPrice * 100),
  currency: 'usd',
});

order.paymentResult = {
  id: paymentIntent.id,
  status: paymentIntent.status,
  ...
};
```

**Razorpay** — Similar structure, replace with Razorpay SDK.

---

## 🚀 Push to GitHub

```bash
# In the root ecommerce/ folder
git init
git add .
git commit -m "feat: initial commit - full stack ecommerce app"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/shopwave.git
git branch -M main
git push -u origin main
```

---

## 🛠️ Tech Stack

**Frontend**
- React.js 18
- Redux Toolkit + React-Redux
- Material UI (MUI) v5
- Axios
- React Router DOM v6
- React Toastify

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Multer (image upload)
- dotenv + cors

---

## 📸 Default Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopwave.com | admin123 |
| User | john@example.com | admin123 |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first.

---

## 📄 License

MIT License — free to use for personal and commercial projects.

---

> Built with ❤️ using React, Node.js, and MongoDB
