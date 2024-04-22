const mongoose = require("mongoose");

// User schema
const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    company: { type: String, default: undefined },
    isChangePassword: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//User model
const User = mongoose.model("user", userSchema);

module.exports = User;
