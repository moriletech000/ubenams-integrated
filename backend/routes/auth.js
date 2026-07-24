const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { pool } = require('../config/database');
const db = require('../config/db-adapter');
const { 
    sendVerificationEmail, 
    sendPasswordResetEmail,
    sendWelcomeEmail 
} = require('../config/email');

// Register new user
router.post('/register', async (req, res) => {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            success: false,
            error: 'Email, password, first name, and last name are required'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid email format'
        });
    }

    // Validate password strength
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            error: 'Password must be at least 8 characters long'
        });
    }

    try {
        // Check if user already exists
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'Email already registered'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Insert user (email_verified = TRUE by default)
        const [result] = await db.query(
            `INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verified) 
             VALUES (?, ?, ?, ?, ?, TRUE)`,
            [email, passwordHash, firstName, lastName, phone || null]
        );

        // Send welcome email (non-blocking - don't wait for it)
        sendWelcomeEmail(email, firstName).catch(err => {
            console.error('Failed to send welcome email:', err);
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful! Redirecting to login...',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Registration failed. Please try again.'
        });
    }
});

// Verify email
router.get('/verify-email/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const [users] = await db.query(
            'SELECT id, email, first_name, email_verified FROM users WHERE verification_token = ?',
            [token]
        );

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired verification token'
            });
        }

        const user = users[0];

        if (user.email_verified) {
            return res.status(400).json({
                success: false,
                error: 'Email already verified'
            });
        }

        // Update user as verified
        await db.query(
            'UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE id = ?',
            [user.id]
        );

        // Send welcome email (non-blocking)
        sendWelcomeEmail(user.email, user.first_name).catch(err => {
            console.error('Failed to send welcome email:', err);
        });

        res.json({
            success: true,
            message: 'Email verified successfully! You can now login.'
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Verification failed. Please try again.'
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Email and password are required'
        });
    }

    try {
        // Get user
        const [users] = await db.query(
            'SELECT id, email, password_hash, first_name, last_name, phone, email_verified FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                error: '✗ No account found with this email address.'
            });
        }

        const user = users[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                error: '✗ Incorrect password. Please try again.'
            });
        }

        // Return user data (excluding password)
        res.json({
            success: true,
            message: '✓ Login successful! Redirecting...',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.'
        });
    }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            error: 'Email is required'
        });
    }

    try {
        // Check if user exists
        const [users] = await db.query(
            'SELECT id, email, first_name FROM users WHERE email = ?',
            [email]
        );

        // Always return success even if user doesn't exist (security best practice)
        if (users.length === 0) {
            return res.json({
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent.'
            });
        }

        const user = users[0];

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save reset token
        await db.query(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
            [resetToken, resetTokenExpiry, user.id]
        );

        // Send reset email (non-blocking)
        sendPasswordResetEmail(user.email, user.first_name, resetToken).catch(err => {
            console.error('Failed to send password reset email:', err);
        });

        res.json({
            success: true,
            message: 'If an account exists with this email, a password reset link has been sent.'
        });

    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process request. Please try again.'
        });
    }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({
            success: false,
            error: 'Password is required'
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            error: 'Password must be at least 8 characters long'
        });
    }

    try {
        // Find user with valid reset token
        const [users] = await db.query(
            'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
            [token]
        );

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired reset token'
            });
        }

        const user = users[0];

        // Hash new password
        const passwordHash = await bcrypt.hash(password, 10);

        // Update password and clear reset token
        await db.query(
            'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
            [passwordHash, user.id]
        );

        res.json({
            success: true,
            message: 'Password reset successful! You can now login with your new password.'
        });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            success: false,
            error: 'Password reset failed. Please try again.'
        });
    }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            error: 'Email is required'
        });
    }

    try {
        const [users] = await db.query(
            'SELECT id, email, first_name, email_verified, verification_token FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.json({
                success: true,
                message: 'If an account exists with this email, a verification link has been sent.'
            });
        }

        const user = users[0];

        if (user.email_verified) {
            return res.status(400).json({
                success: false,
                error: 'Email already verified'
            });
        }

        // Generate new verification token if needed
        let verificationToken = user.verification_token;
        if (!verificationToken) {
            verificationToken = crypto.randomBytes(32).toString('hex');
            await db.query(
                'UPDATE users SET verification_token = ? WHERE id = ?',
                [verificationToken, user.id]
            );
        }

        // Resend verification email (non-blocking)
        sendVerificationEmail(user.email, user.first_name, verificationToken).catch(err => {
            console.error('Failed to resend verification email:', err);
        });

        res.json({
            success: true,
            message: 'Verification email sent! Please check your inbox.'
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send verification email. Please try again.'
        });
    }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const [users] = await db.query(
            'SELECT id, email, first_name, last_name, phone, email_verified, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch profile'
        });
    }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, phone } = req.body;

    try {
        await db.query(
            'UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?',
            [firstName, lastName, phone || null, userId]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update profile'
        });
    }
});

// Get user orders
router.get('/orders/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Get orders
        const [orders] = await db.query(
            `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
            [userId]
        );

        // Get items for each order
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const [items] = await db.query(
                `SELECT product_name, quantity, price, product_image 
                 FROM order_items WHERE order_id = ?`,
                [order.order_id]
            );
            return {
                ...order,
                items
            };
        }));

        res.json({
            success: true,
            orders: ordersWithItems
        });

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders'
        });
    }
});

module.exports = router;

