const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Customer = require("../models/customerModel");

module.exports = {
  authenticateCustomer: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Authorization is not included in the request" });
      }

      const decoded = jwt.verify(token, config.secretKey);
      if (!decoded.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const customer = await Customer.findById(decoded.id);
      if (!customer) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.customer = customer;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};
