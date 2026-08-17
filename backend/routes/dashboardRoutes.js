const express = require("express");

const router = express.Router();

const fetchAdmin = require("../middleware/fetchAdmin");

const {
    getDashboardStats,
    getMonthlySales
} = require("../controllers/dashboardController");


// Dashboard statistics
router.get(
    "/dashboardstats",
    fetchAdmin,
    getDashboardStats
);


// Monthly sales
router.get(
    "/monthlysales",
    fetchAdmin,
    getMonthlySales
);
module.exports = router;