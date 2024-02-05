const ShopItem = require("../models/ShopItem");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

// get all shopitems and filter it by category or price range
const getAllShopItems = async (req, res) => {
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
const searchShopItems = async (req, res) => {
    try {
      const { query } = req.query;
      const shopItems = await ShopItem.find({ title: { $regex: query, $options: "i" } });
  
      res.json(shopItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  };


// Add Shopitem in to Cart
  const addToCart = async (req, res) => {
    try {
      // Extract customer ID, item ID, and quantity from request body
      const { customerId, itemId, quantity } = req.body;
  
      // Find the shopitem by ID
      const shopItem = await ShopItem.findById(itemId);
  
      // Check if there is enough item available in stock
      if (!shopItem || shopItem.availableCount < quantity) {
        return res.status(404).json({ message: "Item insufficient stock or not found" });
      }
   
      // Create or update cart 
      let cart = await Cart.findOne({ customerId });

      if (!cart) {
        cart = new Cart({ customerId, items: [{ shopItemId: itemId, quantity }] });
      } else {
        // Check if the item is Now in the cart
        const itemIndex = cart.items.findIndex(item => item.shopItemId.toString() === itemId);
        if (itemIndex !== -1) {
          cart.items[itemIndex].quantity += quantity;
        } else {
          cart.items.push({ shopItemId: itemId, quantity });
        }
      }

      // Decrement the available count of the shopitem Schema
      shopItem.availableCount -= quantity;
      await shopItem.save();
      await cart.save();
  
      res.status(201).json({ message: "Item added to cart successfully", cart });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).json({ message: "server error" });
    }
  };



//create order and checkout
  const checkout = async (req, res) => {
    try {
      const { customerId } = req.body;
  
      const cart = await Cart.findOne({ customerId }).populate("items.shopItemId");
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      let totalBill = 0;
      const orderItems = cart.items.map(item => {
        totalBill += item.shopItemId.price * item.quantity;
        return {
          shopItemId: item.shopItemId._id,
          quantity: item.quantity,
          totalPrice: item.shopItemId.price * item.quantity
        };
      });
  
      const order = new Order({
        customerId,
        items: orderItems,
        totalBill
      });
  
      await order.save();
  
      cart.items = [];
      await cart.save();
  
      res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ message: "server error" });
    }
  };



  // Get single shopitem information
  const getShopItemById = async (req, res) => {
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
  

  

module.exports = {
  getAllShopItems,
  searchShopItems,
  addToCart,
  checkout,
  getShopItemById
}