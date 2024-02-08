const express = require("express");
const router = express.Router();
const adminCtrl = require("../controller/adminCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

// route for admin sign-in
router.post("/signin", adminCtrl.signIn);

// route for admin sign-out
router.post("/signout", adminCtrl.signOut);

// route for creating a new admin account (accessible only to admins)
router.post(
  "/new-admin",
  authMiddleware.authenticateAdmin,
  adminCtrl.createNewAdmin
);

// route for fetching all customers (accessible only to admins)
router.get(
  "/customers",
  authMiddleware.authenticateAdmin,
  adminCtrl.getAllCustomers
);

//ignore
router.get("/signin", (req, res) => {
  res.render("hi im working");
});

//////////////////////
//ADMIN FUNCTIONALITIES
///////////////////////

// route for getting shop items (accessible only to admins)
router.get(
  "/shop-items",
  authMiddleware.authenticateAdmin,
  adminCtrl.getShopItems
);

// route for adding a new shop item (accessible only to admins)
router.post(
  "/shop-items",
  authMiddleware.authenticateAdmin,
  adminCtrl.addShopItem
);

// route for updating a shop item (accessible only to admins)
router.put(
  "/shop-items/:itemId",
  authMiddleware.authenticateAdmin,
  adminCtrl.updateShopItem
);

// route for deleting a shop item (accessible only to admins)
router.delete(
  "/shop-items/:itemId",
  authMiddleware.authenticateAdmin,
  adminCtrl.deleteShopItem
);

// route for searching shop items (accessible only to admins)
router.get(
  "/shop-items/search",
  authMiddleware.authenticateAdmin,
  adminCtrl.searchShopItems
);

module.exports = router;
