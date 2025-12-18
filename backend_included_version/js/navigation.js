/**
 * Navigation Helper
 * Updates navigation links based on authentication status
 */

// Mobile menu position calculator
const updateMobileMenuPosition = () => {
    if (window.innerWidth <= 992) {
        const navCenter = document.querySelector('.nav-center');
        const topBanner = document.querySelector('.top-banner');
        const navbar = document.querySelector('.navbar');
        const topOffset = (topBanner?.offsetHeight || 0) + (navbar?.offsetHeight || 0);
        if (navCenter) {
            navCenter.style.top = `${topOffset}px`;
            navCenter.style.height = `calc(100vh - ${topOffset}px)`;
        }
        // Also set CSS variable for overlay
        document.documentElement.style.setProperty('--menu-top-offset', `${topOffset}px`);
    } else {
        const navCenter = document.querySelector('.nav-center');
        if (navCenter) {
            navCenter.style.top = '';
            navCenter.style.height = '';
        }
        document.documentElement.style.removeProperty('--menu-top-offset');
    }
};

// Make function globally accessible for language changes
window.updateMobileMenuPosition = updateMobileMenuPosition;

// Update user account links based on login status
function updateAccountLinks() {
    if (AuthHelper.isLoggedIn()) {
        // Update all links that go to login.html
        const accountLinks = document.querySelectorAll('a[href*="login.html"]');
        accountLinks.forEach(link => {
            // Change login.html to account.html
            link.href = link.href.replace('login.html', 'account.html');
            
            // Update mobile menu text to show username if it says "Account"
            const span = link.querySelector('span[data-lang-en="Account"]');
            if (span) {
                const user = AuthHelper.getUser();
                if (user) {
                    const username = user.username || user.email.split('@')[0];
                    span.textContent = username;
                    span.setAttribute('data-lang-en', username);
                    span.setAttribute('data-lang-zh', username);
                }
            }
        });
    }
}

// Call this when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateAccountLinks();
        updateMobileMenuPosition();
    });
} else {
    updateAccountLinks();
    updateMobileMenuPosition();
}

// Also update when auth state changes
window.addEventListener('authStateChanged', updateAccountLinks);

// Update on window resize
window.addEventListener('resize', updateMobileMenuPosition);
