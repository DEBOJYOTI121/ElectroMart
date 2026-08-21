const sendEmail = async ({ to, subject, html }) => {
    try {

        const response = await fetch(
            "https://api.brevo.com/v3/smtp/email",
            {
                method: "POST",

                headers: {
                    "accept": "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json"
                },

                body: JSON.stringify({

                    sender: {
                        name: "Electro Mart",
                        email: "mitradebojyoti5@gmail.com"
                    },

                    to: [
                        {
                            email: to
                        }
                    ],

                    subject: subject,

                    htmlContent: html

                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "❌ Brevo Email Error:",
                data
            );

            throw new Error(
                data.message ||
                "Brevo email sending failed"
            );
        }

        console.log(
            "✅ Brevo Email Sent Successfully:",
            data.messageId
        );

        return {
            success: true,
            data
        };

    } catch (error) {

        console.error(
            "❌ Email Error:",
            error
        );

        throw error;
    }
};

module.exports = sendEmail;