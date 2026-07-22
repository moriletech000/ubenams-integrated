const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ PostgreSQL Database connected successfully');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Initialize database tables
async function initializeTables() {
    try {
        const client = await pool.connect();
        
        // Create users table first (referenced by orders)
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(150) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                email_verified BOOLEAN DEFAULT FALSE,
                verification_token VARCHAR(255),
                reset_token VARCHAR(255),
                reset_token_expiry TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create index on users
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
        `);
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_verification ON users(verification_token)
        `);
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_reset ON users(reset_token)
        `);
        
        // Create orders table
        await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(50) UNIQUE NOT NULL,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
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
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create indexes on orders
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id)
        `);
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)
        `);
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email)
        `);
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_orders_payment_ref ON orders(payment_reference)
        `);
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)
        `);
        
        // Create order_items table
        await client.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(50) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
                product_id VARCHAR(50) NOT NULL,
                product_name VARCHAR(200) NOT NULL,
                product_image VARCHAR(255),
                quantity INTEGER NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                subtotal DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create indexes on order_items
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)
        `);
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id)
        `);
        
        // Create function to auto-update updated_at timestamp
        await client.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql'
        `);
        
        // Create triggers for auto-updating updated_at
        await client.query(`
            DROP TRIGGER IF EXISTS update_users_updated_at ON users
        `);
        await client.query(`
            CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `);
        
        await client.query(`
            DROP TRIGGER IF EXISTS update_orders_updated_at ON orders
        `);
        await client.query(`
            CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `);
        
        console.log('✅ PostgreSQL Database tables initialized');
        client.release();
    } catch (error) {
        console.error('❌ Failed to initialize tables:', error.message);
        throw error;
    }
}

// Query helper function (matches MySQL2 format)
async function query(text, params) {
    const result = await pool.query(text, params);
    // Return in MySQL2 format [rows, fields]
    return [result.rows, result.fields];
}

module.exports = {
    pool,
    query,
    testConnection,
    initializeTables
};
