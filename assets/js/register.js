document.addEventListener("DOMContentLoaded", function () {

    const otpElements = [
        "send-email-otp",
        "send-email-otp-btn",
        "send-otp-btn",
        "email-otp-section",
        "otp-section",
        "verify-email-otp",
        "verify-email-otp-btn",
        "verify-otp-btn"
    ];

    otpElements.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.style.display = "none";
        }

    });

});
const API_URL =
    "https://toy-shop-backend.onrender.com";

const registerForm =
    document.getElementById("register-form");

// =====================================================
// EMAIL VERIFICATION
// =====================================================

// Email OTP removed.
// Email is considered verified for registration.
let emailVerified = true;


// =====================================================
// HIDE OLD EMAIL OTP UI
// =====================================================

// We are not deleting the HTML.
// We simply hide the old OTP elements so they don't appear.

const sendEmailOtpButton =
    document.getElementById("send-email-otp") ||
    document.getElementById("send-email-otp-btn") ||
    document.getElementById("send-otp-btn");

const emailOtpSection =
    document.getElementById("email-otp-section") ||
    document.getElementById("otp-section");

const verifyEmailOtpButton =
    document.getElementById("verify-email-otp") ||
    document.getElementById("verify-email-otp-btn") ||
    document.getElementById("verify-otp-btn");

const otpInput =
    document.getElementById("register-otp");


// =====================================================
// REMOVE / HIDE OTP CONTROLS
// =====================================================

if (sendEmailOtpButton) {

    sendEmailOtpButton.style.display = "none";
    sendEmailOtpButton.disabled = true;

}

if (emailOtpSection) {

    emailOtpSection.style.display = "none";

}

if (verifyEmailOtpButton) {

    verifyEmailOtpButton.style.display = "none";
    verifyEmailOtpButton.disabled = true;

}

if (otpInput) {

    otpInput.style.display = "none";
    otpInput.disabled = true;

}


// =====================================================
// CREATE ACCOUNT
// =====================================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =================================================
            // GET VALUES
            // =================================================

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
            // BASIC VALIDATION
            // =================================================

            if (!name) {

                alert(
                    "Please enter your name."
                );

                return;
            }


            // =================================================
            // EMAIL VALIDATION
            // =================================================

            if (!email) {

                alert(
                    "Please enter your email address."
                );

                return;
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;
            }


            // =================================================
            // PHONE VALIDATION
            // =================================================

            if (!phone) {

                alert(
                    "Please enter your phone number."
                );

                return;
            }


            // =================================================
            // PASSWORD VALIDATION
            // =================================================

            if (!password) {

                alert(
                    "Please enter a password."
                );

                return;
            }


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
            // EMAIL OTP REMOVED
            // =================================================

            // Email verification is intentionally skipped.
            emailVerified = true;


            // =================================================
            // CREATE ACCOUNT BUTTON
            // =================================================

            const createAccountButton =
                document.getElementById(
                    "create-account-btn"
                ) ||
                registerForm.querySelector(
                    'button[type="submit"]'
                );


            try {

                // =================================================
                // BUTTON LOADING
                // =================================================

                if (createAccountButton) {

                    createAccountButton.disabled =
                        true;

                    createAccountButton.textContent =
                        "Creating Account...";

                }


                console.log(
                    "📝 Creating Toyland account..."
                );


                // =================================================
                // REGISTER API
                // =================================================

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

                                    name:
                                        name,

                                    email:
                                        email,

                                    phone:
                                        phone,

                                    password:
                                        password

                                })

                        }
                    );


                // =================================================
                // READ RESPONSE
                // =================================================

                const data =
                    await response.json();


                console.log(
                    "Register Response:",
                    data
                );


                // =================================================
                // CHECK RESPONSE
                // =================================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Registration failed."
                    );

                }


                // =================================================
                // SUCCESS
                // =================================================

                console.log(
                    "✅ Account created successfully"
                );


                alert(
                    "🎉 Account created successfully!"
                );


                // =================================================
                // REDIRECT TO LOGIN
                // =================================================

                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "❌ Registration Error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to create account."
                );


                // =================================================
                // RESET BUTTON
                // =================================================

                if (createAccountButton) {

                    createAccountButton.disabled =
                        false;

                    createAccountButton.textContent =
                        "Create Account";

                }

            }

        }
    );

}