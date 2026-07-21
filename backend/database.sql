-- UBENAMS Integrated Database Schema
-- Run this file manually if automatic table creation fails

-- Create database
CREATE DATABASE IF NOT EXISTS ubenams_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ubenams_db;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    customer_first_name VARCHAR(100) NOT NULL,
    customer_last_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city VARCHAR(100) NOT NULL,
    customer_state VARCHAR(100) NOT NULL,
    customer_zip VARCHAR(20),
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_reference VARCHAR(100),
    payment_status VARCHAR(20) DEFAULT 'pending',
    order_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_email (customer_email),
    INDEX idx_payment_reference (payment_reference),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_image VARCHAR(255),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample queries for testing

-- View all orders
-- SELECT * FROM orders ORDER BY created_at DESC;

-- View orders with items
-- SELECT o.order_id, o.customer_first_name, o.customer_last_name, 
--        o.total, o.payment_status, o.order_status,
--        oi.product_name, oi.quantity, oi.price
-- FROM orders o
-- LEFT JOIN order_items oi ON o.order_id = oi.order_id
-- ORDER BY o.created_at DESC;

-- Get order count by status
-- SELECT order_status, COUNT(*) as count 
-- FROM orders 
-- GROUP BY order_status;

-- Get revenue by payment method
-- SELECT payment_method, SUM(total) as total_revenue, COUNT(*) as order_count
-- FROM orders
-- WHERE payment_status = 'completed'
-- GROUP BY payment_method;

-- Get recent orders (last 7 days)
-- SELECT * FROM orders 
-- WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
-- ORDER BY created_at DESC;

-- Find specific order
-- SELECT o.*, oi.* 
-- FROM orders o 
-- LEFT JOIN order_items oi ON o.order_id = oi.order_id 
-- WHERE o.order_id = 'YOUR_ORDER_ID';
