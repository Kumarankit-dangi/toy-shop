const API_URL =
    "https://toy-shop-backend.onrender.com";

const ordersContainer =
    document.getElementById(
        "orders-container"
    );


// ==========================================
// CHECK LOGIN
// ==========================================

const token =
    localStorage.getItem("token");

if (!token) {

    window.location.href =
        "login.html";

}


// ==========================================
// LOAD MY ORDERS
// ==========================================

async function loadMyOrders() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/orders/my-orders`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "My Orders:",
            data
        );


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Failed to load orders"
            );

        }


        // ==================================
        // NO ORDERS
        // ==================================

        if (
            !data.orders ||
            data.orders.length === 0
        ) {

            ordersContainer.innerHTML = `

                <div class="empty-cart">

                    <h3>
                        You haven't placed any orders yet 📦
                    </h3>

                    <p>
                        Start shopping and your orders
                        will appear here.
                    </p>

                    <a
                        href="shop.html"
                        class="cart-btn"
                    >
                        Start Shopping
                    </a>

                </div>

            `;

            return;

        }


        // ==================================
        // DISPLAY ORDERS
        // ==================================

        ordersContainer.innerHTML = "";


        data.orders.forEach(order => {


            // ==================================
            // ORDER DATE
            // ==================================

            const orderDate =
                new Date(
                    order.createdAt
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                );


            // ==================================
            // ORDER ITEMS
            // ==================================

            const itemsHTML =
                order.items.map(item => `

                    <div class="order-item">

                        <img
                            src="${item.image || ""}"
                            alt="${item.name}"
                        >

                        <div>

                            <h3>
                                ${item.name}
                            </h3>

                            <p>
                                ₹${Number(
                                    item.price
                                ).toFixed(2)}
                                ×
                                ${item.quantity}
                            </p>

                        </div>

                    </div>

                `).join("");


            // ==================================
            // ORDER STATUS
            // ==================================

            const status =
                order.status || "Pending";


            // ==================================
            // TRACKING STATUS
            // ==================================

            const pendingCompleted =
                [
                    "Pending",
                    "Confirmed",
                    "Shipped",
                    "Delivered"
                ].includes(status);


            const confirmedCompleted =
                [
                    "Confirmed",
                    "Shipped",
                    "Delivered"
                ].includes(status);


            const shippedCompleted =
                [
                    "Shipped",
                    "Delivered"
                ].includes(status);


            const deliveredCompleted =
                status === "Delivered";


            // ==================================
            // ORDER CARD
            // ==================================

            ordersContainer.innerHTML += `

                <div class="order-card">


                    <!-- ORDER HEADER -->

                    <div class="order-header">

                        <div>

                            <h2>
                                Order #${order._id.slice(-8)}
                            </h2>

                            <p>
                                ${orderDate}
                            </p>

                        </div>


                        <span class="order-status">

                            ${status}

                        </span>

                    </div>


                    <!-- ORDER ITEMS -->

                    <div class="order-items">

                        ${itemsHTML}

                    </div>


                    <!-- ORDER TRACKING -->

                    <div class="order-tracking">

                        <h3>
                            Order Tracking
                        </h3>


                        <div class="tracking-line">


                            <!-- PENDING -->

                            <div
                                class="tracking-step ${
                                    pendingCompleted
                                        ? "completed"
                                        : ""
                                }"
                            >

                                <div class="tracking-dot">

                                    ${
                                        pendingCompleted
                                            ? "✓"
                                            : ""
                                    }

                                </div>

                                <span>
                                    Pending
                                </span>

                            </div>


                            <!-- CONFIRMED -->

                            <div
                                class="tracking-step ${
                                    confirmedCompleted
                                        ? "completed"
                                        : ""
                                }"
                            >

                                <div class="tracking-dot">

                                    ${
                                        confirmedCompleted
                                            ? "✓"
                                            : ""
                                    }

                                </div>

                                <span>
                                    Confirmed
                                </span>

                            </div>


                            <!-- SHIPPED -->

                            <div
                                class="tracking-step ${
                                    shippedCompleted
                                        ? "completed"
                                        : ""
                                }"
                            >

                                <div class="tracking-dot">

                                    ${
                                        shippedCompleted
                                            ? "✓"
                                            : ""
                                    }

                                </div>

                                <span>
                                    Shipped
                                </span>

                            </div>


                            <!-- DELIVERED -->

                            <div
                                class="tracking-step ${
                                    deliveredCompleted
                                        ? "completed"
                                        : ""
                                }"
                            >

                                <div class="tracking-dot">

                                    ${
                                        deliveredCompleted
                                            ? "✓"
                                            : ""
                                    }

                                </div>

                                <span>
                                    Delivered
                                </span>

                            </div>


                        </div>

                    </div>


                    <!-- ORDER FOOTER -->

                    <div class="order-footer">

                        <span>

                            Payment:

                            <strong>
                                ${order.paymentMethod}
                            </strong>

                        </span>


                        <strong>

                            Total:

                            ₹${Number(
                                order.total
                            ).toFixed(2)}

                        </strong>

                    </div>


                </div>

            `;

        });


    } catch (error) {

        console.error(
            "❌ My Orders Error:",
            error
        );


        ordersContainer.innerHTML = `

            <div class="empty-cart">

                <h3>
                    Unable to load orders
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


// ==========================================
// START
// ==========================================

loadMyOrders();