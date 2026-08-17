const Order = require("../models/Order");
const Product = require("../models/Product");
const Users = require("../models/User");


// =====================================
// DASHBOARD STATS
// =====================================
const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();

        const totalProducts = await Product.countDocuments();

        const totalUsers = await Users.countDocuments();


        // =====================================
        // TOTAL REVENUE
        // Only delivered orders
        // =====================================
        const deliveredOrders = await Order.find({
            orderStatus: "Delivered"
        });

        let totalRevenue = 0;

        deliveredOrders.forEach((order) => {
            totalRevenue += Number(order.totalAmount);
        });


        // =====================================
        // ORDER STATUS COUNTS
        // =====================================
        const pendingOrders = await Order.countDocuments({
            orderStatus: "Pending"
        });

        const approvedOrders = await Order.countDocuments({
            orderStatus: "Approved"
        });

        const packedOrders = await Order.countDocuments({
            orderStatus: "Packed"
        });

        const shippedOrders = await Order.countDocuments({
            orderStatus: "Shipped"
        });

        const outForDeliveryOrders = await Order.countDocuments({
            orderStatus: "Out For Delivery"
        });

        const deliveredCount = await Order.countDocuments({
            orderStatus: "Delivered"
        });


        // =====================================
        // RECENT ORDERS
        // =====================================
        const recentOrders = await Order
            .find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select(
                "_id customerName totalAmount orderStatus createdAt"
            );


        // =====================================
        // LOW STOCK PRODUCTS
        // =====================================
        const lowStockProducts = await Product.find({
            countInStock: {
                $lte: 5
            }
        });


        // =====================================
        // TOP PRODUCTS
        // =====================================
        const topProducts = await Order.aggregate([
            {
                $unwind: "$products"
            },
            {
                $group: {
                    _id: "$products.productId",

                    productName: {
                        $first: "$products.productName"
                    },

                    image: {
                        $first: "$products.image"
                    },

                    totalSold: {
                        $sum: "$products.quantity"
                    }
                }
            },
            {
                $sort: {
                    totalSold: -1
                }
            },
            {
                $limit: 5
            }
        ]);


        // =====================================
        // MONTHLY REVENUE
        // =====================================
        const currentDate = new Date();

        const currentMonth = currentDate.getMonth();

        const currentYear = currentDate.getFullYear();

        const currentMonthOrders = await Order.find({
            paymentStatus: "Paid"
        });


        let currentMonthRevenue = 0;

        let previousMonthRevenue = 0;


        currentMonthOrders.forEach((order) => {
            const orderDate = new Date(order.createdAt);

            const month = orderDate.getMonth();

            const year = orderDate.getFullYear();


            if (
                month === currentMonth &&
                year === currentYear
            ) {
                currentMonthRevenue += Number(
                    order.totalAmount
                );
            }


            // Handle January -> December previous month
            const previousMonth =
                currentMonth === 0
                    ? 11
                    : currentMonth - 1;

            const previousMonthYear =
                currentMonth === 0
                    ? currentYear - 1
                    : currentYear;


            if (
                month === previousMonth &&
                year === previousMonthYear
            ) {
                previousMonthRevenue += Number(
                    order.totalAmount
                );
            }
        });


        // =====================================
        // REVENUE GROWTH
        // =====================================
        let revenueGrowth = 0;

        if (previousMonthRevenue > 0) {
            revenueGrowth =
                (
                    (
                        currentMonthRevenue -
                        previousMonthRevenue
                    ) /
                    previousMonthRevenue
                ) * 100;
        }


        res.json({
            success: true,

            totalRevenue,
            totalOrders,
            totalProducts,
            totalUsers,

            pendingOrders,
            approvedOrders,
            packedOrders,
            shippedOrders,
            outForDeliveryOrders,
            deliveredCount,

            recentOrders,
            topProducts,

            currentMonthRevenue,
            previousMonthRevenue,
            revenueGrowth,

            lowStockProducts
        });

    } catch (error) {
        console.error(
            "Dashboard Stats Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// MONTHLY SALES
// =====================================
const getMonthlySales = async (req, res) => {
    try {
        const orders = await Order.find({
            paymentStatus: "Paid"
        });

        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        const revenue = new Array(12).fill(0);


        orders.forEach((order) => {
            const month =
                new Date(order.createdAt).getMonth();

            revenue[month] += Number(
                order.totalAmount
            );
        });


        res.json({
            success: true,
            labels: months,
            revenue
        });

    } catch (error) {
        console.error(
            "Monthly Sales Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    getDashboardStats,
    getMonthlySales
};