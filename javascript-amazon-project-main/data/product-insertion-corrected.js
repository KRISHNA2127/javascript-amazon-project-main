let innerProduct = '';

products.forEach((item) => {
    innerProduct +=`
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${item.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
           ${item.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${item.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${item.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${(item.priceCents / 100).toFixed(2)}
          </div>

          <div class="product-quantity-container">
            <select>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" 
            data-product-id="${item.id}">
            Add to Cart
          </button>
        </div>
    `;
});

document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.querySelector('.js-products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = innerProduct;
        
        // Add event listeners after content is inserted
        document.querySelectorAll('.js-add-to-cart').forEach((button) => {
            button.addEventListener('click', () => {
                const productId = button.dataset.productId;
                let matchingItem;

                cart.forEach((item) => {
                    if (productId === item.productId) {
                        matchingItem = item;
                    }
                });

                if (matchingItem) {
                    matchingItem.quantity += 1;
                } else {
                    cart.push({
                        productId: productId,
                        quantity: 1
                    });
                }

                let cartQuantity = 0;
                cart.forEach((item) => {
                    cartQuantity += item.quantity;
                });
                
                document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;

                // Add console log to see cart updates
                console.log('Cart:', cart);
            });
        });
    } else {
        console.error('Products grid container not found');
    }
});