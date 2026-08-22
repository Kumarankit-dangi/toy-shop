const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const VerificationOTP = require("../models/VerificationOTP");

const {
    sendRegistrationOTP
} = require("../utils/emailService");

const router = express.Router();

// =====================================================
// SEND REGISTRATION OTP
// =====================================================

router.post("/send-otp", async (req, res) => {

    try {

        const { contact } = req.body;


        // =================================================
        // VALIDATE CONTACT
        // =================================================

        if (!contact) {

            return res.status(400).json({

                success: false,

                message:
                    "Email or mobile number is required."

            });

        }


        const identifier =
            contact
                .trim()
                .toLowerCase();


        // =================================================
        // DETECT EMAIL
        // =================================================

        const isEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(identifier);


        // =================================================
        // DETECT MOBILE
        // =================================================

        const isMobile =
            /^[0-9]{10}$/
                .test(identifier);


        if (
            !isEmail &&
            !isMobile
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Enter a valid email or 10-digit mobile number."

            });

        }


        // =================================================
        // MOBILE - SMS COMING NEXT
        // =================================================

        if (isMobile) {

            return res.status(501).json({

                success: false,

                message:
                    "Mobile OTP service is not configured yet."

            });

        }


        // =================================================
        // CHECK EXISTING EMAIL
        // =================================================

        const existingUser =
            await User.findOne({
                email: identifier
            });


        if (existingUser) {

            return res.status(409).json({

                success: false,

                message:
                    "An account with this email already exists."

            });

        }


        // =================================================
        // GENERATE OTP
        // =================================================

        const otp =
            generateOTP();


        const otpHash =
            hashOTP(otp);


        // =================================================
        // REMOVE OLD OTP
        // =================================================

        await VerificationOTP.deleteMany({

            identifier,

            purpose: "register"

        });


        // =================================================
        // SAVE OTP
        // =================================================

        await VerificationOTP.create({

            identifier,

            otpHash,

            purpose: "register",

            attempts: 0,

            expiresAt:
                new Date(
                    Date.now() +
                    5 * 60 * 1000
                )

        });


        // =================================================
        // SEND EMAIL
        // =================================================

        await sendRegistrationOTP(
            identifier,
            otp
        );


        console.log(
            `📧 OTP sent to ${identifier}`
        );


        return res.json({

            success: true,

            message:
                "OTP sent successfully."

        });


    } catch (error) {

        console.error(
            "Send OTP Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to send OTP."

        });

    }

});
// =====================================================
// VERIFY REGISTRATION OTP
// =====================================================

router.post("/verify-otp", async (req, res) => {

    try {

        const { contact, otp } = req.body;

        if (!contact || !otp) {

            return res.status(400).json({
                success: false,
                message: "Email and OTP are required."
            });

        }

        const identifier =
            contact.trim().toLowerCase();

        const verification =
            await VerificationOTP.findOne({
                identifier,
                purpose: "register"
            });

        if (!verification) {

            return res.status(400).json({
                success: false,
                message: "OTP expired or not found. Please request a new OTP."
            });

        }

        // Maximum 5 attempts
        if (verification.attempts >= 5) {

            await VerificationOTP.deleteOne({
                _id: verification._id
            });

            return res.status(429).json({
                success: false,
                message: "Too many incorrect attempts. Please request a new OTP."
            });

        }

        const enteredOtpHash =
            hashOTP(
                otp.toString().trim()
            );

        if (
            enteredOtpHash !==
            verification.otpHash
        ) {

            verification.attempts += 1;

            await verification.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });

        }

        // OTP is correct
        await VerificationOTP.deleteOne({
            _id: verification._id
        });

        return res.json({
            success: true,
            message: "OTP verified successfully.",
            verified: true
        });

    } catch (error) {

        console.error(
            "Verify OTP Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "OTP verification failed."
        });

    }

});

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
// =====================================================
// OTP HELPERS
// =====================================================

function generateOTP() {

    return crypto
        .randomInt(100000, 1000000)
        .toString();

}


function hashOTP(otp) {

    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

}

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

        // Get Authorization header

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


        // Extract token

        const token =
            authHeader.split(" ")[1];


        // Verify JWT

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


        // Get users

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
// EXPORT ROUTER
// ==========================================

module.exports = router;