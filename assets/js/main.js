// =====================================================
// TOYLAND MAIN.JS
// =====================================================


// =====================================================
// AUTH
// =====================================================

const token = localStorage.getItem("token");

const currentPage =
    window.location.pathname.toLowerCase();

const isLoginPage =
    currentPage.includes("login.html");

const isRegisterPage =
    currentPage.includes("register.html");


// Redirect if login is required
if (
    !token &&
    !isLoginPage &&
    !isRegisterPage
) {

    // Don't redirect wishlist/cart/shop pages
    // if your project allows guest shopping.
    // Remove this block later if guest access is desired.

}


// =====================================================
// WISHLIST
// =====================================================


// Get wishlist
function getWishlist() {

    return JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];

}


// Save wishlist
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
        Number(button.dataset.price || 0);

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


    // =================================================
    // REMOVE
    // =================================================

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


    // =================================================
    // ADD
    // =================================================

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
// INITIALIZE WISHLIST BUTTONS
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


            // Prevent duplicate listeners
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


    // =================================================
    // EMPTY WISHLIST
    // =================================================

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


    // =================================================
    // DISPLAY PRODUCTS
    // =================================================

    wishlist.forEach(
        product => {


            const price =
                Number(product.price || 0);


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


    // Increase quantity
    if (existingProduct) {

        existingProduct.quantity =
            Number(
                existingProduct.quantity || 0
            ) + 1;

    }


    // Add new product
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


    // Update hearts if they exist
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


            // Don't override buttons already
            // controlled by another script.
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

    }
);