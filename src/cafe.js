
/* Menu Products */
const menuItems = [
    {
        name: "Cappuccino",
        price: 4.50,
        category: "Coffee",
        image: "images/cappuccino.png"
    },
    {
        name: "Iced Latte",
        price: 5.00,
        category: "Coffee",
        image: "images/icedlattee.png.png"
    },
    {
        name: "Muffin",
        price: 3.00,
        category: "Bakery",
        image: "images/muffin.png.png"
    },
    {
        name: "Croissant",
        price: 3.25,
        category: "Bakery",
        image: "images/croissant.png.png"
    }
];

/* Load Cart From localStorage */
const savedCart = localStorage.getItem("cart");
let cartList = [];

try {
    cartList = savedCart ? JSON.parse(savedCart) : [];
    if (!Array.isArray(cartList)) {
        cartList = [];
    }
} catch (error) {
    cartList = [];
}

/* Save Cart To localStorage */
function saveCart() {
    localStorage.setItem(
        "cart",
        JSON.stringify(cartList)
    );
}

/* Display Menu Items Dynamically */
function displayMenu(items) {
    const menuList = document.getElementById("menu-card");
    menuList.innerHTML = "";

    if (items.length === 0) {
        menuList.innerHTML = "<p>No products found.</p>";
        return;
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        menuList.innerHTML += `
            <div class="menu-item">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
                <p>${item.category}</p>
                <button
                    type="button"
                    data-name="${item.name}"
                >
                    + Add to Cart
                </button>
            </div>
        `;
    }
}

/* Menu Search Functionality */
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function() {
    const searchValue = searchInput.value.toLowerCase();

    // Filter products by name or category
    const filteredItems = menuItems.filter(function(item) {
        return (
            item.name.toLowerCase().includes(searchValue) ||
            item.category.toLowerCase().includes(searchValue)
        );
    });

    displayMenu(filteredItems);
});

/* Add To Cart Using Event Delegation */
document.getElementById("menu-card").addEventListener(
    "click",
    function(event) {
        const button = event.target.closest("button");
        if (!button) return;

        const productName = button.dataset.name;

        // Find the selected product
        const selectedProduct = menuItems.find(function(item) {
            return item.name === productName;
        });

        if (!selectedProduct) return;

        // Check if product already exists in cart
        const existingItem = cartList.find(function(item) {
            return item.name === productName;
        });

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartList.push({
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: 1
            });
        }

        saveCart();
        updateCartCount();
        displayCart();
    }
);

/* Update Cart Count */
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    let count = 0;

    cartList.forEach(function(item) {
        count += item.quantity;
    });

    cartCount.textContent = count;
}

/* Display Shopping Cart */
function displayCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    if (cartList.length === 0) {
        cartItems.innerHTML = `
            <p>Your cart is currently empty.</p>
            <p>Add some delicious items from our menu!</p>
        `;
    } else {
        cartList.forEach(function(item) {
            cartItems.innerHTML += `
                <div class="cart-item">
                    <h3>${item.name}</h3>
                    <p>
                        Price: $${item.price.toFixed(2)}
                    </p>
                    <div class="quantity-controls">
                        <button
                            class="decrease-btn"
                            data-name="${item.name}"
                        >
                            -
                        </button>
                        <span>${item.quantity}</span>
                        <button
                            class="increase-btn"
                            data-name="${item.name}"
                        >
                            +
                        </button>
                    </div>
                    <p>
                        Item Total:
                        $${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                        class="remove-btn"
                        data-name="${item.name}"
                    >
                        Remove
                    </button>
                </div>
            `;
        });
    }

    // Handle cart item actions
    document.querySelectorAll(".remove-btn").forEach(function(button) {
        button.addEventListener("click", function() {
            removeFromCart(button.dataset.name);
        });
    });

    document.querySelectorAll(".increase-btn").forEach(function(button) {
        button.addEventListener("click", function() {
            increaseQuantity(button.dataset.name);
        });
    });

    document.querySelectorAll(".decrease-btn").forEach(function(button) {
        button.addEventListener("click", function() {
            decreaseQuantity(button.dataset.name);
        });
    });

    document.getElementById("cart-total").textContent =
        `Total: $${calculateTotal()}`;
}

/* Remove Product From Cart */
function removeFromCart(productName) {
    cartList = cartList.filter(function(item) {
        return item.name !== productName;
    });

    saveCart();
    updateCartCount();
    displayCart();
}

/* Increase Product Quantity */
function increaseQuantity(productName) {
    const existingItem = cartList.find(function(item) {
        return item.name === productName;
    });

    if (existingItem) {
        existingItem.quantity++;
    }

    saveCart();
    updateCartCount();
    displayCart();
}

/* Decrease Product Quantity */
function decreaseQuantity(productName) {
    const existingItem = cartList.find(function(item) {
        return item.name === productName;
    });

    if (existingItem) {
        existingItem.quantity--;

        if (existingItem.quantity <= 0) {
            removeFromCart(productName);
            return;
        }
    }

    saveCart();
    updateCartCount();
    displayCart();
}

/* Calculate Cart Total */
function calculateTotal() {
    let total = 0;

    cartList.forEach(function(item) {
        total += item.price * item.quantity;
    });

    return total.toFixed(2);
}

/* Initialize Application */
displayMenu(menuItems);
updateCartCount();
displayCart();
