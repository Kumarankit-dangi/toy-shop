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


            ordersContainer.innerHTML += `

                <div class="order-card">

                    <div class="order-header">

                        <div>

                            <h2>
                                Order #${order._id
                                    .slice(-8)}
                            </h2>

                            <p>
                                ${orderDate}
                            </p>

                        </div>

                        <span class="order-status">
                            ${order.status}
                        </span>

                    </div>


                    <div class="order-items">

                        ${itemsHTML}

                    </div>


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