const API_URL =
    "https://toy-shop-backend.onrender.com";


// =====================================================
// BACKEND WAKE UP
// =====================================================

fetch(`${API_URL}/`)
    .then(() => {
        console.log("✅ Backend is ready");
    })
    .catch(() => {
        console.log("⏳ Backend is waking up...");
    });


// =====================================================
// REGISTER FORM
// =====================================================

const registerForm =
    document.getElementById("register-form");

let emailVerified = false;


// =====================================================
// OTP UI
// =====================================================

if (registerForm) {

    const emailInput =
        document.getElementById("register-email");

    if (emailInput) {

        const otpContainer =
            document.createElement("div");

        otpContainer.id =
            "email-otp-container";

        otpContainer.style.marginTop =
            "10px";

        otpContainer.innerHTML = `

            <button
                type="button"
                id="send-email-otp"
            >
                📧 Send Email OTP
            </button>

            <div
                id="email-otp-box"
                style="display:none; margin-top:10px;"
            >

                <input
                    type="text"
                    id="email-otp"
                    placeholder="Enter 6-digit OTP"
                    maxlength="6"
                    inputmode="numeric"
                >

                <button
                    type="button"
                    id="verify-email-otp"
                >
                    Verify OTP
                </button>

                <button
                    type="button"
                    id="resend-email-otp"
                >
                    Resend OTP
                </button>

                <p id="email-otp-status"></p>

            </div>
        `;

        emailInput.parentNode.insertBefore(
            otpContainer,
            emailInput.nextSibling
        );
    }
}


// =====================================================
// SEND EMAIL OTP
// =====================================================

document.addEventListener(
    "click",
    async function (event) {

        if (
            event.target.id !==
            "send-email-otp"
        ) {
            return;
        }

        const emailInput =
            document.getElementById(
                "register-email"
            );

        const sendButton =
            document.getElementById(
                "send-email-otp"
            );

        const otpBox =
            document.getElementById(
                "email-otp-box"
            );

        const status =
            document.getElementById(
                "email-otp-status"
            );

        const email =
            emailInput.value.trim();


        if (!email) {

            alert(
                "Please enter your email address."
            );

            return;
        }


        try {

            sendButton.disabled = true;

            sendButton.textContent =
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

                        body: JSON.stringify({
                            contact: email
                        })

                    }
                );


            const data =
                await response.json();


            console.log(
                "Send OTP:",
                data
            );


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Failed to send OTP"
                );

            }


            otpBox.style.display =
                "block";


            status.textContent =
                "✅ OTP sent to your email.";

            status.style.color =
                "green";


            sendButton.textContent =
                "OTP Sent ✓";


        } catch (error) {

            console.error(
                "Send OTP Error:",
                error
            );


            alert(
                error.message
            );


            sendButton.disabled =
                false;

            sendButton.textContent =
                "📧 Send Email OTP";
        }

    }
);


// =====================================================
// VERIFY EMAIL OTP
// =====================================================

document.addEventListener(
    "click",
    async function (event) {

        if (
            event.target.id !==
            "verify-email-otp"
        ) {
            return;
        }


        const email =
            document
                .getElementById(
                    "register-email"
                )
                .value
                .trim();


        const otp =
            document
                .getElementById(
                    "email-otp"
                )
                .value
                .trim();


        const status =
            document.getElementById(
                "email-otp-status"
            );


        if (!otp) {

            alert(
                "Please enter the OTP."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/auth/verify-otp`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            contact: email,

                            otp: otp

                        })

                    }
                );


            const data =
                await response.json();


            console.log(
                "Verify OTP:",
                data
            );


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Invalid OTP"
                );

            }


            emailVerified = true;


            status.textContent =
                "✅ Email verified successfully!";

            status.style.color =
                "green";


            const verifyButton =
                document.getElementById(
                    "verify-email-otp"
                );

            verifyButton.disabled =
                true;

            verifyButton.textContent =
                "Verified ✓";


            document
                .getElementById(
                    "register-email"
                )
                .readOnly = true;


        } catch (error) {

            console.error(
                "Verify OTP Error:",
                error
            );


            alert(
                error.message
            );

        }

    }
);


// =====================================================
// RESEND EMAIL OTP
// =====================================================

document.addEventListener(
    "click",
    async function (event) {

        if (
            event.target.id !==
            "resend-email-otp"
        ) {
            return;
        }


        const sendButton =
            document.getElementById(
                "send-email-otp"
            );


        sendButton.disabled =
            false;


        sendButton.textContent =
            "📧 Send Email OTP";


        sendButton.click();

    }
);


// =====================================================
// REGISTER
// =====================================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "register-name"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "register-email"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "register-phone"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "register-password"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "register-confirm-password"
                    )
                    .value;


            // =====================================================
            // PASSWORD CHECK
            // =====================================================

            if (
                password !==
                confirmPassword
            ) {

                alert(
                    "❌ Passwords do not match."
                );

                return;
            }


            // =====================================================
            // EMAIL OTP CHECK
            // =====================================================

            if (!emailVerified) {

                alert(
                    "📧 Please verify your email OTP first."
                );

                return;
            }


            // =====================================================
            // REGISTER BUTTON
            // =====================================================

            const registerButton =
                registerForm.querySelector(
                    'button[type="submit"]'
                );


            try {

                registerButton.disabled =
                    true;

                registerButton.textContent =
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

                            body: JSON.stringify({

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
                        "Registration failed"
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


                registerButton.disabled =
                    false;

                registerButton.textContent =
                    "Create Account";

            }

        }
    );
}