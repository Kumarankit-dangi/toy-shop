const API_URL =
    "https://toy-shop-backend.onrender.com";


let products = [];


async function loadProducts() {

    try {

        // =================================================
        // RESET SHOP PAGE WHEN COMING FROM SHOP NOW
        // =================================================

        const urlParams =
            new URLSearchParams(
                window.location.search
            );

        const isReset =
            urlParams.get("reset") === "true";


        if (isReset) {

            const searchInput =
                document.getElementById(
                    "search-box"
                );

            const categoryInput =
                document.getElementById(
                    "category-filter"
                );

            const sortInput =
                document.getElementById(
                    "sort-filter"
                );


            if (searchInput) {

                searchInput.value = "";

                searchInput.setAttribute(
                    "value",
                    ""
                );

            }


            if (categoryInput) {

                categoryInput.value = "all";

            }


            if (sortInput) {

                sortInput.value = "default";

            }


            // Remove reset parameter from URL
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );

        }


        const response =
            await fetch(
                `${API_URL}/api/products`
            );

        if (!response.ok) {

            throw new Error(
                "HTTP Error: " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "PRODUCT API:",
            data
        );


        if (
            !data.success ||
            !Array.isArray(data.products)
        ) {

            console.error(
                "Invalid product data"
            );

            return;

        }


        products =
            data.products.map(product => ({

                ...product,

                price:
                    Number(product.price)

            }));


        console.log(
            "PRODUCTS:",
            products
        );


        const categoryFromURL =
    loadCategoryFromURL();

if (categoryFromURL) {

    const filteredProducts =
        products.filter(product => {

            return (
                String(product.category || "")
                    .trim()
                    .toLowerCase()
                ===
                String(categoryFromURL)
                    .trim()
                    .toLowerCase()
            );

        });

    displayProducts(filteredProducts);

} else {

    applyFilters();

}

updateWishlistCount();


    } catch (error) {

        console.error(
            "LOAD PRODUCTS ERROR:",
            error
        );

    }

}


// =====================================================
// GET IMAGE
// =====================================================

function getImageName(product) {

    if (
        product.image === "teddy.jpg"
    ) {

        return "teddy-bear.png";

    }


    return product.image || "";

}


// =====================================================
// WISHLIST
// =====================================================

function getWishlist() {

    return JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];

}


// =====================================================
// UPDATE WISHLIST COUNT
// =====================================================

function updateWishlistCount() {

    const count =
        document.getElementById(
            "wishlist-count"
        );


    if (!count) return;


    count.textContent =
        getWishlist().length;

}


// =====================================================
// TOGGLE WISHLIST
// =====================================================

function toggleWishlist(button) {

    const productId =
        button.dataset.id;


    const productName =
        button.dataset.name;


    const productPrice =
        Number(
            button.dataset.price
        );


    const productImage =
        button.dataset.image;


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
                productName || "Product",

            price:
                productPrice,

            image:
                productImage || ""

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


    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );


    updateWishlistCount();

}


// =====================================================
// CHECK WISHLIST STATUS
// =====================================================

function isInWishlist(productId) {

    const wishlist =
        getWishlist();


    return wishlist.some(
        item =>
            String(item.id) ===
            String(productId)
    );

}


// =====================================================
// DISPLAY PRODUCTS
// =====================================================

function displayProducts(productList) {

    const container =
        document.getElementById(
            "product-container"
        );


    if (!container) {

        console.error(
            "Product container not found"
        );

        return;

    }


    container.innerHTML = "";


    // =================================================
    // NO PRODUCTS
    // =================================================

    if (
        productList.length === 0
    ) {

        container.innerHTML = `

            <div style="
                width:100%;
                text-align:center;
                padding:50px;
            ">

                <h2>
                    😔 No products found
                </h2>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;

        return;

    }


    // =================================================
    // CREATE PRODUCTS
    // =================================================

    productList.forEach(product => {


        const wishlistActive =
            isInWishlist(
                product._id
            );


        const wishlistIcon =
            wishlistActive
                ? "❤️"
                : "♡";


        container.innerHTML += `

            <div class="product-card">


                <!-- WISHLIST -->

                <div
                    class="wishlist ${wishlistActive ? "active" : ""}"
                    data-id="${product._id}"
                    data-name="${product.name}"
                    data-price="${product.price}"
                    data-image="${getImageName(product)}"
                    onclick="toggleWishlist(this)"
                >

                    ${wishlistIcon}

                </div>


                <!-- PRODUCT IMAGE -->

                <img
                    src="../assets/images/${getImageName(product)}"
                    alt="${product.name}"
                >


                <!-- PRODUCT NAME -->

                <h3>
                    ${product.name}
                </h3>


                <!-- RATING -->

                <div class="rating">

                    ⭐⭐⭐⭐⭐

                </div>


                <!-- PRICE -->

                <div class="price">

                    <span class="new-price">

                        ₹${product.price.toFixed(2)}

                    </span>

                </div>


                <!-- CART -->

                <button
                    class="cart-btn"
                    onclick="addToCart('${product._id}')"
                >

                    Add to Cart

                </button>


            </div>

        `;

    });


    updateWishlistCount();

}
// =====================================================
// CATEGORY FROM HOMEPAGE
// =====================================================

function loadCategoryFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const categoryFromURL =
        params.get("category");

    console.log(
        "CATEGORY FROM URL:",
        categoryFromURL
    );

    if (!categoryFromURL) {

        return null;

    }

    const categoryInput =
        document.getElementById(
            "category-filter"
        );

    if (categoryInput) {

        categoryInput.value =
            categoryFromURL;

    }

    return categoryFromURL;

}


// =====================================================
// SEARCH + CATEGORY + SORT
// =====================================================

function applyFilters() {

    console.log(
        "FILTER FUNCTION CALLED"
    );


    const searchInput =
        document.getElementById(
            "search-box"
        );


    const categoryInput =
        document.getElementById(
            "category-filter"
        );


    const sortInput =
        document.getElementById(
            "sort-filter"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const category =
        categoryInput
            ? categoryInput.value
            : "all";


    const sort =
        sortInput
            ? sortInput.value
            : "default";


    console.log(
        "SEARCH:",
        search
    );


    console.log(
        "CATEGORY:",
        category
    );


    console.log(
        "SORT:",
        sort
    );


    // =================================================
    // FILTER
    // =================================================

    let result =
        products.filter(product => {


            // SEARCH

            const name =
                String(
                    product.name || ""
                ).toLowerCase();


            const description =
                String(
                    product.description || ""
                ).toLowerCase();


            const searchMatch =
                name.includes(search) ||
                description.includes(search);


            // CATEGORY

            let categoryMatch = true;


            if (
                category !== "all"
            ) {

                categoryMatch =
                    String(
                        product.category || ""
                    )
                        .trim()
                        .toLowerCase()
                    ===
                    String(category)
                        .trim()
                        .toLowerCase();

            }


            return (
                searchMatch &&
                categoryMatch
            );

        });


    // =================================================
    // SORT
    // =================================================

    if (
        sort === "low"
    ) {

        result.sort(
            (a, b) =>
                Number(a.price) -
                Number(b.price)
        );

    }


    else if (
        sort === "high"
    ) {

        result.sort(
            (a, b) =>
                Number(b.price) -
                Number(a.price)
        );

    }


    else if (
        sort === "newest"
    ) {

        result.sort(
            (a, b) => {

                return (
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                );

            }
        );

    }


    console.log(
        "FILTERED RESULT:",
        result
    );


    displayProducts(
        result
    );

}


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(productId) {

    const product =
        products.find(
            item =>
                String(item._id) ===
                String(productId)
        );


    if (!product) {

        alert(
            "Product not found!"
        );

        return;

    }


    const price =
        Number(product.price);


    if (
        !Number.isFinite(price) ||
        price <= 0
    ) {

        alert(
            "Invalid product price."
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
                String(product._id)
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
                product._id,

            name:
                product.name,

            description:
                product.description || "",

            price:
                price,

            image:
                getImageName(product),

            quantity:
                1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    // UPDATE CART COUNT

    updateCartCount();


    alert(
        `${product.name} added to cart 🛒`
    );

}


// =====================================================
// CART COUNT
// =====================================================

function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );


    if (!cartCount) return;


    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total +
                Number(
                    item.quantity || 0
                ),
            0
        );


    cartCount.textContent =
        totalQuantity;

}


// =====================================================
// START
// =====================================================

loadProducts();

updateCartCount();

updateWishlistCount();
// =====================================================
// SEARCH / FILTER EVENTS
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const searchInput =
            document.getElementById(
                "search-box"
            );

        const categoryInput =
            document.getElementById(
                "category-filter"
            );

        const sortInput =
            document.getElementById(
                "sort-filter"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                function () {

                    applyFilters();

                }
            );

        }


        if (categoryInput) {

            categoryInput.addEventListener(
                "change",
                function () {

                    applyFilters();

                }
            );

        }


        if (sortInput) {

            sortInput.addEventListener(
                "change",
                function () {

                    applyFilters();

                }
            );

        }

    }
);