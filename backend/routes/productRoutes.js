const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const fetchAdmin = require("../middleware/fetchAdmin");
const fetchUser = require("../middleware/fetchUser");
const {
    getAllProducts,
    uploadImage,
    addProduct,
    removeProduct,
    updateStock,
    seedProducts,
    getNewCollections,
    getPopularInSwitch,
    addReview
} = require("../controllers/productController");

// GET ALL PRODUCTS
router.get(
    "/allproducts",
    getAllProducts
);
// UPLOAD PRODUCT IMAGE
router.post(
    "/upload",
    fetchAdmin,
    upload.single("product"),
    uploadImage
);
// ADD PRODUCT
router.post(
    "/addproduct",
    fetchAdmin,
    addProduct
);
router.post(
    "/removeproduct",
    fetchAdmin,
    removeProduct
);
router.post(
    "/updatestock",
    fetchAdmin,
    updateStock
);
router.get(
    "/seedproducts",
    seedProducts
);
router.get(
    "/newcollections",
    getNewCollections
);
router.get(
    "/popularinswitch",
    getPopularInSwitch
);
router.post(
    "/addreview",
    fetchUser,
    addReview
);
module.exports = router;