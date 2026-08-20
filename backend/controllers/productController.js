const Product = require("../models/Product");
const allProductsData = require("../all_products_data");
const Users = require("../models/User");
const uploadImage = (req, res) => {
    res.json({
        success: 1,
        image_url: `${process.env.BACKEND_URL}/images/${req.file.filename}`,
    });
};
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        console.log("All Products Fetched");

        res.send(products);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const addProduct = async (req, res) => {
    try {
        const products = await Product.find({});

        let id;

        if (products.length > 0) {
            const lastProduct = products[products.length - 1];
            id = lastProduct.id + 1;
        } else {
            id = 1;
        }

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            countInStock: req.body.countInStock
        });

        await product.save();

        console.log(`Product "${product.name}" saved successfully.`);

        res.json({
            success: true,
            name: product.name
        });

    } catch (error) {
        console.error("Add Product Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const removeProduct = async (req, res) => {
    try {
        const { id, name } = req.body;

        const product = await Product.findOneAndDelete({
            id: Number(id)
        });

        if (!product) {
            return res.json({
                success: false,
                message: "Product not found"
            });
        }

        console.log(`Product "${product.name}" removed successfully.`);

        res.json({
            success: true,
            name: product.name
        });

    } catch (error) {
        console.error("Remove Product Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateStock = async (req, res) => {
    try {
        const { id, countInStock } = req.body;

        const product = await Product.findOneAndUpdate(
            { id: Number(id) },
            {
                countInStock: Number(countInStock)
            },
            {
                new: true
            }
        );

        if (!product) {
            return res.json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            message: "Stock Updated Successfully",
            product
        });

    } catch (error) {
        console.error("Update Stock Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const seedProducts = async (req, res) => {
    try {
        await Product.deleteMany({});

        const products = allProductsData.map((product, index) => ({
            id: index + 1,
            name: product.name,
            image: product.image,
            category: product.category,
            new_price: product.new_price,
            old_price: product.old_price,
        }));

        await Product.insertMany(products);

        console.log(`${products.length} products seeded successfully.`);

        res.json({
            success: true,
            message: `${products.length} products inserted`,
        });

    } catch (error) {
        console.error("Seed Products Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getNewCollections = async (req, res) => {
    try {
        const products = await Product.find({});

        const newCollection = products
            .slice(1)
            .slice(-8);

        console.log("NewCollection Fetched");

        res.json(newCollection);

    } catch (error) {
        console.error("New Collection Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getPopularInSwitch = async (req, res) => {
    try {
        const products = await Product.find({});

        console.log("Total Products:", products.length);

        const switchProducts = products.filter(
            (item) => item.category === "switches"
        );

        console.log("Switch Products:", switchProducts);

        res.json(switchProducts.slice(0, 4));

    } catch (error) {
        console.error("Popular In Switch Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        // Find product
        const product = await Product.findOne({
            id: Number(productId)
        });

        if (!product) {
            return res.json({
                success: false,
                message: "Product not found"
            });
        }

        // Find logged-in user
        const user = await Users.findById(req.user.id);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user already reviewed this product
        const alreadyReviewed = product.reviews.find(
            (review) => review.userName === user.name
        );

        if (alreadyReviewed) {
            return res.json({
                success: false,
                message: "You have already reviewed this product."
            });
        }

        // Create review
        const review = {
            userName: user.name,
            rating: Number(rating),
            comment
        };

        // Add review
        product.reviews.push(review);

        // Update review count
        product.numReviews = product.reviews.length;

        // Calculate average rating
        product.rating =
            product.reviews.reduce(
                (acc, item) => acc + item.rating,
                0
            ) / product.numReviews;

        await product.save();

        res.json({
            success: true,
            message: "Review added successfully.",
            product
        });

    } catch (error) {
        console.error("Add Review Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
module.exports = {
    getAllProducts,
    uploadImage,
    addProduct,
    removeProduct,
    updateStock,
    seedProducts,
    getNewCollections,
    getPopularInSwitch,
    addReview
};