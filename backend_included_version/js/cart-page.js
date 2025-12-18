/**
 * Cart Page JavaScript
 * Handles cart display, quantity management, and checkout
 */

class CartPage {
    constructor() {
        this.cart = [];
        this.init();
    }

    async init() {
        // Wait for cart to load from API
        this.cart = await cartManager.loadCart();
        
        this.renderCart();
        this.renderRecommendedProducts();
        this.setupEventListeners();
        this.initNavigation();
        
        // Listen for cart updates
        window.addEventListener('cartUpdated', () => {
            this.cart = cartManager.getCart();
            this.renderCart();
        });
    }

    initNavigation() {
        const header = document.getElementById('header');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navCenter = document.querySelector('.nav-center');
        const searchToggle = document.getElementById('searchToggle');
        const searchBox = document.getElementById('searchBox');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        if (mobileMenuToggle && navCenter) {
            // Calculate and set dynamic top position for mobile menu
            const updateMenuPosition = () => {
                if (window.innerWidth <= 992) {
                    const topBanner = document.querySelector('.top-banner');
                    const navbar = document.querySelector('.navbar');
                    const topOffset = (topBanner?.offsetHeight || 0) + (navbar?.offsetHeight || 0);
                    navCenter.style.top = `${topOffset}px`;
                    navCenter.style.height = `calc(100vh - ${topOffset}px)`;
                    // Also set CSS variable for overlay
                    document.documentElement.style.setProperty('--menu-top-offset', `${topOffset}px`);
                } else {
                    navCenter.style.top = '';
                    navCenter.style.height = '';
                    document.documentElement.style.removeProperty('--menu-top-offset');
                }
            };
            
            // Set initial position
            updateMenuPosition();
            
            // Update on window resize
            window.addEventListener('resize', updateMenuPosition);
            
            mobileMenuToggle.addEventListener('click', () => {
                navCenter.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        }
        
        // Close menu when clicking navigation links (but NOT utility buttons or dropdown toggles)
        const navLinks = document.querySelectorAll('.nav-link:not(#mobileLanguageToggle):not(#mobileThemeToggle):not(#mobileSearchToggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close menu if it's a dropdown toggle button
                if (link.closest('.dropdown')) {
                    return; // Let the dropdown handler deal with it
                }
                
                // Only close menu for actual navigation links (a tags), not buttons
                if (link.tagName === 'A' && window.innerWidth <= 992) {
                    setTimeout(() => {
                        if (navCenter) navCenter.classList.remove('active');
                        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }, 100);
                }
            });
        });
        
        // Dropdown menu functionality
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (link && menu) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 992) {
                        e.preventDefault();
                        e.stopPropagation();
                        menu.classList.toggle('active');
                        link.setAttribute('aria-expanded', 
                            menu.classList.contains('active') ? 'true' : 'false'
                        );
                        // Don't close the mobile menu - behave like language/theme toggle
                    }
                });
                
                // Close menu when clicking dropdown items
                const dropdownItems = menu.querySelectorAll('.dropdown-item');
                dropdownItems.forEach(item => {
                    item.addEventListener('click', (e) => {
                        if (window.innerWidth <= 992) {
                            setTimeout(() => {
                                if (navCenter) navCenter.classList.remove('active');
                                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                                document.body.classList.remove('menu-open');
                            }, 100);
                        }
                    });
                });
            }
        });
        
        // Mobile utility buttons
        const mobileLanguageToggle = document.getElementById('mobileLanguageToggle');
        const mobileThemeToggle = document.getElementById('mobileThemeToggle');
        const mobileSearchToggle = document.getElementById('mobileSearchToggle');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchOverlayBack = document.getElementById('searchOverlayBack');
        const searchOverlayInput = document.getElementById('searchOverlayInput');
        
        if (mobileLanguageToggle) {
            mobileLanguageToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                // Toggle language directly without triggering desktop button
                if (typeof languageManager !== 'undefined') {
                    languageManager.toggleLanguage();
                    // Update mobile button text
                    const span = mobileLanguageToggle.querySelector('span');
                    if (span) {
                        const lang = languageManager.getCurrentLanguage();
                        span.setAttribute('data-lang-en', lang === 'en' ? 'Language: EN' : 'Language: 中文');
                        span.setAttribute('data-lang-zh', lang === 'en' ? '語言: EN' : '語言: 中文');
                        span.textContent = lang === 'en' ? 'Language: EN' : 'Language: 中文';
                    }
                    // Recalculate menu position after language change
                    if (typeof window.updateMobileMenuPosition === 'function') {
                        setTimeout(() => {
                            window.updateMobileMenuPosition();
                        }, 10); // Minimal delay for DOM update
                    }
                }
            });
        }
        
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                // Toggle theme directly without triggering desktop button
                if (typeof themeManager !== 'undefined') {
                    themeManager.toggleTheme();
                    // Update mobile button icon and text
                    const icon = mobileThemeToggle.querySelector('i');
                    const span = mobileThemeToggle.querySelector('span');
                    const theme = themeManager.getCurrentTheme();
                    if (icon) {
                        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
                    }
                    if (span) {
                        const text = theme === 'light' ? 'Dark Mode' : 'Light Mode';
                        const textZh = theme === 'light' ? '深色模式' : '淺色模式';
                        span.setAttribute('data-lang-en', text);
                        span.setAttribute('data-lang-zh', textZh);
                        span.textContent = languageManager.getCurrentLanguage() === 'en' ? text : textZh;
                    }
                }
            });
        }
        
        if (mobileSearchToggle) {
            mobileSearchToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (navCenter) navCenter.classList.remove('active');
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                if (searchOverlay) {
                    searchOverlay.classList.add('active');
                    if (searchOverlayInput) setTimeout(() => searchOverlayInput.focus(), 100);
                }
            });
        }
        
        if (searchOverlayBack && searchOverlay) {
            searchOverlayBack.addEventListener('click', () => searchOverlay.classList.remove('active'));
        }
        
        if (searchOverlayInput) {
            searchOverlayInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchOverlayInput.value.trim();
                    if (query) window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            });
        }
        
        const searchSuggestions = document.querySelectorAll('.search-suggestion-item');
        searchSuggestions.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.querySelector('span').textContent;
                if (searchOverlayInput) {
                    searchOverlayInput.value = text;
                    searchOverlayInput.focus();
                }
            });
        });
        
        if (searchToggle && searchBox) {
            searchToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                searchBox.classList.toggle('active');
            });
            
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-container')) {
                    searchBox.classList.remove('active');
                }
            });
        }
    }

    setupEventListeners() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.handleCheckout());
        }
        
        const applyPromoBtn = document.getElementById('applyPromoBtn');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => this.applyPromoCode());
        }
    }

    renderCart() {
        const container = document.getElementById('cartItemsContainer');
        if (!container) return;
        
        if (this.cart.length === 0) {
            container.innerHTML = this.renderEmptyCart();
            this.updateSummary();
            return;
        }
        
        container.innerHTML = '';
        this.cart.forEach(item => {
            const cartItem = this.createCartItem(item);
            container.appendChild(cartItem);
        });
        
        this.updateSummary();
    }

    renderEmptyCart() {
        return `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2 data-lang-en="Your cart is empty" data-lang-zh="您的購物車是空的">Your cart is empty</h2>
                <p data-lang-en="Start adding some guitars to your cart!" data-lang-zh="開始將結他加入購物車吧！">Start adding some guitars to your cart!</p>
                <a href="../index.html" class="btn btn-primary">
                    <span data-lang-en="Shop Now" data-lang-zh="立即選購">Shop Now</span>
                </a>
            </div>
        `;
    }

    createCartItem(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div>
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-category">${item.category}</p>
                </div>
                <p class="cart-item-price">$${item.price.toLocaleString()}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="cartPage.decreaseQuantity(${item.id}, ${item.cartItemId || 'null'})" ${item.quantity <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn" onclick="cartPage.increaseQuantity(${item.id}, ${item.cartItemId || 'null'})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-btn" onclick="cartPage.removeItem(${item.id}, ${item.cartItemId || 'null'})">
                    <i class="fas fa-trash"></i>
                    <span data-lang-en="Remove" data-lang-zh="移除">Remove</span>
                </button>
            </div>
        `;
        
        return cartItem;
    }

    updateSummary() {
        const subtotal = cartManager.getTotal();
        const tax = subtotal * 0.1; // 10% tax
        const shipping = subtotal >= 299 ? 0 : 20;
        const total = subtotal + tax + shipping;
        
        const subtotalEl = document.getElementById('subtotal');
        const taxEl = document.getElementById('tax');
        const shippingEl = document.getElementById('shipping');
        const totalEl = document.getElementById('total');
        
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (shippingEl) {
            if (shipping === 0) {
                shippingEl.textContent = 'FREE';
                shippingEl.setAttribute('data-lang-en', 'FREE');
                shippingEl.setAttribute('data-lang-zh', '免費');
            } else {
                shippingEl.textContent = `$${shipping.toFixed(2)}`;
                shippingEl.removeAttribute('data-lang-en');
                shippingEl.removeAttribute('data-lang-zh');
            }
        }
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
        
        // Update checkout button state
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }
    }

    async increaseQuantity(productId, cartItemId) {
        const item = this.cart.find(i => i.id === productId);
        if (item) {
            await cartManager.updateQuantity(productId, item.quantity + 1, cartItemId);
            this.cart = cartManager.getCart();
            this.renderCart();
        }
    }

    async decreaseQuantity(productId, cartItemId) {
        const item = this.cart.find(i => i.id === productId);
        if (item && item.quantity > 1) {
            await cartManager.updateQuantity(productId, item.quantity - 1, cartItemId);
            this.cart = cartManager.getCart();
            this.renderCart();
        }
    }

    async removeItem(productId, cartItemId) {
        if (confirm('Are you sure you want to remove this item?')) {
            await cartManager.removeItem(productId, cartItemId);
            this.cart = cartManager.getCart();
            this.renderCart();
        }
    }

    applyPromoCode() {
        const promoInput = document.getElementById('promoCode');
        const code = promoInput.value.trim().toUpperCase();
        
        // Mock promo codes
        const validCodes = {
            'GUITAR10': 0.1,
            'SAVE20': 0.2,
            'WELCOME15': 0.15
        };
        
        if (validCodes[code]) {
            const discount = validCodes[code];
            this.showNotification(`Promo code applied! ${(discount * 100)}% off`, 'success');
            promoInput.value = '';
        } else {
            this.showNotification('Invalid promo code', 'error');
        }
    }

    async handleCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }
        
        // Check if user is logged in
        if (!AuthHelper.isLoggedIn()) {
            this.showNotification('Please log in to checkout', 'error');
            setTimeout(() => {
                window.location.href = 'login.html?redirect=cart.html';
            }, 1500);
            return;
        }
        
        try {
            // Show loading state
            const checkoutBtn = document.getElementById('checkoutBtn');
            if (checkoutBtn) {
                checkoutBtn.disabled = true;
                checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            }
            
            this.showNotification('Processing your order...', 'info');
            
            // Create order via API
            const orderData = {
                items: this.cart.map(item => ({
                    item_type: item.type || 'product',
                    item_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                shipping_address: 'Default Address', // Could be from a form
                payment_method: 'Credit Card' // Could be from a form
            };
            
            const response = await apiRequest(API.ORDERS.CREATE, {
                method: 'POST',
                body: JSON.stringify(orderData)
            });
            
            // Clear cart after successful order
            await cartManager.clearCart();
            
            // Show success message
            this.showNotification('Order placed successfully!', 'success');
            
            // Redirect to order confirmation or orders page
            setTimeout(() => {
                window.location.href = `order-confirmation.html?orderId=${response.order.id}`;
                // Fallback if order confirmation page doesn't exist
                // window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            console.error('Checkout error:', error);
            this.showNotification('Failed to process order. Please try again.', 'error');
            
            // Restore button state
            const checkoutBtn = document.getElementById('checkoutBtn');
            if (checkoutBtn) {
                checkoutBtn.disabled = false;
                checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> Proceed to Checkout';
            }
        }
    }

    async renderRecommendedProducts() {
        const container = document.getElementById('recommendedProducts');
        if (!container) return;
        
        try {
            // Get recommended products from API
            const response = await apiRequest(API.PRODUCTS.FEATURED);
            const recommended = response.products.slice(0, 4);
            
            container.innerHTML = '';
            recommended.forEach(product => {
                const card = this.createProductCard(product);
                container.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading recommended products:', error);
            container.innerHTML = '';
        }
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toLocaleString()}</p>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="cartPage.addRecommendedToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    async addRecommendedToCart(productId) {
        try {
            await cartManager.addItem('product', productId, 1);
            this.showNotification('Product added to cart!', 'success');
            // Reload cart display
            await this.loadCart();
        } catch (error) {
            console.error('Error adding product to cart:', error);
            this.showNotification('Failed to add product to cart', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: 'var(--bg-primary)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: '9999',
            border: `2px solid ${type === 'success' ? '#10b981' : '#ef4444'}`,
            animation: 'slideInRight 0.3s ease-out'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize cart page
let cartPage;
document.addEventListener('DOMContentLoaded', () => {
    cartPage = new CartPage();
});
