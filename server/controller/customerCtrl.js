const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const Customer = require("../models/customerModel");
const ShopItem = require("../models/ShopItem");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

exports.getProfile = async (req, res) => {
  try {
    // extract customer object from request
    const customer = req.customer;

    // respond with the customer's profile information
    res.json({ customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isValidPassword = await bcrypt.compare(password, customer.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: customer._id }, config.secretKey, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.signOut = async (req, res) => {
  try {
    //no session ever exists

    res.json({ message: "Successfully signed out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // check if customer with the same email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ message: "Customer with this email already exists" });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new customer account
    const newCustomer = await Customer.create({
      email,
      password: hashedPassword,
    });

    // generate token
    const token = jwt.sign({ id: newCustomer._id }, config.secretKey, {
      expiresIn: "24h",
    });

    // respond with success message and token
    res.status(201).json({
      message: "New customer account created successfully",
      customer: newCustomer,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//////////////////
//CUSTOMER FUNCTIONALITIES
//////////////////
exports.getAllShopItems = async (req, res) => {
  try {
    let query = {};
    if (req.query.category) {
      query.genre = req.query.category;
    }
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
    }
    const shopItems = await ShopItem.find(query);
    res.json(shopItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// search for items
exports.searchShopItems = async (req, res) => {
  try {
    const { query } = req.query;
    const shopItems = await ShopItem.find({
      title: { $regex: query, $options: "i" },
    });

    res.json(shopItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

//addToCart
exports.addToCart = async (req, res) => {
  try {
    // extract customer id, item id, quantity from request body
    const { customerId, itemId, quantity } = req.body;

    // find the shopitem by ID
    const shopItem = await ShopItem.findById(itemId);

    // check if there is enough item available in stock
    if (!shopItem || shopItem.availableCount < quantity) {
      return res
        .status(404)
        .json({ message: "Item insufficient stock or not found" });
    }

    // create or update cart
    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      cart = new Cart({
        customerId,
        items: [{ shopItemId: itemId, quantity }],
      });
    } else {
      // check if the item is Now in the cart
      const itemIndex = cart.items.findIndex(
        (item) => item.shopItemId.toString() === itemId
      );
      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ shopItemId: itemId, quantity });
      }
    }

    // decrement the available count of the shopitem Schema
    shopItem.availableCount -= quantity;
    await shopItem.save();
    await cart.save();

    res.status(201).json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "server error" });
  }
};

//checkout
exports.checkout = async (req, res) => {
  try {
    const { customerId } = req.body;

    const cart = await Cart.findOne({ customerId }).populate(
      "items.shopItemId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let totalBill = 0;
    const orderItems = cart.items.map((item) => {
      totalBill += item.shopItemId.price * item.quantity;
      return {
        itemId: item.shopItemId._id,
        quantity: item.quantity,
        price: item.shopItemId.price,
      };
    });

    const order = new Order({
      customerId,
      items: orderItems,
      totalBill,
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//item by id
exports.getShopItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const shopItem = await ShopItem.findById(itemId);

    if (!shopItem) {
      return res.status(404).json({ message: "Shop item not found" });
    }

    res.json(shopItem);
  } catch (error) {
    console.error("Error getting shop item:", error);
    res.status(500).json({ message: "server error" });
  }
};

//customer old orders
exports.getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;

    // find all orders for the customer
    const orders = await Order.find({ customerId });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//view cart
exports.getCustomerCart = async (req, res) => {
  try {
    const { customerId } = req.params;
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    console.error("Error getting customer cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
