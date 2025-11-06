/**
 * Product Detail Page Manager
 * Handles product detail display, image gallery, tabs, and related products
 */

// Import product database from products.js
const PRODUCT_DATABASE = [
    {
        id: 1,
        name: 'Les Paul Standard',
        brand: 'Gibson',
        category: 'electric',
        price: 2499,
        originalPrice: 2999,
        image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
        images: [
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'
        ],
        description: 'The iconic Les Paul Standard represents the pinnacle of electric guitar craftsmanship. With its mahogany body, maple top, and exceptional playability, this guitar delivers the legendary tone that has defined rock music for generations.',
        rating: 4.8,
        reviews: 127,
        specs: {
            'Body Material': 'Mahogany',
            'Top Material': 'Maple',
            'Neck Material': 'Mahogany',
            'Fretboard': 'Rosewood',
            'Scale Length': '24.75"',
            'Frets': '22',
            'Pickups': 'Humbucker x2',
            'Hardware': 'Chrome'
        }
    },
    {
        id: 2,
        name: 'Stratocaster American Professional',
        brand: 'Fender',
        category: 'electric',
        price: 1699,
        originalPrice: 1999,
        image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800',
        images: [
            'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'
        ],
        description: 'The American Professional Stratocaster combines classic Fender tone with modern innovations. Featuring V-Mod II single-coil pickups and a Deep "C" maple neck, this guitar is perfect for players seeking versatile tones and exceptional playability.',
        rating: 4.9,
        reviews: 203,
        specs: {
            'Body Material': 'Alder',
            'Top Material': 'Alder',
            'Neck Material': 'Maple',
            'Fretboard': 'Maple',
            'Scale Length': '25.5"',
            'Frets': '22',
            'Pickups': 'Single-Coil x3',
            'Hardware': 'Nickel'
        }
    },
    {
        id: 3,
        name: 'Martin D-28',
        brand: 'Martin',
        category: 'acoustic',
        price: 3199,
        originalPrice: 3499,
        image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
        images: [
            'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800'
        ],
        description: 'The legendary Martin D-28 has been a favorite of musicians for decades. With its rich, powerful tone and stunning craftsmanship, this dreadnought acoustic delivers the authentic sound that has made Martin guitars world-famous.',
        rating: 4.9,
        reviews: 156,
        specs: {
            'Body Style': 'Dreadnought',
            'Top Material': 'Sitka Spruce',
            'Back & Sides': 'East Indian Rosewood',
            'Neck Material': 'Select Hardwood',
            'Fretboard': 'Ebony',
            'Scale Length': '25.4"',
            'Frets': '20',
            'Electronics': 'None'
        }
    }
];

class ProductDetailPage {
    constructor() {
        this.currentProduct = null;
        this.currentImage = 0;
        this.selectedColor = 'Sunburst';
        this.quantity = 1;
        
        this.init();
    }

    init() {
        this.loadProduct();
        this.initImageGallery();
        this.initTabs();
        this.initColorOptions();
        this.initQuantitySelector();
        this.initAddToCart();
        this.initWishlist();
        this.loadRelatedProducts();
    }

    /**
     * Load Product from URL or default
     */
    loadProduct() {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id')) || 1;

        // Find product in database
        this.currentProduct = PRODUCT_DATABASE.find(p => p.id === productId) || PRODUCT_DATABASE[0];

        // Update page content
        this.updateProductInfo();
        this.updateImages();
        this.updateSpecifications();
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
        document.getElementById('originalPrice').textContent = `$${product.originalPrice}`;
        document.getElementById('productDescription').textContent = product.description;

        // Calculate discount percentage
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        document.getElementById('discountBadge').textContent = `-${discount}%`;

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

        // Set main image
        mainImage.src = product.images[0];
        mainImage.alt = product.name;

        // Create thumbnails
        thumbnailGallery.innerHTML = product.images.map((img, index) => `
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

        specsContainer.innerHTML = Object.entries(specs).map(([label, value]) => `
            <div class="spec-item">
                <span class="spec-label">${label}</span>
                <span class="spec-value">${value}</span>
            </div>
        `).join('');
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
    loadRelatedProducts() {
        const relatedGrid = document.getElementById('relatedProductsGrid');
        
        // Filter products in the same category, excluding current
        const relatedProducts = PRODUCT_DATABASE
            .filter(p => p.category === this.currentProduct.category && p.id !== this.currentProduct.id)
            .slice(0, 4);

        relatedGrid.innerHTML = relatedProducts.map(product => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            
            return `
                <div class="product-card scroll-reveal">
                    <a href="./product-detail.html?id=${product.id}" class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        <span class="product-badge">-${discount}%</span>
                    </a>
                    <div class="product-content">
                        <span class="product-category">${product.brand}</span>
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-footer">
                            <div class="product-price">
                                <span class="current-price">$${product.price}</span>
                                <span class="original-price">$${product.originalPrice}</span>
                            </div>
                            <button class="btn-icon add-to-cart" data-id="${product.id}" aria-label="Add to cart">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners to add-to-cart buttons
        relatedGrid.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(btn.dataset.id);
                const product = PRODUCT_DATABASE.find(p => p.id === productId);
                
                if (product) {
                    const cartManager = new CartManager();
                    cartManager.addItem(product);
                }
            });
        });
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
