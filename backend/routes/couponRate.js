const express = require("express");

const router = express.Router();

const fetchAdmin = require("../middleware/fetchAdmin");

const {
    addCoupon,
    getAllCoupons,
    deleteCoupon,
    applyCoupon
} = require("../controllers/couponController");


// Admin - Add Coupon
router.post(
    "/addcoupon",
    fetchAdmin,
    addCoupon
);


// Admin - Get All Coupons
router.get(
    "/allcoupons",
    fetchAdmin,
    getAllCoupons
);


// Admin - Delete Coupon
router.post(
    "/deletecoupon",
    fetchAdmin,
    deleteCoupon
);


// Customer - Apply Coupon
router.post(
    "/applycoupon",
    applyCoupon
);


module.exports = router;