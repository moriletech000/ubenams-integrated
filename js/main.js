// Main JavaScript

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const ul = navMenu.querySelector('ul');
            ul.classList.toggle('active');
        });
    }

    // Load featured products on home page
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }

    // Load new arrivals on home page
    if (document.getElementById('new-arrivals')) {
        loadNewArrivals();
    }

    // Newsletter form
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            showNotification('Thank you for subscribing!');
            this.reset();
        });
    });
});

// Load featured products (first 8)
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    const featuredProducts = products.slice(0, 8);
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

// Load new arrivals (last 8)
function loadNewArrivals() {
    const container = document.getElementById('new-arrivals');
    const newArrivals = products.slice(8, 16);
    container.innerHTML = newArrivals.map(product => createProductCard(product)).join('');
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
