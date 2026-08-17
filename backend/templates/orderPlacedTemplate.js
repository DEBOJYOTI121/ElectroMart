const orderPlacedTemplate = (order) => {
    const productRows = order.products.map(product => `
    <tr>
        <td style="padding:10px;border:1px solid #ddd;">
            ${product.productName}
        </td>

        <td style="
            padding:10px;
            border:1px solid #ddd;
            text-align:center;
        ">
            ${product.quantity}
        </td>

        <td style="
            padding:10px;
            border:1px solid #ddd;
            text-align:right;
        ">
            ₹${product.price}
        </td>

        <td style="
            padding:10px;
            border:1px solid #ddd;
            text-align:right;
        ">
            ₹${product.price * product.quantity}
        </td>

    </tr>
    `).join("");
    return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
        
        <div style="
        background: linear-gradient(135deg,#0d6efd,#0056d2);
        padding:35px;
        text-align:center;
        color:white;
        ">
        <h1 style="
        margin:0;
        font-size:34px;
        letter-spacing:1px;
        ">
        ⚡ Electro Mart
        </h1>
        <p style="
        margin-top:8px;
        font-size:16px;
        opacity:.95;
        ">
        Electronics & Computer Accessories
        </p>

        <div style="
        margin-top:25px;
        display:inline-block;
        background:white;
        color:#0d6efd;
        padding:10px 22px;
        border-radius:25px;
        font-weight:bold;
        font-size:18px;
        ">
        ✅ Order Confirmed
        </div>
        </div>
        <div style="padding:25px;">
            <p>Hi <strong>${order.customerName}</strong>,</p>
            <p>Thank you for shopping with Electro Mart.</p>
            <p>Your order has been placed successfully.</p>
            <div style="
            background:#f8f9fa;
            border:1px solid #e6e6e6;
            border-radius:10px;
            padding:20px;
            margin:25px 0;
            ">
            <h2 style="
            margin-top:0;
            color:#0d6efd;
            border-bottom:2px solid #0d6efd;
            padding-bottom:10px;
            ">
            📦 Order Information
            </h2>
            <table width="100%" cellpadding="8" cellspacing="0" style="font-size:15px;">
            <tr>
            <td><strong>Order ID</strong></td>
            <td>${order._id}</td>
            </tr>
            <tr>
            <td><strong>Order Date</strong></td>
            <td>${new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })}</td>
            </tr>
            <tr>
            <td><strong>Payment</strong></td>
            <td style="color:green;font-weight:bold;">
            ✅ ${order.paymentStatus}
            </td>
            </tr>
            <tr>
            <td><strong>Status</strong></td>
            <td style="
            background:#fff3cd;
            color:#856404;
            padding:6px 12px;
            border-radius:20px;
            display:inline-block;
            font-weight:bold;
            ">
            ${order.orderStatus}
            </td>
            </tr>
            </table>
            </div>
            <div style="
            margin:25px 0;
            ">
            <h2 style="
            color:#0d6efd;
            border-bottom:2px solid #0d6efd;
            padding-bottom:10px;
            ">
            🛒 Products Ordered
            </h2>
            <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
            border-collapse:collapse;
            font-size:14px;
            ">
            <tr style="
            background:#0d6efd;
            color:white;
            ">
            <th style="padding:12px;border:1px solid #ddd;text-align:left;">
            Product
            </th>
            <th style="padding:12px;border:1px solid #ddd;">
            Qty
            </th>
            <th style="padding:12px;border:1px solid #ddd;text-align:right;">
            Price
            </th>
            <th style="padding:12px;border:1px solid #ddd;text-align:right;">
            Total
            </th>
            </tr>
            ${productRows}
            </table>
            </div>
            <div style="
            background:#f8f9fa;
            border:1px solid #e5e5e5;
            border-radius:10px;
            padding:20px;
            margin:25px 0;
            ">
            <h2 style="
            margin-top:0;
            color:#0d6efd;
            border-bottom:2px solid #0d6efd;
            padding-bottom:10px;
            ">
            💰 Order Summary
            </h2>
            <table
            width="100%"
            cellpadding="8"
            cellspacing="0"
            style="
            font-size:15px;
            ">
            <tr>
            <td><strong>Original Amount</strong></td>
            <td align="right">
            ₹${order.originalAmount}
            </td>
            </tr>
            <tr>
            <td><strong>Coupon</strong></td>
            <td align="right">
            ${order.couponCode || "No Coupon"}
            </td>
            </tr>
            <tr>
            <td>
                <strong>
                    Discount
                    ${
                        order.discountPercentage > 0
                            ? `(${order.discountPercentage}%)`
                            : ""
                    }
                </strong>
            </td>
            <td align="right" style="color:green;">
                - ₹${order.discountAmount}
            </td>
            </tr>
            <tr>
            <td colspan="2">
            <hr>
            </td>
            </tr>
            <tr style="
            font-size:18px;
            font-weight:bold;
            ">
            <td>
            Grand Total
            </td>
            <td
            align="right"
            style="
            color:#0d6efd;
            font-size:22px;
            ">
            ₹${order.totalAmount}
            </td>
            </tr>
            </table>
            </div>
            <div style="
            background:#f8f9fa;
            border:1px solid #e5e5e5;
            border-radius:10px;
            padding:20px;
            margin:25px 0;
            ">
            <h2 style="
            margin-top:0;
            color:#0d6efd;
            border-bottom:2px solid #0d6efd;
            padding-bottom:10px;
            ">
            📍 Delivery Address
            </h2>
            <table
            width="100%"
            cellpadding="8"
            cellspacing="0"
            style="font-size:15px;">
            <tr>
            <td width="30%"><strong>House</strong></td>
            <td>${order.deliveryAddress.house}</td>
            </tr>
            <tr>
            <td><strong>Street</strong></td>
            <td>${order.deliveryAddress.street}</td>
            </tr>
            <tr>
            <td><strong>City</strong></td>
            <td>${order.deliveryAddress.city}</td>
            </tr>
            <tr>
            <td><strong>State</strong></td>
            <td>${order.deliveryAddress.state}</td>
            </tr>
            <tr>
            <td><strong>PIN Code</strong></td>
            <td>${order.deliveryAddress.pincode}</td>
            </tr>
            ${
            order.deliveryAddress.landmark
            ? `
            <tr>
            <td><strong>Landmark</strong></td>
            <td>${order.deliveryAddress.landmark}</td>
            </tr>
            `
            : ""
            }
            </table>
            </div>
            <br>
            <div style="
            text-align:center;
            margin:35px 0;
            ">

            <a
            href="http://localhost:3000/myorders"
            style="
            background:#0d6efd;
            color:white;
            padding:14px 32px;
            text-decoration:none;
            font-weight:bold;
            border-radius:8px;
            display:inline-block;
            font-size:16px;
            ">
            📦 Track My Order
            </a>
            </div>
            <div style="
            background:#1f2937;
            color:#ffffff;
            padding:30px;
            text-align:center;
            margin-top:30px;
            ">
            <h3 style="
            margin:0;
            font-size:22px;
            color:white;
            ">
            Electro Mart
            </h3>
            <p style="
            margin:10px 0;
            color:#d1d5db;
            font-size:14px;
            ">
            Your Trusted Electronics & Computer Accessories Store
            </p>
            <div style="
            margin:20px 0;
            line-height:1.8;
            font-size:14px;
            ">
            📧 support@electromart.com<br>
            🌐 www.electromart.com<br>
            ☎ +91-7602033395
            </div>
            <hr style="
            border:none;
            border-top:1px solid #4b5563;
            margin:20px 0;
            ">
            <p style="
            margin:0;
            font-size:13px;
            color:#9ca3af;
            ">
            © ${new Date().getFullYear()} Electro Mart
            <br><br>
            Thank you for shopping with us ❤️
            </p>
            </div>
        </div>
    </div>
    `;
};

module.exports = orderPlacedTemplate;