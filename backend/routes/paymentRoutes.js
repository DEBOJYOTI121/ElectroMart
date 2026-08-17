const express = require("express");

const router = express.Router();

const {
    createRazorpayOrder,
    verifyPayment
} = require("../controllers/paymentController");


// Create Razorpay order
router.post(
    "/create-razorpay-order",
    createRazorpayOrder
);


// Verify Razorpay payment
router.post(
    "/verify-payment",
    verifyPayment
);


module.exports = router;