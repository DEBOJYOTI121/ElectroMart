const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;
const Product = require("../models/Product");``
const signupUser = async (req, res) => {
    try {
        const check = await Users.findOne({
            email: req.body.email
        });
        if (check) {
            return res.json({
                success: false,
                errors: "Email already registered"
            });
        }
        const cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }
        const hashedPassword = await bcrypt.hash(
            req.body.password,
            10
        );
        const user = new Users({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            mobile: req.body.mobile,
            cartData: cart
        });
        await user.save();
        const data = {
            user: {
                id: user.id
            }
        };
        const token = jwt.sign(
            data,
            JWT_SECRET
        );
        res.json({
            success: true,
            token,
            name: user.name,
            email: user.email,
            mobile: user.mobile
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({
            success: false,
            errors: error.message
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const user = await Users.findOne({
            email: req.body.email
        });
        if (!user) {
            return res.json({
                success: false,
                errors: "Email not found"
            });
        }
        const passCompare = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!passCompare) {
            return res.json({
                success: false,
                errors: "Wrong Password"
            });
        }
        const data = {
            user: {
                id: user.id
            }
        };
        const token = jwt.sign(
            data,
            JWT_SECRET
        );
        res.json({
            success: true,
            token,
            name: user.name,
            email: user.email,
            mobile: user.mobile
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            errors: error.message
        });
    }
};
const googleLogin = async (req, res) => {
    try {
        const {
            name,
            email
        } = req.body;
        let user = await Users.findOne({
            email
        });
        // Create new user if Google email doesn't exist
        if (!user) {
            const cart = {};
            for (let i = 0; i < 300; i++) {
                cart[i] = 0;
            }
            user = new Users({
                name,
                email,
                password: "",
                cartData: cart
            });
            await user.save();
        }
        const data = {
            user: {
                id: user.id
            }
        };
        const token = jwt.sign(
            data,
            JWT_SECRET
        );
        res.json({
            success: true,
            token
        });
      } catch (error) {
        console.error("Google Login Error:", error);

        res.status(500).json({
            success: false,
            errors: error.message
        });
    }
};
const adminLogin = async (req, res) => {
    try {
        const user = await Users.findOne({
            email: req.body.email
        });
        if (!user) {
            return res.json({
                success: false,
                errors: "Email not found"
            });
        }
        const passCompare = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!passCompare) {
            return res.json({
                success: false,
                errors: "Wrong Password"
            });
        }
        // Check admin role
        if (user.role !== "admin") {
            return res.json({
                success: false,
                errors: "Access Denied. Admin Only."
            });
        }
        const data = {
            user: {
                id: user.id
            }
        };
        const token = jwt.sign(
            data,
            JWT_SECRET
        );
        res.json({
            success: true,
            token,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error("Admin Login Error:", error);
          res.status(500).json({
            success: false,
            errors: error.message
        });
    }
};
const addToCart = async (req, res) => {
    try {
        const { itemId } = req.body;

        console.log("Adding Product:", itemId);
        console.log("User ID:", req.user.id);

        const userData = await Users.findById(req.user.id);

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // Make sure cartData exists
        if (!userData.cartData) {
            userData.cartData = {};
        }

        // Make sure product quantity exists
        if (!userData.cartData[itemId]) {
            userData.cartData[itemId] = 0;
        }

        // Increase quantity
        userData.cartData[itemId] += 1;

        // IMPORTANT:
        // Tell Mongoose that cartData was modified
        userData.markModified("cartData");

        await userData.save();

        console.log(
            `Product ${itemId} added. Quantity: ${userData.cartData[itemId]}`
        );

        res.json({
            success: true,
            message: "Added To Cart"
        });

    } catch (error) {

        console.error("Add To Cart Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const removeFromCart = async (req, res) => {
    try {

        const { itemId } = req.body;

        const userData = await Users.findById(req.user.id);

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (
            userData.cartData &&
            userData.cartData[itemId] > 0
        ) {

            userData.cartData[itemId] =
                userData.cartData[itemId] > 1
                    ? userData.cartData[itemId] - 1
                    : 0;

            userData.markModified("cartData");

            await userData.save();
        }

        res.json({
            success: true,
            message: "Cart updated"
        });

    } catch (error) {

        console.error("Remove From Cart Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const deleteFromCart = async (req, res) => {
    try {

        const { itemId } = req.body;

        const userData = await Users.findById(req.user.id);

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (userData.cartData) {

            userData.cartData[itemId] = 0;

            userData.markModified("cartData");

            await userData.save();
        }

        res.json({
            success: true,
            message: "Product removed from cart"
        });

    } catch (error) {

        console.error("Delete From Cart Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getCart = async (req, res) => {
    try {
        const userData = await Users.findById(req.user.id);
        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }
        const cartData = userData.cartData || {};
        res.json({
            success: true,
            cartData: cartData
        });
    } catch (error) {
        console.error("Get Cart Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const id = Number(productId);

        if (
            productId === undefined ||
            !Number.isInteger(id) ||
            id <= 0
        ) {
            console.log("Invalid wishlist productId:", productId);

            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const userData = await Users.findById(req.user.id);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!userData.wishlist) {
            userData.wishlist = [];
        }

        // Prevent duplicate products
        if (!userData.wishlist.includes(id)) {
            userData.wishlist.push(id);
        }

        await userData.save();

        console.log(
            `Product ${id} added to wishlist for user ${userData.email}`
        );

        res.json({
            success: true,
            message: "Added To Wishlist",
            wishlist: userData.wishlist
        });

    } catch (error) {
        console.error("Add To Wishlist Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const id = Number(productId);
        if (
            productId === undefined ||
            !Number.isInteger(id) ||
            id <= 0
        ) {
            console.log("Invalid wishlist productId:", productId);
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }
        const userData = await Users.findById(req.user.id);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (!userData.wishlist) {
            userData.wishlist = [];
        }
        // Remove the product from wishlist
        userData.wishlist = userData.wishlist.filter(
            (wishlistId) => wishlistId !== id
        );
        await userData.save();
        console.log(
            `Product ${id} removed from wishlist for user ${userData.email}`
        );
        res.json({
            success: true,
            message: "Removed From Wishlist",
            wishlist: userData.wishlist
        });
    } catch (error) {
        console.error("Remove From Wishlist Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getWishlist = async (req, res) => {
    try {
        const userData = await Users.findById(req.user.id);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const wishlistIds = userData.wishlist || [];

        // Get complete product information
        const wishlistProducts = await Product.find({
            id: { $in: wishlistIds }
        });

        res.json({
            success: true,
            wishlist: wishlistProducts
        });

    } catch (error) {
        console.error("Get Wishlist Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    signupUser,
    loginUser,
    googleLogin,
    adminLogin,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getCart,
    addToWishlist,
    removeFromWishlist,
    getWishlist
};
