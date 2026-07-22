// Profile Page JavaScript
// Auto-detect API URL based on environment
const getApiUrl = () => {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `${window.location.protocol}//${hostname}:3000/api`;
    }
    return 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('user') !== null;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Require authentication
if (!isLoggedIn()) {
    window.location.href = 'login.html?redirect=profile.html';
}

const currentUser = getCurrentUser();

// Load user profile
async function loadProfile() {
    try {
        const response = await fetch(`${API_URL}/auth/profile/${currentUser.id}`);
        const data = await response.json();

        if (data.success) {
            const user = data.user;
            
            // Update profile info
            document.getElementById('user-name').textContent = `${user.first_name} ${user.last_name}`;
            document.getElementById('user-email').textContent = user.email;
            document.getElementById('user-phone').textContent = user.phone || 'Not provided';
            document.getElementById('user-since').textContent = new Date(user.created_at).toLocaleDateString();

            // Store for edit form
            document.getElementById('edit-firstName').value = user.first_name;
            document.getElementById('edit-lastName').value = user.last_name;
            document.getElementById('edit-phone').value = user.phone || '';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Load user orders
async function loadOrders() {
    const ordersContainer = document.getElementById('orders-container');
    const ordersLoading = document.getElementById('orders-loading');
    const noOrders = document.getElementById('no-orders');

    try {
        const response = await fetch(`${API_URL}/auth/orders/${currentUser.id}`);
        const data = await response.json();

        ordersLoading.style.display = 'none';

        if (data.success && data.orders.length > 0) {
            ordersContainer.innerHTML = data.orders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <div class="order-id">Order #${order.order_id}</div>
                            <div class="order-date">${new Date(order.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</div>
                        </div>
                        <div class="order-status">
                            <span class="status-badge ${order.payment_status}">${order.payment_status}</span>
                            <span class="status-badge ${order.order_status}">${order.order_status}</span>
                        </div>
                    </div>
                    
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                ${item.product_image ? `<img src="${item.product_image}" alt="${item.product_name}" class="order-item-image">` : ''}
                                <div class="order-item-details">
                                    <div class="order-item-name">${item.product_name}</div>
                                    <div class="order-item-quantity">Quantity: ${item.quantity} × ₦${parseFloat(item.price).toLocaleString()}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="order-footer">
                        <div class="order-payment">
                            <i class="fas fa-credit-card"></i> ${order.payment_method.toUpperCase()}
                            ${order.payment_reference ? `<br><small>Ref: ${order.payment_reference}</small>` : ''}
                        </div>
                        <div class="order-total">
                            Total: ₦${parseFloat(order.total).toLocaleString()}
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            noOrders.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersLoading.innerHTML = '<p style="color: red;">Failed to load orders. Please try again.</p>';
    }
}

// Edit Profile Button
document.getElementById('edit-profile-btn').addEventListener('click', () => {
    document.getElementById('edit-profile-form').style.display = 'block';
    document.getElementById('edit-profile-btn').style.display = 'none';
});

// Cancel Edit Button
document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    document.getElementById('edit-profile-form').style.display = 'none';
    document.getElementById('edit-profile-btn').style.display = 'block';
    document.getElementById('edit-message').style.display = 'none';
});

// Update Profile Form
document.getElementById('update-profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const messageDiv = document.getElementById('edit-message');
    messageDiv.style.display = 'none';

    const formData = {
        firstName: document.getElementById('edit-firstName').value,
        lastName: document.getElementById('edit-lastName').value,
        phone: document.getElementById('edit-phone').value
    };

    try {
        const response = await fetch(`${API_URL}/auth/profile/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.textContent = 'Profile updated successfully!';
            messageDiv.className = 'message success';
            messageDiv.style.display = 'block';

            // Update displayed info
            document.getElementById('user-name').textContent = `${formData.firstName} ${formData.lastName}`;
            document.getElementById('user-phone').textContent = formData.phone || 'Not provided';

            // Update localStorage
            currentUser.firstName = formData.firstName;
            currentUser.lastName = formData.lastName;
            currentUser.phone = formData.phone;
            localStorage.setItem('user', JSON.stringify(currentUser));

            // Hide form after 2 seconds
            setTimeout(() => {
                document.getElementById('edit-profile-form').style.display = 'none';
                document.getElementById('edit-profile-btn').style.display = 'block';
                messageDiv.style.display = 'none';
            }, 2000);
        } else {
            messageDiv.textContent = data.error || 'Failed to update profile';
            messageDiv.className = 'message error';
            messageDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
    }
});

// Logout Button
document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        logout();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadOrders();
});
