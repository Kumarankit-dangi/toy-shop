const { Resend } = require("resend");


// =====================================================
// RESEND EMAIL CLIENT
// =====================================================

const resend = new Resend(
    process.env.RESEND_API_KEY
);


// =====================================================
// SEND REGISTRATION OTP
// =====================================================

const sendRegistrationOTP = async (
    email,
    otp
) => {

    console.log(
        "📧 Sending OTP using Resend to:",
        email
    );


    const {
        data,
        error
    } = await resend.emails.send({

        from:
            process.env.RESEND_FROM ||
            "onboarding@resend.dev",

        to: [
            email
        ],

        subject:
            "Toyland - Email Verification OTP",

        text:
`Welcome to Toyland!

Your verification OTP is:

${otp}

This OTP will expire in 5 minutes.

If you did not create a Toyland account, please ignore this email.

Thank you,
Toyland Team`,

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                border: 1px solid #eee;
                border-radius: 12px;
            ">

                <h2 style="
                    color: #ff6b6b;
                    text-align: center;
                ">
                    🧸 Welcome to Toyland
                </h2>

                <p>
                    Thank you for creating your Toyland account.
                </p>

                <p>
                    Your email verification OTP is:
                </p>

                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    text-align: center;
                    padding: 20px;
                    margin: 20px 0;
                    background: #fff5f5;
                    border-radius: 10px;
                    color: #333;
                ">
                    ${otp}
                </div>

                <p>
                    This OTP will expire in
                    <strong>5 minutes</strong>.
                </p>

                <p style="color:#777;">
                    If you did not create this account,
                    you can safely ignore this email.
                </p>

                <hr>

                <p style="
                    text-align:center;
                    color:#999;
                    font-size:13px;
                ">
                    © Toyland
                </p>

            </div>
        `

    });


    // =================================================
    // RESEND ERROR
    // =================================================

    if (error) {

        console.error(
            "❌ RESEND EMAIL ERROR:",
            error
        );

        throw new Error(
            error.message ||
            "Unable to send OTP."
        );

    }


    console.log(
        "✅ Resend email sent:",
        data
    );


    return data;

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    sendRegistrationOTP
};