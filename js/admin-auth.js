// Admin Authentication JavaScript

// Admin credentials (in production, these should be stored securely in the backend)
const ADMIN_CREDENTIALS = {
    username: 'oberon',
    password: '#morile#123'
};

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(`${inputId}-icon`);
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show message function
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    if (!messageDiv) return;

    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    // Add icon
    const icon = type === 'success' ? '✓' : '✗';
    messageDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
}

// Hide message function
function hideMessage() {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.style.display = 'none';
    }
}

// Check if admin is logged in
function isAdminLoggedIn() {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) return false;
    
    try {
        const session = JSON.parse(adminSession);
        // Check if session is still valid (24 hours)
        const sessionAge = Date.now() - session.timestamp;
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (sessionAge > twentyFourHours) {
            // Session expired
            localStorage.removeItem('adminSession');
            return false;
        }
        
        return session.authenticated === true;
    } catch (error) {
        return false;
    }
}

// Create admin session
function createAdminSession() {
    const session = {
        authenticated: true,
        timestamp: Date.now(),
        username: ADMIN_CREDENTIALS.username
    };
    localStorage.setItem('adminSession', JSON.stringify(session));
}

// Admin Login Form Handler
if (document.getElementById('admin-login-form')) {
    document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Validate credentials
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Successful login
            createAdminSession();
            showMessage('✓ Login successful! Redirecting to dashboard...', 'success');
            
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1500);
        } else {
            // Failed login
            const form = document.getElementById('admin-login-form');
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
            
            showMessage('✗ Invalid username or password. Please try again.', 'error');
            
            // Clear password field
            document.getElementById('password').value = '';
        }
    });
}

// Logout function
function adminLogout() {
    localStorage.removeItem('adminSession');
    window.location.href = 'admin-login.html';
}
