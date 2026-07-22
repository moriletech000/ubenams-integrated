// Header Authentication Update
// Add this script to all pages to show login/profile icons dynamically

(function() {
    function isLoggedIn() {
        return localStorage.getItem('user') !== null;
    }

    function getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    function updateHeaderAuth() {
        const navIcons = document.querySelector('.nav-icons');
        if (!navIcons) return;

        // Check if auth icon already exists
        if (document.getElementById('auth-icon')) return;

        const user = getCurrentUser();
        const authIcon = document.createElement('a');
        authIcon.id = 'auth-icon';
        authIcon.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; color: #E91E8C; transition: all 0.3s ease; text-decoration: none;';
        
        if (user) {
            // Show profile icon if logged in
            authIcon.href = 'profile.html';
            authIcon.innerHTML = '<i class="fas fa-user-circle" style="font-size: 24px;"></i>';
            authIcon.title = `${user.firstName} ${user.lastName}`;
        } else {
            // Show login icon if not logged in
            authIcon.href = 'login.html';
            authIcon.innerHTML = '<i class="fas fa-sign-in-alt" style="font-size: 20px;"></i>';
            authIcon.title = 'Login / Register';
        }

        authIcon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });

        authIcon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        // Insert before cart icon
        const cartIcon = navIcons.querySelector('.cart-icon');
        if (cartIcon) {
            navIcons.insertBefore(authIcon, cartIcon);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateHeaderAuth);
    } else {
        updateHeaderAuth();
    }
})();
