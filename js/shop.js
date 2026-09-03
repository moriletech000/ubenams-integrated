// Shop Page JavaScript

let selectedCategory = 'All';
let selectedSubcategory = null;

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
    selectedSubcategory = null; // Reset subcategory when changing category
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim() === category) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide subcategory dropdown for Bathroom Accessories and Kitchen Accessories
    const dropdown = document.getElementById('subcategory-dropdown');
    if (category === 'Bathroom Accessories') {
        loadSubcategoryDropdown('Bathroom Accessories');
        dropdown.style.display = 'block';
    } else if (category === 'Kitchen Accessories') {
        loadSubcategoryDropdown('Kitchen Accessories');
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
    
    displayProducts();
}

// Load subcategory dropdown buttons
function loadSubcategoryDropdown(category) {
    const container = document.getElementById('subcategory-dropdown');
    const subcategories = getSubcategories(category);
    
    container.innerHTML = `
        <button class="subcategory-btn active" onclick="filterBySubcategory(null)">
            All
        </button>
        ${subcategories.map(subcat => `
            <button class="subcategory-btn" onclick="filterBySubcategory('${subcat}')">
                ${subcat}
            </button>
        `).join('')}
    `;
}

// Filter by subcategory
function filterBySubcategory(subcategory) {
    selectedSubcategory = subcategory;
    
    // Update active button
    document.querySelectorAll('.subcategory-btn').forEach(btn => {
        btn.classList.remove('active');
        if ((subcategory === null && btn.textContent.trim() === 'All') || 
            btn.textContent.trim() === subcategory) {
            btn.classList.add('active');
        }
    });
    
    displayProducts();
}

// Display filtered products
function displayProducts() {
    const container = document.getElementById('shop-products');
    const countElement = document.getElementById('products-count');
    const headerElement = document.getElementById('subcategory-header');
    
    let filteredProducts = getProductsByCategory(selectedCategory, selectedSubcategory);
    
    container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    const count = filteredProducts.length;
    countElement.textContent = `Showing ${count} ${count === 1 ? 'product' : 'products'}`;
    
    // Show/hide subcategory header
    if (selectedSubcategory) {
        headerElement.textContent = selectedSubcategory;
        headerElement.style.display = 'block';
    } else {
        headerElement.style.display = 'none';
    }
}
