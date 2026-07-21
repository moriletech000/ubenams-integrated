// Admin Dashboard JavaScript

let currentFilter = 'all';

// Format price
function formatPrice(price) {
    return '₦' + price.toLocaleString('en-NG');
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

    // Auto-refresh every 30 seconds
    setInterval(() => {
        loadOrders();
        updateStats();
    }, 30000);
});

// Load orders
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const ordersList = document.getElementById('orders-list');
    const emptyOrders = document.getElementById('empty-orders');

    if (orders.length === 0) {
        ordersList.innerHTML = '';
        emptyOrders.style.display = 'block';
        return;
    }

    emptyOrders.style.display = 'none';

    // Filter orders
    let filteredOrders = orders;
    if (currentFilter !== 'all') {
        filteredOrders = orders.filter(order => order.status === currentFilter);
    }

    // Sort by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    ordersList.innerHTML = filteredOrders.map(order => createOrderCard(order)).join('');
}

// Create order card HTML
function createOrderCard(order) {
    const statusClass = `status-${order.status.replace('_', '-')}`;
    const statusText = order.status.replace('_', ' ').toUpperCase();
    const orderDate = new Date(order.createdAt).toLocaleString('en-NG');

    return `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">${order.id}</span>
                <span class="order-status ${statusClass}">${statusText}</span>
            </div>

            <div class="order-info">
                <div class="info-item">
                    <span class="info-label">Customer</span>
                    <span class="info-value">${order.customer.firstName} ${order.customer.lastName}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${order.customer.email}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${order.customer.phone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Payment Method</span>
                    <span class="info-value">${order.paymentMethod.toUpperCase()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Order Date</span>
                    <span class="info-value">${orderDate}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Address</span>
                    <span class="info-value">${order.customer.address}, ${order.customer.city}</span>
                </div>
            </div>

            <div class="order-items">
                <h4>Order Items</h4>
                <ul>
                    ${order.items.map(item => `
                        <li>${item.name} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}</li>
                    `).join('')}
                </ul>
            </div>

            <div class="order-total">
                Total: ${formatPrice(order.total)}
            </div>

            ${order.paymentProofName ? `
                <div class="payment-proof">
                    <p style="font-weight: 600; margin-bottom: 10px; color: #666;">
                        <i class="fas fa-image"></i> Payment Proof Uploaded
                    </p>
                    ${order.paymentProof ? `
                        <img src="${order.paymentProof}" alt="Payment Proof" 
                             onclick="viewPaymentProof('${order.paymentProof}')">
                    ` : `<p style="color: #999;">File: ${order.paymentProofName}</p>`}
                </div>
            ` : ''}

            <div class="order-actions">
                ${order.status === 'pending_verification' ? `
                    <button class="btn-approve" onclick="approveOrder('${order.id}')">
                        <i class="fas fa-check"></i> Approve Order
                    </button>
                    <button class="btn-reject" onclick="rejectOrder('${order.id}')">
                        <i class="fas fa-times"></i> Reject Order
                    </button>
                ` : ''}
                <button class="btn-view" onclick="viewOrderDetails('${order.id}')">
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
function approveOrder(orderId) {
    if (!confirm('Are you sure you want to approve this order? The customer will be notified.')) {
        return;
    }

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'confirmed';
        orders[orderIndex].confirmedAt = new Date().toISOString();
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Send confirmation notification (in production, this would be an email)
        sendConfirmationNotification(orders[orderIndex]);
        
        showNotification('Order approved successfully!', 'success');
        loadOrders();
        updateStats();
    }
}

// Reject order
function rejectOrder(orderId) {
    const reason = prompt('Enter reason for rejection (optional):');
    if (reason === null) return; // User cancelled

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'rejected';
        orders[orderIndex].rejectionReason = reason;
        orders[orderIndex].rejectedAt = new Date().toISOString();
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Send rejection notification (in production, this would be an email)
        sendRejectionNotification(orders[orderIndex]);
        
        showNotification('Order rejected', 'error');
        loadOrders();
        updateStats();
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
function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    alert(`
Order Details:
━━━━━━━━━━━━━━━━━━
Order ID: ${order.id}
Customer: ${order.customer.firstName} ${order.customer.lastName}
Email: ${order.customer.email}
Phone: ${order.customer.phone}

Shipping Address:
${order.customer.address}
${order.customer.city}, ${order.customer.state}

Items:
${order.items.map(item => `- ${item.name} x ${item.quantity}`).join('\n')}

Total: ${formatPrice(order.total)}
Payment: ${order.paymentMethod.toUpperCase()}
Status: ${order.status.toUpperCase()}
    `);
}

// Update statistics
function updateStats() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending_verification').length;
    const confirmedOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'paid').length;
    const totalRevenue = orders
        .filter(o => o.status === 'confirmed' || o.status === 'paid')
        .reduce((sum, order) => sum + order.total, 0);
    
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('confirmed-orders').textContent = confirmedOrders;
    document.getElementById('total-revenue').textContent = formatPrice(totalRevenue);
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
