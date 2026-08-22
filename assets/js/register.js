const API_URL =
    "https://toy-shop-backend.onrender.com";

const registerForm =
    document.getElementById("register-form");

let otpSent = false;
let emailVerified = false;


// =====================================================
// REGISTER FORM
// =====================================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("register-name")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("register-email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("register-password")
                    .value;

            const confirmPassword =
                document
                    .getElementById(
                        "register-confirm-password"
                    )
                    .value;


            // =================================================
            // PASSWORD CHECK
            // =================================================

            if (password !== confirmPassword) {

                alert(
                    "❌ Passwords do not match."
                );

                return;
            }


            // =================================================
            // EMAIL CHECK
            // =================================================

            if (!email) {

                alert(
                    "Please enter your email address."
                );

                return;
            }


            // =================================================
            // FIRST CLICK → SEND OTP
            // =================================================

            if (!otpSent) {

                try {

                    const button =
                        document.getElementById(
                            "send-otp-btn"
                        );

                    button.disabled = true;

                    button.textContent =
                        "Sending OTP...";


                    const response =
                        await fetch(
                            `${API_URL}/api/auth/send-otp`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        contact: email
                                    })
                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "Send OTP Response:",
                        data
                    );


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        throw new Error(
                            data.message ||
                            "Failed to send OTP."
                        );

                    }


                    otpSent = true;


                    // =================================================
                    // SHOW OTP INPUT
                    // =================================================

                    const otpSection =
                        document.createElement(
                            "div"
                        );

                    otpSection.id =
                        "email-otp-section";

                    otpSection.style.marginTop =
                        "15px";


                    otpSection.innerHTML = `

                        <input
                            type="text"
                            id="register-otp"
                            placeholder="Enter 6-digit OTP"
                            maxlength="6"
                            inputmode="numeric"
                        >

                        <button
                            type="button"
                            id="verify-otp-btn"
                        >
                            Verify OTP
                        </button>

                        <p
                            id="otp-status"
                            style="
                                text-align:center;
                                margin-top:10px;
                            "
                        ></p>

                    `;


                    button.parentNode.insertBefore(
                        otpSection,
                        button
                    );


                    button.textContent =
                        "Verify OTP";

                    button.disabled =
                        false;


                    // =================================================
                    // VERIFY OTP
                    // =================================================

                    button.onclick =
                        async function () {

                            if (emailVerified) {

                                await createAccount();

                                return;
                            }


                            const otp =
                                document
                                    .getElementById(
                                        "register-otp"
                                    )
                                    .value
                                    .trim();


                            if (!otp) {

                                alert(
                                    "Please enter the OTP."
                                );

                                return;
                            }


                            try {

                                button.disabled =
                                    true;

                                button.textContent =
                                    "Verifying...";


                                const verifyResponse =
                                    await fetch(
                                        `${API_URL}/api/auth/verify-otp`,
                                        {
                                            method: "POST",

                                            headers: {
                                                "Content-Type":
                                                    "application/json"
                                            },

                                            body:
                                                JSON.stringify({
                                                    contact:
                                                        email,
                                                    otp
                                                })
                                        }
                                    );


                                const verifyData =
                                    await verifyResponse.json();


                                console.log(
                                    "Verify OTP Response:",
                                    verifyData
                                );


                                if (
                                    !verifyResponse.ok ||
                                    !verifyData.success
                                ) {

                                    throw new Error(
                                        verifyData.message ||
                                        "Invalid OTP."
                                    );

                                }


                                emailVerified =
                                    true;


                                const status =
                                    document.getElementById(
                                        "otp-status"
                                    );


                                status.textContent =
                                    "✅ Email verified successfully!";

                                status.style.color =
                                    "green";


                                button.textContent =
                                    "Create Account";

                                button.disabled =
                                    false;


                            } catch (error) {

                                console.error(
                                    "Verify OTP Error:",
                                    error
                                );


                                alert(
                                    error.message
                                );


                                button.disabled =
                                    false;

                                button.textContent =
                                    "Verify OTP";

                            }

                        };


                } catch (error) {

                    console.error(
                        "Send OTP Error:",
                        error
                    );


                    alert(
                        error.message ||
                        "Unable to send OTP."
                    );


                    const button =
                        document.getElementById(
                            "send-otp-btn"
                        );

                    button.disabled =
                        false;

                    button.textContent =
                        "Send OTP";

                }


                return;
            }


            // =================================================
            // CREATE ACCOUNT
            // =================================================

            if (!emailVerified) {

                alert(
                    "📧 Please verify your email OTP first."
                );

                return;
            }


            await createAccount();

        }
    );
}


// =====================================================
// CREATE ACCOUNT FUNCTION
// =====================================================

async function createAccount() {

    const name =
        document
            .getElementById("register-name")
            .value
            .trim();

    const email =
        document
            .getElementById("register-email")
            .value
            .trim();

    const password =
        document
            .getElementById("register-password")
            .value;


    const button =
        document.getElementById(
            "send-otp-btn"
        );


    try {

        button.disabled =
            true;

        button.textContent =
            "Creating Account...";


        const response =
            await fetch(
                `${API_URL}/api/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            name,

                            email,

                            password

                        })
                }
            );


        const data =
            await response.json();


        console.log(
            "Register Response:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Registration failed."
            );

        }


        alert(
            "🎉 Account created successfully!"
        );


        window.location.href =
            "login.html";


    } catch (error) {

        console.error(
            "Register Error:",
            error
        );


        alert(
            error.message ||
            "Unable to create account."
        );


        button.disabled =
            false;

        button.textContent =
            "Create Account";

    }

}