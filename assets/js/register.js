const API_URL =
    "https://toy-shop-backend.onrender.com";

const registerForm =
    document.getElementById("register-form");

let emailVerified = false;


// =====================================================
// SEND EMAIL OTP
// =====================================================

const sendEmailOtpButton =
    document.getElementById("send-email-otp");

const emailOtpSection =
    document.getElementById("email-otp-section");

const verifyEmailOtpButton =
    document.getElementById("verify-email-otp");


if (sendEmailOtpButton) {

    sendEmailOtpButton.addEventListener(
        "click",
        async function () {

            const email =
                document
                    .getElementById("register-email")
                    .value
                    .trim();


            if (!email) {

                alert(
                    "Please enter your email address."
                );

                return;
            }


            try {

                sendEmailOtpButton.disabled =
                    true;

                sendEmailOtpButton.textContent =
                    "Sending...";


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


                // Show OTP field

                emailOtpSection.style.display =
                    "flex";


                sendEmailOtpButton.textContent =
                    "Sent ✓";


                alert(
                    "📧 OTP sent to your email."
                );


            } catch (error) {

                console.error(
                    "Send OTP Error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to send OTP."
                );


                sendEmailOtpButton.disabled =
                    false;

                sendEmailOtpButton.textContent =
                    "Send OTP";

            }

        }
    );

}


// =====================================================
// VERIFY EMAIL OTP
// =====================================================

if (verifyEmailOtpButton) {

    verifyEmailOtpButton.addEventListener(
        "click",
        async function () {

            const email =
                document
                    .getElementById("register-email")
                    .value
                    .trim();


            const otp =
                document
                    .getElementById("register-otp")
                    .value
                    .trim();


            if (!otp) {

                alert(
                    "Please enter the OTP."
                );

                return;
            }


            try {

                verifyEmailOtpButton.disabled =
                    true;

                verifyEmailOtpButton.textContent =
                    "Checking...";


                const response =
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

                                    contact: email,

                                    otp: otp

                                })

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Verify OTP Response:",
                    data
                );


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Invalid OTP."
                    );

                }


                emailVerified = true;


                verifyEmailOtpButton.textContent =
                    "Verified ✓";


                verifyEmailOtpButton.disabled =
                    true;


                document
                    .getElementById(
                        "register-email"
                    )
                    .readOnly = true;


                document
                    .getElementById(
                        "register-otp"
                    )
                    .readOnly = true;


                alert(
                    "✅ Email verified successfully!"
                );


            } catch (error) {

                console.error(
                    "Verify OTP Error:",
                    error
                );


                alert(
                    error.message ||
                    "OTP verification failed."
                );


                verifyEmailOtpButton.disabled =
                    false;

                verifyEmailOtpButton.textContent =
                    "Verify";

            }

        }
    );

}


// =====================================================
// CREATE ACCOUNT
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


            const phone =
                document
                    .getElementById("register-phone")
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

            if (
                password !==
                confirmPassword
            ) {

                alert(
                    "❌ Passwords do not match."
                );

                return;
            }


            // =================================================
            // EMAIL VERIFICATION CHECK
            // =================================================

            if (!emailVerified) {

                alert(
                    "📧 Please verify your email first."
                );

                return;
            }


            const createAccountButton =
                document.getElementById(
                    "create-account-btn"
                );


            try {

                createAccountButton.disabled =
                    true;

                createAccountButton.textContent =
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

                                    phone,

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
                    "Registration Error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to create account."
                );


                createAccountButton.disabled =
                    false;

                createAccountButton.textContent =
                    "Create Account";

            }

        }
    );

}