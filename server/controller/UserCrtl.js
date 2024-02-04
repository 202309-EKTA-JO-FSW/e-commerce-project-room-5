// server/controller/authCtrl.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const User = require("../models/userModel");

// Sign in
exports.signIn = async (req, res) => {
  try {
    // Sign in logic for regular users
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Sign out
exports.signOut = async (req, res) => {
  try {
    // Clear session or token on the client side
    res.json({ message: "Successfully signed out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
