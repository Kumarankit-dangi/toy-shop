function loadCart() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    if (!container) return;

    container.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty 🛒</h3>
                <p>Add some toys from the shop.</p>

                <a href="shop.html">
                    <button class="cart-btn">
                        Continue Shopping
                    </button>
                </a>
            </div>
        `;

        totalElement.textContent = "0.00";

        return;
    }


    cart.forEach((product, index) => {

     const price = Number(product.price) || 0;
     const quantity = Number(product.quantity) || 1;

     const itemTotal = price * quantity;

        total += itemTotal;

        container.innerHTML += `
            <div class="cart-item">

                <img
                    src="../assets/images/${product.image}"
                    alt="${product.name}"
                    width="100"
                >

                <div class="cart-item-info">

                    <h3>${product.name}</h3>

                    <p>${product.description || ""}</p>

                    <p>Price: ₹${price}</p>
                    <div class="quantity">

                        <button onclick="decreaseQuantity(${index})">
                            -
                        </button>

                        <span>${quantity}</span>
                        <button onclick="increaseQuantity(${index})">
                            +
                        </button>

                    </div>

                    <h4>
                        Total: ₹${itemTotal}
                    </h4>

                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${index})">
                        Remove
                    </button>

                </div>

            </div>
        `;
    });


    totalElement.textContent = total.toFixed(2);
}



function increaseQuantity(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].quantity += 1;

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}



function decreaseQuantity(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    } else {

        cart.splice(index, 1);

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}



function removeFromCart(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}



const checkoutButton = document.getElementById("checkout-btn");

if (checkoutButton) {

    checkoutButton.addEventListener("click", () => {

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;
        }

        window.location.href = "checkout.html";

    });

}


loadCart();