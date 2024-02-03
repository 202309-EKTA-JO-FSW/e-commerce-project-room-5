
const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminCtrl");

// Define admin routes




router.get('/shop-items',adminController.getShopItems);

router.post("/shop-items", adminController.addShopItem);
// Update shop item details
router.put("/shop-items/:itemId", adminController.updateShopItem);

// Delete shop item
router.delete("/shop-items/:itemId", adminController.deleteShopItem);

// Search for shop items based on different properties
router.get("/shop-items/search", adminController.searchShopItems);

module.exports = router;
