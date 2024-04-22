const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");

async function registerAdmin(req, res) {
  const { email, password } = req.body;
  try {
    //Validating inputs
    if (!email || !password) throw new Error("Empty fields");
    if (typeof email !== "string" || typeof password !== "string")
      throw new Error("Invalid data types it should be string");

    //Finding existing admin from database
    const adminData = await Admin.findOne({ email });
    const allAdminData = await Admin.find();

    if (adminData)
      return res.send({
        message: "failed",
        data: "Admin already registered",
      });

    if (allAdminData.length)
      return res.send({
        message: "failed",
        data: "More than one admin cannot be registered",
      });

    //Creating admin account
    const result = await Admin.create({
      email,
      password: await hashPassword(password),
    });

    if (!result) throw new Error("Admin not registered");

    res.status(201).send({
      message: "success",
      data: "Admin registered successfully",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function adminLogin(req, res) {
  const { email, password } = req.body;

  try {
    //Validating inputs
    if (!email || !password) throw new Error("Empty fields");
    if (typeof email !== "string" || typeof password !== "string")
      throw new Error("Invalid data types it should be string");

    //Finding admin from database
    const adminData = await Admin.findOne({ email });
    if (!adminData) throw new Error("Admin not found");

    //Matching the passwords
    const result = await bcrypt.compare(password, adminData.password);
    if (!result) throw new Error("Invalid credentials");

    res.status(200).send({
      token: generateJWT(null, null, email),
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

//Genereate JWT
function generateJWT(firstname, lastname, email) {
  return jwt.sign({ firstname, lastname, email }, process.env.JWT_SECERET);
}

// Hashing password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

module.exports = { registerAdmin, adminLogin };
