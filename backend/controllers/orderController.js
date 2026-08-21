const Users = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const sendEmail = require("../utils/emailService");
const orderStatusTemplate = require("../templates/orderStatusTemplate");
const orderPlacedTemplate = require("../templates/orderPlacedTemplate");
// =====================================
// PLACE ORDER
// =====================================
const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const userData =
            await Users.findById(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // =====================================
        // PAYMENT INFORMATION
        // =====================================
        const razorpayOrderId =
            req.body.razorpayOrderId || "";
        const razorpayPaymentId =
            req.body.razorpayPaymentId || "";
        // =====================================
        // DUPLICATE PAYMENT PROTECTION
        // =====================================
        if (razorpayPaymentId) {
            const existingOrder =
                await Order.findOne({
                    razorpayPaymentId:
                        razorpayPaymentId
                });
            if (existingOrder) {
                console.log(
                    "DUPLICATE PAYMENT DETECTED:",
                    razorpayPaymentId
                );
                return res.json({
                    success: true,
                    message:
                        "Order already exists for this payment",
                    order:
                        existingOrder,
                    duplicate: true
                });
            }
        }
        // =====================================
        // CHECKOUT SNAPSHOT
        // =====================================
        const checkoutItems =
            Array.isArray(
                req.body.checkoutItems
            )
                ? req.body.checkoutItems
                : [];
        console.log(
            "================================="
        );
        console.log(
            "PLACE ORDER USER:",
            userData.email
        );
        console.log(
            "PLACE ORDER USER ID:",
            userId
        );
        console.log(
            "CHECKOUT ITEMS RECEIVED:",
            checkoutItems
        );
        console.log("PLACE ORDER CART DATA:", userData.cartData);
        console.log("ORDER EMAIL:", userData.email);
        console.log(
            "RAZORPAY ORDER ID:",
            razorpayOrderId
        );
        console.log(
            "RAZORPAY PAYMENT ID:",
            razorpayPaymentId
        );
        console.log(
            "================================="
        );
        if (
            checkoutItems.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Checkout items are missing"
            });
        }
        // =====================================
        // CONVERT CHECKOUT ITEMS INTO ORDER
        // =====================================
        const products = [];
        let subtotal = 0;
        for (
            const item of checkoutItems
        ) {
            const productId =
                Number(item.productId);
            const quantity =
                Number(item.quantity);
            console.log(
                "Processing checkout item:",
                {
                    productId,
                    quantity
                }
            );
            if (
                !Number.isFinite(productId) ||
                !Number.isFinite(quantity) ||
                quantity <= 0
            ) {
                continue;
            }
            const product =
                await Product.findOne({
                    id: productId
                });
            if (!product) {
                console.log(
                    `Product ${productId} not found`
                );
                continue;
            }
            const itemTotal =
                Number(product.new_price) *
                quantity;
            products.push({
                productId:
                    product.id,
                productName:
                    product.name,
                image:
                    product.image,
                price:
                    product.new_price,
                quantity:
                    quantity
            });
            subtotal +=
                itemTotal;
        }
        console.log(
            "FINAL ORDER PRODUCTS:",
            products
        );
        console.log(
            "CALCULATED SUBTOTAL:",
            subtotal
        );
        // =====================================
        // VALIDATE PRODUCTS
        // =====================================
        if (products.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "No valid products found"
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
        const originalAmount =
            Number(subtotal.toFixed(2));
        const couponCode =
            req.body.couponCode || "";
        const discountPercentage =
            Number(req.body.discount) || 0;
        /*
          Calculate discount from the actual
          checkout products.
          Do NOT use the stale database cart.
        */
        let calculatedDiscountAmount =
            (
                originalAmount *
                discountPercentage
            ) / 100;
        calculatedDiscountAmount =
            Number(
                calculatedDiscountAmount.toFixed(2)
            );
        /*
          Use the calculated value when a
          percentage discount exists.
          This prevents the order from becoming:
          Original: ₹4860
          Discount: ₹3822
          Total: ₹8918
          which was your current problem.
        */
        let finalDiscountAmount =
            calculatedDiscountAmount;
        /*
          If no percentage discount exists,
          preserve zero.
        */
        if (
            discountPercentage <= 0
        ) {
            finalDiscountAmount = 0;
        }
        let totalAmount =
            Number(
                (
                    originalAmount -
                    finalDiscountAmount
                ).toFixed(2)
            );
        if (totalAmount < 0) {
            totalAmount = 0;
        }
        // =====================================
        // OPTIONAL CLIENT AMOUNT CHECK
        // =====================================
        const clientFinalAmount =
            Number(req.body.finalAmount);
        if (
            Number.isFinite(
                clientFinalAmount
            )
        ) {
            const difference =
                Math.abs(
                    clientFinalAmount -
                    totalAmount
                );
            if (difference > 1) {
                console.error(
                    "PAYMENT AMOUNT MISMATCH",
                    {
                        clientFinalAmount,
                        serverCalculatedAmount:
                            totalAmount,
                        originalAmount,
                        discountPercentage,
                        finalDiscountAmount
                    }
                );
                return res.status(400).json({
                    success: false,
                    message:
                        "Order amount does not match checkout amount"
                });
            }

        }
        // =====================================
        // CREATE ORDER
        // =====================================
        const order =
            new Order({
                userId:
                    userData._id,
                customerName:
                    customerName,
                customerEmail:
                    userData.email,
                customerMobile:
                    customerMobile,
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
                products:
                    products,
                // =====================================
                // PRICE INFORMATION
                // =====================================
                originalAmount:
                    originalAmount,
                couponCode:
                    couponCode,
                discountPercentage:
                    discountPercentage,
                discountAmount:
                    finalDiscountAmount,
                totalAmount:
                    totalAmount,
                // =====================================
                // PAYMENT INFORMATION
                // =====================================
                paymentStatus:
                    req.body.paymentStatus ||
                    "Pending",
                razorpayOrderId:
                    razorpayOrderId,
                razorpayPaymentId:
                    razorpayPaymentId,
                paymentTime:
                    req.body.paymentTime
                        ? new Date(
                            req.body.paymentTime
                        )
                        : null,
                // =====================================
                // ORDER STATUS
                // =====================================
                orderStatus:
                    "Pending"

            });
        // =====================================
        // SAVE ORDER
        // =====================================
        try {
            await order.save();
        } catch (saveError) {
            // =====================================
            // DUPLICATE RAZORPAY PAYMENT
            // =====================================
            if (
                saveError.code === 11000 &&
                razorpayPaymentId
            ) {
                const existingOrder =
                    await Order.findOne({
                        razorpayPaymentId:
                            razorpayPaymentId
                    });
                if (existingOrder) {
                    console.log(
                        "DUPLICATE ORDER PREVENTED:",
                        razorpayPaymentId
                    );
                    return res.json({
                        success: true,
                        message:
                            "Order already exists for this payment",
                        order:
                            existingOrder,
                        duplicate: true
                    });
                }

            }

            throw saveError;
        }
        console.log(
        "ORDER CREATED:",
        order._id
      );

    // =====================================
    // SEND ORDER PLACED EMAIL
    // =====================================
    try {
    const emailHtml =
        orderPlacedTemplate(order);
    await sendEmail({
        to:
            order.customerEmail,
        subject:
            `Electro Mart - Order Placed #${order._id
                .toString()
                .slice(-6)
                .toUpperCase()}`,
        html:
            emailHtml
    });
    console.log(
        `Order placed email sent to ${order.customerEmail}`
    );
   } catch (emailError) {
    console.error(
        "Order placed email failed:",
        emailError
    );
   }
   // =====================================
   // CLEAR CART
   // =====================================

        // =====================================
        // CLEAR CART ONLY AFTER ORDER SAVED
        // =====================================
        userData.cartData = {};
        await userData.save();
        console.log(
            "USER CART CLEARED AFTER ORDER"
        );
        // =====================================
        // RESPONSE
        // =====================================
        return res.json({
            success: true,
            message:
                "Order placed successfully",
            order:
                order
        });
    } catch (error) {
        console.error(
            "Place Order Error:",
            error
        );
        return res.status(500).json({
            success: false,
            message:
                error.message
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
        // Send order status email
        try {
            console.log("=================================");
            console.log("ORDER STATUS EMAIL");
            console.log("ORDER ID:", order._id);
            console.log("CUSTOMER EMAIL:", order.customerEmail);
            console.log("STATUS:", status);
            console.log("=================================");
            const emailHtml = orderStatusTemplate(order, status);            
            await sendEmail({
                to: order.customerEmail,
                subject: `Electro Mart - Order ${status}`,
                html: emailHtml,
            });

            console.log(
                `Status email sent to ${order.customerEmail}`
            );

        } catch (emailError) {

            console.error(
                "Order status email failed:",
                emailError
            );

        }
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