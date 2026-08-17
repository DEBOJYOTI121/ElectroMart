const orderStatusTemplate = (order, status) => {
    const statusMessages = {
        "Pending": {
            title: "🕒 Order Pending",
            message: "Your order has been received and is awaiting processing."
        },
        "Approved": {
            title: "✅ Order Approved",
            message: "Great news! Your order has been approved and will be processed shortly."
        },
        "Packed": {
            title: "📦 Order Packed",
            message: "Your order has been packed carefully and is ready for shipment."
        },
        "Shipped": {
            title: "🚚 Order Shipped",
            message: "Your order is on the way. We'll notify you once it's out for delivery."
        },
        "Out For Delivery": {
            title: "🛵 Out For Delivery",
            message: "Your order is out for delivery and should reach you soon."
        },
        "Delivered": {
            title: "🎉 Order Delivered",
            message: "Your order has been delivered successfully. Thank you for shopping with Electro Mart!"
        },
        "Cancelled": {
            title: "❌ Order Cancelled",
            message: "Your order has been cancelled. If you have any questions, please contact our support team."
        }
    };

    const current = statusMessages[status];

    return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">

        <div style="background:#0d6efd;color:white;padding:30px;text-align:center;">
            <h1 style="margin:0;">⚡ Electro Mart</h1>
            <h2 style="margin-top:15px;">${current.title}</h2>
        </div>

        <div style="padding:25px;">

            <p>Hello <strong>${order.customerName}</strong>,</p>

            <p>${current.message}</p>

            <div style="
                background:#f8f9fa;
                border:1px solid #e5e5e5;
                border-radius:10px;
                padding:20px;
                margin:20px 0;
            ">

                <p><strong>Order ID:</strong> EM-${order._id.toString().slice(-8).toUpperCase()}</p>

                <p><strong>Current Status:</strong>
                    <span style="color:#0d6efd;font-weight:bold;">
                        ${status}
                    </span>
                </p>

                <p><strong>Total Paid:</strong> ₹${order.totalAmount}</p>

            </div>

            <div style="text-align:center;margin:30px 0;">

                <a href="http://localhost:3000/myorders"
                style="
                    background:#0d6efd;
                    color:white;
                    padding:14px 28px;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:bold;
                ">
                    Track My Order
                </a>

            </div>

            <p>Thank you for choosing <strong>Electro Mart</strong>.</p>

        </div>

        <div style="
            background:#1f2937;
            color:white;
            padding:20px;
            text-align:center;
        ">
            © ${new Date().getFullYear()} Electro Mart
        </div>

    </div>
    `;
};

module.exports = orderStatusTemplate;