// Authentication Setup Script
// Run this to create the users table and update orders table

const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupAuthTables() {
    console.log('\n🔧 Setting up authentication tables...\n');

    try {
        // Create connection
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'ubenams_db'
        });

        console.log('✅ Connected to database');

        // Create users table
        console.log('📝 Creating users table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(150) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                email_verified BOOLEAN DEFAULT FALSE,
                verification_token VARCHAR(255),
                reset_token VARCHAR(255),
                reset_token_expiry TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_verification_token (verification_token),
                INDEX idx_reset_token (reset_token)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Users table created');

        // Check if user_id column exists in orders table
        console.log('📝 Checking orders table...');
        const [columns] = await connection.query(`
            SHOW COLUMNS FROM orders LIKE 'user_id'
        `);

        if (columns.length === 0) {
            // Add user_id column to orders table
            console.log('📝 Adding user_id column to orders table...');
            await connection.query(`
                ALTER TABLE orders 
                ADD COLUMN user_id INT AFTER order_id,
                ADD INDEX idx_user_id (user_id),
                ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            `);
            console.log('✅ Orders table updated with user_id column');
        } else {
            console.log('✅ Orders table already has user_id column');
        }

        await connection.end();

        console.log('\n' + '='.repeat(50));
        console.log('✅ Authentication setup completed successfully!');
        console.log('='.repeat(50) + '\n');

        console.log('📋 Next steps:');
        console.log('1. Install bcrypt: npm install bcrypt');
        console.log('2. Restart your backend server: npm start');
        console.log('3. Test registration at: http://localhost:5500/register.html');
        console.log('4. Check email for verification link\n');

    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Make sure MySQL is running');
        console.error('2. Check your .env file has correct database credentials');
        console.error('3. Ensure the database "ubenams_db" exists');
        process.exit(1);
    }
}

// Run setup
setupAuthTables();
