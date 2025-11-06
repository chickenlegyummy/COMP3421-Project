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
    const navMenu = document.getElementById('navMenu');
    
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
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-toggle')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
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
                    menu.classList.toggle('active');
                    link.setAttribute('aria-expanded', 
                        menu.classList.contains('active') ? 'true' : 'false'
                    );
                }
            });
        }
    });
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
