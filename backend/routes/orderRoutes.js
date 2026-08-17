const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const fetchAdmin = require("../middleware/fetchAdmin");
const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    approveOrder,
    deleteOrder
} = require("../controllers/orderController");
// =====================================
// CUSTOMER ORDERS
// =====================================
// Place Order
router.post(
    "/placeorder",
    fetchUser,
    placeOrder
);
// My Orders
router.get(
    "/myorders",
    fetchUser,
    getMyOrders
);
// =====================================
// ADMIN ORDERS
// =====================================
// Get All Orders
router.get(
    "/allorders",
    fetchAdmin,
    getAllOrders
);
// Approve Order
router.post(
    "/approveorder",
    fetchAdmin,
    approveOrder
);
// Update Order Status
router.put(
    "/updateorderstatus/:orderId",
    fetchAdmin,
    updateOrderStatus
);
// Delete Order
router.post(
    "/deleteorder",
    fetchAdmin,
    deleteOrder
);
module.exports = router;