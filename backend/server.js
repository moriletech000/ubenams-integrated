const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
require('dotenv').config();

// Log environment to help debug
console.log('Environment:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

// Use PostgreSQL for production (Render), MySQL for local development
let dbConfig;
try {
    if (process.env.DATABASE_URL) {
        console.log('Loading PostgreSQL configuration...');
        dbConfig = require('./config/database-postgres');
    } else {
        console.log('Loading MySQL configuration...');
        dbConfig = require('./config/database');
    }
} catch (error) {
    console.error('⚠️  Database configuration error:', error.message);
    console.log('⚠️  Server starting without database connection');
    console.log('💡 Make sure to set DATABASE_URL environment variable in Render');
}

const { testConnection, initializeTables } = dbConfig || { 
    testConnection: async () => false, 
    initializeTables: async () => {} 
};
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
