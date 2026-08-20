const API_URL =
    "https://toy-shop-backend.onrender.com";


let products = [];


// =====================================================
// LOAD PRODUCTS
// =====================================================

async function loadProducts() {

    try {

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


        // Show all products initially

        displayProducts(products);


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


    // No products

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


    // Create products

    productList.forEach(product => {

        container.innerHTML += `

            <div class="product-card">

                <img
                    src="../assets/images/${getImageName(product)}"
                    alt="${product.name}"
                >

                <h3>
                    ${product.name}
                </h3>

                <div class="rating">
                    ⭐⭐⭐⭐⭐
                </div>

                <div class="price">

                    <span class="new-price">

                        ₹${product.price.toFixed(2)}

                    </span>

                </div>

                <button
                    class="cart-btn"
                    onclick="addToCart('${product._id}')"
                >

                    Add to Cart

                </button>

            </div>

        `;

    });

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


            // Search

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


            // Category

            let categoryMatch = true;


            if (
                category !== "all"
            ) {

                categoryMatch =
                    String(
                        product.category || ""
                    ).trim().toLowerCase()
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


    displayProducts(result);

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


    alert(
        `${product.name} added to cart 🛒`
    );

}


// =====================================================
// START
// =====================================================

loadProducts();