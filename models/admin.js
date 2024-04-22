const mongoose = require("mongoose");

// User schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//User model
const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
