const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ==========================================
// REGISTER USER
// ==========================================

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });

        }

        // Check existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });

        }

        // Create user
        const user = new User({
            name,
            email: email.toLowerCase(),
            password
        });

        // User.js ka pre-save hook
        // password ko automatically hash karega
        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("Register Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});

module.exports = router;