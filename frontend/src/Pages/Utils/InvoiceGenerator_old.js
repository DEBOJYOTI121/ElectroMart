import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateInvoice = (order) => {

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Electro Mart", 14, 20);

    doc.setFontSize(12);
    doc.text("Electronics Store Invoice", 14, 28);

    doc.line(14, 32, 195, 32);

    doc.text(`Invoice No : ${order._id.slice(-8).toUpperCase()}`, 14, 42);
    doc.text(`Order Date : ${new Date(order.createdAt).toLocaleDateString()}`, 14, 50);

    doc.text(`Customer : ${order.customerName}`, 14, 62);
    doc.text(`Email : ${order.customerEmail}`, 14, 70);
    doc.text(`Mobile : ${order.customerMobile}`, 14, 78);

    doc.text("Delivery Address:", 14, 92);

    doc.text(
        `${order.deliveryAddress.house},
${order.deliveryAddress.street},
${order.deliveryAddress.city},
${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}`,
        14,
        100
    );

    autoTable(doc, {
        startY: 125,
        head: [["Product", "Qty", "Price", "Total"]],
        body: order.products.map((item) => [
            item.productName,
            item.quantity,
            `₹${item.price}`,
            `₹${item.price * item.quantity}`
        ])
    });

    let finalY = doc.lastAutoTable.finalY + 10;

    doc.text(`Original Amount : ₹${order.originalAmount}`, 14, finalY);

    if (order.couponCode) {

        finalY += 8;
        doc.text(`Coupon : ${order.couponCode}`, 14, finalY);

        finalY += 8;
        doc.text(`Discount : ${order.discountPercentage}%`, 14, finalY);

        finalY += 8;
        doc.text(`Discount Amount : ₹${order.discountAmount}`, 14, finalY);

    }

    finalY += 12;

    doc.setFontSize(14);
    doc.text(`Final Amount : ₹${order.totalAmount}`, 14, finalY);

    finalY += 10;

    doc.setFontSize(12);
    doc.text(`Payment : ${order.paymentStatus}`, 14, finalY);

    finalY += 8;
    doc.text(`Order Status : ${order.orderStatus}`, 14, finalY);

    finalY += 18;

    doc.setFontSize(14);
    doc.text("Thank You For Shopping With Electro Mart!", 14, finalY);

    doc.save(`Invoice-${order._id.slice(-6)}.pdf`);

};

export default generateInvoice;