// Authentication JavaScript
// Auto-detect API URL based on environment
const getApiUrl = () => {
    const hostname = window.location.hostname;
    
    // Production: Use Render backend
    if (hostname.includes('vercel.app') || hostname.includes('ubenams')) {
        return 'https://ubenams-integrated.onrender.com/api';
    }
    
    // Local development: Use localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    
    // Mobile/IP access: Use computer's IP
    return `${window.location.protocol}//${hostname}:3000/api`;
};

const API_URL = getApiUrl();

console.log('API URL:', API_URL); // For debugging

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

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('user') !== null;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Register Form Handler
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage();

        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value
        };

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        // Validate password length
        if (formData.password.length < 8) {
            showMessage('Password must be at least 8 characters long', 'error');
            return;
        }

        try {
            showMessage('Creating your account...', 'success');
            
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                showMessage('✓ Account created successfully! A welcome email has been sent. Redirecting to login...', 'success');
                // Clear form
                document.getElementById('register-form').reset();
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showMessage(data.error || '✗ Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            
            // More detailed error message
            if (error.message === 'Failed to fetch') {
                showMessage('Cannot connect to server. Please check your internet connection and make sure the backend server is running.', 'error');
            } else {
                showMessage('An error occurred. Please try again. Error: ' + error.message, 'error');
            }
        }
    });
}

// Login Form Handler
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage();

        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Store user data
                localStorage.setItem('user', JSON.stringify(data.user));
                
                showMessage('✓ Login successful! Redirecting...', 'success');
                
                // Redirect to profile or intended page
                setTimeout(() => {
                    const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'profile.html';
                    window.location.href = redirectUrl;
                }, 1000);
            } else {
                // Show specific error message
                if (data.errorType === 'INVALID_PASSWORD') {
                    showMessage('✗ Incorrect password. Please try again.', 'error');
                } else if (data.error && data.error.includes('Invalid email')) {
                    showMessage('✗ No account found with this email address.', 'error');
                } else {
                    showMessage(data.error || '✗ Login failed. Please check your credentials.', 'error');
                }
            }
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // More detailed error message
            if (error.message === 'Failed to fetch') {
                showMessage('Cannot connect to server. Please check your internet connection and make sure the backend server is running.', 'error');
            } else {
                showMessage('An error occurred. Please try again. Error: ' + error.message, 'error');
            }
        }
    });
}

// Resend verification email
async function resendVerification(email) {
    try {
        const response = await fetch(`${API_URL}/auth/resend-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        
        if (data.success) {
            showMessage('Verification email sent! Please check your inbox.', 'success');
        } else {
            showMessage(data.error || 'Failed to send verification email.', 'error');
        }
    } catch (error) {
        console.error('Resend verification error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
}

// Forgot Password Form Handler
if (document.getElementById('forgot-password-form')) {
    document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage();

        const email = document.getElementById('email').value;

        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                showMessage('Password reset link sent! Please check your email.', 'success');
                document.getElementById('forgot-password-form').reset();
            } else {
                showMessage(data.error || 'Failed to send reset link.', 'error');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            showMessage('An error occurred. Please try again.', 'error');
        }
    });
}

// Reset Password Form Handler
if (document.getElementById('reset-password-form')) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showMessage('Invalid or missing reset token.', 'error');
    }

    document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage();

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate passwords match
        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        // Validate password length
        if (password.length < 8) {
            showMessage('Password must be at least 8 characters long', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.success) {
                showMessage('Password reset successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showMessage(data.error || 'Password reset failed. The link may have expired.', 'error');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            showMessage('An error occurred. Please try again.', 'error');
        }
    });
}

// Email Verification Handler
if (window.location.pathname.includes('verify-email.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        document.getElementById('loading').style.display = 'none';
        showMessage('Invalid or missing verification token.', 'error');
    } else {
        // Verify email
        fetch(`${API_URL}/auth/verify-email/${token}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('loading').style.display = 'none';
                
                if (data.success) {
                    showMessage('Email verified successfully! You can now login to your account.', 'success');
                    document.getElementById('actions').style.display = 'block';
                } else {
                    showMessage(data.error || 'Email verification failed. The link may have expired.', 'error');
                }
            })
            .catch(error => {
                console.error('Verification error:', error);
                document.getElementById('loading').style.display = 'none';
                showMessage('An error occurred during verification. Please try again.', 'error');
            });
    }
}

// Protect pages that require authentication
function requireAuth() {
    if (!isLoggedIn()) {
        const currentPage = window.location.pathname;
        window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
    }
}

// Update header with user info
function updateHeaderWithUser() {
    const user = getCurrentUser();
    if (user) {
        // Add user icon to header if not already there
        const navIcons = document.querySelector('.nav-icons');
        if (navIcons && !document.getElementById('user-icon')) {
            const userIcon = document.createElement('a');
            userIcon.href = 'profile.html';
            userIcon.className = 'user-icon';
            userIcon.id = 'user-icon';
            userIcon.innerHTML = '<i class="fas fa-user"></i>';
            navIcons.insertBefore(userIcon, navIcons.firstChild);
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderWithUser();
});


// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(`${inputId}-icon`);
    
    if (!input || !icon) return;
    
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
