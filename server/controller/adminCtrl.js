const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const ShopItem = require("../models/ShopItem");
const Admin = require("../models/adminModel");
const Customer = require("../models/customerModel");

// sign in admin
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

// sign out
exports.signOut = async (req, res) => {
  try {
    res.json({ message: "Successfully signed out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// new admin
exports.createNewAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const newAdmin = await Admin.create({ email, password });

    const token = jwt.sign({ id: newAdmin._id }, config.secretKey, {
      expiresIn: "1h",
    });

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

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

///////////////////////////
// ADMIN FUNCTIONALITIES
//////////////////////////

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getShopItems = async (req, res) => {
  try {
    const shopItems = await ShopItem.find();
    res.json(shopItems);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
// add new shop item
exports.addShopItem = async (req, res) => {
  try {
    // extract shop item details from request body
    const { title, image, price, description, availableCount, genre } =
      req.body;

    // create new shop item
    const newItem = new ShopItem({
      title,
      image,
      price,
      description,
      availableCount,
      genre,
    });

    // save new shop item to database
    await newItem.save();

    res.status(201).json({ message: "Shop item added successfully", newItem });
  } catch (error) {
    console.error("Error adding shop item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// update shop item details
exports.updateShopItem = async (req, res) => {
  try {
    // extract shop item ID and updated details from request body
    const { itemId } = req.params;
    const { title, description, price, availableCount, genre } = req.body;

    // find shop item by ID and update its details
    const updatedItem = await ShopItem.findByIdAndUpdate(
      itemId,
      { title, description, price, availableCount, genre },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Shop item not found" });
    }

    res.json({ message: "Shop item updated successfully", updatedItem });
  } catch (error) {
    console.error("Error updating shop item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete shop item
exports.deleteShopItem = async (req, res) => {
  try {
    // extract shop item ID from request parameters
    const { itemId } = req.params;

    // find shop item by ID and delete it
    const deletedItem = await ShopItem.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: "Shop item not found" });
    }

    res.json({ message: "Shop item deleted successfully", deletedItem });
  } catch (error) {
    console.error("Error deleting shop item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// search for shop items based on different properties
exports.searchShopItems = async (req, res) => {
  try {
    // extract search criteria from request query parameters
    const { title, genre } = req.query;

    // construct query object based on search criteria
    const query = {};
    if (title) query.title = title;
    if (genre) query.genre = genre;

    // find shop items matching the search criteria
    const shopItems = await ShopItem.find(query);

    res.json(shopItems);
  } catch (error) {
    console.error("Error searching for shop items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
