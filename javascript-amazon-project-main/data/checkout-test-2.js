import { cart, deleteFromCart } from "./cart.js";
import { products } from "./products.js";
import { deliveryOptions } from "./deliveryOptions.js";

let cartsummaryHTML = '';
// Wrap all your code in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    
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
            cartSummary(matchingItem, cartItem, productId, matchingDeliveryOptionId);
        }
    });

    // Move this inside DOMContentLoaded
    const orderSummaryElement = document.querySelector('.js-order-summary');
    if (orderSummaryElement) {
        orderSummaryElement.innerHTML = cartsummaryHTML;
        console.log('HTML inserted into DOM');
        console.log(cartsummaryHTML);
    } else {
        console.error('Could not find .js-order-summary element');
    }

    // Add event listeners after content is loaded
    initializeEventListeners();
});

console.log(cartsummaryHTML);

// Rest of your functions...
function cartSummary(matchingItem, cartItem, productId, matchingDeliveryOptionId) {
    if (!dayjs) {
        console.error('dayjs is not loaded');
        return;
    }

    const today = dayjs();
    const deliveryDate = today.add(matchingDeliveryOptionId.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    let cartsummary = `
    <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
        <div class="delivery-date">
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

function initializeEventListeners() {
    // Move all event listeners here
    document.querySelectorAll('.js-delete-quantity-link').forEach((deleteLink) => {
        deleteLink.addEventListener('click', () => {
            const deleteElement = deleteLink.dataset.productId;
            deleteFromCart(deleteElement);
            const relocate = document.querySelector(`.js-cart-item-container-${deleteElement}`);
            if (relocate) {
                relocate.remove();
            }
        });
    });
}