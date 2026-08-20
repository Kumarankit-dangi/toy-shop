const API_URL = "https://toy-shop-backend.onrender.com";

let orderProcessing = false;

document
    .getElementById("placeOrderBtn")
    .addEventListener("click", async function (event) {

        event.preventDefault();

        // ==========================================
        // PREVENT DOUBLE CLICK
        // ==========================================

        if (orderProcessing) {
            return;
        }

        orderProcessing = true;

        const orderButton =
            document.getElementById("placeOrderBtn");

        orderButton.disabled = true;
        orderButton.textContent = "Processing...";


        // ==========================================
        // CHECK LOGIN TOKEN
        // ==========================================

        const token =
            localStorage.getItem("token");

        if (!token) {

            alert("❌ Please login first.");

            orderProcessing = false;

            orderButton.disabled = false;
            orderButton.textContent = "Place Order";

            window.location.href = "login.html";

            return;
        }


        // ==========================================
        // CUSTOMER DETAILS
        // ==========================================

        const name =
            document
                .querySelector(
                    'input[placeholder="Full Name"]'
                )
                .value.trim();

        const email =
            document
                .querySelector(
                    'input[placeholder="Email"]'
                )
                .value.trim();

        const phone =
            document
                .querySelector(
                    'input[placeholder="Phone Number"]'
                )
                .value.trim();

        const address =
            document
                .querySelector(
                    'input[placeholder="Address"]'
                )
                .value.trim();


        // ==========================================
        // PAYMENT METHOD
        // ==========================================

        const paymentElement =
            document.querySelector(
                'input[name="payment"]:checked'
            );

        if (!paymentElement) {

            alert(
                "Please select a payment method."
            );

            orderProcessing = false;

            orderButton.disabled = false;
            orderButton.textContent = "Place Order";

            return;
        }

        const paymentMethod =
            paymentElement.value;


        // ==========================================
        // GET CART
        // ==========================================

        const cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            orderProcessing = false;

            orderButton.disabled = false;
            orderButton.textContent = "Place Order";

            return;
        }


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !name ||
            !email ||
            !phone ||
            !address
        ) {

            alert(
                "Please fill all details."
            );

            orderProcessing = false;

            orderButton.disabled = false;
            orderButton.textContent = "Place Order";

            return;
        }


        // ==========================================
        // CART ITEMS
        // ==========================================

        const items =
            cart.map(product => ({

                name:
                    product.name,

                price:
                    Number(product.price) || 0,

                quantity:
                    Number(product.quantity) || 1,

                image:
                    product.image || ""

            }));


        // ==========================================
        // TOTAL
        // ==========================================

        const total =
            items.reduce(

                (sum, item) => {

                    return (
                        sum +
                        (
                            item.price *
                            item.quantity
                        )
                    );

                },

                0
            );


        console.log(
            "📦 Cart Items:",
            items
        );

        console.log(
            "💰 Order Total:",
            total
        );

        console.log(
            "💳 Payment:",
            paymentMethod
        );


        // ==========================================
        // ONLINE PAYMENT
        // ==========================================

        if (
            paymentMethod
                .toLowerCase()
                .includes("online") ||

            paymentMethod
                .toLowerCase()
                .includes("razorpay") ||

            paymentMethod
                .toLowerCase()
                .includes("upi") ||

            paymentMethod
                .toLowerCase()
                .includes("card")
        ) {

            await startRazorpayPayment(

                name,
                email,
                phone,
                address,
                items,
                total,
                token,
                orderButton
            );

            return;
        }


        // ==========================================
        // COD
        // ==========================================

        await placeCODOrder(

            name,
            email,
            phone,
            address,
            items,
            total,
            paymentMethod,
            token,
            orderButton
        );

    });


// ==================================================
// COD ORDER
// ==================================================

async function placeCODOrder(

    name,
    email,
    phone,
    address,
    items,
    total,
    paymentMethod,
    token,
    orderButton

) {

    try {

        console.log(
            "📦 Sending COD order..."
        );


        // ==========================================
        // CHECK TOKEN
        // ==========================================

        if (!token) {

            alert(
                "❌ Please login first."
            );

            orderProcessing = false;

            orderButton.disabled = false;
            orderButton.textContent = "Place Order";

            window.location.href =
                "login.html";

            return;
        }


        // ==========================================
        // SEND ORDER TO BACKEND
        // ==========================================

        const response =
            await fetch(

                `${API_URL}/api/orders`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify({

                            name,

                            email,

                            phone,

                            address,

                            items,

                            total,

                            paymentMethod

                        })

                }
            );


        const data =
            await response.json();


        console.log(
            "Backend Response:",
            data
        );


        // ==========================================
        // SUCCESS
        // ==========================================

        if (
            response.ok &&
            data.success
        ) {

            alert(
                "🎉 Order Placed Successfully!"
            );


            localStorage.removeItem(
                "cart"
            );


            window.location.href =
                "../index.html";


            return;
        }


        // ==========================================
        // ERROR
        // ==========================================

        alert(

            "❌ " +
            (
                data.message ||
                "Order failed"
            )

        );


        orderProcessing = false;

        orderButton.disabled = false;
        orderButton.textContent = "Place Order";


    } catch (error) {

        console.error(
            "❌ COD Error:",
            error
        );


        alert(
            "❌ Server se connection nahi ho raha."
        );


        orderProcessing = false;

        orderButton.disabled = false;
        orderButton.textContent = "Place Order";

    }

}


// ==================================================
// RAZORPAY PAYMENT
// ==================================================

async function startRazorpayPayment(

    name,
    email,
    phone,
    address,
    items,
    total,
    token,
    orderButton

) {

    try {

        console.log(
            "💳 Starting Razorpay Payment..."
        );


        // ==========================================
        // CHECK TOKEN
        // ==========================================

        if (!token) {

            alert(
                "❌ Please login first."
            );

            orderProcessing = false;

            orderButton.disabled = false;
            orderButton.textContent = "Place Order";

            window.location.href =
                "login.html";

            return;
        }


        // ==========================================
        // GET RAZORPAY KEY
        // ==========================================

        const keyResponse =
            await fetch(

                `${API_URL}/api/payment/key`

            );


        const keyData =
            await keyResponse.json();


        if (
            !keyResponse.ok ||
            !keyData.success ||
            !keyData.key
        ) {

            throw new Error(
                "Razorpay Key not available"
            );

        }


        // ==========================================
        // CREATE RAZORPAY ORDER
        // ==========================================

        const orderResponse =
            await fetch(

                `${API_URL}/api/payment/create-order`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify({

                            amount: total

                        })

                }
            );


        const orderData =
            await orderResponse.json();


        console.log(
            "Razorpay Order:",
            orderData
        );


        if (
            !orderResponse.ok ||
            !orderData.success
        ) {

            throw new Error(

                orderData.message ||
                "Unable to create Razorpay order"

            );

        }


        // ==========================================
        // RAZORPAY CHECKOUT OPTIONS
        // ==========================================

        const options = {

            key:
                keyData.key,

            amount:
                orderData.order.amount,

            currency:
                orderData.order.currency,

            name:
                "Toyland",

            description:
                "Toyland Toy Shop Order",

            order_id:
                orderData.order.id,


            // ======================================
            // CUSTOMER DETAILS
            // ======================================

            prefill: {

                name:
                    name,

                email:
                    email,

                contact:
                    phone

            },


            // ======================================
            // NOTES
            // ======================================

            notes: {

                address:
                    address

            },


            // ======================================
            // THEME
            // ======================================

            theme: {

                color:
                    "#ff6b6b"

            },


            // ======================================
            // PAYMENT SUCCESS
            // ======================================

            handler:
                async function (response) {

                    console.log(
                        "✅ Razorpay Payment Success:",
                        response
                    );


                    // ==================================
                    // SAVE ORDER AFTER PAYMENT
                    // ==================================

                    try {

                        const saveResponse =
                            await fetch(

                                `${API_URL}/api/orders`,

                                {

                                    method:
                                        "POST",

                                    headers: {

                                        "Content-Type":
                                            "application/json",

                                        "Authorization":
                                            `Bearer ${token}`

                                    },

                                    body:
                                        JSON.stringify({

                                            name:
                                                name,

                                            email:
                                                email,

                                            phone:
                                                phone,

                                            address:
                                                address,

                                            items:
                                                items,

                                            total:
                                                total,

                                            paymentMethod:
                                                "Razorpay",

                                            razorpayOrderId:
                                                response
                                                    .razorpay_order_id,

                                            razorpayPaymentId:
                                                response
                                                    .razorpay_payment_id

                                        })

                                }

                            );


                        const saveData =
                            await saveResponse.json();


                        console.log(
                            "Saved Order:",
                            saveData
                        );


                        // ==================================
                        // ORDER SAVED
                        // ==================================

                        if (
                            saveResponse.ok &&
                            saveData.success
                        ) {

                            alert(
                                "🎉 Payment Successful! Order Placed!"
                            );


                            localStorage.removeItem(
                                "cart"
                            );


                            window.location.href =
                                "../index.html";


                            return;
                        }


                        // ==================================
                        // ORDER SAVE FAILED
                        // ==================================

                        alert(
                            "Payment succeeded, but order saving failed."
                        );


                        orderProcessing = false;

                        orderButton.disabled = false;
                        orderButton.textContent =
                            "Place Order";


                    } catch (error) {

                        console.error(
                            "Order Save Error:",
                            error
                        );


                        alert(
                            "Payment successful, but order saving failed."
                        );


                        orderProcessing = false;

                        orderButton.disabled = false;
                        orderButton.textContent =
                            "Place Order";

                    }

                },


            // ======================================
            // PAYMENT POPUP CLOSE
            // ======================================

            modal: {

                ondismiss:
                    function () {

                        console.log(
                            "Payment popup closed."
                        );

                        orderProcessing = false;

                        orderButton.disabled = false;
                        orderButton.textContent =
                            "Place Order";

                    }

            }

        };


        // ==========================================
        // CREATE RAZORPAY INSTANCE
        // ==========================================

        const razorpay =
            new Razorpay(options);


        // ==========================================
        // PAYMENT FAILED
        // ==========================================

        razorpay.on(

            "payment.failed",

            function (response) {

                console.error(
                    "❌ Payment Failed:",
                    response.error
                );


                alert(

                    "❌ Payment Failed: " +
                    response.error.description

                );


                orderProcessing = false;

                orderButton.disabled = false;
                orderButton.textContent =
                    "Place Order";

            }

        );


        // ==========================================
        // OPEN RAZORPAY
        // ==========================================

        razorpay.open();


    } catch (error) {

        console.error(
            "❌ Razorpay Error:",
            error
        );


        alert(
            "❌ Unable to start payment."
        );


        orderProcessing = false;

        orderButton.disabled = false;
        orderButton.textContent =
            "Place Order";

    }

}