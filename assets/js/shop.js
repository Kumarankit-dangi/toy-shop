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
            // =====================================================
// ENABLE CATEGORY + SORT FILTERS
// =====================================================

const categoryFilter =
    document.getElementById(
        "category-filter"
    );

const sortFilter =
    document.getElementById(
        "sort-filter"
    );


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        function () {

            applyFilters();

        }
    );

}


if (sortFilter) {

    sortFilter.addEventListener(
        "change",
        function () {

            applyFilters();

        }
    );

}
initLiveSearch();

        console.log(
            "PRODUCTS:",
            products
        );


        const categoryFromURL =
            loadCategoryFromURL();


        // =================================================
        // CATEGORY FROM URL
        // =================================================

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


            displayProducts(
                filteredProducts
            );

        }


        // =================================================
        // NORMAL SHOP / SHOP NOW
        // =================================================

        else {

            // IMPORTANT:
            // Shop Now should always show ALL products

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

            }


            if (categoryInput) {

                categoryInput.value = "all";

            }


            if (sortInput) {

                sortInput.value = "default";

            }


            // SHOW ALL PRODUCTS
            displayProducts(
                products
            );

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

    if (!product || !product.image) {

        return "";

    }


    let image =
        String(product.image).trim();


    // External image URL

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {

        return image;

    }


    // Old teddy image

    if (image === "teddy.jpg") {

        return "/assets/images/teddy-bear.png";

    }


    // Remove any old relative path

    image =
        image
            .replace(/^(\.\.\/)+/, "")
            .replace(/^(\.\/)+/, "")
            .replace(/^\/+/, "");


    // If database contains assets/images/

    if (
        image.startsWith(
            "assets/images/"
        )
    ) {

        image =
            image.replace(
                "assets/images/",
                ""
            );

    }


    // If database contains assets/

    if (
        image.startsWith(
            "assets/"
        )
    ) {

        image =
            image.replace(
                "assets/",
                ""
            );

    }


    // Final correct path

    return (
        "/assets/images/" +
        image
    );

}


// =====================================================
// WISHLIST
// =====================================================

function getWishlist() {

    return JSON.parse(
        localStorage.getItem(
            "wishlist"
        )
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
        !Array.isArray(productList) ||
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
                    src="${getImageName(product)}"
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
// START
// =====================================================

loadProducts();

updateCartCount();

updateWishlistCount();


// =====================================================
// SEARCH + CATEGORY + SORT
// =====================================================

function applyFilters() {

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


    // =================================================
    // GET CURRENT VALUES
    // =================================================

    const search =
        searchInput
            ? String(
                searchInput.value || ""
            )
                .trim()
                .toLowerCase()
            : "";


    const category =
        categoryInput
            ? String(
                categoryInput.value || "all"
            )
                .trim()
                .toLowerCase()
            : "all";


    const sort =
        sortInput
            ? String(
                sortInput.value || "default"
            )
            : "default";


    // =================================================
    // START WITH ALL PRODUCTS
    // =================================================

    let filteredProducts =
        Array.isArray(products)
            ? [...products]
            : [];


    // =================================================
    // SEARCH
    // =================================================

    if (search !== "") {

        filteredProducts =
            filteredProducts.filter(
                product => {

                    const name =
                        String(
                            product.name || ""
                        )
                            .toLowerCase();


                    const description =
                        String(
                            product.description || ""
                        )
                            .toLowerCase();


                    const productCategory =
                        String(
                            product.category || ""
                        )
                            .toLowerCase();


                    return (
                        name.includes(search) ||
                        description.includes(search) ||
                        productCategory.includes(search)
                    );

                }
            );

    }


    // =================================================
    // CATEGORY
    // =================================================

    if (
        category !== "" &&
        category !== "all"
    ) {

        filteredProducts =
            filteredProducts.filter(
                product => {

                    const productCategory =
                        String(
                            product.category || ""
                        )
                            .trim()
                            .toLowerCase();


                    return (
                        productCategory ===
                        category
                    );

                }
            );

    }


    // =================================================
    // SORT
    // =================================================

    if (sort === "low") {

        filteredProducts.sort(
            (a, b) => {

                return (
                    Number(
                        a.price || 0
                    ) -
                    Number(
                        b.price || 0
                    )
                );

            }
        );

    }


    else if (sort === "high") {

        filteredProducts.sort(
            (a, b) => {

                return (
                    Number(
                        b.price || 0
                    ) -
                    Number(
                        a.price || 0
                    )
                );

            }
        );

    }


    else if (sort === "newest") {

        filteredProducts.sort(
            (a, b) => {

                const dateA =
                    new Date(
                        a.createdAt || 0
                    ).getTime();


                const dateB =
                    new Date(
                        b.createdAt || 0
                    ).getTime();


                return (
                    dateB - dateA
                );

            }
        );

    }


    // =================================================
    // DISPLAY
    // =================================================

    displayProducts(
        filteredProducts
    );

}

// =====================================================
// SEARCH / FILTER EVENTS
// =====================================================

function setupShopFilters() {

    const searchInput =
        document.getElementById("search-box");

    const categoryInput =
        document.getElementById("category-filter");

    const sortInput =
        document.getElementById("sort-filter");


    // =================================================
    // SEARCH
    // =================================================


    // =================================================
    // CATEGORY
    // =================================================

    if (categoryInput) {

        categoryInput.onchange = function () {

            applyFilters();

        };

    }


    // =================================================
    // SORT
    // =================================================

    if (sortInput) {

        sortInput.onchange = function () {

            applyFilters();

        };

    }

}


// =====================================================
// INITIALIZE FILTERS
// =====================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        setupShopFilters
    );

}

else {

    setupShopFilters();

}
// =====================================================
// LIVE SEARCH — FINAL
// =====================================================

function initLiveSearch() {

    const searchBox =
        document.getElementById("search-box");

    if (!searchBox) {
        console.error("Search box not found");
        return;
    }


    searchBox.addEventListener(
        "input",
        function () {

            const search =
                searchBox.value
                    .trim()
                    .toLowerCase();


            // EMPTY SEARCH
            if (search === "") {

                displayProducts(products);

                return;
            }


            // FILTER
            const filteredProducts =
                products.filter(function (product) {

                    const name =
                        String(
                            product.name || ""
                        ).toLowerCase();


                    const description =
                        String(
                            product.description || ""
                        ).toLowerCase();


                    const category =
                        String(
                            product.category || ""
                        ).toLowerCase();


                    return (
                        name.includes(search) ||
                        description.includes(search) ||
                        category.includes(search)
                    );

                });


            console.log(
                "SEARCH:",
                search,
                "RESULTS:",
                filteredProducts.length
            );


            displayProducts(
                filteredProducts
            );

        }
    );

}

