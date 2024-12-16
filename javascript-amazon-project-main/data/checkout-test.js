import { cart, deleteFromCart } from "./cart.js";
import { products } from "./products.js";
import { deliveryOptions } from "./deliveryOptions.js";
//import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js';//

// Remove the dayjs import since we're loading it from CDN
//<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>//
let cartsummaryHTML = '';

function renderOrderSummary() {

    // Add error checking
    console.log('Initial load:', {
        cartLength: cart.length,
        productsLength: products.length,
        deliveryOptionsLength: deliveryOptions.length
    });

    cart.forEach((cartItem) => {
        let productId = cartItem.productId;
        console.log(productId);
        // Set a default delivery option if none exists
        let deliveryOptionId = cartItem.deliveryOptionId;
        console.log(deliveryOptionId);
        
        let matchingItem = products.find(product => product.id === productId);
        let matchingDeliveryOptionId = deliveryOptions.find(option => option.id === deliveryOptionId);

        if (matchingItem && matchingDeliveryOptionId) {
            cartSummary(matchingItem, cartItem, productId, matchingDeliveryOptionId);
        } else {
            console.error('Missing item:', { 
                productId, 
                deliveryOptionId,
                hasMatchingItem: !!matchingItem,
                hasDeliveryOption: !!matchingDeliveryOptionId 
            });
        }
    });
    document.querySelector('.js-order-summary').innerHTML = cartsummaryHTML;
}



function cartSummary(matchingItem, cartItem, productId, matchingDeliveryOptionId) {
    if (!dayjs) {
        console.error('dayjs is not loaded');
        return;
    }

    let today = dayjs();
    let deliveryDate = today.add(matchingDeliveryOptionId.deliveryDays, 'days');
    let dateString = deliveryDate.format('dddd, MMMM D');

    let cartsummary = `
    <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
        <div class="delivery-date js-delivery-date-${matchingDeliveryOptionId.id}-${productId}">
            Delivery date: ${dateString}
        </div>
        <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingItem.image}">
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
    
    cartsummaryHTML += cartsummary;
    return cartsummary;
}


renderOrderSummary()


function deliveryOptionsHTML(productId) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
        let today = dayjs();
        let deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        let dateString = deliveryDate.format('dddd, MMMM D');

        html += `
            <div class="delivery-option js-delivery-option" data-deliveryoption-id="${deliveryOption.id}" data-product-id = "${productId}">
                <input type="radio" checked
                    class="delivery-option-input js-delivery-option-input" data-product-id="${productId}" 
                    name="delivery-option-${productId}">
                <div>
                    <div class="delivery-option-date js-delivery-option-date-${deliveryOption.id}-${productId}">
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

document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
        let { deliveryOptionId, productId } = element.dataset;
        
        // Add error checking
        const dateElement = document.querySelector(`.js-delivery-option-date-${deliveryOptionId}-${productId}`);
        if (!dateElement) {
            console.error('Could not find delivery date element');
            return;
        }
        
        let deliveryDate = dateElement.textContent;
        console.log('Selected delivery date:', deliveryDate);
        
        cartsummaryHTML = '';
        renderOrderSummary();
        
        const mainDateElement = document.querySelector(`.js-delivery-date-${deliveryOptionId}-${productId}`);
        if (mainDateElement) {
            mainDateElement.innerHTML = `Delivery Date: ${deliveryDate}`;
        }
    });
});

// Add at the end of checkout.js
/*window.addEventListener('DOMContentLoaded', () => {
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
}*/