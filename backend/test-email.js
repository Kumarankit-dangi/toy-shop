require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },

    tls: {
        rejectUnauthorized: false
    }

});


async function testEmail() {

    try {

        const info = await transporter.sendMail({

            from: `"Toyland" <${process.env.EMAIL_USER}>`,

            to: process.env.EMAIL_USER,

            subject: "Toyland Email OTP Test",

            text:
                "🎉 Toyland Gmail OTP connection is working successfully!"

        });


        console.log(
            "✅ EMAIL SENT SUCCESSFULLY"
        );

        console.log(
            "Message ID:",
            info.messageId
        );


    } catch (error) {

        console.error(
            "❌ EMAIL FAILED"
        );

        console.error(
            error.message
        );

    }

}


testEmail();