const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();


// =====================================================
// SECURITY
// =====================================================

app.use(helmet());


// =====================================================
// CORS
// =====================================================

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true
    })
);


// =====================================================
// BODY PARSER
// =====================================================

app.use(
    express.json({
        limit: "1mb"
    })
);


// =====================================================
// GENERAL API RATE LIMIT
// =====================================================

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use("/api", apiLimiter);


// =====================================================
// ROUTES
// =====================================================

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);


// =====================================================
// TEST ROUTES
// =====================================================

app.get("/api/orders-test", (req, res) => {

    console.log("🔥 ORDER TEST ROUTE HIT");

    res.json({
        success: true,
        message: "Order route is working"
    });

});


app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message: "API Working"
    });

});


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {

    res.send("🚀 Toy Shop Backend Running Successfully");

});


// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });

});


// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

    console.error("Server Error:", err.message);

    res.status(err.status || 500).json({
        success: false,
        message: "Internal server error"
    });

});


// =====================================================
// SERVER START
// =====================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {

        await connectDB();

        app.listen(PORT, () => {

            console.log(`🚀 Server Running on Port ${PORT}`);

        });

    } catch (error) {

        console.error("❌ Failed to start server:", error.message);

        process.exit(1);

    }

};

startServer();