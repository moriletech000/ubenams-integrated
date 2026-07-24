// Admin Dashboard JavaScript

let currentFilter = 'all';

// Auto-detect API URL based on environment
const getApiUrl = () => {
    const hostname = window.location.hostname;
    
    // Production: Use Render backend
    if (hostname.includes('vercel.app') || hostname.includes('ubenams')) {
        return 'https://ubenams-integrated.onrender.com/api';
    }
    
    // Local development: Use localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    
    // Mobile/IP access: Use computer's IP
    return `${window.location.protocol}//${hostname}:3000/api`;
};

const API_URL = getApiUrl();

// Format price
function formatPrice(price) {
    return '₦' + parseFloat(price).toLocaleString('en-NG');
}

// Load admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    updateStats();
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const ul = navMenu.querySelector('ul');
            ul.classList.toggle('active');
        });
    }

    // Auto-refresh every 10 seconds
    setInterval(() => {
        loadOrders();
        updateStats();
    }, 10000);
});

// Load orders from backend API
async function loadOrders() {
    const ordersList = document.getElementById('orders-list');
    const emptyOrders = document.getElementById('empty-orders');

    try {
        // Show loading state
        ordersList.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">Loading orders...</p>';
        
        const response = await fetch(`${API_URL}/orders?limit=100`);
        const data = await response.json();

        if (!data.success || !data.orders || data.orders.length === 0) {
            ordersList.innerHTML = '';
            emptyOrders.style.display = 'block';
            return;
        }

        emptyOrders.style.display = 'none';

        let orders = data.orders;

        // Filter orders
        if (currentFilter !== 'all') {
            if (currentFilter === 'pending_verification') {
                orders = orders.filter(order => order.order_status === 'pending');
            } else if (currentFilter === 'confirmed') {
                orders = orders.filter(order => order.order_status === 'verified' || order.order_status === 'processing' || order.order_status === 'shipped');
            } else if (currentFilter === 'paid') {
                orders = orders.filter(order => order.payment_status === 'completed' || order.payment_status === 'paid');
            }
        }

        // Fetch items for each order
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            try {
                const itemsResponse = await fetch(`${API_URL}/orders/${order.order_id}`);
                const itemsData = await itemsResponse.json();
                return {
                    ...order,
                    items: itemsData.items || []
                };
            } catch (error) {
                console.error('Error fetching items for order:', order.order_id, error);
                return {
                    ...order,
                    items: []
                };
            }
        }));

        ordersList.innerHTML = ordersWithItems.map(order => createOrderCard(order)).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersList.innerHTML = '<p style="text-align: center; padding: 40px; color: #e74c3c;">Failed to load orders. Please check your connection.</p>';
    }
}

// Create order card HTML
function createOrderCard(order) {
    const statusClass = `status-${order.order_status.replace('_', '-')}`;
    const statusText = order.order_status.replace('_', ' ').toUpperCase();
    const orderDate = new Date(order.created_at).toLocaleString('en-NG');
    const isPending = order.order_status === 'pending';

    return `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">${order.order_id}</span>
                <span class="order-status ${statusClass}">${statusText}</span>
                ${isPending ? '<span class="order-status status-pending-verification">⏳ NEEDS VERIFICATION</span>' : ''}
            </div>

            <div class="order-info">
                <div class="info-item">
                    <span class="info-label">Customer</span>
                    <span class="info-value">${order.customer_first_name} ${order.customer_last_name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${order.customer_email}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${order.customer_phone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Payment Method</span>
                    <span class="info-value">${order.payment_method.toUpperCase()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Payment Status</span>
                    <span class="info-value">${order.payment_status.toUpperCase()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Order Date</span>
                    <span class="info-value">${orderDate}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Address</span>
                    <span class="info-value">${order.customer_address}, ${order.customer_city}</span>
                </div>
            </div>

            <div class="order-items">
                <h4>Order Items</h4>
                <ul>
                    ${order.items && order.items.length > 0 ? order.items.map(item => `
                        <li>${item.product_name} x ${item.quantity} = ${formatPrice(parseFloat(item.price) * item.quantity)}</li>
                    `).join('') : '<li>Loading items...</li>'}
                </ul>
            </div>

            <div class="order-total">
                Total: ${formatPrice(order.total)}
            </div>

            <div class="order-actions">
                ${isPending ? `
                    <button class="btn-approve" onclick="approveOrder('${order.order_id}')">
                        <i class="fas fa-check"></i> Verify & Approve Order
                    </button>
                    <button class="btn-reject" onclick="rejectOrder('${order.order_id}')">
                        <i class="fas fa-times"></i> Reject Order
                    </button>
                ` : ''}
                <button class="btn-view" onclick="viewOrderDetails('${order.order_id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
    `;
}

// Filter orders
function filterOrders(status) {
    currentFilter = status;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.closest('.filter-tab').classList.add('active');
    
    loadOrders();
}

// Approve order
async function approveOrder(orderId) {
    if (!confirm('Are you sure you want to verify and approve this order? The customer will be notified.')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'verified' })
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Order verified and approved successfully!', 'success');
            loadOrders();
            updateStats();
        } else {
            showNotification('Failed to approve order: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error approving order:', error);
        showNotification('Failed to approve order. Please try again.', 'error');
    }
}

// Reject order
async function rejectOrder(orderId) {
    const reason = prompt('Enter reason for rejection (optional):');
    if (reason === null) return; // User cancelled

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'cancelled' })
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Order rejected', 'error');
            loadOrders();
            updateStats();
        } else {
            showNotification('Failed to reject order: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error rejecting order:', error);
        showNotification('Failed to reject order. Please try again.', 'error');
    }
}

// View payment proof
function viewPaymentProof(imageUrl) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div style="position: relative; max-width: 90%; max-height: 90%;">
            <button onclick="this.closest('.modal').remove()" 
                    style="position: absolute; top: -40px; right: 0; background: white; 
                           color: #222; border: none; padding: 10px 20px; border-radius: 5px; 
                           cursor: pointer; font-weight: bold;">
                <i class="fas fa-times"></i> Close
            </button>
            <img src="${imageUrl}" style="max-width: 100%; max-height: 85vh; border-radius: 10px; 
                 box-shadow: 0 5px 30px rgba(0,0,0,0.5);">
        </div>
    `;
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}

// View order details
async function viewOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`);
        const data = await response.json();
        
        if (!data.success) {
            alert('Failed to load order details');
            return;
        }
        
        const order = data.order;
        const items = data.items || [];
        
        alert(`
Order Details:
━━━━━━━━━━━━━━━━━━
Order ID: ${order.order_id}
Customer: ${order.customer_first_name} ${order.customer_last_name}
Email: ${order.customer_email}
Phone: ${order.customer_phone}

Shipping Address:
${order.customer_address}
${order.customer_city}, ${order.customer_state}

Items:
${items.map(item => `- ${item.product_name} x ${item.quantity}`).join('\n')}

Total: ${formatPrice(order.total)}
Payment: ${order.payment_method.toUpperCase()}
Payment Status: ${order.payment_status.toUpperCase()}
Order Status: ${order.order_status.toUpperCase()}
        `);
    } catch (error) {
        console.error('Error viewing order details:', error);
        alert('Failed to load order details');
    }
}

// Update statistics
async function updateStats() {
    try {
        const response = await fetch(`${API_URL}/orders?limit=1000`);
        const data = await response.json();

        if (!data.success) return;

        const orders = data.orders || [];
        
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.order_status === 'pending').length;
        const confirmedOrders = orders.filter(o => o.order_status === 'verified' || o.order_status === 'processing' || o.order_status === 'shipped').length;
        const totalRevenue = orders
            .filter(o => o.payment_status === 'completed' || o.payment_status === 'paid')
            .reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
        
        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('pending-orders').textContent = pendingOrders;
        document.getElementById('confirmed-orders').textContent = confirmedOrders;
        document.getElementById('total-revenue').textContent = formatPrice(totalRevenue);
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Send confirmation notification
function sendConfirmationNotification(order) {
    console.log('Sending confirmation email to:', order.customer.email);
    console.log('Order ID:', order.id);
    console.log('Order has been confirmed and will be processed for delivery.');
}

// Send rejection notification
function sendRejectionNotification(order) {
    console.log('Sending rejection email to:', order.customer.email);
    console.log('Order ID:', order.id);
    console.log('Reason:', order.rejectionReason || 'No reason provided');
}

// Show notification
function showNotification(message, type = 'success') {
    const bgColor = type === 'success' ? '#27ae60' : '#e74c3c';
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 3px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
