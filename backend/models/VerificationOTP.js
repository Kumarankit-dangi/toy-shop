const mongoose = require("mongoose");

const verificationOTPSchema = new mongoose.Schema(
    {
        identifier: {
            type: String,
            required: true,
            index: true,
        },

        otpHash: {
            type: String,
            required: true,
        },

        purpose: {
            type: String,
            enum: ["register"],
            default: "register",
        },

        attempts: {
            type: Number,
            default: 0,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


// Automatically remove expired OTP documents
verificationOTPSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);


module.exports = mongoose.model(
    "VerificationOTP",
    verificationOTPSchema
);