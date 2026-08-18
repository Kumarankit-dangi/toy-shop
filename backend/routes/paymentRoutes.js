const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE RAZORPAY ORDER
router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount",
            });
        }

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(201).json({
            success: true,
            order,
        });

    } catch (error) {
        console.error("Razorpay Order Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
// GET RAZORPAY PUBLIC KEY
router.get("/key", (req, res) => {
    res.json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID
    });
});

module.exports = router;