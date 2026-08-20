// ==========================
// MOBILE MENU
// ==========================

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (menu && nav) {
    menu.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
}


// ==========================
// ADD TO CART
// ==========================

const cartButtons = document.querySelectorAll(".cart-btn");

cartButtons.forEach(button => {

    button.addEventListener("click", () => {

        const product = {
            id: button.dataset.id || Date.now().toString(),
            name: button.dataset.name || "Product",
            price: Number(button.dataset.price) || 0,
            image: button.dataset.image || "",
            quantity: 1
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct = cart.find(
            item => item.id === product.id
        );

        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push(product);

        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();

        alert(product.name + " added to cart!");
    });

});


// ==========================
// CART COUNT
// ==========================

function updateCartCount() {

    const cartCount = document.getElementById("cart-count");

    if (!cartCount) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartCount.textContent = cart.reduce(
        (total, item) => total + (Number(item.quantity) || 1),
        0
    );
}

updateCartCount();


// ==========================
// SEARCH
// ==========================

const searchInput = document.getElementById("search-input");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const products = document.querySelectorAll(".product-card");

        products.forEach(product => {

            const name =
                (product.dataset.name || "").toLowerCase();

            product.style.display =
                name.includes(value) ? "block" : "none";

        });

    });

}


// ==========================
// SHOW CART
// ==========================

const cartContainer =
    document.getElementById("cart-items");

const totalElement =
    document.getElementById("cart-total");

if (cartContainer) {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    cartContainer.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty 🛒</h3>
                <p>Add some toys from the shop.</p>

                <a href="shop.html" class="cart-btn">
                    Continue Shopping
                </a>
            </div>
        `;

    } else {

        cart.forEach(product => {

            const price = Number(product.price) || 0;
            const quantity = Number(product.quantity) || 1;

            const itemTotal = price * quantity;

            total += itemTotal;

            cartContainer.innerHTML += `

                <div class="cart-item">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div class="cart-info">

                        <h3>${product.name}</h3>

                        <p>
                            Price: ₹${price.toFixed(2)}
                        </p>

                        <div class="quantity-controls">

                            <button
                                onclick="decreaseQuantity('${product.id}')">
                                -
                            </button>

                            <span>${quantity}</span>

                            <button
                                onclick="increaseQuantity('${product.id}')">
                                +
                            </button>

                        </div>

                        <strong>
                            Total: ₹${itemTotal.toFixed(2)}
                        </strong>

                    </div>

                    <button
                        class="remove-btn"
                        onclick="removeItem('${product.id}')">
                        Remove
                    </button>

                </div>
            `;
        });
    }

    if (totalElement) {
        totalElement.innerText = total.toFixed(2);
    }
}


// ==========================
// REMOVE ITEM
// ==========================

function removeItem(id) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.filter(
        product => product.id !== id
    );

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    location.reload();
}


// ==========================
// INCREASE QUANTITY
// ==========================

function increaseQuantity(id) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach(product => {

        if (product.id === id) {
            product.quantity += 1;
        }

    });

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    location.reload();
}


// ==========================
// DECREASE QUANTITY
// ==========================

function decreaseQuantity(id) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach(product => {

        if (
            product.id === id &&
            product.quantity > 1
        ) {
            product.quantity -= 1;
        }

    });

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    location.reload();
}


// ==========================
// BUY NOW
// ==========================

const buyNow =
    document.getElementById("buy-now");

if (buyNow) {

    buyNow.addEventListener("click", () => {

        alert("Redirecting to Checkout...");

        window.location.href = "checkout.html";

    });

}


// ==========================
// CHECKOUT PRODUCTS
// ==========================

const checkoutProducts =
    document.getElementById("checkout-products");

if (checkoutProducts) {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let subtotal = 0;

    checkoutProducts.innerHTML = "";

    cart.forEach(product => {

        const price = Number(product.price) || 0;
        const quantity = Number(product.quantity) || 1;

        subtotal += price * quantity;

        checkoutProducts.innerHTML += `

            <div class="checkout-item">

                <span>
                    ${product.name} × ${quantity}
                </span>

                <span>
                    ₹${(price * quantity).toFixed(2)}
                </span>

            </div>
        `;
    });

    const subtotalElement =
        document.getElementById("subtotal");

    const grandTotalElement =
        document.getElementById("grand-total");

    if (subtotalElement) {
        subtotalElement.innerText =
            "₹" + subtotal.toFixed(2);
    }

    const shipping = subtotal > 100 ? 0 : 10;

    if (grandTotalElement) {
        grandTotalElement.innerText =
            "₹" + (subtotal + shipping).toFixed(2);
    }
}


// ==========================
// COUPON
// ==========================

const couponBtn =
    document.getElementById("apply-coupon");

if (couponBtn) {

    couponBtn.addEventListener("click", () => {

        const couponInput =
            document.getElementById("coupon");

        if (!couponInput) return;

        const coupon =
            couponInput.value.trim().toUpperCase();

        const subtotalElement =
            document.getElementById("subtotal");

        const discountElement =
            document.getElementById("discount");

        const grandTotalElement =
            document.getElementById("grand-total");

        if (!subtotalElement) return;

        const subtotal =
            parseFloat(
                subtotalElement.innerText.replace("₹", "")
            ) || 0;

        const shipping = subtotal > 100 ? 0 : 10;

        let discount = 0;

        if (coupon === "SAVE10") {

            discount = subtotal * 0.10;

            localStorage.setItem("coupon", "SAVE10");

            alert("🎉 Coupon Applied Successfully!");

        } else {

            localStorage.removeItem("coupon");

            alert("❌ Invalid Coupon");
        }

        if (discountElement) {
            discountElement.innerText =
                "₹" + discount.toFixed(2);
        }

        if (grandTotalElement) {
            grandTotalElement.innerText =
                "₹" +
                (subtotal + shipping - discount).toFixed(2);
        }

    });

}


// ==========================
// PAYMENT METHOD
// ==========================

const paymentOptions =
    document.querySelectorAll(
        'input[name="payment"]'
    );

paymentOptions.forEach(option => {

    option.addEventListener("change", function () {

        const upiBox =
            document.getElementById("upi-box");

        const cardBox =
            document.getElementById("card-box");

        if (upiBox) {
            upiBox.style.display = "none";
        }

        if (cardBox) {
            cardBox.style.display = "none";
        }

        if (this.value === "upi" && upiBox) {
            upiBox.style.display = "block";
        }

        if (this.value === "card" && cardBox) {
            cardBox.style.display = "block";
        }

    });

});


// ==========================
// PLACE ORDER
// ==========================

const placeOrderBtn =
    document.getElementById("place-order");

if (placeOrderBtn) {

    placeOrderBtn.addEventListener("click", function (e) {

        const payment =
            document.querySelector(
                'input[name="payment"]:checked'
            );

        if (!payment) {

            alert("Please select a payment method.");

            e.preventDefault();

            return;
        }

        if (payment.value === "upi") {

            const upiInput =
                document.getElementById("upi-id");

            if (!upiInput || upiInput.value.trim() === "") {

                alert("Please Enter UPI ID");

                e.preventDefault();

                return;
            }
        }

        if (payment.value === "card") {

            const cardNumber =
                document.getElementById("card-number");

            const cardName =
                document.getElementById("card-name");

            const expiry =
                document.getElementById("expiry");

            const cvv =
                document.getElementById("cvv");

            if (
                !cardNumber ||
                !cardName ||
                !expiry ||
                !cvv ||
                cardNumber.value.trim() === "" ||
                cardName.value.trim() === "" ||
                expiry.value.trim() === "" ||
                cvv.value.trim() === ""
            ) {

                alert("Please Fill Card Details");

                e.preventDefault();

                return;
            }
        }

        localStorage.setItem(
            "paymentMethod",
            payment.value
        );

    });

}


// ==========================
// ORDER SUCCESS
// ==========================

const orderIdText =
    document.getElementById("order-id");

if (orderIdText) {

    const id =
        localStorage.getItem("orderId");

    orderIdText.innerText =
        "Order ID : " + id;
}


// ==========================
// LOAD ORDERS
// ==========================

const ordersContainer =
    document.getElementById("orders-container");

if (ordersContainer) {

    const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    if (orders.length === 0) {

        ordersContainer.innerHTML = `
            <h3>No Orders Yet</h3>
        `;

    } else {

        orders.forEach(order => {

            ordersContainer.innerHTML += `

                <div class="order-card">

                    <h3>
                        Order ID : ${order.id}
                    </h3>

                    <p>
                        Total : ₹${order.total}
                    </p>

                    <p>
                        Payment : ${order.payment}
                    </p>

                    <p>
                        Status : Processing
                    </p>

                </div>
            `;
        });
    }
}


// ==========================
// LOGIN / USER / LOGOUT
// ==========================

function updateLoginUI() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const token =
        localStorage.getItem("token");


    // ==========================================
    // FIND NAVBAR
    // ==========================================

    const navIcons =
        document.querySelector(".nav-icons");

    if (!navIcons) return;


    // ==========================================
    // ADD MY ORDERS LINK
    // ==========================================

    let myOrdersLink =
        navIcons.querySelector(".my-orders-link");


    if (!myOrdersLink) {

        myOrdersLink =
            document.createElement("a");

        myOrdersLink.className =
            "my-orders-link";

        myOrdersLink.textContent =
            "📦 My Orders";


        // Homepage vs pages folder
        const currentPath =
            window.location.pathname;

        if (
            currentPath.includes("/pages/")
        ) {

            myOrdersLink.href =
                "my-orders.html";

        } else {

            myOrdersLink.href =
                "pages/my-orders.html";

        }


        // Put My Orders before Login
        const loginLinks =
            navIcons.querySelectorAll(
                'a[href$="login.html"], .user-profile-link'
            );


        if (loginLinks.length > 0) {

            loginLinks[loginLinks.length - 1]
                .before(myOrdersLink);

        } else {

            navIcons.appendChild(myOrdersLink);

        }

    }


    // ==========================================
    // FIND LOGIN LINK
    // ==========================================

    const loginLinks =
        document.querySelectorAll(
            'a[href$="login.html"]'
        );


    loginLinks.forEach(link => {

        if (user && token) {

            // Avoid adding multiple click handlers
            if (
                link.dataset.loggedIn === "true"
            ) {
                return;
            }

            link.dataset.loggedIn = "true";

            link.classList.add(
                "user-profile-link"
            );

            link.textContent =
                "👤 " + user.name;

            link.href = "#";


            link.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();


                    const confirmLogout =
                        confirm(
                            "Do you want to logout?"
                        );


                    if (confirmLogout) {

                        localStorage.removeItem(
                            "token"
                        );

                        localStorage.removeItem(
                            "user"
                        );

                        alert(
                            "👋 Logged out successfully!"
                        );

                        window.location.reload();

                    }

                }
            );

        }

    });

}

updateLoginUI();


// ==========================
// LOGIN REQUIRED
// ==========================

const token = localStorage.getItem("token");

const currentPage = window.location.pathname;


// Login/Register pages ko allow karo

const isLoginPage =
    currentPage.endsWith("/login.html");

const isRegisterPage =
    currentPage.endsWith("/register.html");


// Agar login nahi hai aur login/register page par bhi nahi hai

if (
    !token &&
    !isLoginPage &&
    !isRegisterPage
) {

    window.location.href =
        "/pages/login.html";

}