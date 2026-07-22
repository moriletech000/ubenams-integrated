/**
 * Create Database Script
 * Creates the ubenams_db database if it doesn't exist
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
    console.log('\n📦 Creating database...\n');
    
    try {
        // Connect without specifying database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });
        
        // Create database
        await connection.query(
            `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'ubenams_db'} 
             CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );
        
        console.log(`✅ Database '${process.env.DB_NAME || 'ubenams_db'}' created successfully\n`);
        
        await connection.end();
        return true;
    } catch (error) {
        console.error('❌ Failed to create database:', error.message);
        return false;
    }
}

// Run
createDatabase()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
        console.error('Error:', error.message);
        process.exit(1);
    });
