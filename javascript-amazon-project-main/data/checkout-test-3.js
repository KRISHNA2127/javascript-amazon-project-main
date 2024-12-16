import { cart, deleteFromCart, saveToStorage, cartItemTotal, itemsTotalTax } from "./cart.js";
import { products } from "./products.js";
import { deliveryOptions } from "./deliveryOptions.js";
//import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js';//

// Remove the dayjs import since we're loading it from CDN
//<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>//
let cartsummaryHTML = '';

function renderOrderSummary() {
    cartsummaryHTML = '';  // Clear existing HTML

    cart.forEach((cartItem) => {
        let productId = cartItem.productId;
        let deliveryOptionId = cartItem.deliveryOptionId;
        
        let matchingItem = products.find(product => product.id === productId);
        let matchingDeliveryOptionId = deliveryOptions.find(option => option.id === deliveryOptionId);

        if (matchingItem && matchingDeliveryOptionId) {
            cartSummary(matchingItem, cartItem, productId, matchingDeliveryOptionId);
        }
    });

    // Update the DOM
    const orderSummaryElement = document.querySelector('.js-order-summary');
    if (orderSummaryElement) {
        orderSummaryElement.innerHTML = cartsummaryHTML;
    }
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
                <div class="product-price js-product-price-${matchingItem.id}">
                    $${((matchingItem.priceCents / 100) * cartItem.quantity).toFixed(2)}
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


renderOrderSummary();
paymentDetails();
setupDeliveryOptionListeners();
setupDeleteOptionListeners();


function deliveryOptionsHTML(productId) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
        let today = dayjs();
        let deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        let dateString = deliveryDate.format('dddd, MMMM D');

        html += `
            <div class="delivery-option js-delivery-option" 
                data-deliveryoption-id="${deliveryOption.id}" 
                data-product-id="${productId}">
                <input type="radio" checked
                    class="delivery-option-input js-delivery-option-input" 
                    data-product-id="${productId}" 
                    name="delivery-option-${productId}">
                <div>
                    <div class="delivery-option-date js-delivery-option-date-${deliveryOption.id}-${productId}">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        $${((deliveryOption.priceCents / 100)).toFixed(2)} Shipping
                    </div>
                </div>
            </div>`;
    });
    return html;
}

function setupDeleteOptionListeners() {
    document.querySelectorAll('.js-delete-quantity-link').forEach((deleteLink) => {
        deleteLink.removeEventListener('click', deleteHandler); // Remove any existing listeners
        deleteLink.addEventListener('click', deleteHandler);
    });
}

function deleteHandler(event) {
    const deleteElement = event.target.dataset.productId;
    deleteFromCart(deleteElement);
    cartItemTotal();
    itemsTotalTax();
    paymentDetails();

    let relocate = document.querySelector(`.js-cart-item-container-${deleteElement}`);
    if (relocate) {
        relocate.remove();
    }
    saveToStorage();
}

function setupDeliveryOptionListeners() {
    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            let { deliveryoptionId, productId } = element.dataset;
            
            // Update cart data
            cart.forEach((item) => {
                if (item.productId === productId) {
                    item.deliveryOptionId = deliveryoptionId;
                }
            });
            itemsTotalTax();
            paymentDetails();


            // Clear and re-render
            cartsummaryHTML = '';
            renderOrderSummary();
            
            // Reattach event listeners to the new elements
            setupDeliveryOptionListeners();
            setupDeleteOptionListeners();
            saveToStorage();
        });
    });
}

function totalBeforeTax() {
    let totalBeforeTax = 0;
    totalBeforeTax = Number(itemsTotalTax()) + Number(cartItemTotal())
    return Number(totalBeforeTax);
}

function total() {
    let total = 0;
    total = Number(totalBeforeTax()) + Number((totalBeforeTax() * 0.1).toFixed(2));
    return Number(total);
}
function paymentDetails() {
    let html = '';

    html = 
        `<div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row js-payment-summay-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$${cartItemTotal()}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${itemsTotalTax()}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${totalBeforeTax().toFixed(2)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${(totalBeforeTax() * 0.1).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${total().toFixed(2)}</div>
        </div>

        <button class="place-order-button button-primary">
            Place your order
        </button>`;

    const paymentSummaryElement = document.querySelector('.js-payment-summary');
    if (paymentSummaryElement) {
        paymentSummaryElement.innerHTML = html;
    } else {
        console.error('Element .js-payment-summary not found');
    }
    saveToStorage();
}

/*document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
        let { deliveryoptionId, productId } = element.dataset;
        
        // First, update the cart data with the new delivery option
        cart.forEach((item) => {
            if (item.productId === productId) {
                item.deliveryOptionId = deliveryoptionId;
            }
        });

        // Then clear and re-render - this will now use the updated delivery option
        cartsummaryHTML = '';
        renderOrderSummary();
        
        // No need to manually update DOM since renderOrderSummary will do it
        document.querySelector('.js-order-summary').innerHTML = cartsummaryHTML;
    });
});*/


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