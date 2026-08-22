const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
},

phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true,
},

isVerified: {
    type: Boolean,
    default: false,
},
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Password hash hone se pehle
userSchema.pre("save", async function (next) {

  // Agar password change nahi hua
  // to dobara hash mat karo
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );

  next();
});

module.exports = mongoose.model("User", userSchema);