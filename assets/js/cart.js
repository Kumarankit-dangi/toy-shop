// =====================================================
// GET IMAGE NAME
// =====================================================

function getCartImage(product) {

    let image = product.image || "";

    // If old teddy image exists
    if (image === "teddy.jpg") {
        return "teddy-bear.png";
    }

    // If complete path was accidentally saved
    image = image.replace("../assets/images/", "");
    image = image.replace("assets/images/", "");

    return image;
}


// =====================================================
// LOAD CART
// =====================================================

function loadCart() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const container =
        document.getElementById(
            "cart-items"
        );


    const totalElement =
        document.getElementById(
            "cart-total"
        );


    if (!container) return;


    container.innerHTML = "";


    let total = 0;


    // =================================================
    // EMPTY CART
    // =================================================

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h3>
                    Your cart is empty 🛒
                </h3>

                <p>
                    Add some toys from the shop.
                </p>

                <a href="shop.html">

                    <button class="cart-btn">
                        Continue Shopping
                    </button>

                </a>

            </div>

        `;


        if (totalElement) {
            totalElement.textContent = "0.00";
        }


        return;

    }


    // =================================================
    // CART PRODUCTS
    // =================================================

    cart.forEach(
        (product, index) => {

            const price =
                Number(product.price) || 0;


            const quantity =
                Number(product.quantity) || 1;


            const itemTotal =
                price * quantity;


            total += itemTotal;


            const imageName =
                getCartImage(product);


            console.log(
                "CART IMAGE:",
                imageName
            );


            container.innerHTML += `

                <div class="cart-item">


                    <img
                        src="../assets/images/${imageName}"
                        alt="${product.name}"
                        width="100"
                        onerror="this.src='../assets/images/teddy-bear.png'"
                    >


                    <div class="cart-item-info">


                        <h3>
                            ${product.name}
                        </h3>


                        <p>
                            ${product.description || ""}
                        </p>


                        <p>
                            Price: ₹${price}
                        </p>


                        <div class="quantity">


                            <button
                                onclick="decreaseQuantity(${index})"
                            >
                                -
                            </button>


                            <span>
                                ${quantity}
                            </span>


                            <button
                                onclick="increaseQuantity(${index})"
                            >
                                +
                            </button>


                        </div>


                        <h4>
                            Total: ₹${itemTotal}
                        </h4>


                        <button
                            class="remove-btn"
                            onclick="removeFromCart(${index})"
                        >
                            Remove
                        </button>


                    </div>

                </div>

            `;

        }
    );


    if (totalElement) {

        totalElement.textContent =
            total.toFixed(2);

    }

}


// =====================================================
// INCREASE QUANTITY
// =====================================================

function increaseQuantity(index) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    cart[index].quantity =
        Number(
            cart[index].quantity || 1
        ) + 1;


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    loadCart();

}


// =====================================================
// DECREASE QUANTITY
// =====================================================

function decreaseQuantity(index) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const quantity =
        Number(
            cart[index].quantity || 1
        );


    if (quantity > 1) {

        cart[index].quantity =
            quantity - 1;

    }

    else {

        cart.splice(
            index,
            1
        );

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    loadCart();

}


// =====================================================
// REMOVE FROM CART
// =====================================================

function removeFromCart(index) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    cart.splice(
        index,
        1
    );


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    loadCart();

}


// =====================================================
// CHECKOUT
// =====================================================

const checkoutButton =
    document.getElementById(
        "checkout-btn"
    );


if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        () => {

            const cart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];


            if (cart.length === 0) {

                alert(
                    "Your cart is empty!"
                );

                return;

            }


            window.location.href =
                "checkout.html";

        }
    );

}


// =====================================================
// START
// =====================================================

loadCart();