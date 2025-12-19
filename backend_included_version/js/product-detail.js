/**
 * Product Detail Page Manager
 * Handles product detail display, image gallery, tabs, and related products
 */

// Products are fetched from the API - no hardcoded database needed

class ProductDetailPage {
    constructor() {
        this.currentProduct = null;
        this.currentImage = 0;
        this.selectedColor = 'Sunburst';
        this.quantity = 1;
        
        this.init();
    }

    async init() {
        // Initialize navigation first (doesn't depend on product data)
        this.initNavigation();
        
        // Wait for product to load before initializing components that need it
        await this.loadProduct();
        
        // Now initialize components that depend on product data
        this.initImageGallery();
        this.initTabs();
        this.initColorOptions();
        this.initQuantitySelector();
        this.initAddToCart();
        this.initWishlist();
        this.loadRelatedProducts();
    }

    /**
     * Initialize Navigation
     */
    initNavigation() {
        const header = document.getElementById('header');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navCenter = document.querySelector('.nav-center');
        const searchToggle = document.getElementById('searchToggle');
        const searchBox = document.getElementById('searchBox');
        
        // Sticky header
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
        
        // Mobile menu
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
                if (typeof languageManager !== 'undefined') {
                    languageManager.toggleLanguage();
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
                if (typeof themeManager !== 'undefined') {
                    themeManager.toggleTheme();
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
                        span.textContent = text;
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
                    if (searchOverlayInput) searchOverlayInput.focus();
                }
            });
        }
        
        if (searchOverlayBack && searchOverlay) {
            searchOverlayBack.addEventListener('click', () => searchOverlay.classList.remove('active'));
        }
        
        if (searchOverlayInput) {
            searchOverlayInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    window.location.href = `products.html?search=${searchOverlayInput.value}`;
                }
            });
        }
        
        const searchSuggestions = document.querySelectorAll('.search-suggestion-item');
        searchSuggestions.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.querySelector('span').textContent;
                if (searchOverlayInput) {
                    searchOverlayInput.value = text;
                    window.location.href = `products.html?search=${text}`;
                }
            });
        });
        
        // Search toggle
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

    /**
     * Load Product from URL or default
     */
    async loadProduct() {
        try {
            // Get product ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const productId = parseInt(urlParams.get('id')) || 1;

            // Fetch product from API
            const response = await apiRequest(API.PRODUCTS.DETAIL(productId));
            this.currentProduct = response;

            // Update page content
            this.updateProductInfo();
            this.updateImages();
            this.updateSpecifications();
        } catch (error) {
            console.error('Error loading product:', error);
            this.showNotification('Failed to load product details', 'error');
        }
    }

    /**
     * Update Product Information
     */
    updateProductInfo() {
        const product = this.currentProduct;

        // Update text content
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productBrand').textContent = product.brand;
        document.getElementById('productTitle').textContent = product.name;
        document.getElementById('productPrice').textContent = `$${product.price}`;
        
        // Handle originalPrice - if not in database, hide the discount elements
        const originalPriceEl = document.getElementById('originalPrice');
        const discountBadgeEl = document.getElementById('discountBadge');
        if (product.originalPrice && product.originalPrice > product.price) {
            originalPriceEl.textContent = `$${product.originalPrice}`;
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            discountBadgeEl.textContent = `-${discount}%`;
            originalPriceEl.style.display = '';
            discountBadgeEl.style.display = '';
        } else {
            originalPriceEl.style.display = 'none';
            discountBadgeEl.style.display = 'none';
        }
        
        document.getElementById('productDescription').textContent = product.description;

        // Update page title
        document.title = `${product.name} - Guitar Shop`;
    }

    /**
     * Update Product Images
     */
    updateImages() {
        const product = this.currentProduct;
        const mainImage = document.getElementById('mainImage');
        const thumbnailGallery = document.querySelector('.thumbnail-gallery');

        // Handle both single image (from database) and images array (if exists)
        const images = product.images || [product.image];
        
        // Set main image
        mainImage.src = images[0];
        mainImage.alt = product.name;

        // Create thumbnails
        thumbnailGallery.innerHTML = images.map((img, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${img}" alt="${product.name} ${index + 1}">
            </div>
        `).join('');
    }

    /**
     * Initialize Image Gallery
     */
    initImageGallery() {
        const thumbnailGallery = document.querySelector('.thumbnail-gallery');
        const mainImage = document.getElementById('mainImage');

        thumbnailGallery.addEventListener('click', (e) => {
            const thumbnail = e.target.closest('.thumbnail');
            if (!thumbnail) return;

            const index = parseInt(thumbnail.dataset.index);
            this.currentImage = index;

            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');

            // Update main image with fade animation
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = this.currentProduct.images[index];
                mainImage.style.opacity = '1';
            }, 200);
        });

        // Zoom button
        const zoomBtn = document.querySelector('.zoom-btn');
        zoomBtn.addEventListener('click', () => {
            // Open image in modal (simplified version)
            window.open(this.currentProduct.images[this.currentImage], '_blank');
        });
    }

    /**
     * Update Specifications
     */
    updateSpecifications() {
        const specsContainer = document.getElementById('specsContainer');
        const specs = this.currentProduct.specs;

        // Handle missing specs field
        if (specs && Object.keys(specs).length > 0) {
            specsContainer.innerHTML = Object.entries(specs).map(([label, value]) => `
                <div class="spec-item">
                    <span class="spec-label">${label}</span>
                    <span class="spec-value">${value}</span>
                </div>
            `).join('');
        } else {
            specsContainer.innerHTML = `
                <div class="spec-item" style="text-align: center; color: #666; grid-column: 1/-1;">
                    Specifications not available
                </div>
            `;
        }
    }

    /**
     * Initialize Tabs
     */
    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;

                // Update buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update panes
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === tabId) {
                        pane.classList.add('active');
                    }
                });
            });
        });
    }

    /**
     * Initialize Color Options
     */
    initColorOptions() {
        const colorOptions = document.querySelectorAll('.color-option');

        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.selectedColor = option.dataset.color;
            });
        });
    }

    /**
     * Initialize Quantity Selector
     */
    initQuantitySelector() {
        const decreaseBtn = document.querySelector('.qty-btn.decrease');
        const increaseBtn = document.querySelector('.qty-btn.increase');
        const qtyInput = document.querySelector('.qty-input');

        decreaseBtn.addEventListener('click', () => {
            if (this.quantity > 1) {
                this.quantity--;
                qtyInput.value = this.quantity;
            }
        });

        increaseBtn.addEventListener('click', () => {
            if (this.quantity < 10) {
                this.quantity++;
                qtyInput.value = this.quantity;
            }
        });

        qtyInput.addEventListener('change', (e) => {
            let value = parseInt(e.target.value) || 1;
            value = Math.max(1, Math.min(10, value));
            this.quantity = value;
            qtyInput.value = value;
        });
    }

    /**
     * Initialize Add to Cart
     */
    initAddToCart() {
        const addToCartBtn = document.querySelector('.add-to-cart-btn');

        addToCartBtn.addEventListener('click', () => {
            const cartManager = new CartManager();
            
            const product = {
                ...this.currentProduct,
                selectedColor: this.selectedColor,
                quantity: this.quantity
            };

            for (let i = 0; i < this.quantity; i++) {
                cartManager.addItem(product);
            }

            // Show success message
            this.showNotification('Product added to cart!', 'success');
        });
    }

    /**
     * Initialize Wishlist
     */
    initWishlist() {
        const wishlistBtn = document.querySelector('.wishlist-btn');
        
        // Check if already in wishlist
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const isInWishlist = wishlist.includes(this.currentProduct.id);
        
        if (isInWishlist) {
            wishlistBtn.classList.add('active');
            wishlistBtn.querySelector('i').classList.remove('far');
            wishlistBtn.querySelector('i').classList.add('fas');
        }

        wishlistBtn.addEventListener('click', () => {
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            const index = wishlist.indexOf(this.currentProduct.id);

            if (index > -1) {
                // Remove from wishlist
                wishlist.splice(index, 1);
                wishlistBtn.classList.remove('active');
                wishlistBtn.querySelector('i').classList.remove('fas');
                wishlistBtn.querySelector('i').classList.add('far');
                this.showNotification('Removed from wishlist', 'info');
            } else {
                // Add to wishlist
                wishlist.push(this.currentProduct.id);
                wishlistBtn.classList.add('active');
                wishlistBtn.querySelector('i').classList.remove('far');
                wishlistBtn.querySelector('i').classList.add('fas');
                this.showNotification('Added to wishlist!', 'success');
            }

            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        });
    }

    /**
     * Load Related Products
     */
    async loadRelatedProducts() {
        try {
            const relatedGrid = document.getElementById('relatedProductsGrid');
            
            // Fetch products from the same category
            const response = await apiRequest(`${API.PRODUCTS.LIST}?category=${this.currentProduct.category}&limit=5`);
            
            // Filter out current product and limit to 4
            const relatedProducts = response.products
                .filter(p => p.id !== this.currentProduct.id)
                .slice(0, 4);

        relatedGrid.innerHTML = relatedProducts.map(product => {
            const badge = product.badge || '';
            
            return `
                <div class="product-card scroll-reveal revealed" onclick="window.location.href='product-detail.html?id=${product.id}'">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        ${badge ? `<span class="product-badge">${badge}</span>` : ''}
                    </div>
                    <div class="product-info">
                        <p class="product-category">${product.category}</p>
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">$${product.price.toLocaleString()}</p>
                        <div class="product-actions">
                            <button class="btn btn-primary" onclick="event.stopPropagation(); addToCartProduct(${product.id})">
                                <i class="fas fa-shopping-cart"></i> <span data-lang-en="Add to Cart" data-lang-zh="加入購物車">Add to Cart</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        } catch (error) {
            console.error('Error loading related products:', error);
        }
    }

    /**
     * Show Notification
     */
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetailPage();
});
