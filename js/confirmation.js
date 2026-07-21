// Order Confirmation Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    displayOrderId();
    
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

function displayOrderId() {
    const orderId = localStorage.getItem('lastOrderId');
    const orderIdElement = document.getElementById('order-id');
    
    if (orderId) {
        orderIdElement.textContent = orderId;
    } else {
        orderIdElement.textContent = 'N/A';
    }
}
