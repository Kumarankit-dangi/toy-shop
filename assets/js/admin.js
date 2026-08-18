let editIndex = -1;

const API_URL = "http://127.0.0.1:5000";

// =====================================================
// PRODUCT MANAGEMENT
// =====================================================

const form = document.getElementById("product-form");

const editProductData =
    JSON.parse(localStorage.getItem("editProduct"));

if (editProductData && form) {

    document.getElementById("form-title").innerText =
        "Edit Product";

    document.getElementById("product-name").value =
        editProductData.name;

    document.getElementById("product-price").value =
        editProductData.price;

    document.getElementById("product-discount").value =
        editProductData.discount;

    document.getElementById("product-stock").value =
        editProductData.stock;

    document.getElementById("product-category").value =
        editProductData.category;

    document.getElementById("product-image").value =
        editProductData.image;

    document.getElementById("product-description").value =
        editProductData.description;
}


// ADD / UPDATE PRODUCT

if (form) {

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const product = {

            name:
                document.getElementById("product-name").value,

            price:
                document.getElementById("product-price").value,

            discount:
                document.getElementById("product-discount").value,

            stock:
                document.getElementById("product-stock").value,

            category:
                document.getElementById("product-category").value,

            image:
                document.getElementById("product-image").value,

            description:
                document.getElementById("product-description").value

        };

        let products =
            JSON.parse(localStorage.getItem("products")) || [];

        const editing =
            JSON.parse(localStorage.getItem("editProduct"));

        if (editing) {

            const index = products.findIndex(

                p =>
                    p.name === editing.name &&
                    p.price === editing.price

            );

            if (index !== -1) {

                products[index] = product;

            }

            localStorage.removeItem("editProduct");

        } else {

            products.push(product);

        }

        localStorage.setItem(
            "products",
            JSON.stringify(products)
        );

        alert("Product Saved Successfully");

        form.reset();

        window.location.href = "products.html";

    });

}


// LOAD PRODUCTS

function loadProducts() {

    const table =
        document.getElementById("product-table");

    if (!table) return;

    let products =
        JSON.parse(localStorage.getItem("products")) || [];

    table.innerHTML = "";

    products.forEach((product, index) => {

        table.innerHTML += `

        <tr>

            <td>
                <img
                    src="../../${product.image}"
                    width="60"
                >
            </td>

            <td>${product.name}</td>

            <td>${product.category}</td>

            <td>₹${product.price}</td>

            <td>${product.stock}</td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editProduct(${index})"
                >
                    Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteProduct(${index})"
                >
                    Delete
                </button>

            </td>

        </tr>

        `;

    });

}

loadProducts();


// DELETE PRODUCT

function deleteProduct(index) {

    let products =
        JSON.parse(localStorage.getItem("products")) || [];

    products.splice(index, 1);

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    loadProducts();

}


// EDIT PRODUCT

function editProduct(index) {

    const products =
        JSON.parse(localStorage.getItem("products")) || [];

    editIndex = index;

    localStorage.setItem(
        "editProduct",
        JSON.stringify(products[index])
    );

    window.location.href =
        "add-product.html";

}


// =====================================================
// REAL ORDERS - MONGODB
// =====================================================

async function loadOrders() {

    const table =
        document.getElementById("orders-table");

    if (!table) return;

    table.innerHTML = `

        <tr>
            <td colspan="6">
                Loading orders...
            </td>
        </tr>

    `;

    try {

        console.log("📦 Getting all orders...");

        const response =
            await fetch(`${API_URL}/api/orders`);

        console.log(
            "Orders HTTP Status:",
            response.status
        );

        const data =
            await response.json();

        console.log(
            "Orders Response:",
            data
        );

        if (!response.ok || !data.success) {

            throw new Error(
                data.message || "Failed to load orders"
            );

        }

        table.innerHTML = "";

        if (!data.orders || data.orders.length === 0) {

            table.innerHTML = `

                <tr>

                    <td colspan="6">
                        No orders found.
                    </td>

                </tr>

            `;

            return;

        }


        data.orders.forEach((order) => {

            const orderId =
                order._id.substring(
                    order._id.length - 8
                );


            table.innerHTML += `

            <tr>

                <td>
                    #${orderId}
                </td>

                <td>

                    <strong>
                        ${order.name}
                    </strong>

                    <br>

                    <small>
                        ${order.email}
                    </small>

                    <br>

                    <small>
                        ${order.phone}
                    </small>

                </td>

                <td>
                    —
                </td>

                <td>
                    ${order.paymentMethod}
                </td>

                <td>

                    <select
                        onchange="changeOrderStatus(
                            '${order._id}',
                            this.value
                        )"
                    >

                        <option
                            value="Pending"
                            ${order.status === "Pending"
                                ? "selected"
                                : ""}
                        >
                            Pending
                        </option>

                        <option
                            value="Confirmed"
                            ${order.status === "Confirmed"
                                ? "selected"
                                : ""}
                        >
                            Confirmed
                        </option>

                        <option
                            value="Shipped"
                            ${order.status === "Shipped"
                                ? "selected"
                                : ""}
                        >
                            Shipped
                        </option>

                        <option
                            value="Delivered"
                            ${order.status === "Delivered"
                                ? "selected"
                                : ""}
                        >
                            Delivered
                        </option>

                    </select>

                </td>

                <td>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteOrder(
                            '${order._id}'
                        )"
                    >
                        Cancel
                    </button>

                </td>

            </tr>

            `;

        });

    } catch (error) {

        console.error(
            "❌ Load Orders Error:",
            error
        );

        table.innerHTML = `

            <tr>

                <td colspan="6">

                    ❌ Unable to load orders.

                    <br>

                    Make sure backend server
                    is running on port 5000.

                </td>

            </tr>

        `;

    }

}

loadOrders();


// =====================================================
// CHANGE ORDER STATUS
// =====================================================

async function changeOrderStatus(orderId, status) {

    try {

        console.log(
            "🔄 Updating order:",
            orderId,
            status
        );

        const response =
            await fetch(
                `${API_URL}/api/orders/${orderId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );

        const data =
            await response.json();

        console.log(
            "Status Update Response:",
            data
        );

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Status update failed"
            );

        }

        alert(
            `Order status updated to ${status}`
        );

        loadOrders();

    } catch (error) {

        console.error(
            "❌ Status Update Error:",
            error
        );

        alert(
            "Failed to update order status"
        );

    }

}


// =====================================================
// DELETE / CANCEL ORDER
// =====================================================

async function deleteOrder(orderId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to cancel this order?"
        );

    if (!confirmDelete) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/orders/${orderId}`,
                {
                    method: "DELETE"
                }
            );

        const data =
            await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Delete failed"
            );

        }

        alert(
            "Order cancelled successfully"
        );

        loadOrders();

    } catch (error) {

        console.error(
            "❌ Delete Order Error:",
            error
        );

        alert(
            "Failed to cancel order"
        );

    }

}


// =====================================================
// ORDER SEARCH
// =====================================================

const searchOrder =
    document.getElementById("search-order");

if (searchOrder) {

    searchOrder.addEventListener(
        "keyup",
        () => {

            const value =
                searchOrder.value
                    .toLowerCase();

            document
                .querySelectorAll(
                    "#orders-table tr"
                )
                .forEach(row => {

                    const customer =
                        row.children[1]
                            ?.innerText
                            .toLowerCase() || "";

                    row.style.display =
                        customer.includes(value)
                            ? ""
                            : "none";

                });

        }
    );

}


// =====================================================
// USERS
// =====================================================

function loadUsers() {

    const table =
        document.getElementById("users-table");

    if (!table) return;

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    table.innerHTML = "";

    users.forEach((user, index) => {

        table.innerHTML += `

        <tr>

            <td>${user.name}</td>

            <td>${user.email}</td>

            <td>${user.phone || "-"}</td>

            <td>

                <span class="${
                    user.blocked
                        ? "status-blocked"
                        : "status-active"
                }">

                    ${
                        user.blocked
                            ? "Blocked"
                            : "Active"
                    }

                </span>

            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="toggleBlock(${index})"
                >
                    ${
                        user.blocked
                            ? "Unblock"
                            : "Block"
                    }
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteUser(${index})"
                >
                    Delete
                </button>

                <button
                    class="action-btn"
                    onclick="viewUser(${index})"
                >
                    View
                </button>

            </td>

        </tr>

        `;

    });

}

loadUsers();


// BLOCK / UNBLOCK

function toggleBlock(index) {

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    users[index].blocked =
        !users[index].blocked;

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    loadUsers();

}


// DELETE USER

function deleteUser(index) {

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    if (
        confirm(
            "Delete this user?"
        )
    ) {

        users.splice(index, 1);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        loadUsers();

    }

}


// VIEW USER

function viewUser(index) {

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    const user = users[index];

    alert(

        "Name : " + user.name +

        "\nEmail : " + user.email +

        "\nPhone : " +
        (user.phone || "-")

    );

}


// USER SEARCH

const searchUser =
    document.getElementById("search-user");

if (searchUser) {

    searchUser.addEventListener(
        "keyup",
        () => {

            const value =
                searchUser.value
                    .toLowerCase();

            document
                .querySelectorAll(
                    "#users-table tr"
                )
                .forEach(row => {

                    const name =
                        row.children[0]
                            ?.innerText
                            .toLowerCase() || "";

                    const email =
                        row.children[1]
                            ?.innerText
                            .toLowerCase() || "";

                    row.style.display =
                        name.includes(value) ||
                        email.includes(value)
                            ? ""
                            : "none";

                });

        }
    );

}


// =====================================================
// DASHBOARD ANALYTICS
// =====================================================

function loadDashboard() {

    const totalProducts =
        document.getElementById(
            "total-products"
        );

    const totalOrders =
        document.getElementById(
            "total-orders"
        );

    const totalUsers =
        document.getElementById(
            "total-users"
        );

    const totalRevenue =
        document.getElementById(
            "total-revenue"
        );

    if (!totalProducts) return;

    const products =
        JSON.parse(
            localStorage.getItem("products")
        ) || [];

    const users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];

    totalProducts.innerText =
        products.length;

    totalUsers.innerText =
        users.length;

    // Get real MongoDB orders

    fetch(`${API_URL}/api/orders`)
        .then(response =>
            response.json()
        )
        .then(data => {

            if (!data.success) return;

            const orders =
                data.orders || [];

            totalOrders.innerText =
                orders.length;

            let revenue = 0;

            orders.forEach(order => {

                if (
                    order.status ===
                    "Delivered"
                ) {

                    revenue +=
                        Number(order.total) || 0;

                }

            });

            if (totalRevenue) {

                totalRevenue.innerText =
                    "₹" + revenue;

            }

        })
        .catch(error => {

            console.error(
                "Dashboard order error:",
                error
            );

        });

}

loadDashboard();


// =====================================================
// SALES CHART
// =====================================================

function loadSalesChart() {

    const chart =
        document.getElementById(
            "salesChart"
        );

    if (!chart) return;

    if (typeof Chart === "undefined") {

        return;

    }

    new Chart(chart, {

        type: "bar",

        data: {

            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun"
            ],

            datasets: [{

                label: "Sales",

                data: [
                    1200,
                    2400,
                    1800,
                    3100,
                    2600,
                    4000
                ]

            }]

        }

    });

}

loadSalesChart();


// =====================================================
// TOP PRODUCTS
// =====================================================

function loadTopProducts() {

    const list =
        document.getElementById(
            "top-products"
        );

    if (!list) return;

    const products =
        JSON.parse(
            localStorage.getItem("products")
        ) || [];

    list.innerHTML = "";

    products
        .slice(0, 5)
        .forEach(product => {

            list.innerHTML += `

                <li>
                    ${product.name}
                </li>

            `;

        });

}

loadTopProducts();


// =====================================================
// LOW STOCK
// =====================================================

function loadLowStock() {

    const list =
        document.getElementById(
            "low-stock"
        );

    if (!list) return;

    const products =
        JSON.parse(
            localStorage.getItem("products")
        ) || [];

    list.innerHTML = "";

    products

        .filter(
            product =>
                Number(product.stock) <= 5
        )

        .forEach(product => {

            list.innerHTML += `

                <li>
                    ${product.name}
                    (${product.stock})
                </li>

            `;

        });

}

loadLowStock();


// =====================================================
// RECENT ORDERS
// =====================================================

async function loadRecentOrders() {

    const list =
        document.getElementById(
            "recent-orders"
        );

    if (!list) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/orders`
            );

        const data =
            await response.json();

        if (!data.success) return;

        list.innerHTML = "";

        data.orders
            .slice(-5)
            .reverse()
            .forEach(order => {

                list.innerHTML += `

                    <li>
                        ${order.name}
                        -
                        ${order.status}
                    </li>

                `;

            });

    } catch (error) {

        console.error(
            "Recent orders error:",
            error
        );

    }

}

loadRecentOrders();


// =====================================================
// CATEGORY REVENUE
// =====================================================

function loadCategoryRevenue() {

    const table =
        document.getElementById(
            "category-revenue"
        );

    if (!table) return;

    const products =
        JSON.parse(
            localStorage.getItem("products")
        ) || [];

    const revenue = {};

    products.forEach(product => {

        const category =
            product.category;

        const amount =
            Number(product.price) || 0;

        revenue[category] =
            (revenue[category] || 0) +
            amount;

    });

    table.innerHTML = "";

    for (
        let category in revenue
    ) {

        table.innerHTML += `

            <tr>

                <td>
                    ${category}
                </td>

                <td>
                    ₹${revenue[category]}
                </td>

            </tr>

        `;

    }

}

loadCategoryRevenue();


// =====================================================
// BEST PRODUCTS
// =====================================================

function loadBestProducts() {

    const list =
        document.getElementById(
            "best-products"
        );

    if (!list) return;

    const products =
        JSON.parse(
            localStorage.getItem("products")
        ) || [];

    list.innerHTML = "";

    products
        .slice(0, 5)
        .forEach(product => {

            list.innerHTML += `

                <li>
                    ⭐ ${product.name}
                </li>

            `;

        });

}

loadBestProducts();


// =====================================================
// LATEST USERS
// =====================================================

function loadLatestUsers() {

    const list =
        document.getElementById(
            "latest-users"
        );

    if (!list) return;

    const users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];

    list.innerHTML = "";

    users
        .slice(-5)
        .reverse()
        .forEach(user => {

            list.innerHTML += `

                <li>
                    ${user.name}
                </li>

            `;

        });

}

loadLatestUsers();


// =====================================================
// EXPORT ORDERS
// =====================================================

async function exportOrders() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/orders`
            );

        const data =
            await response.json();

        if (!data.success) {

            alert(
                "Failed to export orders"
            );

            return;

        }

        let csv =
            "OrderID,Customer,Email,Phone,Address,Payment,Status\n";

        data.orders.forEach(order => {

            csv +=
                `"${order._id}",` +
                `"${order.name}",` +
                `"${order.email}",` +
                `"${order.phone}",` +
                `"${order.address}",` +
                `"${order.paymentMethod}",` +
                `"${order.status}"\n`;

        });

        const blob =
            new Blob(
                [csv],
                {
                    type: "text/csv"
                }
            );

        const a =
            document.createElement("a");

        a.href =
            URL.createObjectURL(blob);

        a.download =
            "toyland-orders.csv";

        a.click();

    } catch (error) {

        console.error(error);

        alert(
            "Failed to export orders"
        );

    }

}


// =====================================================
// DARK MODE
// =====================================================

const dark =
    document.getElementById(
        "dark-mode"
    );

if (dark) {

    dark.onclick = () => {

        document.body.classList.toggle(
            "dark"
        );

    };

}


// =====================================================
// LANGUAGE
// =====================================================

const language =
    document.getElementById(
        "language"
    );

if (language) {

    language.onchange = () => {

        if (
            language.value === "hi"
        ) {

            alert(
                "Hindi Mode Enabled"
            );

        } else {

            alert(
                "English Mode Enabled"
            );

        }

    };

}