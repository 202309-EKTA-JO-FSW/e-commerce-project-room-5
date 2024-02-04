const express = require("express");
const router = express.Router();
const adminCtrl = require("../controller/adminCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

// Route for admin sign-in
router.post("/signin", adminCtrl.signIn);

// Route for admin sign-out
router.post("/signout", adminCtrl.signOut);

// Route for creating a new admin account (accessible only to admins)
router.post(
  "/new-admin",
  authMiddleware.authenticateAdmin,
  adminCtrl.createNewAdmin
);

// Route for fetching all orders (accessible only to admins)
router.get("/orders", authMiddleware.authenticateAdmin, (req, res) => {
  // Logic to fetch all orders
});

// Route for fetching all customers (accessible only to admins)
router.get("/customers", authMiddleware.authenticateAdmin, (req, res) => {
  // Logic to fetch all customers
});

router.get("/signin", (req, res) => {
  res.render("admin-signin"); // Renders the admin-signin.ejs file
});

// router.post(
//   "/new-admin",
//   authMiddleware.authenticateAdmin,
//   adminCtrl.createNewAdmin
// );

//create first admin

//dummy data

// router.get("/new-admin", (req, res) => {
//   res.send("hello world");
// });

// router.get("/example", (req, res) => {
//   res.send("hello world");
// });

// router.post("/example", (req, res) => {
//   try {
//     // Extract data from request body
//     const { data } = req.body;

//     // Perform some processing with the data

//     // Respond with success message
//     res.status(200).json({ message: "Data received successfully", data });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

module.exports = router;
