const Coupon = require("../models/Coupon");

// =====================================
// ADD COUPON
// =====================================
const addCoupon = async (req, res) => {
    try {
        const {
            code,
            discount,
            expiryDate
        } = req.body;

        if (!code || discount === undefined || !expiryDate) {
            return res.status(400).json({
                success: false,
                message: "Coupon code, discount and expiry date are required"
            });
        }

        const couponCode = code.trim().toUpperCase();

        const existingCoupon = await Coupon.findOne({
            code: couponCode
        });

        if (existingCoupon) {
            return res.json({
                success: false,
                message: "Coupon already exists"
            });
        }

        const coupon = new Coupon({
            code: couponCode,
            discount,
            expiryDate
        });

        await coupon.save();

        res.json({
            success: true,
            message: "Coupon added successfully",
            coupon
        });

    } catch (error) {
        console.error("Add Coupon Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


// =====================================
// GET ALL COUPONS
// =====================================
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon
            .find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            coupons
        });

    } catch (error) {
        console.error("Get Coupons Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


// =====================================
// DELETE COUPON
// =====================================
const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Coupon ID is required"
            });
        }

        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.json({
                success: false,
                message: "Coupon not found"
            });
        }

        await Coupon.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Coupon deleted successfully"
        });

    } catch (error) {
        console.error("Delete Coupon Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


// =====================================
// APPLY COUPON
// =====================================
const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.json({
                success: false,
                message: "Coupon code is required"
            });
        }

        const coupon = await Coupon.findOne({
            code: code.trim().toUpperCase()
        });

        if (!coupon) {
            return res.json({
                success: false,
                message: "Invalid Coupon"
            });
        }

        // Check coupon status
        if (!coupon.isActive) {
            return res.json({
                success: false,
                message: "Coupon is inactive"
            });
        }

        // Check expiry
        const expiryDate = new Date(coupon.expiryDate);

        expiryDate.setUTCHours(
            23,
            59,
            59,
            999
        );

        if (new Date() > expiryDate) {
            return res.json({
                success: false,
                message: "Coupon has expired"
            });
        }

        res.json({
            success: true,
            discount: coupon.discount,
            message: "Coupon Applied Successfully"
        });

    } catch (error) {
        console.error("Apply Coupon Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


module.exports = {
    addCoupon,
    getAllCoupons,
    deleteCoupon,
    applyCoupon
};