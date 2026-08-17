import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const generateInvoice = (order) => {
    const doc = new jsPDF("p", "mm", "a4");
    // ========= HEADER =========
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("ELECTRO MART", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
        "Electronics & Computer Store",
        105,
        24,
        { align: "center" }
    );
    // Reset text color
    doc.setTextColor(0, 0, 0);
    // ================================
    // Invoice Information Box
    // ================================
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(14, 42, 182, 18, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Invoice Number", 20, 50);
    doc.text("Order Date", 85, 50);
    doc.text("Payment", 135, 50);
    doc.setFont("helvetica", "normal");
    doc.text(
        `EMT-${order._id.slice(-8).toUpperCase()}`,
        20,
        56
    );
    doc.text(
        new Date(order.createdAt).toLocaleDateString("en-IN"),
        85,
        56
    );
    doc.text(
        order.paymentStatus,
        135,
        56
    );
    // ================================
    // Bill To
    // ================================
    doc.setDrawColor(220);
    doc.roundedRect(14, 70, 85, 48, 2, 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("CUSTOMER DETAILS", 18, 78);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Name : ${order.customerName}`, 18, 86);
    doc.text(`Email : ${order.customerEmail}`, 18, 93);
    doc.text(`Mobile : ${order.customerMobile}`, 18, 100);
    // ================================
    // Delivery Address
    // ================================
    doc.roundedRect(111, 70, 85, 48, 2, 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("DELIVERY ADDRESS", 115, 78);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`House : ${order.deliveryAddress.house}`, 115, 86);
    doc.text(`Street : ${order.deliveryAddress.street}`, 115, 93);
    doc.text(`City : ${order.deliveryAddress.city}`, 115, 100);
    doc.text(`State : ${order.deliveryAddress.state}`, 115, 107);
    doc.text(`PIN : ${order.deliveryAddress.pincode}`, 115, 114);    
        // ================================
        // Product Table
        // ================================
        autoTable(doc, {
            startY: 126,
            head: [[
                "Product",
                "Qty",
                "Unit Price",
                "Total"
            ]],
            body: order.products.map((item) => [
                item.productName,
                item.quantity,
                `Rs. ${item.price.toFixed(2)}`,
                `Rs. ${(item.price * item.quantity).toFixed(2)}`
            ]),
            theme: "grid",
            headStyles: {
                fillColor: [37, 99, 235],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                halign: "center"
            },
            bodyStyles: {
                halign: "center",
                fontSize: 10
            },
            columnStyles: {
                0: {
                    halign: "left",
                    cellWidth: 80
                }
            }
        });
        let finalY = doc.lastAutoTable.finalY + 12;
        // =====================================
        // PAYMENT SUMMARY
        // =====================================
        // Background box
        doc.setFillColor(248, 249, 250);
        doc.roundedRect(120, finalY, 76, 52, 3, 3, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(37,99,235);
        doc.text("ORDER SUMMARY",125,finalY+8);
        doc.setTextColor(0,0,0);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        let y = finalY + 18;
        doc.text("Original Amount", 125, y);
        doc.text(`Rs. ${order.originalAmount.toFixed(2)}`, 190, y, {
            align: "right",
        });
        y += 8;
        if (order.couponCode) {
            doc.text("Coupon", 125, y);
            doc.text(
                order.couponCode,
                190,
                y,
                {
                    align: "right",
                }
            );
            y += 8;
            doc.text("Discount", 125, y);
            doc.text(
                `${order.discountPercentage}% (-Rs. ${order.discountAmount.toFixed(2)})`,
                190,
                y,
                {
                    align: "right",
                }
            );
            y += 8;
        }
        doc.text("Order Status", 125, y);
        doc.text(
            order.orderStatus,
            190,
            y,
            {
                align: "right",
            }
        );
        y += 8;
        // Divider
        doc.setDrawColor(180);
        doc.line(125, y, 190, y);
        y += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(37,99,235);
        doc.text("Grand Total",125,y);
        doc.text(
            `Rs. ${order.totalAmount.toFixed(2)}`,
            190,
            y,
            {
                align:"right"
            }
        );
        doc.setTextColor(0,0,0);
        // =====================================
        // FOOTER
        // =====================================
        const footerY = finalY + 70;
        doc.setDrawColor(220);
        doc.line(14, footerY, 196, footerY);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(
            "Thank You For Shopping With Electro Mart!",
            105,
            footerY + 10,
            {
                align: "center",
            }
        );
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(
            "support@electromart.com",
            105,
            footerY + 18,
            {
                align: "center",
            }
        );
        doc.text(
            "www.electromart.com",
            105,
            footerY + 24,
            {
                align: "center",
            }
        );    
        // STOP HERE FOR NOW
        doc.save(
            `Invoice-${order._id.slice(-6)}.pdf`
        );
    };
    export default generateInvoice;