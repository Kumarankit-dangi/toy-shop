const API_URL = "https://toy-shop-backend.onrender.com";
let products = [];

async function loadProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Server response error: " + response.status);
        }

        const data = await response.json();

        console.log("API DATA:", data);

        if (!data.success || !Array.isArray(data.products)) {
            console.error("Products data is invalid:", data);
            return;
        }

        // Normalize product data
        products = data.products.map(product => ({
            ...product,
            price: Number(product.price)
        }));

        console.log("NORMALIZED PRODUCTS:", products);

        const container = document.querySelector(".product-container");

        if (!container) {
            console.log("Product container not found");
            return;
        }

        container.innerHTML = "";

        products.forEach((product) => {

            container.innerHTML += `
                <div class="product-card">

                    <img
                        src="../assets/images/${getImageName(product)}"
                        alt="${product.name}"
                    >

                    <h3>${product.name}</h3>

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

    } catch (error) {
        console.error("Error loading products:", error);
    }
}


function getImageName(product) {

    if (product.image === "teddy.jpg") {
        return "teddy-bear.png";
    }

    return product.image || "";
}


function addToCart(productId) {

    const product = products.find(
        item => String(item._id) === String(productId)
    );

    if (!product) {
        console.error("Product not found:", productId);
        alert("Product not found!");
        return;
    }

    const price = Number(product.price);

    console.log("ADDING PRODUCT:", product);
    console.log("PRODUCT PRICE:", price);

    if (!Number.isFinite(price) || price <= 0) {
        console.error("Invalid product price:", product);
        alert("This product has an invalid price.");
        return;
    }

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
        item => String(item._id) === String(product._id)
    );

    if (existingProduct) {

        existingProduct.quantity =
            Number(existingProduct.quantity || 0) + 1;

    } else {

        cart.push({

            _id: product._id,

            name: product.name,

            description: product.description || "",

            price: price,

            image: getImageName(product),

            quantity: 1

        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    console.log(
        "CART AFTER ADD:",
        JSON.parse(localStorage.getItem("cart"))
    );

    alert(`${product.name} added to cart 🛒`);
}


loadProducts();