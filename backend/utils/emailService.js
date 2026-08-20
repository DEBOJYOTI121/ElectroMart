const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Gmail SMTP verification failed:");
        console.error(error);
    } else {
        console.log("✅ Gmail SMTP connection verified successfully");
    }
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"Electro Mart" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("✅ Email Sent Successfully:", info.messageId);

        return {
            success: true,
            messageId: info.messageId,
        };

    } catch (error) {
        console.error("❌ Email Sending Failed:");
        console.error(error);

        throw error;
    }
};

module.exports = sendEmail;