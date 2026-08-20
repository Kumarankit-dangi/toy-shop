const API_URL = "https://toy-shop-backend.onrender.com";

const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("login-email").value.trim();

        const password =
            document.getElementById("login-password").value;

        try {

            console.log("🔐 Logging in...");

            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            console.log("Login Response:", data);

            if (!response.ok || !data.success) {

                alert(
                    data.message || "Login failed"
                );

                return;
            }

            // Save login information
            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            alert("🎉 Login Successful!");

            window.location.href = "../index.html";

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            alert(
                "Unable to connect to server."
            );
        }

    });

}