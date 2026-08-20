// =====================================================
// API
// =====================================================

const API_URL =
    "https://toy-shop-backend.onrender.com";


// =====================================================
// ADMIN PAGE PROTECTION
// =====================================================

(async function protectAdminPage() {

    const token =
        localStorage.getItem("token");


    // User is not logged in
    if (!token) {

        alert("Please login first.");

        window.location.replace(
            "../../index.html"
        );

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/api/auth/users`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        // Backend rejected the user
        if (!response.ok) {

            alert(
                "Admin access required."
            );

            window.location.replace(
                "../../index.html"
            );

            return;
        }


        console.log(
            "✅ Admin access verified"
        );


    } catch (error) {

        console.error(
            "Admin verification failed:",
            error
        );

        alert(
            "Unable to verify admin access."
        );

        window.location.replace(
            "../../index.html"
        );

    }

})();


// =====================================================
// EXISTING CODE
// =====================================================

let editIndex = -1;


// =====================================================
// AUTH HELPER
// =====================================================

function getAuthHeaders() {

    const token =
        localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

}


// =====================================================
// PRODUCT MANAGEMENT - MONGODB
// =====================================================

const form =
    document.getElementById("product-form");

const editProductData =
    JSON.parse(
        localStorage.getItem("editProduct")
    );


// =====================================================
// LOAD PRODUCT INTO EDIT FORM
// =====================================================

if (editProductData && form) {

    const formTitle =
        document.getElementById("form-title");

    if (formTitle) {

        formTitle.innerText =
            "Edit Product";

    }


    const nameInput =
        document.getElementById("product-name");

    const priceInput =
        document.getElementById("product-price");

    const discountInput =
        document.getElementById("product-discount");

    const stockInput =
        document.getElementById("product-stock");

    const categoryInput =
        document.getElementById("product-category");

    const imageInput =
        document.getElementById("product-image");

    const descriptionInput =
        document.getElementById("product-description");


    if (nameInput)
        nameInput.value =
            editProductData.name || "";


    if (priceInput)
        priceInput.value =
            editProductData.price || "";


    if (discountInput)
        discountInput.value =
            editProductData.discount || 0;


    if (stockInput)
        stockInput.value =
            editProductData.stock || 0;


    if (categoryInput)
        categoryInput.value =
            editProductData.category || "";


    if (imageInput)
        imageInput.value =
            editProductData.image || "";


    if (descriptionInput)
        descriptionInput.value =
            editProductData.description || "";

}


// =====================================================
// ADD / UPDATE PRODUCT
// =====================================================

if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                if (!token) {

                    alert(
                        "Please login as admin."
                    );

                    return;

                }


                const product = {

                    name:
                        document.getElementById(
                            "product-name"
                        ).value.trim(),

                    price:
                        Number(
                            document.getElementById(
                                "product-price"
                            ).value
                        ),

                    discount:
                        Number(
                            document.getElementById(
                                "product-discount"
                            ).value
                        ) || 0,

                    stock:
                        Number(
                            document.getElementById(
                                "product-stock"
                            ).value
                        ),

                    category:
                        document.getElementById(
                            "product-category"
                        ).value.trim(),

                    image:
                        document.getElementById(
                            "product-image"
                        ).value.trim(),

                    description:
                        document.getElementById(
                            "product-description"
                        ).value.trim()

                };


                const editing =
                    JSON.parse(
                        localStorage.getItem(
                            "editProduct"
                        )
                    );


                let url =
                    `${API_URL}/api/products`;

                let method =
                    "POST";


                if (
                    editing &&
                    editing._id
                ) {

                    url =
                        `${API_URL}/api/products/${editing._id}`;

                    method =
                        "PUT";

                }


                const response =
                    await fetch(
                        url,
                        {

                            method,

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify(
                                    product
                                )

                        }
                    );


                const responseText = await response.text();

console.log(
    "Product Save HTTP Status:",
    response.status
);

console.log(
    "Product Save Raw Response:",
    responseText
);

let data;

try {

    data = JSON.parse(responseText);

} catch (parseError) {

    throw new Error(
        "Server returned invalid JSON. HTTP " +
        response.status +
        ": " +
        responseText.substring(0, 200)
    );

}

console.log(
    "Product Save Response:",
    data
);

                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Product save failed"
                    );

                }


                alert(
                    editing
                        ? "Product updated successfully!"
                        : "Product added successfully!"
                );


                localStorage.removeItem(
                    "editProduct"
                );


                form.reset();


                window.location.href =
                    "products.html";


            } catch (error) {

                console.error(
                    "❌ Product Save Error:",
                    error
                );


                alert(
                    "Failed to save product: " +
                    error.message
                );

            }

        }
    );

}


// =====================================================
// LOAD PRODUCTS FROM MONGODB
// =====================================================

async function loadProducts() {

    const table =
        document.getElementById(
            "product-table"
        );


    if (!table)
        return;


    table.innerHTML = `

        <tr>

            <td colspan="6">

                Loading products...

            </td>

        </tr>

    `;


    try {

        console.log(
            "📦 Getting products from MongoDB..."
        );


        const response =
            await fetch(
                `${API_URL}/api/products`
            );


        const data =
            await response.json();


        console.log(
            "Products Response:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load products"
            );

        }


        const products =
            data.products || [];


        table.innerHTML =
            "";


        if (
            products.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td colspan="6">

                        No products found.

                    </td>

                </tr>

            `;

            return;

        }


        products.forEach(
            function (product) {

                const image =
                    product.image || "";


                let imageSrc =
                    image;


                if (
                    image &&
                    !image.startsWith(
                        "http"
                    )
                ) {

                    imageSrc =
                        `../../${image}`;

                }


                table.innerHTML += `

                    <tr>

                        <td>

                            <img
                                src="${imageSrc}"
                                width="60"
                                height="60"
                                style="
                                    object-fit: contain;
                                "
                                alt="${product.name || "Product"}"
                                onerror="
                                    this.style.display='none'
                                "
                            >

                        </td>


                        <td>

                            ${product.name || "-"}

                        </td>


                        <td>

                            ${product.category || "-"}

                        </td>


                        <td>

                            ₹${Number(
                                product.price || 0
                            ).toFixed(2)}

                        </td>


                        <td>

                            ${product.stock ?? 0}

                        </td>


                        <td>

                            <button
                                class="action-btn edit-btn"
                                onclick="
                                    editProduct(
                                        '${product._id}'
                                    )
                                "
                            >

                                Edit

                            </button>


                            <button
                                class="
                                    action-btn
                                    delete-btn
                                "
                                onclick="
                                    deleteProduct(
                                        '${product._id}'
                                    )
                                "
                            >

                                Delete

                            </button>

                        </td>

                    </tr>

                `;

            }
        );


    } catch (error) {

        console.error(
            "❌ Load Products Error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td colspan="6">

                    ❌ Unable to load products.

                    <br><br>

                    ${error.message}

                </td>

            </tr>

        `;

    }

}


loadProducts();


// =====================================================
// DELETE PRODUCT
// =====================================================

async function deleteProduct(
    productId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed)
        return;


    try {

        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            alert(
                "Please login as admin."
            );

            return;

        }


        const response =
            await fetch(
                `${API_URL}/api/products/${productId}`,
                {

                    method:
                        "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        console.log(
            "Delete Product Response:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Delete failed"
            );

        }


        alert(
            "Product deleted successfully!"
        );


        loadProducts();


    } catch (error) {

        console.error(
            "❌ Delete Product Error:",
            error
        );


        alert(
            "Failed to delete product: " +
            error.message
        );

    }

}


// =====================================================
// EDIT PRODUCT
// =====================================================

async function editProduct(
    productId
) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/products`
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load product"
            );

        }


        const product =
            (data.products || [])
                .find(
                    function (item) {

                        return (
                            item._id ===
                            productId
                        );

                    }
                );


        if (!product) {

            alert(
                "Product not found."
            );

            return;

        }


        localStorage.setItem(
            "editProduct",
            JSON.stringify(
                product
            )
        );


        window.location.href =
            "add-product.html";


    } catch (error) {

        console.error(
            "❌ Edit Product Error:",
            error
        );


        alert(
            "Failed to open product: " +
            error.message
        );

    }

}


// =====================================================
// REAL ORDERS - MONGODB
// =====================================================

async function loadOrders() {

    const table =
        document.getElementById(
            "orders-table"
        );


    if (!table)
        return;


    table.innerHTML = `

        <tr>

            <td colspan="6">
                Loading orders...
            </td>

        </tr>

    `;


    try {

        console.log(
            "📦 Getting all orders..."
        );


        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            table.innerHTML = `

                <tr>

                    <td colspan="6">

                        ❌ Please login as admin.

                    </td>

                </tr>

            `;

            return;

        }


        const response =
            await fetch(
                `${API_URL}/api/orders`,
                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


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


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load orders"
            );

        }


        table.innerHTML =
            "";


        if (
            !data.orders ||
            data.orders.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td colspan="6">
                        No orders found.
                    </td>

                </tr>

            `;

            return;

        }


        data.orders.forEach(
            function (order) {

                const orderId =
                    order._id.substring(
                        order._id.length - 8
                    );


                const total =
                    Number(
                        order.total
                    ) || 0;


                const status =
                    order.status ||
                    "Pending";


                table.innerHTML += `

                    <tr>

                        <td>
                            #${orderId}
                        </td>

                        <td>

                            <strong>
                                ${order.name || "-"}
                            </strong>

                            <br>

                            <small>
                                ${order.email || "-"}
                            </small>

                            <br>

                            <small>
                                ${order.phone || "-"}
                            </small>

                        </td>

                        <td>

                            <strong>
                                ₹${total.toFixed(2)}
                            </strong>

                        </td>

                        <td>
                            ${order.paymentMethod || "-"}
                        </td>

                        <td>

                            <select
                                onchange="
                                    changeOrderStatus(
                                        '${order._id}',
                                        this.value
                                    )
                                "
                            >

                                <option
                                    value="Pending"
                                    ${
                                        status === "Pending"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Pending
                                </option>

                                <option
                                    value="Confirmed"
                                    ${
                                        status === "Confirmed"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Confirmed
                                </option>

                                <option
                                    value="Shipped"
                                    ${
                                        status === "Shipped"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Shipped
                                </option>

                                <option
                                    value="Delivered"
                                    ${
                                        status === "Delivered"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Delivered
                                </option>

                            </select>

                        </td>

                        <td>

                            <button
                                class="
                                    action-btn
                                    delete-btn
                                "
                                onclick="
                                    deleteOrder(
                                        '${order._id}'
                                    )
                                "
                            >

                                Cancel

                            </button>

                        </td>

                    </tr>

                `;

            }
        );


    } catch (error) {

        console.error(
            "❌ Load Orders Error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td colspan="6">

                    ❌ Unable to load orders.

                    <br><br>

                    ${error.message}

                </td>

            </tr>

        `;

    }

}


loadOrders();


// =====================================================
// CHANGE ORDER STATUS
// =====================================================

async function changeOrderStatus(
    orderId,
    status
) {

    try {

        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            alert(
                "Please login first."
            );

            return;

        }


        const response =
            await fetch(
                `${API_URL}/api/orders/${orderId}/status`,
                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify({
                            status
                        })

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

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
            "Failed to update order status: " +
            error.message
        );

    }

}


// =====================================================
// DELETE / CANCEL ORDER
// =====================================================

async function deleteOrder(
    orderId
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to cancel this order?"
        );


    if (!confirmDelete)
        return;


    try {

        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            alert(
                "Please login first."
            );

            return;

        }


        const response =
            await fetch(
                `${API_URL}/api/orders/${orderId}`,
                {

                    method:
                        "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

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
            "Failed to cancel order: " +
            error.message
        );

    }

}


// =====================================================
// ORDER SEARCH
// =====================================================

const searchOrder =
    document.getElementById(
        "search-order"
    );


if (searchOrder) {

    searchOrder.addEventListener(
        "keyup",
        function () {

            const value =
                searchOrder.value
                    .toLowerCase();


            document
                .querySelectorAll(
                    "#orders-table tr"
                )
                .forEach(
                    function (row) {

                        const customer =
                            row.children[1]
                                ?.innerText
                                .toLowerCase() ||
                            "";


                        row.style.display =
                            customer.includes(
                                value
                            )
                                ? ""
                                : "none";

                    }
                );

        }
    );

}


// =====================================================
// REAL USERS - MONGODB
// =====================================================

async function loadUsers() {

    const table =
        document.getElementById(
            "users-table"
        );


    if (!table)
        return;


    table.innerHTML = `

        <tr>

            <td colspan="5">
                Loading users...
            </td>

        </tr>

    `;


    try {

        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            throw new Error(
                "Please login as admin."
            );

        }


        const response =
            await fetch(
                `${API_URL}/api/auth/users`,
                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        console.log(
            "Users Response:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load users"
            );

        }


        table.innerHTML =
            "";


        if (
            !data.users ||
            data.users.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td colspan="5">
                        No users found.
                    </td>

                </tr>

            `;

            return;

        }


        data.users.forEach(
            function (user) {

                const createdDate =
                    user.createdAt
                        ? new Date(
                            user.createdAt
                        ).toLocaleDateString(
                            "en-IN"
                        )
                        : "-";


                table.innerHTML += `

                    <tr>

                        <td>
                            ${user.name}
                        </td>

                        <td>
                            ${user.email}
                        </td>

                        <td>
                            -
                        </td>

                        <td>

                            <span class="status-active">

                                ${
                                    user.role === "admin"
                                        ? "Admin"
                                        : "Active"
                                }

                            </span>

                        </td>

                        <td>

                            <button
                                class="action-btn"
                                onclick="
                                    viewUser(
                                        '${user._id}',
                                        '${user.name}',
                                        '${user.email}',
                                        '${user.role}',
                                        '${createdDate}'
                                    )
                                "
                            >

                                View

                            </button>

                        </td>

                    </tr>

                `;

            }
        );


    } catch (error) {

        console.error(
            "❌ Load Users Error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td colspan="5">

                    ❌ Unable to load users.

                    <br><br>

                    ${error.message}

                </td>

            </tr>

        `;

    }

}


loadUsers();


// =====================================================
// VIEW USER
// =====================================================

function viewUser(
    id,
    name,
    email,
    role,
    createdAt
) {

    alert(

        "User ID : " +
        id +

        "\nName : " +
        name +

        "\nEmail : " +
        email +

        "\nRole : " +
        role +

        "\nJoined : " +
        createdAt

    );

}


// =====================================================
// USER SEARCH
// =====================================================

const searchUser =
    document.getElementById(
        "search-user"
    );


if (searchUser) {

    searchUser.addEventListener(
        "keyup",
        function () {

            const value =
                searchUser.value
                    .toLowerCase();


            document
                .querySelectorAll(
                    "#users-table tr"
                )
                .forEach(
                    function (row) {

                        const name =
                            row.children[0]
                                ?.innerText
                                .toLowerCase() ||
                            "";


                        const email =
                            row.children[1]
                                ?.innerText
                                .toLowerCase() ||
                            "";


                        row.style.display =
                            name.includes(value) ||
                            email.includes(value)
                                ? ""
                                : "none";

                    }
                );

        }
    );

}


// =====================================================
// DASHBOARD ANALYTICS
// =====================================================

async function loadDashboard() {

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


    if (!totalProducts)
        return;


    totalProducts.innerText =
        "...";

    totalOrders.innerText =
        "...";

    totalUsers.innerText =
        "...";


    if (totalRevenue) {

        totalRevenue.innerText =
            "...";

    }


    try {

        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            throw new Error(
                "Please login as admin."
            );

        }


        const productsResponse =
            await fetch(
                `${API_URL}/api/products`
            );


        const productsData =
            await productsResponse.json();


        let products = [];


        if (
            Array.isArray(
                productsData
            )
        ) {

            products =
                productsData;

        } else if (
            Array.isArray(
                productsData.products
            )
        ) {

            products =
                productsData.products;

        }


        totalProducts.innerText =
            products.length;


        const ordersResponse =
            await fetch(
                `${API_URL}/api/orders`,
                {

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const ordersData =
            await ordersResponse.json();


        if (
            !ordersResponse.ok ||
            !ordersData.success
        ) {

            throw new Error(
                ordersData.message ||
                "Failed to load orders"
            );

        }


        const orders =
            ordersData.orders || [];


        totalOrders.innerText =
            orders.length;


        const usersResponse =
            await fetch(
                `${API_URL}/api/auth/users`,
                {

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const usersData =
            await usersResponse.json();


        if (
            !usersResponse.ok ||
            !usersData.success
        ) {

            throw new Error(
                usersData.message ||
                "Failed to load users"
            );

        }


        const users =
            usersData.users || [];


        totalUsers.innerText =
            users.length;


        let revenue = 0;


        orders.forEach(
            function (order) {

                if (
                    order.status ===
                    "Delivered"
                ) {

                    revenue +=
                        Number(
                            order.total
                        ) || 0;

                }

            }
        );


        if (totalRevenue) {

            totalRevenue.innerText =
                "₹" +
                revenue.toFixed(2);

        }


    } catch (error) {

        console.error(
            "❌ Dashboard Error:",
            error
        );


        totalProducts.innerText =
            "0";

        totalOrders.innerText =
            "0";

        totalUsers.innerText =
            "0";


        if (totalRevenue) {

            totalRevenue.innerText =
                "₹0";

        }

    }

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


    if (!chart)
        return;


    if (
        typeof Chart ===
        "undefined"
    )
        return;


    new Chart(
        chart,
        {

            type:
                "bar",

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

                    label:
                        "Sales",

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

        }
    );

}


loadSalesChart();


// =====================================================
// TOP PRODUCTS
// =====================================================

async function loadTopProducts() {

    const list =
        document.getElementById(
            "top-products"
        );


    if (!list)
        return;


    try {

        const response =
            await fetch(
                `${API_URL}/api/products`
            );


        const data =
            await response.json();


        let products = [];


        if (
            Array.isArray(data)
        ) {

            products =
                data;

        } else if (
            Array.isArray(
                data.products
            )
        ) {

            products =
                data.products;

        }


        list.innerHTML =
            "";


        products
            .slice(0, 5)
            .forEach(
                function (product) {

                    list.innerHTML += `

                        <li>
                            ${product.name}
                        </li>

                    `;

                }
            );


    } catch (error) {

        console.error(
            "Top products error:",
            error
        );

    }

}


loadTopProducts();


// =====================================================
// LOW STOCK
// =====================================================

async function loadLowStock() {

    const list =
        document.getElementById(
            "low-stock"
        );


    if (!list)
        return;


    try {

        const response =
            await fetch(
                `${API_URL}/api/products`
            );


        const data =
            await response.json();


        let products = [];


        if (
            Array.isArray(data)
        ) {

            products =
                data;

        } else if (
            Array.isArray(
                data.products
            )
        ) {

            products =
                data.products;

        }


        list.innerHTML =
            "";


        products
            .filter(
                function (product) {

                    return Number(
                        product.stock
                    ) <= 5;

                }
            )
            .forEach(
                function (product) {

                    list.innerHTML += `

                        <li>

                            ${product.name}

                            (${product.stock})

                        </li>

                    `;

                }
            );


    } catch (error) {

        console.error(
            "Low stock error:",
            error
        );

    }

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


    if (!list)
        return;


    try {

        const token =
            localStorage.getItem(
                "token"
            );


        const response =
            await fetch(
                `${API_URL}/api/orders`,
                {

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!data.success)
            return;


        list.innerHTML =
            "";


        data.orders
            .slice(0, 5)
            .forEach(
                function (order) {

                    list.innerHTML += `

                        <li>

                            ${order.name}

                            -

                            ${order.status}

                        </li>

                    `;

                }
            );


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

async function loadCategoryRevenue() {

    const table =
        document.getElementById(
            "category-revenue"
        );


    if (!table)
        return;


    try {

        const response =
            await fetch(
                `${API_URL}/api/products`
            );


        const data =
            await response.json();


        let products = [];


        if (
            Array.isArray(data)
        ) {

            products =
                data;

        } else if (
            Array.isArray(
                data.products
            )
        ) {

            products =
                data.products;

        }


        const revenue = {};


        products.forEach(
            function (product) {

                const category =
                    product.category ||
                    "Other";


                const amount =
                    Number(
                        product.price
                    ) || 0;


                revenue[category] =
                    (
                        revenue[category] ||
                        0
                    ) + amount;

            }
        );


        table.innerHTML =
            "";


        for (
            const category in revenue
        ) {

            table.innerHTML += `

                <tr>

                    <td>
                        ${category}
                    </td>

                    <td>
                        ₹${revenue[category].toFixed(2)}
                    </td>

                </tr>

            `;

        }


    } catch (error) {

        console.error(
            "Category revenue error:",
            error
        );

    }

}


loadCategoryRevenue();


// =====================================================
// BEST PRODUCTS
// =====================================================

async function loadBestProducts() {

    const list =
        document.getElementById(
            "best-products"
        );


    if (!list)
        return;


    try {

        const response =
            await fetch(
                `${API_URL}/api/products`
            );


        const data =
            await response.json();


        let products = [];


        if (
            Array.isArray(data)
        ) {

            products =
                data;

        } else if (
            Array.isArray(
                data.products
            )
        ) {

            products =
                data.products;

        }


        list.innerHTML =
            "";


        products
            .slice(0, 5)
            .forEach(
                function (product) {

                    list.innerHTML += `

                        <li>
                            ⭐ ${product.name}
                        </li>

                    `;

                }
            );


    } catch (error) {

        console.error(
            "Best products error:",
            error
        );

    }

}


loadBestProducts();


// =====================================================
// LATEST USERS
// =====================================================

async function loadLatestUsers() {

    const list =
        document.getElementById(
            "latest-users"
        );


    if (!list)
        return;


    try {

        const token =
            localStorage.getItem(
                "token"
            );


        const response =
            await fetch(
                `${API_URL}/api/auth/users`,
                {

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load users"
            );

        }


        list.innerHTML =
            "";


        (data.users || [])
            .slice(0, 5)
            .forEach(
                function (user) {

                    list.innerHTML += `

                        <li>
                            ${user.name}
                        </li>

                    `;

                }
            );


    } catch (error) {

        console.error(
            "Latest users error:",
            error
        );

    }

}


loadLatestUsers();


// =====================================================
// EXPORT ORDERS
// =====================================================

async function exportOrders() {

    try {

        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            alert(
                "Please login first."
            );

            return;

        }


        const response =
            await fetch(
                `${API_URL}/api/orders`,
                {

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
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
            "OrderID,Customer,Email,Phone,Address,Payment,Status,Total\n";


        data.orders.forEach(
            function (order) {

                csv +=
                    `"${order._id}",` +
                    `"${order.name}",` +
                    `"${order.email}",` +
                    `"${order.phone}",` +
                    `"${order.address}",` +
                    `"${order.paymentMethod}",` +
                    `"${order.status}",` +
                    `"${order.total}"\n`;

            }
        );


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv"
                }
            );


        const a =
            document.createElement(
                "a"
            );


        a.href =
            URL.createObjectURL(
                blob
            );


        a.download =
            "toyland-orders.csv";


        a.click();


        URL.revokeObjectURL(
            a.href
        );


    } catch (error) {

        console.error(
            "Export Orders Error:",
            error
        );


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

    dark.onclick = function () {

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

    language.onchange =
        function () {

            if (
                language.value ===
                "hi"
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