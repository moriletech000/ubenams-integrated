// Checkout Page JavaScript

// NOTE: Replace with your actual Paystack public key
const PAYSTACK_PUBLIC_KEY = 'pk_test_your_key_here'; // Get from https://dashboard.paystack.com/settings/developer

// Backend API Configuration - Auto-detect based on environment
const getApiUrl = () => {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `${window.location.protocol}//${hostname}:3000/api`;
    }
    return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiUrl();

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('user') !== null;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

document.addEventListener('DOMContentLoaded', function() {
    // Require login to checkout
    if (!isLoggedIn()) {
        alert('Please login or create an account to checkout');
        window.location.href = 'login.html?redirect=checkout.html';
        return;
    }

    // Redirect if cart is empty
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    // Auto-fill user information if logged in
    const user = getCurrentUser();
    if (user) {
        document.querySelector('input[name="firstName"]').value = user.firstName || '';
        document.querySelector('input[name="lastName"]').value = user.lastName || '';
        document.querySelector('input[name="email"]').value = user.email || '';
        document.querySelector('input[name="phone"]').value = user.phone || '';
    }

    displayCheckoutSummary();
    setupCheckoutForm();
    
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

function displayCheckoutSummary() {
    const summaryItems = document.getElementById('summary-items');
    
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span class="summary-item-name">${item.name} x ${item.quantity}</span>
            <span class="summary-item-price">${formatPrice(item.price * item.quantity)}</span>
        </div>
    `).join('');

    const subtotal = getCartTotal();
    const shipping = 5000;
    const total = subtotal + shipping;

    document.getElementById('checkout-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('checkout-shipping').textContent = formatPrice(shipping);
    document.getElementById('checkout-total').textContent = formatPrice(total);
}

function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        processCheckout();
    });
}

function processCheckout() {
    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);
    const user = getCurrentUser();
    
    const orderData = {
        userId: user ? user.id : null, // Link order to user
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode')
        },
        items: cart,
        subtotal: getCartTotal(),
        shipping: 5000,
        total: getCartTotal() + 5000,
        paymentMethod: formData.get('paymentMethod')
    };

    const paymentMethod = formData.get('paymentMethod');

    if (paymentMethod === 'card') {
        initiatePaystackPayment(orderData);
    } else if (paymentMethod === 'transfer') {
        showBankTransferModal(orderData);
    } else {
        processDirectOrder(orderData);
    }
}

function initiatePaystackPayment(orderData) {
    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: orderData.customer.email,
        amount: orderData.total * 100, // Paystack expects amount in kobo
        currency: 'NGN',
        ref: 'ORD-' + Date.now(),
        metadata: {
            custom_fields: [
                {
                    display_name: "Customer Name",
                    variable_name: "customer_name",
                    value: `${orderData.customer.firstName} ${orderData.customer.lastName}`
                },
                {
                    display_name: "Phone",
                    variable_name: "phone",
                    value: orderData.customer.phone
                }
            ]
        },
        callback: function(response) {
            // Payment successful
            sendOrderToBackend(orderData, response.reference);
        },
        onClose: function() {
            showNotification('Payment cancelled');
        }
    });
    
    handler.openIframe();
}

function processDirectOrder(orderData) {
    // For bank transfer or cash on delivery
    const btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.textContent = 'Processing...';

    // Simulate API call
    setTimeout(() => {
        sendOrderToBackend(orderData, null);
    }, 1000);
}

function sendOrderToBackend(orderData, paymentReference) {
    // Show loading state
    const btn = document.getElementById('place-order-btn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Processing...';
    }

    // Prepare order data for backend
    const backendOrderData = {
        ...orderData,
        paymentReference: paymentReference,
        orderId: 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    // Send to backend API
    fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendOrderData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to process order');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('✅ Order processed successfully:', data.orderId);
            
            // Also save to localStorage as backup
            const order = {
                id: data.orderId,
                ...orderData,
                paymentReference: paymentReference,
                status: paymentReference ? 'paid' : 'pending',
                createdAt: new Date().toISOString()
            };
            
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Clear cart
            clearCart();
            
            // Redirect to confirmation page
            localStorage.setItem('lastOrderId', data.orderId);
            window.location.href = 'order-confirmation.html';
        } else {
            throw new Error(data.error || 'Failed to process order');
        }
    })
    .catch(error => {
        console.error('❌ Error sending order to backend:', error);
        
        // Fallback: save locally if backend fails
        const orderId = 'ORD-LOCAL-' + Date.now();
        const order = {
            id: orderId,
            ...orderData,
            paymentReference: paymentReference,
            status: 'pending_sync',
            createdAt: new Date().toISOString()
        };
        
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Show warning but still proceed
        showNotification('Order saved locally. We will sync with server when connection is restored.');
        
        clearCart();
        localStorage.setItem('lastOrderId', orderId);
        
        setTimeout(() => {
            window.location.href = 'order-confirmation.html';
        }, 2000);
    })
    .finally(() => {
        // Reset button state
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Place Order';
        }
    });
}

function showBankTransferModal(orderData) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'bank-transfer-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
        padding: 20px;
        overflow-y: auto;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; width: 90%; box-shadow: 0 5px 30px rgba(0,0,0,0.3); max-height: 90vh; overflow-y: auto; margin: auto;">
            <h2 style="color: #088178; margin-bottom: 20px; text-align: center; font-size: 22px;">
                <i class="fas fa-university" style="margin-right: 10px;"></i>
                Bank Transfer Details
            </h2>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <div style="margin-bottom: 12px;">
                    <p style="color: #666; font-size: 12px; margin-bottom: 3px;">Bank Name</p>
                    <p style="font-size: 16px; font-weight: bold; color: #222;">Access Bank</p>
                </div>
                <div style="margin-bottom: 12px;">
                    <p style="color: #666; font-size: 12px; margin-bottom: 3px;">Account Name</p>
                    <p style="font-size: 16px; font-weight: bold; color: #222;">Ubenams Integrated Limited</p>
                </div>
                <div style="margin-bottom: 12px;">
                    <p style="color: #666; font-size: 12px; margin-bottom: 3px;">Account Number</p>
                    <p style="font-size: 22px; font-weight: bold; color: #088178; font-family: monospace;">1234567890</p>
                    <button onclick="copyAccountNumber()" style="background: #088178; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; margin-top: 5px; font-size: 11px;">
                        <i class="fas fa-copy"></i> Copy Account Number
                    </button>
                </div>
                <div style="margin-bottom: 0;">
                    <p style="color: #666; font-size: 12px; margin-bottom: 3px;">Amount to Transfer</p>
                    <p style="font-size: 24px; font-weight: bold; color: #e74c3c;">${formatPrice(orderData.total)}</p>
                </div>
            </div>

            <div style="background: #fff3cd; padding: 12px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 15px;">
                <p style="color: #856404; font-size: 13px; margin: 0; line-height: 1.4;">
                    <i class="fas fa-info-circle" style="margin-right: 5px;"></i>
                    <strong>Important:</strong> Please use your Order ID as the transfer reference.
                </p>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #222; font-size: 14px;">
                    Upload Payment Proof (Optional)
                </label>
                <input type="file" id="payment-proof" accept="image/*" style="width: 100%; padding: 8px; border: 2px dashed #ddd; border-radius: 5px; cursor: pointer; font-size: 13px;">
                <p style="font-size: 11px; color: #999; margin-top: 5px;">Upload screenshot of transfer receipt</p>
            </div>

            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                <button onclick="confirmBankTransfer()" style="background: #088178; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; flex: 1; min-width: 150px;">
                    <i class="fas fa-check"></i> I've Made Transfer
                </button>
                <button onclick="closeBankTransferModal()" style="background: #e74c3c; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Store order data temporarily
    window.tempOrderData = orderData;
}

function copyAccountNumber() {
    const accountNumber = '1234567890';
    navigator.clipboard.writeText(accountNumber).then(() => {
        showNotification('Account number copied!');
    });
}

function closeBankTransferModal() {
    const modal = document.getElementById('bank-transfer-modal');
    if (modal) {
        modal.remove();
    }
    window.tempOrderData = null;
}

function confirmBankTransfer() {
    const orderData = window.tempOrderData;
    if (!orderData) return;

    const fileInput = document.getElementById('payment-proof');
    const file = fileInput?.files[0];

    // Show loading
    const confirmBtn = event.target;
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Create order ID
    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Prepare backend order data
    const backendOrderData = {
        ...orderData,
        orderId: orderId,
        paymentReference: `BANK-TRANSFER-${orderId}`,
        paymentProof: file ? file.name : null
    };

    // Send to backend
    fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendOrderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Bank transfer order created:', data.orderId);
            
            // Save locally as backup
            const order = {
                id: data.orderId,
                ...orderData,
                paymentProof: file ? URL.createObjectURL(file) : null,
                paymentProofName: file ? file.name : null,
                status: 'pending_verification',
                createdAt: new Date().toISOString()
            };
            
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Close modal
            closeBankTransferModal();
            
            // Clear cart
            clearCart();
            
            // Redirect to pending confirmation page
            localStorage.setItem('lastOrderId', data.orderId);
            window.location.href = 'order-pending.html';
        } else {
            throw new Error(data.error || 'Failed to process order');
        }
    })
    .catch(error => {
        console.error('❌ Error processing bank transfer:', error);
        
        // Fallback: save locally
        const order = {
            id: orderId,
            ...orderData,
            paymentProof: file ? URL.createObjectURL(file) : null,
            paymentProofName: file ? file.name : null,
            status: 'pending_sync',
            createdAt: new Date().toISOString()
        };
        
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        showNotification('Order saved locally. We will sync with server when connection is restored.');
        
        closeBankTransferModal();
        clearCart();
        localStorage.setItem('lastOrderId', orderId);
        
        setTimeout(() => {
            window.location.href = 'order-pending.html';
        }, 2000);
    });
}

function sendOrderNotification(order) {
    // In production, implement email sending on your backend
    // This is just a simulation
    console.log('Order Notification Email:');
    console.log('To: admin@ubenamsintegrated.com');
    console.log('Subject: New Order Received - ' + order.id);
    console.log('Body:');
    console.log(`
        New Order Received!
        
        Order ID: ${order.id}
        Customer: ${order.customer.firstName} ${order.customer.lastName}
        Email: ${order.customer.email}
        Phone: ${order.customer.phone}
        
        Shipping Address:
        ${order.customer.address}
        ${order.customer.city}, ${order.customer.state}
        
        Order Items:
        ${order.items.map(item => `- ${item.name} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join('\n        ')}
        
        Subtotal: ${formatPrice(order.subtotal)}
        Shipping: ${formatPrice(order.shipping)}
        Total: ${formatPrice(order.total)}
        
        Payment Method: ${order.paymentMethod}
        Payment Status: ${order.status}
    `);
}
