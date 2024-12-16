import { deliveryOptions } from "./deliveryOptions.js";
import { products } from "./products.js";

export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
  cart = [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 1,
    deliveryOptionId: '3',
    priceCents: 1090,
    deliveryPriceCents: 999
  }, {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryOptionId: '3',
    priceCents: 2095,
    deliveryPriceCents: 999
  }];
}

export function saveToStorage() {
  console.log('Saving cart to local storage:', cart);
  localStorage.setItem('cart', JSON.stringify(cart));
}


export function addToCart(productId) {
    let matchingItem;

    cart.forEach((item) => {
        if (productId === item.productId) {
            matchingItem = item;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += 1;
        matchingItem.priceCents = (matchingItem.priceCents / (matchingItem.quantity - 1)) * (matchingItem.quantity);
        console.log(matchingItem.priceCents);
    } else if (products.some(product => product.id === productId)) {
        const product = products.find(product => product.id === productId);
        cart.push({
            productId: productId,
            quantity: 1,
            deliveryOptionId: '3',
            priceCents: product.priceCents,
            deliveryPriceCents: 999 
        });
    }
    cartItemTotal();
    saveToStorage();
    console.log('Cart after adding:', cart);
}

export function deleteFromCart(deleteElement) {
    let newcart = [];

    cart.forEach((item) => {
        if(item.productId !== deleteElement) {
            newcart.push(item)
        }
    })

    cart = newcart;
    saveToStorage();
    console.log('Cart after adding:', cart);
};

export function cartItemTotal() {
    let totalPrice = 0;
    cart.forEach((price) => {
        totalPrice = totalPrice + price.priceCents;

    })
    let totalPriceCents = (totalPrice/100).toFixed(2);
    saveToStorage();
    console.log(totalPriceCents);
    return totalPriceCents;
}

export function itemsTotalTax() {
    let totalTax = 0;

    cart.forEach((item) => {
        deliveryOptions.forEach((option) => {
            if(option.id === item.deliveryOptionId) {
                item.deliveryPriceCents = option.priceCents;
            }
        })
    })
    cart.forEach((tax) => {
        totalTax = totalTax + tax.deliveryPriceCents;
    })
    //saveToStorage();
    console.log('Cart after adding:', cart);
    let totalPriceCents = (totalTax / 100).toFixed(2);
    console.log(totalPriceCents);
    return totalPriceCents;
}