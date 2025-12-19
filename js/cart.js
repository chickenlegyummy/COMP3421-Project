/**
 * Shopping Cart Manager
 * Handles cart operations with localStorage persistence
 */

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.cartCount = document.getElementById('cartCount');
        this.mobileCartCount = document.getElementById('mobileCartCount');
        this.init();
    }

    init() {
        this.updateCartCount();
        
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                this.cart = this.loadCart();
                this.updateCartCount();
            }
        });
    }

    loadCart() {
        try {
            const cartData = localStorage.getItem('cart');
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.cart));
            this.updateCartCount();
            
            // Dispatch event for cart updates
            window.dispatchEvent(new CustomEvent('cartUpdated', { 
                detail: { cart: this.cart, count: this.getItemCount() } 
            }));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showNotification('Item added to cart!');
        this.animateCartIcon();
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.showNotification('Item removed from cart');
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.showNotification('Cart cleared');
    }

    getCart() {
        return this.cart;
    }

    getItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartCount() {
        const count = this.getItemCount();
        
        if (this.cartCount) {
            this.cartCount.textContent = count;
            this.cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
        
        if (this.mobileCartCount) {
            this.mobileCartCount.textContent = count;
            this.mobileCartCount.style.display = count > 0 ? 'inline' : 'none';
        }
    }

    animateCartIcon() {
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.classList.add('cart-add-animation');
            setTimeout(() => {
                cartBtn.classList.remove('cart-add-animation');
            }, 600);
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Position notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: 'var(--bg-primary)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '2px solid var(--accent-primary)'
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Make cartManager globally accessible
window.cartManager = cartManager;

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}
