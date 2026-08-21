const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerMobile: {
    type: String,
    required: false
    },
    deliveryAddress: {

    house: {
        type: String,
        default: ""
    },

    street: {
        type: String,
        default: ""
    },

    city: {
        type: String,
        default: ""
    },

    state: {
        type: String,
        default: ""
    },

    pincode: {
        type: String,
        default: ""
    },

    landmark: {
        type: String,
        default: ""
    }
    }, 
    products: [
        {
            productId: Number,
            productName: String,
            image: String,
            price: Number,
            quantity: Number
        }
    ],
     originalAmount: {
    type: Number,
    default: 0
    },
    couponCode: {
        type: String,
        default: ""
    },
    discountPercentage: {
        type: Number,
        default: 0
    },

    discountAmount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
    type: String,
    default: "Pending"
    },

    razorpayOrderId: {
        type: String,
        default: ""
    },

    razorpayPaymentId: {
    type: String,
    default: ""
    },

    paymentTime: {
        type: Date
    },
    orderStatus: {
    type: String,
    default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
OrderSchema.index(
    { razorpayPaymentId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            razorpayPaymentId: {
                $exists: true,
                $ne: ""
            }
        }
    }
);
module.exports = mongoose.model("Order", OrderSchema);