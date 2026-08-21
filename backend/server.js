const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// ORDER TEST ROUTE
app.get("/api/orders-test", (req, res) => {
  console.log("🔥 ORDER TEST ROUTE HIT");

  res.json({
    success: true,
    message: "Order route is working"
  });
});

// API TEST
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API Working"
  });
});

// HOME
app.get("/", (req, res) => {
  res.send("🚀 Toy Shop Backend Running Successfully");
});

console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);
console.log("Razorpay Key Loaded:", !!process.env.RAZORPAY_KEY_ID);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});