// Product Detail Page JavaScript

let currentQuantity = 1;

document.addEventListener('DOMContentLoaded', function() {
    loadProductDetail();
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const ul = navMenu.querySelector('ul');
            ul.classList.toggle('active');
        });
    }
});

function loadProductDetail() {
    const productId = parseInt(localStorage.getItem('selectedProduct'));
    const product = getProductById(productId);
    const container = document.getElementById('product-detail');

    if (!product) {
        container.innerHTML = `
            <div class="not-found">
                <h1>Product Not Found</h1>
                <p>Sorry, the product you're looking for doesn't exist.</p>
                <a href="shop.html" class="btn btn-primary">Back to Shop</a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/600x600?text=Product+Image'">
            </div>
            <div class="product-detail-info">
                <p class="product-detail-brand">${product.brand}</p>
                <h1 class="product-detail-name">${product.name}</h1>
                <div class="product-detail-price">${formatPrice(product.price)}</div>
                
                <div class="product-detail-description">
                    <h3>Description</h3>
                    <p>${product.description}</p>
                </div>

                <div class="product-detail-category">
                    <h3>Category</h3>
                    <span class="category-badge">${product.category}</span>
                </div>

                <div class="product-detail-quantity">
                    <h3>Quantity</h3>
                    <div class="quantity-selector">
                        <button onclick="decreaseQuantity()">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span id="quantity-display">${currentQuantity}</span>
                        <button onclick="increaseQuantity()">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>

                <button class="btn btn-primary add-to-cart-full" onclick="addMultipleToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Add to Cart</span>
                </button>

                <div class="product-features">
                    <p><i class="fas fa-check-circle"></i> High-quality products</p>
                    <p><i class="fas fa-check-circle"></i> Fast delivery available</p>
                    <p><i class="fas fa-check-circle"></i> Professional installation service</p>
                    <p><i class="fas fa-check-circle"></i> Customer support available</p>
                </div>
            </div>
        </div>
    `;
}

function increaseQuantity() {
    currentQuantity++;
    updateQuantityDisplay();
}

function decreaseQuantity() {
    if (currentQuantity > 1) {
        currentQuantity--;
        updateQuantityDisplay();
    }
}

function updateQuantityDisplay() {
    document.getElementById('quantity-display').textContent = currentQuantity;
}

function addMultipleToCart(productId) {
    for (let i = 0; i < currentQuantity; i++) {
        addToCart(productId);
    }
    showNotification(`Added ${currentQuantity} item(s) to cart!`);
    currentQuantity = 1;
    updateQuantityDisplay();
}
