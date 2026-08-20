const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


// ==========================================
// REGISTER USER
// ==========================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, email and password are required"

            });

        }


        const existingUser =
            await User.findOne({

                email:
                    email.toLowerCase()

            });


        if (existingUser) {

            return res.status(400).json({

                success: false,

                message:
                    "User already exists"

            });

        }


        const user =
            new User({

                name,

                email:
                    email.toLowerCase(),

                password

            });


        await user.save();


        res.status(201).json({

            success: true,

            message:
                "User registered successfully",

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role

            }

        });


    } catch (error) {

        console.error(
            "Register Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

});


// ==========================================
// LOGIN USER
// ==========================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"

            });

        }


        const user =
            await User.findOne({

                email:
                    email.toLowerCase()

            });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        const token =
            jwt.sign(

                {

                    userId:
                        user._id,

                    role:
                        user.role

                },

                process.env.JWT_SECRET,

                {

                    expiresIn:
                        "7d"

                }

            );


        res.json({

            success: true,

            message:
                "Login successful",

            token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role

            }

        });


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

});


// ==========================================
// GET ALL USERS
// ADMIN ONLY
// ==========================================

router.get("/users", async (req, res) => {

    try {

        // Get token
        const authHeader =
            req.headers.authorization;


        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required"

            });

        }


        const token =
            authHeader.split(" ")[1];


        // Verify token
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Check admin role
        if (
            decoded.role !== "admin"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Admin access required"

            });

        }


        // Get users from MongoDB
        const users =
            await User.find({})
                .select(
                    "_id name email role createdAt"
                )
                .sort({
                    createdAt: -1
                });


        res.json({

            success: true,

            count:
                users.length,

            users

        });


    } catch (error) {

        console.error(
            "Get Users Error:",
            error
        );


        if (
            error.name ===
            "JsonWebTokenError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid token"

            });

        }


        if (
            error.name ===
            "TokenExpiredError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Token expired"

            });

        }


        res.status(500).json({

            success: false,

            message:
                "Failed to get users"

        });

    }

});


// ==========================================
// TEMPORARY ADMIN SETUP
// ==========================================
// USE THIS ONLY ONCE
// REMOVE THIS ROUTE AFTER ADMIN IS CREATED
// ==========================================

router.post("/setup-admin", async (req, res) => {

    try {

        const {
            setupKey
        } = req.body;


        // Check secret key
        if (
            !setupKey ||
            setupKey !==
                process.env.ADMIN_SETUP_KEY
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Unauthorized"

            });

        }


        const email =
            "admin@toyland.com";


        const password =
            "Admin@12345";


        // Check whether admin already exists
        let user =
            await User.findOne({

                email

            });


        if (user) {

            user.role =
                "admin";


            await user.save();


            console.log(
                "👑 Existing user promoted to admin"
            );

        } else {

            user =
                new User({

                    name:
                        "Toyland Admin",

                    email,

                    password,

                    role:
                        "admin"

                });


            await user.save();


            console.log(
                "👑 New admin account created"
            );

        }


        res.json({

            success: true,

            message:
                "Admin account created/updated successfully",

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role

            }

        });


    } catch (error) {

        console.error(
            "Admin Setup Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Admin setup failed"

        });

    }

});


module.exports = router;