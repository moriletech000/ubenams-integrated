const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { pool } = require('../config/database');

// Paystack webhook endpoint
router.post('/paystack', async (req, res) => {
    try {
        // Verify webhook signature
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');
        
        if (hash !== req.headers['x-paystack-signature']) {
            console.log('⚠️ Invalid Paystack webhook signature');
            return res.status(401).json({
                success: false,
                error: 'Invalid signature'
            });
        }
        
        const event = req.body;
        console.log('📨 Paystack webhook received:', event.event);
        
        // Handle different event types
        switch (event.event) {
            case 'charge.success':
                await handleChargeSuccess(event.data);
                break;
                
            case 'transfer.success':
                console.log('💸 Transfer successful:', event.data.reference);
                break;
                
            case 'transfer.failed':
                console.log('❌ Transfer failed:', event.data.reference);
                break;
                
            default:
                console.log('ℹ️ Unhandled event type:', event.event);
        }
        
        // Always respond with 200 to acknowledge receipt
        res.sendStatus(200);
        
    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        res.sendStatus(500);
    }
});

// Handle successful payment
async function handleChargeSuccess(data) {
    try {
        const reference = data.reference;
        const amount = data.amount / 100; // Paystack returns amount in kobo
        
        console.log(`✅ Payment successful - Reference: ${reference}, Amount: ₦${amount}`);
        
        // Update order payment status in database
        const [result] = await pool.query(
            `UPDATE orders 
             SET payment_status = 'completed',
                 order_status = 'processing',
                 payment_reference = ?
             WHERE payment_reference = ? OR order_id = ?`,
            [reference, reference, reference]
        );
        
        if (result.affectedRows > 0) {
            console.log(`✅ Order payment status updated for reference: ${reference}`);
        } else {
            console.log(`⚠️ No order found with reference: ${reference}`);
        }
        
        // You can add additional logic here:
        // - Send confirmation email
        // - Trigger inventory update
        // - Notify admin
        // - Start fulfillment process
        
    } catch (error) {
        console.error('❌ Error handling charge success:', error);
    }
}

// Webhook for bank transfer confirmations (if using manual verification)
router.post('/bank-transfer-confirm', async (req, res) => {
    try {
        const { orderId, verified } = req.body;
        
        if (!orderId) {
            return res.status(400).json({
                success: false,
                error: 'Order ID is required'
            });
        }
        
        if (verified) {
            await pool.query(
                `UPDATE orders 
                 SET payment_status = 'completed',
                     order_status = 'processing'
                 WHERE order_id = ?`,
                [orderId]
            );
            
            console.log(`✅ Bank transfer verified for order: ${orderId}`);
            
            res.json({
                success: true,
                message: 'Payment verified successfully'
            });
        } else {
            res.json({
                success: true,
                message: 'Payment verification pending'
            });
        }
        
    } catch (error) {
        console.error('❌ Error verifying bank transfer:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify payment'
        });
    }
});

module.exports = router;
