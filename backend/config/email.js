const nodemailer = require('nodemailer');

// Create email transporter with proper Gmail SMTP configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter configuration
async function verifyEmailConfig() {
    // Skip email verification if EMAIL_USER or EMAIL_PASSWORD is not set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('⚠️  Email not configured (missing EMAIL_USER or EMAIL_PASSWORD)');
        console.log('⚠️  Email features will be disabled, but the server will continue running');
        return false;
    }

    try {
        await transporter.verify();
        console.log('✅ Gmail email service configured successfully');
        console.log(`📧 Sending emails from: ${process.env.EMAIL_USER}`);
        return true;
    } catch (error) {
        console.error('❌ Email configuration failed:', error.message);
        console.log('⚠️  Email features will be limited, but the server will continue running');
        return false;
    }
}

// Helper function to send email
async function sendEmail(mailOptions) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('⚠️  Email not configured - skipping email');
        return false;
    }

    try {
        await transporter.sendMail({
            from: `"UBENAMS Integrated" <${process.env.EMAIL_USER}>`,
            ...mailOptions
        });
        return true;
    } catch (error) {
        console.error('❌ Failed to send email:', error.message);
        return false;
    }
}

// Send order confirmation email to admin
async function sendAdminOrderNotification(orderData) {
    const mailOptions = {
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
        await sendEmail(mailOptions);
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
        await sendEmail(mailOptions);
        console.log('✅ Customer confirmation email sent');
        return true;
    } catch (error) {
        console.error('❌ Failed to send customer email:', error.message);
        return false;
    }
}

// Send email verification email
async function sendVerificationEmail(email, firstName, token) {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('⚠️  Email not configured - skipping verification email');
        return false;
    }

    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5500'}/verify-email.html?token=${token}`;
    
    const mailOptions = {
        to: email,
        subject: 'Verify Your Email - UBENAMS Integrated',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .button { display: inline-block; background: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Welcome to UBENAMS Integrated! 🎉</h2>
                    </div>
                    <div class="content">
                        <p>Hi ${firstName},</p>
                        <p>Thank you for registering with UBENAMS Integrated!</p>
                        <p>Please verify your email address by clicking the button below:</p>
                        <center>
                            <a href="${verificationUrl}" class="button">Verify Email Address</a>
                        </center>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                        <p>This link will expire in 24 hours.</p>
                        <p>If you didn't create an account, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>UBENAMS Integrated</p>
                        <p>...exceptional unique products.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await sendEmail(mailOptions);
        console.log('✅ Verification email sent to:', email);
        return true;
    } catch (error) {
        console.error('❌ Failed to send verification email:', error.message);
        return false;
    }
}

// Send welcome email after verification
async function sendWelcomeEmail(email, firstName) {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('⚠️  Email not configured - skipping welcome email');
        return false;
    }

    const mailOptions = {
        to: email,
        subject: 'Welcome to UBENAMS Integrated!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .button { display: inline-block; background: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; color: #777; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Email Verified Successfully! ✅</h2>
                    </div>
                    <div class="content">
                        <p>Hi ${firstName},</p>
                        <p>Your email has been verified successfully! You can now enjoy all the features of UBENAMS Integrated.</p>
                        <p>Here's what you can do now:</p>
                        <ul>
                            <li>Browse our unique products</li>
                            <li>Place orders with ease</li>
                            <li>Track your order status</li>
                            <li>Manage your profile</li>
                        </ul>
                        <center>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5500'}/shop.html" class="button">Start Shopping</a>
                        </center>
                        <p>Thank you for choosing UBENAMS Integrated!</p>
                    </div>
                    <div class="footer">
                        <p>UBENAMS Integrated</p>
                        <p>...exceptional unique products.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await sendEmail(mailOptions);
        console.log('✅ Welcome email sent to:', email);
        return true;
    } catch (error) {
        console.error('❌ Failed to send welcome email:', error.message);
        return false;
    }
}

// Send password reset email
async function sendPasswordResetEmail(email, firstName, token) {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('⚠️  Email not configured - skipping password reset email');
        return false;
    }

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5500'}/reset-password.html?token=${token}`;
    
    const mailOptions = {
        to: email,
        subject: 'Reset Your Password - UBENAMS Integrated',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #e74c3c; color: white; padding: 20px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .button { display: inline-block; background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
                    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Password Reset Request 🔐</h2>
                    </div>
                    <div class="content">
                        <p>Hi ${firstName},</p>
                        <p>We received a request to reset your password for your UBENAMS Integrated account.</p>
                        <p>Click the button below to reset your password:</p>
                        <center>
                            <a href="${resetUrl}" class="button">Reset Password</a>
                        </center>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                        <div class="warning">
                            <strong>⚠️ Security Notice:</strong>
                            <p>This link will expire in 1 hour for security reasons.</p>
                        </div>
                        <p>If you didn't request a password reset, please ignore this email or contact us if you have concerns.</p>
                    </div>
                    <div class="footer">
                        <p>UBENAMS Integrated</p>
                        <p>...exceptional unique products.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await sendEmail(mailOptions);
        console.log('✅ Password reset email sent to:', email);
        return true;
    } catch (error) {
        console.error('❌ Failed to send password reset email:', error.message);
        return false;
    }
}

module.exports = {
    verifyEmailConfig,
    sendAdminOrderNotification,
    sendCustomerOrderConfirmation,
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail
};
