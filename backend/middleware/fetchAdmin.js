const jwt = require("jsonwebtoken");
const Users = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

const fetchAdmin = async (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({
      success: false,
      errors: "Please authenticate",
    });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);

    const admin = await Users.findById(data.user.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        errors: "User not found",
      });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        errors: "Access Denied. Admin Only.",
      });
    }

    req.user = data.user;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      errors: "Invalid Token",
    });
  }
};

module.exports = fetchAdmin;