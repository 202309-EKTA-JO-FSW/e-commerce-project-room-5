const express = require("express");
const router = express.Router();
const customerCtrl = require("../controller/customerCtrl");
const customerAuthMiddleware = require("../middlewares/customerAuthMiddleware");

// Route for customer sign-up
router.post("/signup", customerCtrl.signUp);

// Route for customer sign-in
router.post("/signin", customerCtrl.signIn);

// Route for customer sign-out
router.post("/signout", customerCtrl.signOut);

router.get(
  "/profile",
  customerAuthMiddleware.authenticateCustomer,
  customerCtrl.getProfile
);

/////functionalities

router.get(
  "/shop-items",
  customerAuthMiddleware.authenticateCustomer,
  customerCtrl.getAllShopItems
);

//filter
router.get(
  "/shop-items/search",
  customerAuthMiddleware.authenticateCustomer,
  customerCtrl.searchShopItems
);

//cart
router.post(
  "/cart",
  customerAuthMiddleware.authenticateCustomer,
  customerCtrl.addToCart
);

//checkout
router.post(
  "/checkout",
  customerAuthMiddleware.authenticateCustomer,
  customerCtrl.checkout
);

//item by id
router.get(
  "/shop-items/:itemId",
  customerAuthMiddleware.authenticateCustomer,
  customerCtrl.getShopItemById
);

//old order checking
router.get(
  "/orders/:customerId",
  customerAuthMiddleware.authenticateCustomer,
  customerCtrl.getCustomerOrders
);

//
// Route to get the customer's cart
router.get(
  "/cart/:customerId",
  customerAuthMiddleware.authenticateCustomer,
  customerCtrl.getCustomerCart
);

module.exports = router;
