const Users = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
// =====================================
// PLACE ORDER
// =====================================
const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const userData = await Users.findById(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        console.log("=================================");
        console.log("PLACE ORDER USER:", userData.email);
        console.log("PLACE ORDER USER ID:", userId);
        console.log("PLACE ORDER CART DATA:", userData.cartData);
        console.log("=================================");
        const cartData = userData.cartData || {};
        const products = [];
        let subtotal = 0;
        // =====================================
        // CONVERT CART INTO PRODUCTS
        // =====================================
        const cartEntries = Object.entries(cartData);
        for (const [itemId, itemQuantity] of cartEntries) {
            const quantity = Number(itemQuantity);
            const productId = Number(itemId);
            console.log(
                `Checking cart product ${productId}, quantity ${quantity}`
            );
            if (
                !Number.isFinite(productId) ||
                quantity <= 0
            ) {
                continue;
            }
            const product = await Product.findOne({
                id: productId
            });
            if (!product) {
                console.log(
                    `Product ${productId} not found in Product collection`
                );
                continue;
            }
            products.push({
                productId: product.id,
                productName: product.name,
                image: product.image,
                price: product.new_price,
                quantity: quantity
            });
            subtotal +=
                product.new_price * quantity;
        }
        console.log(
            "ORDER PRODUCTS:",
            products
        );
        console.log(
            "ORDER SUBTOTAL:",
            subtotal
        );
        if (products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }
        // =====================================
        // DELIVERY ADDRESS
        // =====================================
        const deliveryAddress =
            req.body.deliveryAddress || {};
        const customerName =
            req.body.customerName ||
            deliveryAddress.customerName ||
            userData.name;
        const customerMobile =
            req.body.customerMobile ||
            deliveryAddress.customerMobile ||
            userData.mobile;
        if (
            !customerMobile ||
            customerMobile === "undefined" ||
            customerMobile === "null"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Customer mobile number is required"
            });
        }
        // =====================================
        // COUPON / FINAL AMOUNT
        // =====================================
        const originalAmount = subtotal;
        const couponCode =
            req.body.couponCode || "";
        const discountPercentage =
            Number(req.body.discount) || 0;
        const discountAmount =
            Number(req.body.discountAmount) || 0;
        let totalAmount =
            Number(req.body.finalAmount);
        if (!Number.isFinite(totalAmount)) {
            totalAmount =
                originalAmount -
                discountAmount;
        }
        if (totalAmount < 0) {
            totalAmount = 0;
        }
        // =====================================
        // CREATE ORDER
        // =====================================
        const order = new Order({
            userId: userData._id,
            customerName: customerName,
            customerEmail: userData.email,
            customerMobile: customerMobile,
            deliveryAddress: {
                house:
                    deliveryAddress.house || "",
                street:
                    deliveryAddress.street || "",
                city:
                    deliveryAddress.city || "",
                state:
                    deliveryAddress.state || "",
                pincode:
                    deliveryAddress.pincode || "",
                landmark:
                    deliveryAddress.landmark || ""
            },
            products: products,
            // PRICE INFORMATION
            originalAmount:
                originalAmount,
            couponCode:
                couponCode,
            discountPercentage:
                discountPercentage,
            discountAmount:
                discountAmount,
            totalAmount:
                totalAmount,
            // PAYMENT INFORMATION
            paymentStatus:
                req.body.paymentStatus ||
                "Pending",
            razorpayOrderId:
                req.body.razorpayOrderId ||
                "",
            razorpayPaymentId:
                req.body.razorpayPaymentId ||
                "",
            paymentTime:
                req.body.paymentTime
                    ? new Date(
                        req.body.paymentTime
                    )
                    : null,
            // ORDER STATUS
            orderStatus: "Pending"
        });
        await order.save();
        console.log(
            "ORDER CREATED:",
            order._id
        );
        // =====================================
        // CLEAR CART
        // =====================================
        userData.cartData = {};
        await userData.save();
        console.log(
            "USER CART CLEARED AFTER ORDER"
        );
        res.json({
            success: true,
            message:
                "Order placed successfully",
            order: order
        });
    } catch (error) {
        console.error(
            "Place Order Error:",
            error
        );
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// =====================================
// GET USER ORDERS
// =====================================
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({
            userId: userId,

            orderStatus: {
                $ne: "Cancelled"
            }
        }).sort({
            createdAt: -1
        });
        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error(
            "Get My Orders Error:",
            error
        );
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =====================================
// GET ALL ORDERS - ADMIN
// =====================================
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            orderStatus: {
                $ne: "Cancelled"
            }
        }).sort({
            createdAt: -1
        });
        console.log(
            orders.map(order => ({
                id: order._id,
                status: order.orderStatus
            }))
        );
        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error(
            "Get All Orders Error:",
            error
        );
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// =====================================
// UPDATE ORDER STATUS
// =====================================
const updateOrderStatus = async (req, res) => {
    try {
        const {
            orderId
        } = req.params;
        const {
            status
        } = req.body;
        console.log(
            "Updating Order:",
            orderId
        );
        console.log(
            "New Status:",
            status
        );
        const allowedStatuses = [
            "Pending",
            "Approved",
            "Packed",
            "Shipped",
            "Out For Delivery",
            "Delivered",
            "Cancelled"
        ];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid order status"
            });
        }
        const order =
            await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message:
                    "Order not found"
            });
        }
        order.orderStatus = status;
        await order.save();
        console.log(
            `Order ${orderId} status changed to ${status}`
        );
        res.json({
            success: true,
            message:
                "Order status updated successfully",

            order: order
        });
    } catch (error) {
        console.error(
            "Update Order Status Error:",
            error
        );
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// =====================================
// APPROVE ORDER
// Compatibility endpoint
// =====================================
const approveOrder = async (req, res) => {
    try {
        const {
            orderId
        } = req.body;
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message:
                    "Order ID is required"
            });
        }
        const order =
            await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message:
                    "Order not found"
            });
        }
        order.orderStatus = "Approved";
        await order.save();
        res.json({
            success: true,
            message: "Order Approved",
            order: order
        });
    } catch (error) {
        console.error(
            "Approve Order Error:",
            error
        );
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// =====================================
// DELETE ORDER - ADMIN
// =====================================
const deleteOrder = async (req, res) => {
    try {
        const {
            orderId
        } = req.body;
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message:
                    "Order ID is required"
            });
        }
        const order =
            await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message:
                    "Order not found"
            });
        }
        await Order.findByIdAndDelete(
            orderId
        );
        res.json({
            success: true,
            message:
                "Order deleted successfully"
        });
    } catch (error) {
        console.error(
            "Delete Order Error:",
            error
        );
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// =====================================
// EXPORT
// =====================================
module.exports = {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    approveOrder,
    deleteOrder
};