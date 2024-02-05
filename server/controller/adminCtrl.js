const ShopItem = require("../models/ShopItem");

const getShopItems = async (req, res) => {
    try {
      const shopItems = await ShopItem.find();
      res.json(shopItems);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
// Add new shop item
const addShopItem = async (req, res) => {
  try {
    // Extract shop item details from request body
    const { title, image, price, description, availableCount, genre } = req.body;

    // Create new shop item
    const newItem = new ShopItem({
      title,
      image,
      price,
      description,
      availableCount,
      genre
    });

    // Save new shop item to database
    await newItem.save();

    res.status(201).json({ message: "Shop item added successfully", newItem });
  } catch (error) {
    console.error("Error adding shop item:", error);
    res.status(500).json({ message: "Internal server error" });
  }

};

// Update shop item details
const updateShopItem = async (req, res) => {
  try {
    // Extract shop item ID and updated details from request body
    const { itemId } = req.params;
    const {title, description, price, availableCount, genre } = req.body;

    // Find shop item by ID and update its details
    const updatedItem = await ShopItem.findByIdAndUpdate(
      itemId,
      { title ,description, price, availableCount, genre },
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

// Delete shop item
const deleteShopItem = async (req, res) => {
  try {
    // Extract shop item ID from request parameters
    const { itemId } = req.params;

    // Find shop item by ID and delete it
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

// Search for shop items based on different properties
const searchShopItems = async (req, res) => {
  try {
    // Extract search criteria from request query parameters
    const { title, genre } = req.query;

    // Construct query object based on search criteria
    const query = {};
    if (title) query.title = title;
    if (genre) query.genre = genre;

    // Find shop items matching the search criteria
    const shopItems = await ShopItem.find(query);

    res.json(shopItems);
  } catch (error) {
    console.error("Error searching for shop items:", error);
    res.status(500).json({ message: "Internal server error" });
  }

};

module.exports = {
  addShopItem,
  updateShopItem,
  deleteShopItem,
  searchShopItems,
  getShopItems
};