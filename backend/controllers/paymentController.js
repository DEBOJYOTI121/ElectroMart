const crypto = require("crypto");
const razorpay = require("../config/razorpay");

// =====================================
// CREATE RAZORPAY ORDER
// =====================================
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid amount is required"
            });
        }

        const options = {
            amount: Number(amount) * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order
        });

    } catch (error) {
        console.error("Create Razorpay Order Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// VERIFY RAZORPAY PAYMENT
// =====================================
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification data is incomplete"
            });
        }

        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            return res.json({
                success: true,
                message: "Payment Verified"
            });
        }

        res.status(400).json({
            success: false,
            message: "Invalid Signature"
        });

    } catch (error) {
        console.error("Payment Verification Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    createRazorpayOrder,
    verifyPayment
};