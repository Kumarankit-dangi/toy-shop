const API_URL =
    "https://toy-shop-backend.onrender.com";


// =====================================================
// WAKE UP BACKEND
// =====================================================

fetch(`${API_URL}/`)
    .then(() => {

        console.log(
            "✅ Backend is ready"
        );

    })
    .catch(() => {

        console.log(
            "⏳ Backend is waking up..."
        );

    });


// =====================================================
// REGISTER FORM
// =====================================================

const registerForm =
    document.getElementById(
        "register-form"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =====================================================
            // GET FORM VALUES
            // =====================================================

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
            // REGISTER BUTTON
            // =====================================================

            const registerButton =
                registerForm.querySelector(
                    'button[type="submit"]'
                );


            // Prevent double click

            if (registerButton) {

                registerButton.disabled =
                    true;

                registerButton.textContent =
                    "Creating Account...";

            }


            try {

                console.log(
                    "📝 Creating account..."
                );


                // =====================================================
                // REGISTER API
                // =====================================================

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


                // =====================================================
                // REGISTER FAILED
                // =====================================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    alert(
                        data.message ||
                        "Registration failed"
                    );


                    if (registerButton) {

                        registerButton.disabled =
                            false;

                        registerButton.textContent =
                            "Create Account";

                    }


                    return;

                }


                // =====================================================
                // SUCCESS
                // =====================================================

                alert(
                    "🎉 Account created successfully!"
                );


                // Go to login page

                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "❌ Register Error:",
                    error
                );


                alert(
                    "Unable to connect to server. Please try again."
                );


                // Enable button again

                if (registerButton) {

                    registerButton.disabled =
                        false;

                    registerButton.textContent =
                        "Create Account";

                }

            }

        }
    );

}