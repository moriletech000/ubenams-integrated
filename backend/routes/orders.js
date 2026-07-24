const express = require('express');
const router = express.Router();
const { pool, query } = require('../config/database');
const { sendAdminOrderNotification, sendCustomerOrderConfirmation } = require('../config/email');

// Create new order
router.post('/', async (req, res) => {
    try {
        const orderData = req.body;
        
        // Validate required fields
        if (!orderData.customer || !orderData.items || orderData.items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid order data. Customer information and items are required.'
            });
        }

        // Generate order ID if not provided
        const orderId = orderData.orderId || 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        const client = await pool.connect();
        
        try {
            // Start transaction
            await client.query('BEGIN');
            
            // Insert order (PostgreSQL uses $1, $2, etc.)
            await client.query(
                `INSERT INTO orders (
                    order_id, user_id, customer_first_name, customer_last_name, 
                    customer_email, customer_phone, customer_address, 
                    customer_city, customer_state, customer_zip,
                    subtotal, shipping, total, payment_method, 
                    payment_reference, payment_status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
                [
                    orderId,
                    orderData.userId || null,
                    orderData.customer.firstName,
                    orderData.customer.lastName,
                    orderData.customer.email,
                    orderData.customer.phone,
                    orderData.customer.address,
                    orderData.customer.city,
                    orderData.customer.state,
                    orderData.customer.zipCode || null,
                    orderData.subtotal,
                    orderData.shipping,
                    orderData.total,
                    orderData.paymentMethod,
                    orderData.paymentReference || null,
                    orderData.paymentMethod === 'Bank Transfer' ? 'pending' : 'completed'
                ]
            );
            
            // Insert order items
            for (const item of orderData.items) {
                await client.query(
                    `INSERT INTO order_items (
                        order_id, product_id, product_name, product_image,
                        quantity, price, subtotal
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        orderId,
                        item.id,
                        item.name,
                        item.image || null,
                        item.quantity,
                        item.price,
                        item.price * item.quantity
                    ]
                );
            }
            
            // Commit transaction
            await client.query('COMMIT');
            
            // Send email notifications (don't wait for these)
            const emailData = {
                ...orderData,
                orderId
            };
            
            sendAdminOrderNotification(emailData).catch(err => 
                console.error('Email notification failed:', err)
            );
            
            sendCustomerOrderConfirmation(emailData).catch(err => 
                console.error('Customer email failed:', err)
            );
            
            res.json({
                success: true,
                orderId: orderId,
                message: 'Order received successfully',
                paymentStatus: orderData.paymentMethod === 'Bank Transfer' ? 'pending' : 'completed'
            });
            
        } catch (error) {
            // Rollback transaction on error
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process order',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const [orders] = await query(
            'SELECT * FROM orders WHERE order_id = ?',
            [orderId]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }
        
        const [items] = await query(
            'SELECT * FROM order_items WHERE order_id = ?',
            [orderId]
        );
        
        res.json({
            success: true,
            order: orders[0],
            items: items
        });
        
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch order'
        });
    }
});

// Get all orders (with pagination)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        
        const [orders] = await query(
            'SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        
        const [countResult] = await query(
            'SELECT COUNT(*) as total FROM orders'
        );
        
        res.json({
            success: true,
            orders: orders,
            pagination: {
                page: page,
                limit: limit,
                total: countResult[0].total,
                totalPages: Math.ceil(countResult[0].total / limit)
            }
        });
        
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders'
        });
    }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['pending', 'verified', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status value'
            });
        }
        
        await query(
            'UPDATE orders SET order_status = ? WHERE order_id = ?',
            [status, orderId]
        );
        
        res.json({
            success: true,
            message: 'Order status updated successfully'
        });
        
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update order status'
        });
    }
});

module.exports = router;



