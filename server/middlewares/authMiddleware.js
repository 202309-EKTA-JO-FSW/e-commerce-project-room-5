const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Admin = require("../models/adminModel");

module.exports = {
  authenticateAdmin: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, config.secretKey);
      if (!decoded.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.admin = admin;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid token" });
      } else if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token expired" });
      } else {
        console.error("Authentication error:", error);
        res.status(500).json({ message: "Server Error" });
      }
    }
  },
};
