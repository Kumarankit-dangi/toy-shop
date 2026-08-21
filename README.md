# 🧸 Toyland - Full Stack Toy Shop

A modern full-stack e-commerce website for browsing and purchasing toys online.

## 🌐 Live Demo

Frontend:
https://toy-shop-wine.vercel.app/index.html

Backend API:
https://toy-shop-backend.onrender.com

## ✨ Features
## 📸 Screenshots

### 🏠 Homepage

![Toyland Homepage](screenshots/homepage.png)

### 🛍️ Shop

![Toyland Shop](screenshots/shop.png)

### 🛒 Cart

![Toyland Cart](screenshots/cart.png)

### 🔐 Login

![Toyland Login](screenshots/login.png)

### 👨‍💼 Admin Dashboard

![Toyland Admin Dashboard](screenshots/admin-dashboard.png)

### 👤 User Features
- User registration
- User login/logout
- JWT authentication
- Browse products
- Product search/filter
- Product details
- Add to cart
- Wishlist
- Checkout
- Order creation
- My Orders

### 👨‍💼 Admin Features
- Admin authentication
- Admin dashboard
- Add products
- Edit products
- Delete products
- Manage users
- Manage orders
- Update order status

### 💳 Payment
- Razorpay integration
- Server-side payment order creation

### 🔐 Security
- JWT authentication
- Protected admin routes
- Helmet security headers
- API rate limiting
- CORS configuration
- Environment variables for secrets
- MongoDB authentication

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Token (JWT)

### Payment
- Razorpay

### Deployment
- Vercel - Frontend
- Render - Backend
- MongoDB Atlas - Database

## 📁 Project Structure

```text
toy-shop/
│
├── assets/
│   ├── css/
│   ├── images/
│   └── js/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── pages/
│   ├── admin/
│   ├── cart.html
│   ├── login.html
│   ├── register.html
│   ├── shop.html
│   └── my-orders.html
│
├── index.html
├── package.json
└── README.md