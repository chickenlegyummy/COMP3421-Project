/**
 * Main JavaScript - Application Logic
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initHeroSlider();
    initSearch();
    initScrollAnimations();
    loadFeaturedProducts();
    initNewsletterForm();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const header = document.getElementById('header');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navCenter = document.querySelector('.nav-center');
    
    // Sticky header on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
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
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navCenter && navCenter.classList.contains('active')) {
            // Don't close if clicking inside nav-center or on toggle button
            if (!e.target.closest('.nav-center') && !e.target.closest('.mobile-menu-toggle')) {
                navCenter.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
    
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
    
    // Dropdown menu accessibility
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
            }
            // Don't close menu for language toggle
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
            // Don't close menu for theme toggle
        });
    }
    
    if (mobileSearchToggle) {
        mobileSearchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close mobile menu
            if (navCenter) navCenter.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Open full-screen search overlay
            if (searchOverlay) {
                searchOverlay.classList.add('active');
                if (searchOverlayInput) {
                    setTimeout(() => searchOverlayInput.focus(), 100);
                }
            }
        });
    }
    
    // Close search overlay
    if (searchOverlayBack && searchOverlay) {
        searchOverlayBack.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }
    
    // Handle search overlay input
    if (searchOverlayInput) {
        searchOverlayInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchOverlayInput.value.trim();
                if (query) {
                    window.location.href = `pages/products.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
    
    // Handle search suggestions click
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
    
    // Update mobile cart count
    function updateMobileCartCount() {
        const mobileCartCount = document.getElementById('mobileCartCount');
        const desktopCartCount = document.querySelector('.nav-right .cart-count');
        if (mobileCartCount && desktopCartCount) {
            mobileCartCount.textContent = desktopCartCount.textContent;
        }
    }
    
    // Update initially and on cart changes
    updateMobileCartCount();
    if (window.cartManager) {
        const originalAddItem = window.cartManager.addItem;
        window.cartManager.addItem = function(...args) {
            originalAddItem.apply(this, args);
            updateMobileCartCount();
        };
    }
}

/**
 * Hero Slider functionality
 */
function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.hero-slide');
    const indicatorsContainer = document.getElementById('heroIndicators');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    
    let currentSlide = 0;
    let slideInterval;
    
    // Create indicators
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `hero-indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    const indicators = indicatorsContainer.querySelectorAll('.hero-indicator');
    
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }
    
    // Auto play
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(slideInterval);
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });
    
    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    
    // Start auto play
    startAutoPlay();
}

/**
 * Search functionality
 */
function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchBox = document.getElementById('searchBox');
    
    if (searchToggle && searchBox) {
        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            searchBox.classList.toggle('active');
            
            if (searchBox.classList.contains('active')) {
                const input = searchBox.querySelector('input');
                if (input) input.focus();
            }
        });
        
        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchBox.classList.remove('active');
            }
        });
        
        // Handle search submission
        const searchForm = searchBox.querySelector('input');
        if (searchForm) {
            searchForm.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchForm.value.trim();
                    if (query) {
                        window.location.href = `pages/products.html?search=${encodeURIComponent(query)}`;
                    }
                }
            });
        }
    }
}

/**
 * Scroll animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with scroll-reveal classes
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    revealElements.forEach(el => observer.observe(el));
    
    // Add scroll-reveal class to category cards and product cards
    setTimeout(() => {
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach((card, index) => {
            card.classList.add('scroll-reveal');
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }, 100);
}

/**
 * Load featured products
 */
async function loadFeaturedProducts() {
    const productsGrid = document.getElementById('featuredProducts');
    if (!productsGrid) return;
    
    try {
        // Show loading skeleton
        productsGrid.innerHTML = createLoadingSkeleton(4);
        
        // Simulate API call (replace with actual API)
        const products = await fetchFeaturedProducts();
        
        // Clear loading skeleton
        productsGrid.innerHTML = '';
        
        // Render products
        products.forEach((product, index) => {
            const productCard = createProductCard(product);
            productCard.classList.add('scroll-reveal');
            productCard.style.transitionDelay = `${index * 0.1}s`;
            productsGrid.appendChild(productCard);
        });
        
        // Initialize scroll animations for products
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.product-card').forEach(card => {
            observer.observe(card);
        });
        
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

/**
 * Fetch featured products (mock data)
 */
async function fetchFeaturedProducts() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with actual API call
    return [
        {
            id: 1,
            name: 'Les Paul Standard',
            category: 'Electric Guitar',
            price: 2999,
            image: 'https://via.placeholder.com/300x300/667eea/ffffff?text=Les+Paul',
            badge: 'New',
            featured: true
        },
        {
            id: 2,
            name: 'Stratocaster Deluxe',
            category: 'Electric Guitar',
            price: 2499,
            image: 'https://via.placeholder.com/300x300/764ba2/ffffff?text=Stratocaster',
            badge: 'Sale',
            featured: true
        },
        {
            id: 3,
            name: 'Acoustic Dreadnought',
            category: 'Acoustic Guitar',
            price: 1899,
            image: 'https://via.placeholder.com/300x300/f093fb/ffffff?text=Acoustic',
            badge: '',
            featured: true
        },
        {
            id: 4,
            name: 'Jazz Bass Premium',
            category: 'Bass Guitar',
            price: 2299,
            image: 'https://via.placeholder.com/300x300/4facfe/ffffff?text=Jazz+Bass',
            badge: 'Popular',
            featured: true
        }
    ];
}

/**
 * Create product card element
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => window.location.href = `pages/product-detail.html?id=${product.id}`;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
            <p class="product-category">${product.category}</p>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">$${product.price.toLocaleString()}</p>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Create loading skeleton
 */
function createLoadingSkeleton(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="product-card">
                <div class="skeleton skeleton-image"></div>
                <div class="product-info">
                    <div class="skeleton skeleton-text" style="width: 60%;"></div>
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text" style="width: 40%;"></div>
                </div>
            </div>
        `;
    }
    return html;
}

/**
 * Add product to cart
 */
window.addToCart = async function(productId) {
    try {
        // Fetch product details
        const products = await fetchFeaturedProducts();
        const product = products.find(p => p.id === productId);
        
        if (product && typeof cartManager !== 'undefined') {
            cartManager.addItem(product);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
};

/**
 * Newsletter form
 */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const input = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');
            const email = input.value.trim();
            
            if (!email) return;
            
            // Disable form
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Success
                showNotification('Thank you for subscribing!', 'success');
                input.value = '';
            } catch (error) {
                showNotification('Something went wrong. Please try again.', 'error');
            } finally {
                button.disabled = false;
                button.textContent = 'Subscribe';
            }
        });
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
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

/**
 * Utility function: Debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility function: Get URL parameters
 */
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

// Add slide animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
