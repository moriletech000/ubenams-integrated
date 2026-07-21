// Shop Page JavaScript

let selectedCategory = 'All';

document.addEventListener('DOMContentLoaded', function() {
    loadCategoryFilters();
    displayProducts();
    
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

// Load category filter buttons
function loadCategoryFilters() {
    const container = document.getElementById('category-filters');
    const categories = getCategories();
    
    container.innerHTML = categories.map(category => `
        <button class="filter-btn ${category === 'All' ? 'active' : ''}" 
                onclick="filterByCategory('${category}')">
            ${category}
        </button>
    `).join('');
}

// Filter products by category
function filterByCategory(category) {
    selectedCategory = category;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim() === category) {
            btn.classList.add('active');
        }
    });
    
    displayProducts();
}

// Display filtered products
function displayProducts() {
    const container = document.getElementById('shop-products');
    const countElement = document.getElementById('products-count');
    
    let filteredProducts = selectedCategory === 'All' 
        ? products 
        : products.filter(p => p.category === selectedCategory);
    
    container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    const count = filteredProducts.length;
    countElement.textContent = `Showing ${count} ${count === 1 ? 'product' : 'products'}`;
}
