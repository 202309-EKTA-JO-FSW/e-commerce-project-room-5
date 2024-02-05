const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerCtrl");

// get all shopitems and filter it by category or price range
router.get("/shop-items", customerController.getAllShopItems);
// search for items
router.get("/shop-items/search", customerController.searchShopItems);
// Get single shopitem information
router.get("/shop-items/:itemId", customerController.getShopItemById);
// Add Shopitem in to Cart
router.post("/cart", customerController.addToCart);
//create order
router.post("/checkout", customerController.checkout);

module.exports = router;