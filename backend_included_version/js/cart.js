/**
 * Shopping Cart Manager - Backend Version
 * Handles cart operations with API integration and localStorage fallback
 */

class CartManager {
    constructor() {
        this.cart = [];
        this.cartCount = document.getElementById('cartCount');
        this.mobileCartCount = document.getElementById('mobileCartCount');
        this.init();
    }

    async init() {
        await this.loadCart();
        this.updateCartCount();
        
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                this.loadCart();
            }
        });
    }

    async loadCart() {
        try {
            if (AuthHelper.isLoggedIn()) {
                // Load from API
                const data = await apiRequest(API.CART.GET);
                this.cart = data.cart || [];
            } else {
                // Load from localStorage
                const cartData = localStorage.getItem('cart');
                this.cart = cartData ? JSON.parse(cartData) : [];
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            // Fallback to localStorage
            const cartData = localStorage.getItem('cart');
            this.cart = cartData ? JSON.parse(cartData) : [];
        }
        this.updateCartCount();
        return this.cart;
    }

    saveCart() {
        try {
            // Always save to localStorage for offline access
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

    /**
     * Add item to cart
     * @param {string|object} typeOrProduct - Either 'product'/'accessory' or a product object
     * @param {number} idOrUndefined - Product/accessory ID if first param is string
     * @param {number} quantityOrUndefined - Quantity if first param is string
     */
    async addItem(typeOrProduct, idOrUndefined, quantityOrUndefined = 1) {
        try {
            let itemType, itemId, quantity;
            
            // Support both signatures: addItem(type, id, quantity) and addItem(productObject)
            if (typeof typeOrProduct === 'string') {
                // New API signature: addItem('product', 123, 1)
                itemType = typeOrProduct;
                itemId = idOrUndefined;
                quantity = quantityOrUndefined;
            } else {
                // Old signature: addItem(productObject)
                const product = typeOrProduct;
                itemType = product.id >= 100 ? 'accessory' : 'product';
                itemId = product.id;
                quantity = 1;
            }
            
            if (AuthHelper.isLoggedIn()) {
                // Add to backend cart via API
                const payload = {
                    productType: itemType,
                    quantity: quantity
                };
                
                // Add the correct ID field based on type
                if (itemType === 'product') {
                    payload.productId = itemId;
                } else {
                    payload.accessoryId = itemId;
                }

                await apiRequest(API.CART.ADD, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                // Reload cart to show the new item
                await this.loadCart();
            } else {
                // Add to localStorage for non-logged-in users
                // For this, we need the full product info, so fetch it if we only have ID
                let productInfo;
                if (typeof typeOrProduct === 'string') {
                    // Fetch product info from API
                    const endpoint = itemType === 'product' 
                        ? `${API.PRODUCTS.DETAIL.replace(':id', itemId)}`
                        : `${API.ACCESSORIES.DETAIL.replace(':id', itemId)}`;
                    const response = await apiRequest(endpoint);
                    productInfo = response[itemType];
                } else {
                    productInfo = typeOrProduct;
                }
                
                const existingItem = this.cart.find(item => item.id === productInfo.id);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    this.cart.push({
                        id: productInfo.id,
                        name: productInfo.name,
                        price: productInfo.price,
                        image: productInfo.image,
                        category: productInfo.category,
                        quantity: quantity,
                        type: itemType
                    });
                }
                
                this.saveCart();
                this.updateCartCount();
            }

            this.showNotification('Item added to cart!');
            this.animateCartIcon();
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Failed to add item to cart', 'error');
        }
    }

    async removeItem(productId, cartItemId) {
        try {
            if (AuthHelper.isLoggedIn() && cartItemId) {
                // Remove via API
                await apiRequest(API.CART.REMOVE(cartItemId), {
                    method: 'DELETE'
                });
                await this.loadCart();
            } else {
                // Remove from localStorage
                this.cart = this.cart.filter(item => item.id !== productId);
                this.saveCart();
            }

            this.showNotification('Item removed from cart');
        } catch (error) {
            console.error('Error removing from cart:', error);
            this.showNotification('Failed to remove item', 'error');
        }
    }

    async updateQuantity(productId, quantity, cartItemId) {
        try {
            if (quantity <= 0) {
                return this.removeItem(productId, cartItemId);
            }

            if (AuthHelper.isLoggedIn() && cartItemId) {
                // Update via API
                await apiRequest(API.CART.UPDATE(cartItemId), {
                    method: 'PUT',
                    body: JSON.stringify({ quantity })
                });
                await this.loadCart();
            } else {
                // Update in localStorage
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    item.quantity = quantity;
                    this.saveCart();
                }
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            this.showNotification('Failed to update quantity', 'error');
        }
    }

    async clearCart() {
        try {
            if (AuthHelper.isLoggedIn()) {
                // Clear via API
                await apiRequest(API.CART.CLEAR, {
                    method: 'DELETE'
                });
            }
            
            // Always clear localStorage
            this.cart = [];
            this.saveCart();
            this.showNotification('Cart cleared');
        } catch (error) {
            console.error('Error clearing cart:', error);
            this.showNotification('Failed to clear cart', 'error');
        }
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

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}
