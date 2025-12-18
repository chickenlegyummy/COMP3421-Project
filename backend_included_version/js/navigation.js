/**
 * Navigation Helper
 * Updates navigation links based on authentication status
 */

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
    document.addEventListener('DOMContentLoaded', updateAccountLinks);
} else {
    updateAccountLinks();
}

// Also update when auth state changes
window.addEventListener('authStateChanged', updateAccountLinks);
