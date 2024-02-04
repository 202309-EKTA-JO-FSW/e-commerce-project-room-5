const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const Admin = require("../models/adminModel");

// Sign in admin
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id }, config.secretKey, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Sign out admin
exports.signOut = async (req, res) => {
  try {
    // Clear session or token on the client side
    // For sessions: destroy the session
    req.session.destroy();

    // For tokens: clear the token stored on the client side (e.g., remove from localStorage)
    // Example if using JWT:
    // localStorage.removeItem('token');

    res.json({ message: "Successfully signed out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create new admin account
exports.createNewAdmin = async (req, res) => {
  try {
    // Extract necessary data from the request body
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    // Create a new admin account
    const newAdmin = await Admin.create({ email, password });

    // Generate token
    const token = jwt.sign({ id: newAdmin._id }, config.secretKey, {
      expiresIn: "1h",
    });

    // Respond with success message and token
    res.status(201).json({
      message: "New admin account created successfully",
      admin: newAdmin,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
