/**
 * Backend Setup Script
 * Run this after installing dependencies to initialize the database
 */

require('dotenv').config();

const { testConnection, initializeTables } = require('./config/database');
const { verifyEmailConfig } = require('./config/email');

async function setup() {
    console.log('\n🚀 UBENAMS Backend Setup\n');
    console.log('='.repeat(50));
    
    // Check environment variables
    console.log('\n📋 Checking configuration...\n');
    
    const requiredEnvVars = [
        'DB_HOST',
        'DB_USER',
        'DB_PASSWORD',
        'DB_NAME',
        'EMAIL_USER',
        'EMAIL_PASSWORD',
        'ADMIN_EMAIL'
    ];
    
    const missingVars = [];
    
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missingVars.push(varName);
            console.log(`❌ ${varName}: Not configured`);
        } else {
            // Mask sensitive values
            const value = varName.includes('PASSWORD') || varName.includes('KEY') 
                ? '*'.repeat(8) 
                : process.env[varName];
            console.log(`✅ ${varName}: ${value}`);
        }
    });
    
    if (missingVars.length > 0) {
        console.log('\n⚠️  Warning: Some environment variables are missing.');
        console.log('Please update your .env file with the missing values.\n');
    }
    
    // Test database connection
    console.log('\n📊 Testing database connection...\n');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
        console.log('\n❌ Database connection failed!');
        console.log('\nPlease check:');
        console.log('1. MySQL server is running');
        console.log('2. Database credentials in .env are correct');
        console.log('3. Database exists (or will be created on first connection)');
        console.log('\nTo create database manually, run:');
        console.log('CREATE DATABASE ubenams_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n');
        process.exit(1);
    }
    
    // Initialize tables
    console.log('\n📦 Initializing database tables...\n');
    await initializeTables();
    
    // Test email configuration
    console.log('\n📧 Testing email configuration...\n');
    const emailConfigured = await verifyEmailConfig();
    
    if (!emailConfigured) {
        console.log('\n⚠️  Email configuration failed!');
        console.log('\nPlease check:');
        console.log('1. Gmail credentials are correct');
        console.log('2. Using App Password (not regular Gmail password)');
        console.log('3. 2-Factor Authentication is enabled');
        console.log('\nHow to generate App Password:');
        console.log('1. Go to https://myaccount.google.com/security');
        console.log('2. Enable 2-Step Verification');
        console.log('3. Go to App Passwords');
        console.log('4. Generate password for "Mail"');
        console.log('5. Use that password in .env file\n');
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('\n✨ Setup Complete!\n');
    
    if (dbConnected && emailConfigured) {
        console.log('✅ All systems operational');
        console.log('\nYou can now start the server with:');
        console.log('  npm start          (production)');
        console.log('  npm run dev        (development with auto-reload)\n');
    } else {
        console.log('⚠️  Some issues detected - please review the messages above\n');
    }
    
    console.log('='.repeat(50) + '\n');
    
    process.exit(0);
}

// Run setup
setup().catch(error => {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
});
