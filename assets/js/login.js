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


const loginForm =
    document.getElementById("login-form");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("login-email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("login-password")
                    .value;


            // =====================================================
            // LOGIN BUTTON
            // =====================================================

            const loginButton =
                loginForm.querySelector(
                    'button[type="submit"]'
                );


            // Prevent double click

            if (loginButton) {

                loginButton.disabled = true;

                loginButton.textContent =
                    "Logging in...";

            }


            try {

                console.log(
                    "🔐 Logging in..."
                );


                const response =
                    await fetch(
                        `${API_URL}/api/auth/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email,
                                    password
                                })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Login Response:",
                    data
                );


                // ==================================
                // LOGIN FAILED
                // ==================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    alert(
                        data.message ||
                        "Login failed"
                    );


                    // Enable button again

                    if (loginButton) {

                        loginButton.disabled =
                            false;

                        loginButton.textContent =
                            "Login";

                    }


                    return;

                }


                // ==================================
                // SAVE LOGIN INFORMATION
                // ==================================

                localStorage.setItem(
                    "token",
                    data.token
                );


                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                console.log(
                    "Logged in user:",
                    data.user
                );


                alert(
                    "🎉 Login Successful!"
                );


                // ==================================
                // REDIRECT BASED ON ROLE
                // ==================================

                if (
                    data.user &&
                    data.user.role === "admin"
                ) {

                    console.log(
                        "👑 Admin login detected"
                    );


                    window.location.href =
                        "admin/dashboard.html";


                } else {

                    console.log(
                        "👤 Normal user login detected"
                    );


                    window.location.href =
                        "../index.html";

                }


            } catch (error) {

                console.error(
                    "❌ Login Error:",
                    error
                );


                alert(
                    "Unable to connect to server. Please try again."
                );


                // ==================================
                // ENABLE LOGIN AGAIN
                // ==================================

                if (loginButton) {

                    loginButton.disabled =
                        false;

                    loginButton.textContent =
                        "Login";

                }

            }

        }
    );

}