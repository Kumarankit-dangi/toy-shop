const API_URL =
    "https://toy-shop-backend.onrender.com";

const registerForm =
    document.getElementById("register-form");

let emailVerified = false;


// =====================================================
// EMAIL OTP ELEMENTS
// =====================================================

// Support current IDs

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

const emailInput =
    document.getElementById("register-email");

const otpInput =
    document.getElementById("register-otp");


// =====================================================
// SEND EMAIL OTP
// =====================================================

if (sendEmailOtpButton) {

    sendEmailOtpButton.addEventListener(
        "click",
        async function () {

            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            // =================================================
            // EMAIL VALIDATION
            // =================================================

            if (!email) {

                alert(
                    "Please enter your email address."
                );

                if (emailInput) {
                    emailInput.focus();
                }

                return;
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                if (emailInput) {
                    emailInput.focus();
                }

                return;
            }


            try {

                // =================================================
                // BUTTON LOADING
                // =================================================

                sendEmailOtpButton.disabled =
                    true;

                sendEmailOtpButton.textContent =
                    "Sending...";


                console.log(
                    "📧 Sending OTP to:",
                    email
                );


                // =================================================
                // SEND OTP API
                // =================================================

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


                // =================================================
                // CHECK RESPONSE
                // =================================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Failed to send OTP."
                    );

                }


                // =================================================
                // OTP SENT SUCCESSFULLY
                // =================================================

                console.log(
                    "✅ OTP sent successfully"
                );


                // Change button text

                sendEmailOtpButton.textContent =
                    "OTP Sent ✓";


                // Keep disabled

                sendEmailOtpButton.disabled =
                    true;


                // =================================================
                // SHOW OTP SECTION
                // =================================================

                if (emailOtpSection) {

                    emailOtpSection.style.display =
                        "flex";

                    emailOtpSection.style.visibility =
                        "visible";

                    emailOtpSection.style.opacity =
                        "1";

                }


                // =================================================
                // SHOW OTP INPUT
                // =================================================

                if (otpInput) {

                    otpInput.style.display =
                        "block";

                    otpInput.style.visibility =
                        "visible";

                    otpInput.disabled =
                        false;

                    otpInput.focus();

                }


                // =================================================
                // SHOW VERIFY BUTTON
                // =================================================

                if (verifyEmailOtpButton) {

                    verifyEmailOtpButton.style.display =
                        "inline-block";

                    verifyEmailOtpButton.style.visibility =
                        "visible";

                    verifyEmailOtpButton.disabled =
                        false;

                    verifyEmailOtpButton.textContent =
                        "Verify";

                }


                alert(
                    "📧 OTP sent to your email. Please check Gmail."
                );


            } catch (error) {

                console.error(
                    "❌ Send OTP Error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to send OTP."
                );


                // =================================================
                // RESET BUTTON
                // =================================================

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
                emailInput
                    ? emailInput.value.trim()
                    : "";


            const otp =
                otpInput
                    ? otpInput.value.trim()
                    : "";


            // =================================================
            // VALIDATION
            // =================================================

            if (!email) {

                alert(
                    "Please enter your email address."
                );

                return;
            }


            if (!otp) {

                alert(
                    "Please enter the OTP."
                );

                if (otpInput) {
                    otpInput.focus();
                }

                return;
            }


            if (!/^\d{6}$/.test(otp)) {

                alert(
                    "Please enter a valid 6-digit OTP."
                );

                if (otpInput) {
                    otpInput.focus();
                }

                return;
            }


            try {

                // =================================================
                // BUTTON LOADING
                // =================================================

                verifyEmailOtpButton.disabled =
                    true;

                verifyEmailOtpButton.textContent =
                    "Checking...";


                console.log(
                    "🔐 Verifying OTP..."
                );


                // =================================================
                // VERIFY API
                // =================================================

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


                // =================================================
                // CHECK RESPONSE
                // =================================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Invalid OTP."
                    );

                }


                // =================================================
                // VERIFIED
                // =================================================

                emailVerified =
                    true;


                verifyEmailOtpButton.textContent =
                    "Verified ✓";


                verifyEmailOtpButton.disabled =
                    true;


                // Lock email

                if (emailInput) {

                    emailInput.readOnly =
                        true;

                }


                // Lock OTP

                if (otpInput) {

                    otpInput.readOnly =
                        true;

                }


                console.log(
                    "✅ Email verified successfully"
                );


                alert(
                    "✅ Email verified successfully!"
                );


            } catch (error) {

                console.error(
                    "❌ Verify OTP Error:",
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

                if (createAccountButton) {

                    createAccountButton.disabled =
                        true;

                    createAccountButton.textContent =
                        "Creating Account...";

                }


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

                alert(
                    "🎉 Account created successfully!"
                );


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