import { cart, deleteFromCart } from "./cart.js";
import { products } from "./products.js";

let cartsummaryHTML = '';

cart.forEach((cartItem) => {
    let productId = cartItem.productId;

    let matchingItem;
    
    products.forEach((product) => {
        if(product.id === productId) {
            matchingItem = product;
        }
    });

    if (matchingItem) {
        cartsummaryHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingItem.id} ">
                <div class="delivery-date">
                    Delivery date: Tuesday, June 21
                </div>
                <div class="cart-item-details-grid">
                    <img class="product-image"
                        src="${matchingItem.image}">
                    <div class="cart-item-details">
                        <div class="product-name">
                            ${matchingItem.name}
                        </div>
                        <div class="product-price">
                            $${(matchingItem.priceCents/100).toFixed(2)}
                        </div>
                        <div class="product-quantity">
                            <span>
                                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                            </span>
                            <span class="update-quantity-link link-primary">
                                Update
                            </span>
                            <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id = "${matchingItem.id}">
                                Delete
                            </span>
                        </div>
                    </div>
                    <div class="delivery-options">
                        <div class="delivery-options-title">
                            Choose a delivery option:
                        </div>
                        <div class="delivery-option">
                            <input type="radio" checked
                                class="delivery-option-input"
                                name="delivery-option-${productId}">
                            <div>
                                <div class="delivery-option-date">
                                    Tuesday, June 21
                                </div>
                                <div class="delivery-option-price">
                                    FREE Shipping
                                </div>
                            </div>
                        </div>
                        <div class="delivery-option">
                            <input type="radio"
                                class="delivery-option-input"
                                name="delivery-option-${productId}">
                            <div>
                                <div class="delivery-option-date">
                                    Wednesday, June 15
                                </div>
                                <div class="delivery-option-price">
                                    $4.99 - Shipping
                                </div>
                            </div>
                        </div>
                        <div class="delivery-option">
                            <input type="radio"
                                class="delivery-option-input"
                                name="delivery-option-${productId}">
                            <div>
                                <div class="delivery-option-date">
                                    Monday, June 13
                                </div>
                                <div class="delivery-option-price">
                                    $4.99 - Shipping
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
});

console.log(cartsummaryHTML);

document.querySelector('.js-order-summary').innerHTML = cartsummaryHTML;

document.querySelectorAll('.js-delete-quantity-link').forEach((deleteLink) => {
    deleteLink.addEventListener('click', () => {
        const deleteElement = deleteLink.dataset.productId;
        deleteFromCart(deleteElement);

        const relocate = document.querySelector(`.js-cart-item-container-${deleteElement}`);
        relocate.remove();
    });
    // Add your delete functionality here
});

/*document.querySelectorAll('.js-add-to-cart').forEach((addButton) => {
    addButton.addEventListener('click', () => {
        const productId = addButton.dataset.productId; // Get the product ID from the button
        console.log(`Adding product with ID: ${productId}`); // Debug log
        addToCart(productId); // Call the addToCart function
        //updateCartSummary();// // Call a function to update the cart summary
    });
});*/

/*function updateCartSummary() {
    let cartsummaryHTML = '';
    cart.forEach((cartItem) => {
        let productId = cartItem.productId;
        let matchingItem = products.find(product => product.id === productId);

        if (matchingItem) {
            cartsummaryHTML += `
                <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
                    <div class="product-name">${matchingItem.name}</div>
                    <div class="product-price">$${(matchingItem.priceCents / 100).toFixed(2)}</div>
                    <div class="product-quantity">Quantity: ${cartItem.quantity}</div>
                    <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${matchingItem.id}">Delete</span>
                </div>
            `;
        }
    });

    document.querySelector('.js-order-summary').innerHTML = cartsummaryHTML;
};*/