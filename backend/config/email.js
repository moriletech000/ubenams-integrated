const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter configuration
async function verifyEmailConfig() {
    try {
        await transporter.verify();
        console.log('✅ Email service configured successfully');
        return true;
    } catch (error) {
        console.error('❌ Email configuration failed:', error.message);
        return false;
    }
}

// Send order confirmation email to admin
async function sendAdminOrderNotification(orderData) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || 'admin@ubenamsintegrated.com',
        subject: `🛒 New Order - ${orderData.orderId}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
                    .content { background: #f9f9f9; padding: 20px; }
                    .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                    .item { border-bottom: 1px solid #eee; padding: 10px 0; }
                    .total { font-size: 1.2em; font-weight: bold; color: #27ae60; }
                    .footer { text-align: center; padding: 20px; color: #777; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>New Order Received! 🎉</h2>
                    </div>
                    <div class="content">
                        <div class="order-details">
                            <h3>Order Information</h3>
                            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                            <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
                            <p><strong>Payment Reference:</strong> ${orderData.paymentReference || 'N/A'}</p>
                            <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        
                        <div class="order-details">
                            <h3>Customer Information</h3>
                            <p><strong>Name:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                            <p><strong>Email:</strong> ${orderData.customer.email}</p>
                            <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
                            <p><strong>Address:</strong> ${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.state} ${orderData.customer.zip || ''}</p>
                        </div>
                        
                        <div class="order-details">
                            <h3>Order Items</h3>
                            ${orderData.items.map(item => `
                                <div class="item">
                                    <p><strong>${item.name}</strong></p>
                                    <p>Quantity: ${item.quantity} × ₦${item.price.toLocaleString()} = ₦${(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="order-details">
                            <p><strong>Subtotal:</strong> ₦${orderData.subtotal.toLocaleString()}</p>
                            <p><strong>Shipping:</strong> ₦${orderData.shipping.toLocaleString()}</p>
                            <p class="total">Total: ₦${orderData.total.toLocaleString()}</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>UBENAMS Integrated - Order Management System</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Admin notification email sent');
        return true;
    } catch (error) {
        console.error('❌ Failed to send admin email:', error.message);
        return false;
    }
}

// Send order confirmation email to customer
async function sendCustomerOrderConfirmation(orderData) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: orderData.customer.email,
        subject: `Order Confirmation - ${orderData.orderId}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
                    .content { background: #f9f9f9; padding: 20px; }
                    .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                    .item { border-bottom: 1px solid #eee; padding: 10px 0; }
                    .total { font-size: 1.2em; font-weight: bold; color: #27ae60; }
                    .footer { text-align: center; padding: 20px; color: #777; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Thank You for Your Order! ✅</h2>
                    </div>
                    <div class="content">
                        <p>Dear ${orderData.customer.firstName},</p>
                        <p>We've received your order and will process it shortly.</p>
                        
                        <div class="order-details">
                            <h3>Order Summary</h3>
                            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                            <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        
                        <div class="order-details">
                            <h3>Items Ordered</h3>
                            ${orderData.items.map(item => `
                                <div class="item">
                                    <p><strong>${item.name}</strong></p>
                                    <p>Quantity: ${item.quantity} × ₦${item.price.toLocaleString()} = ₦${(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="order-details">
                            <p><strong>Subtotal:</strong> ₦${orderData.subtotal.toLocaleString()}</p>
                            <p><strong>Shipping:</strong> ₦${orderData.shipping.toLocaleString()}</p>
                            <p class="total">Total: ₦${orderData.total.toLocaleString()}</p>
                        </div>
                        
                        <div class="order-details">
                            <h3>Delivery Address</h3>
                            <p>${orderData.customer.address}<br>
                            ${orderData.customer.city}, ${orderData.customer.state} ${orderData.customer.zip || ''}</p>
                        </div>
                        
                        <p>We'll send you another email once your order ships.</p>
                        <p>If you have any questions, please contact us at ${process.env.ADMIN_EMAIL}</p>
                    </div>
                    <div class="footer">
                        <p>UBENAMS Integrated</p>
                        <p>Thank you for shopping with us!</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Customer confirmation email sent');
        return true;
    } catch (error) {
        console.error('❌ Failed to send customer email:', error.message);
        return false;
    }
}

module.exports = {
    transporter,
    verifyEmailConfig,
    sendAdminOrderNotification,
    sendCustomerOrderConfirmation
};
