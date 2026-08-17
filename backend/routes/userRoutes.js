const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const {
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
} = require("../controllers/userController");
router.post(
    "/signup",
    signupUser
);
router.post(
    "/login",
    loginUser
);
router.post(
    "/google-login",
    googleLogin
);
router.post(
    "/adminlogin",
    adminLogin
);
router.post(
    "/addtocart",
    fetchUser,
    addToCart
);
router.post(
    "/removefromcart",
    fetchUser,
    removeFromCart
);
router.post(
    "/deletefromcart",
    fetchUser,
    deleteFromCart
);
router.post(
    "/getcart",
    fetchUser,
    getCart
);
router.post(
    "/addtowishlist",
    fetchUser,
    addToWishlist
);
router.post(
    "/removefromwishlist",
    fetchUser,
    removeFromWishlist
);
router.post(
    "/getwishlist",
    fetchUser,
    getWishlist
);
module.exports = router;