const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
require('dotenv').config();

// Log environment to help debug
console.log('='.repeat(50));
console.log('🔍 Environment Check:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL value:', process.env.DATABASE_URL ? 'SET (hidden for security)' : 'NOT SET');
console.log('='.repeat(50));

// Use PostgreSQL for production (Render), MySQL for local development
let dbConfig = null;
let testConnection = async () => false;
let initializeTables = async () => {};

try {
    if (process.env.DATABASE_URL) {
        console.log('✅ DATABASE_URL found - Loading PostgreSQL configuration...');
        dbConfig = require('./config/database-postgres');
        testConnection = dbConfig.testConnection;
        initializeTables = dbConfig.initializeTables;
    } else {
        console.log('ℹ️  No DATABASE_URL - Loading MySQL configuration for local development...');
        dbConfig = require('./config/database');
        testConnection = dbConfig.testConnection || (async () => false);
        initializeTables = dbConfig.initializeTables || (async () => {});
    }
} catch (error) {
    console.error('❌ Database configuration error:', error.message);
    console.error('Stack:', error.stack);
    console.log('⚠️  Server will start without database connection');
    console.log('💡 To fix this:');
    if (process.env.DATABASE_URL) {
        console.log('   - Make sure pg (PostgreSQL) package is installed');
        console.log('   - Verify DATABASE_URL format: postgresql://user:pass@host:port/db');
    } else {
        console.log('   - Make sure mysql2 package is installed for local development');
        console.log('   - Or set DATABASE_URL environment variable for PostgreSQL');
    }
}

const { verifyEmailConfig } = require('./config/email');
const orderRoutes = require('./routes/orders');
const webhookRoutes = require('./routes/webhooks');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://ubenams-integrated.vercel.app', 'https://*.vercel.app']
        : '*', // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'UBENAMS Integrated Backend API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/health',
            orders: '/api/orders',
            webhooks: '/api/webhooks',
            auth: '/api/auth'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Initialize and start server
async function startServer() {
    console.log('\n🚀 Starting UBENAMS Backend Server...\n');
    
    // Test database connection
    const dbConnected = await testConnection();
    if (dbConnected) {
        await initializeTables();
    } else {
        console.log('⚠️  Server starting without database connection');
    }
    
    // Test email configuration (non-blocking)
    verifyEmailConfig();
    
    // Start listening on 0.0.0.0 for Render deployment
    const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    app.listen(PORT, HOST, () => {
        console.log('\n' + '='.repeat(50));
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`🌐 API URL: http://${HOST}:${PORT}/api`);
        console.log(`💚 Health Check: http://${HOST}:${PORT}/health`);
        console.log('='.repeat(50) + '\n');
    });
}

startServer().catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});

module.exports = app;
