// =====================================================
// TOYLAND MAIN.JS
// =====================================================


// =====================================================
// AUTH
// =====================================================

const authToken =
    localStorage.getItem("token");

const currentPage =
    window.location.pathname.toLowerCase();

const isLoginPage =
    currentPage.includes("login.html");

const isRegisterPage =
    currentPage.includes("register.html");

const isPreview =
    new URLSearchParams(
        window.location.search
    ).get("preview") === "true";


// =====================================================
// REQUIRE LOGIN
// =====================================================

if (
    !authToken &&
    !isLoginPage &&
    !isRegisterPage &&
    !isPreview
) {

    // Homepage can be opened without login.
    // Protected pages will still redirect to login.

    if (
        currentPage.includes("/pages/") &&
        !currentPage.includes("shop.html") &&
        !currentPage.includes("about.html") &&
        !currentPage.includes("contact.html")
    ) {

        window.location.href =
            "login.html";

    }

}


// =====================================================
// WISHLIST
// =====================================================

function getWishlist() {

    return JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];

}


function saveWishlist(wishlist) {

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

}


// =====================================================
// WISHLIST COUNT
// =====================================================

function updateWishlistCount() {

    const countElement =
        document.getElementById(
            "wishlist-count"
        );

    if (!countElement) return;

    const wishlist =
        getWishlist();

    countElement.textContent =
        wishlist.length;

}


// =====================================================
// ADD / REMOVE WISHLIST
// =====================================================

function toggleWishlist(button) {

    const productId =
        button.dataset.id;

    const productName =
        button.dataset.name;

    const productPrice =
        Number(
            button.dataset.price || 0
        );

    const productImage =
        button.dataset.image || "";

    if (!productId) {

        console.error(
            "Wishlist product ID missing"
        );

        return;

    }


    let wishlist =
        getWishlist();


    const existingIndex =
        wishlist.findIndex(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (existingIndex !== -1) {

        wishlist.splice(
            existingIndex,
            1
        );

        button.textContent =
            "♡";

        button.classList.remove(
            "active"
        );

        console.log(
            "Removed from wishlist:",
            productName
        );

    }

    else {

        wishlist.push({

            id:
                productId,

            name:
                productName ||
                "Product",

            price:
                productPrice,

            image:
                productImage

        });


        button.textContent =
            "❤️";

        button.classList.add(
            "active"
        );


        console.log(
            "Added to wishlist:",
            productName
        );

    }


    saveWishlist(
        wishlist
    );


    updateWishlistCount();

}


// =====================================================
// INITIALIZE WISHLIST
// =====================================================

function initializeWishlist() {

    const wishlist =
        getWishlist();


    document
        .querySelectorAll(
            ".wishlist"
        )
        .forEach(button => {

            const productId =
                button.dataset.id;


            if (!productId) return;


            const exists =
                wishlist.some(
                    item =>
                        String(item.id) ===
                        String(productId)
                );


            if (exists) {

                button.textContent =
                    "❤️";

                button.classList.add(
                    "active"
                );

            }

            else {

                button.textContent =
                    "♡";

                button.classList.remove(
                    "active"
                );

            }


            button.onclick =
                function () {

                    toggleWishlist(
                        this
                    );

                };

        });


    updateWishlistCount();

}


// =====================================================
// LOAD WISHLIST PAGE
// =====================================================

function loadWishlist() {

    const container =
        document.getElementById(
            "wishlist-items"
        );


    if (!container) return;


    const wishlist =
        getWishlist();


    container.innerHTML =
        "";


    if (wishlist.length === 0) {

        container.innerHTML = `

            <div class="wishlist-empty">

                <div class="empty-heart">
                    ♡
                </div>

                <h2>
                    Your wishlist is empty
                </h2>

                <p>
                    Save your favourite toys here
                    and find them whenever you want.
                </p>

                <a
                    href="shop.html"
                    class="btn-primary"
                >
                    🛍️ Continue Shopping
                </a>

            </div>

        `;

        updateWishlistCount();

        return;

    }


    wishlist.forEach(
        product => {

            const price =
                Number(
                    product.price || 0
                );


            container.innerHTML += `

                <div
                    class="wishlist-card"
                    data-id="${product.id}"
                >

                    <div class="wishlist-image-box">

                        <img
                            src="../assets/images/${product.image}"
                            alt="${product.name}"
                            onerror="
                                this.src='../assets/images/teddy-bear.png'
                            "
                        >

                    </div>


                    <div class="wishlist-details">

                        <h3>
                            ${product.name}
                        </h3>


                        <div class="wishlist-rating">
                            ⭐⭐⭐⭐⭐
                        </div>


                        <p class="wishlist-price">
                            ₹${price.toFixed(2)}
                        </p>


                        <div class="wishlist-actions">

                            <button
                                class="cart-btn"
                                onclick="
                                    addWishlistProductToCart(
                                        '${product.id}'
                                    )
                                "
                            >
                                🛒 Add to Cart
                            </button>


                            <button
                                class="wishlist-remove"
                                onclick="
                                    removeFromWishlist(
                                        '${product.id}'
                                    )
                                "
                            >
                                ❤️ Remove
                            </button>

                        </div>

                    </div>

                </div>

            `;

        }
    );


    updateWishlistCount();

}


// =====================================================
// ADD WISHLIST PRODUCT TO CART
// =====================================================

function addWishlistProductToCart(
    productId
) {

    const wishlist =
        getWishlist();


    const product =
        wishlist.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (!product) {

        alert(
            "Product not found!"
        );

        return;

    }


    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const existingProduct =
        cart.find(
            item =>
                String(item._id) ===
                String(product.id)
        );


    if (existingProduct) {

        existingProduct.quantity =
            Number(
                existingProduct.quantity || 0
            ) + 1;

    }

    else {

        cart.push({

            _id:
                product.id,

            name:
                product.name,

            price:
                Number(product.price),

            image:
                product.image,

            quantity:
                1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    alert(
        `${product.name} added to cart 🛒`
    );

}


// =====================================================
// REMOVE FROM WISHLIST
// =====================================================

function removeFromWishlist(
    productId
) {

    let wishlist =
        getWishlist();


    wishlist =
        wishlist.filter(
            product =>
                String(product.id) !==
                String(productId)
        );


    saveWishlist(
        wishlist
    );


    loadWishlist();

    updateWishlistCount();

    initializeWishlist();

}


// =====================================================
// CART COUNT
// =====================================================

function updateCartCount() {

    const countElement =
        document.getElementById(
            "cart-count"
        );


    if (!countElement) return;


    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    let totalQuantity = 0;


    cart.forEach(
        item => {

            totalQuantity +=
                Number(
                    item.quantity || 0
                );

        }
    );


    countElement.textContent =
        totalQuantity;

}


// =====================================================
// CART BUTTONS
// =====================================================

function initializeCartButtons() {

    document
        .querySelectorAll(
            ".cart-btn[data-id]"
        )
        .forEach(button => {

            if (
                button.dataset.cartInitialized
            ) {

                return;

            }


            button.dataset.cartInitialized =
                "true";


            button.addEventListener(
                "click",
                function () {

                    const id =
                        this.dataset.id;

                    const name =
                        this.dataset.name;

                    const price =
                        Number(
                            this.dataset.price
                        );

                    const image =
                        this.dataset.image;


                    if (
                        !id ||
                        !name ||
                        !Number.isFinite(price)
                    ) {

                        console.error(
                            "Invalid cart product"
                        );

                        return;

                    }


                    let cart =
                        JSON.parse(
                            localStorage.getItem(
                                "cart"
                            )
                        ) || [];


                    const existing =
                        cart.find(
                            item =>
                                String(
                                    item._id
                                ) ===
                                String(id)
                        );


                    if (existing) {

                        existing.quantity =
                            Number(
                                existing.quantity || 0
                            ) + 1;

                    }

                    else {

                        cart.push({

                            _id:
                                id,

                            name:
                                name,

                            price:
                                price,

                            image:
                                image,

                            quantity:
                                1

                        });

                    }


                    localStorage.setItem(
                        "cart",
                        JSON.stringify(cart)
                    );


                    updateCartCount();


                    alert(
                        `${name} added to cart 🛒`
                    );

                }
            );

        });

}


// =====================================================
// PROFILE / AUTH UI
// =====================================================

function updateAuthUI() {

    const authArea =
        document.getElementById(
            "auth-area"
        );

    if (!authArea) return;


    const token =
        localStorage.getItem(
            "token"
        );

    const userData =
        localStorage.getItem(
            "user"
        );


    // =================================================
    // NOT LOGGED IN
    // =================================================

   if (
    !token ||
    !userData
) {

    authArea.innerHTML = `

        <a
            href="pages/account.html"
            class="profile-link"
            title="My Account"
        >
            🔴 A
        </a>

    `;

    return;

}


    // =================================================
    // READ USER
    // =================================================

    let user;

    try {

        user =
            JSON.parse(
                userData
            );

    }

    catch (error) {

        console.error(
            "Invalid user data:",
            error
        );

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        authArea.innerHTML = `

            <a href="pages/login.html">
                Login
            </a>

        `;

        return;

    }


    // =================================================
    // USER EMAIL / NAME
    // =================================================

    const email =
        user.email ||
        user.name ||
        "User";


    // FIRST CAPITAL LETTER

    const firstLetter =
        email
            .trim()
            .charAt(0)
            .toUpperCase();


    // =================================================
    // PROFILE HTML
    // =================================================

    authArea.innerHTML = `

        <div class="profile-wrapper">

            <button
                type="button"
                class="profile-letter"
                id="profile-button"
                title="${email}"
            >
                ${firstLetter}
            </button>


            <div
                class="profile-dropdown"
                id="profile-dropdown"
            >

                <div class="profile-info">

                    <div class="profile-big-letter">
                        ${firstLetter}
                    </div>


                    <div>

                        <strong>
                            ${email}
                        </strong>


                        <p>
                            Logged in
                        </p>

                    </div>

                </div>


                <hr>


                <button
                    type="button"
                    id="logout-btn"
                    class="logout-btn"
                >
                    🚪 Logout
                </button>

            </div>

        </div>

    `;


    // =================================================
    // PROFILE BUTTON
    // =================================================

    const profileButton =
        document.getElementById(
            "profile-button"
        );

    const profileDropdown =
        document.getElementById(
            "profile-dropdown"
        );


    if (
        profileButton &&
        profileDropdown
    ) {

        profileButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                profileDropdown.classList.toggle(
                    "show"
                );

            }
        );

    }


    // =================================================
    // LOGOUT
    // =================================================

    const logoutButton =
        document.getElementById(
            "logout-btn"
        );

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                alert(
                    "✅ Logout Successful!"
                );

                window.location.href =
                    "pages/login.html";

            }
        );

    }

}


// =====================================================
// MOBILE PROFILE
// =====================================================

function updateMobileProfile() {

    if (window.innerWidth > 768) {
        return;
    }


    const mobileMenu =
        document.querySelector(
            ".nav-links"
        );


    if (!mobileMenu) {
        return;
    }


    // =================================================
    // GET / CREATE MOBILE AUTH AREA
    // =================================================

    let mobileAuth =
        document.getElementById(
            "mobile-auth-area"
        );


    if (!mobileAuth) {

        mobileAuth =
            document.createElement(
                "div"
            );

        mobileAuth.id =
            "mobile-auth-area";

        mobileAuth.className =
            "mobile-auth-area";

    }


    // Put auth area inside mobile menu

    mobileMenu.insertBefore(
        mobileAuth,
        mobileMenu.firstChild
    );


    // =================================================
    // AUTH DATA
    // =================================================

    const token =
        localStorage.getItem(
            "token"
        );

    const userData =
        localStorage.getItem(
            "user"
        );


    
    // =================================================
    // NOT LOGGED IN
    // =================================================

    if (!token || !userData) {

        mobileAuth.innerHTML = `

            <div class="mobile-auth-row">

                <a
                    href="pages/login.html"
                    class="mobile-login-btn"
                >
                    Login
                </a>

                <a
                    href="pages/register.html"
                    class="mobile-register-btn"
                >
                    Register
                </a>

            </div>

        `;

        return;
    }


    // =================================================
    // READ USER
    // =================================================

    let user;

    try {

        user = JSON.parse(userData);

    } catch (error) {

        console.error(
            "Invalid user data:",
            error
        );

        return;
    }


    // =================================================
    // FIRST CAPITAL LETTER
    // =================================================

    const email =
        user.email ||
        user.name ||
        "User";

    const firstLetter =
        email
            .trim()
            .charAt(0)
            .toUpperCase();


    // =================================================
    // PROFILE + LOGOUT
    // =================================================

    mobileAuth.innerHTML = `

        <div class="mobile-profile-row">

            <button
                type="button"
                class="mobile-profile-letter"
                title="${email}"
            >
                ${firstLetter}
            </button>

            <button
                type="button"
                id="mobile-logout-btn"
                class="mobile-logout-btn"
            >
                Logout
            </button>

        </div>

    `;


    // =================================================
    // MOBILE LOGOUT
    // =================================================

    const mobileLogout =
        document.getElementById(
            "mobile-logout-btn"
        );


    if (mobileLogout) {

        mobileLogout.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                alert(
                    "✅ Logout Successful!"
                );

                window.location.href =
                    "pages/login.html";

            }
        );

    }

}
// =====================================================
// INITIALIZE EVERYTHING
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeWishlist();

        loadWishlist();

        initializeCartButtons();

        updateWishlistCount();

        updateCartCount();

        updateAuthUI();

        updateMobileProfile();

    }
);
