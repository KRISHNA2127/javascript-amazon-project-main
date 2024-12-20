import { cart, deleteFromCart } from "./cart.js";
import { products } from "./products.js";
import { deliveryOptions } from "./deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

let cartsummaryHTML = ''; // Global variable for all items

cart.forEach((cartItem) => {
    let productId = cartItem.productId;
    let matchingItem;
    let deliveryOptionId = cartItem.deliveryOptionId;
    let matchingDeliveryOptionId;

    products.forEach((product) => {
        if (product.id === productId) {
            matchingItem = product;
        }
    });

    deliveryOptions.forEach((deliveryOption) => {
        if (deliveryOption.id === deliveryOptionId) {
            matchingDeliveryOptionId = deliveryOption;
        }
    });

    if (matchingItem && matchingDeliveryOptionId) {
        // This function will add its result to cartsummaryHTML
        cartSummary(matchingItem, cartItem, productId, matchingDeliveryOptionId);
    }
});

// After loop is done, cartsummaryHTML has all items
document.querySelector('.js-order-summary').innerHTML = cartsummaryHTML;

function cartSummary(matchingItem, cartItem, productId, matchingDeliveryOptionId) {
    let today = dayjs();
    let deliveryDate = today.add(matchingDeliveryOptionId.deliveryDays, 'days');
    let dateString = deliveryDate.format('dddd, MMMM D');

    // This variable holds just one item's HTML
    let cartsummary = '';

    cartsummary += `
     <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
        <div class="delivery-date">
            Delivery date: ${dateString}
        </div>
        <div class="cart-item-details-grid">
            <img class="product-image"
                src="${matchingItem.image}">
            <div class="cart-item-details">
                <div class="product-name">
                    ${matchingItem.name}
                </div>
                <div class="product-price">
                    $${(matchingItem.priceCents / 100).toFixed(2)}
                </div>
                <div class="product-quantity">
                    <span>
                        Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary">
                        Update
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${matchingItem.id}">
                        Delete
                    </span>
                </div>
            </div>

            <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(productId)}
            </div>
        </div>
    </div>`;

    // Add this single item to the global HTML
    cartsummaryHTML += cartsummary;
    
    return cartsummary; // Returns single item HTML if needed
}

function deliveryOptionsHTML(productId) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
        let today = dayjs();
        let deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        let dateString = deliveryDate.format('dddd, MMMM D');

        html += `
            <div class="delivery-option js-delivery-option" data-deliveryoption-id="${deliveryOption.id}">
                <input type="radio" checked
                    class="delivery-option-input js-delivery-option-input" data-product-id="${productId}" 
                    name="delivery-option-${productId}">
                <div>
                    <div class="delivery-option-date">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        $${(deliveryOption.priceCents / 100).toFixed(2)} Shipping
                    </div>
                </div>
            </div>`;
    });
    return html;
}

document.querySelectorAll('.js-delete-quantity-link').forEach((deleteLink) => {
    deleteLink.addEventListener('click', () => {
        const deleteElement = deleteLink.dataset.productId;
        deleteFromCart(deleteElement);

        const relocate = document.querySelector(`.js-cart-item-container-${deleteElement}`);
        relocate.remove();
    });
    // Add your delete functionality here
});

// Add at the end of checkout.js
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    console.log('Final HTML:', cartsummaryHTML);
});

// Add error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// At the start of checkout.js
console.log('Starting checkout.js');

try {
    let cartsummaryHTML = '';

    if (!cart || !Array.isArray(cart)) {
        console.error('Cart is not available or not an array:', cart);
        throw new Error('Invalid cart data');
    }

    if (!products || !Array.isArray(products)) {
        console.error('Products is not available or not an array:', products);
        throw new Error('Invalid products data');
    }

    if (!deliveryOptions || !Array.isArray(deliveryOptions)) {
        console.error('Delivery options is not available or not an array:', deliveryOptions);
        throw new Error('Invalid delivery options data');
    }

    // ... rest of your code ...

} catch (error) {
    console.error('Error in checkout.js:', error);
    document.querySelector('.js-order-summary').innerHTML = 
        '<p>Sorry, there was an error loading the cart. Please try refreshing the page.</p>';
}