/**
 * Accessories Page JavaScript
 * Handles filtering, sorting, pagination, and accessory display
 */

// Mock accessories database
const ACCESSORIES_DATABASE = [
    { id: 101, name: 'Electric Guitar Strings Set', category: 'strings', brand: 'daddario', price: 12.99, image: 'https://via.placeholder.com/300x300/667eea/ffffff?text=Strings', badge: 'Popular', featured: true },
    { id: 102, name: 'Acoustic Guitar Strings', category: 'strings', brand: 'ernieball', price: 14.99, image: 'https://via.placeholder.com/300x300/764ba2/ffffff?text=Acoustic+Strings', badge: 'Sale', featured: true },
    { id: 103, name: 'Premium Guitar Picks Pack', category: 'picks', brand: 'dunlop', price: 8.99, image: 'https://via.placeholder.com/300x300/f093fb/ffffff?text=Picks', badge: '', featured: true },
    { id: 104, name: 'Jazz III Guitar Picks', category: 'picks', brand: 'dunlop', price: 6.99, image: 'https://via.placeholder.com/300x300/4facfe/ffffff?text=Jazz+Picks', badge: 'New', featured: false },
    { id: 105, name: 'Hard Shell Guitar Case', category: 'cases', brand: 'fender', price: 149.99, image: 'https://via.placeholder.com/300x300/fa709a/ffffff?text=Case', badge: '', featured: true },
    { id: 106, name: 'Gig Bag Deluxe', category: 'cases', brand: 'mono', price: 89.99, image: 'https://via.placeholder.com/300x300/fee140/ffffff?text=Gig+Bag', badge: 'Popular', featured: false },
    { id: 107, name: 'Professional Guitar Cable 20ft', category: 'cables', brand: 'monster', price: 39.99, image: 'https://via.placeholder.com/300x300/30cfd0/ffffff?text=Cable', badge: 'Sale', featured: false },
    { id: 108, name: 'Instrument Cable 10ft', category: 'cables', brand: 'planetwaves', price: 24.99, image: 'https://via.placeholder.com/300x300/a8edea/ffffff?text=Cable+10ft', badge: '', featured: false },
    { id: 109, name: 'Overdrive Pedal', category: 'pedals', brand: 'boss', price: 129.99, image: 'https://via.placeholder.com/300x300/fed6e3/ffffff?text=Overdrive', badge: 'Popular', featured: true },
    { id: 110, name: 'Delay Pedal', category: 'pedals', brand: 'tcelectronic', price: 149.99, image: 'https://via.placeholder.com/300x300/c1dfc4/ffffff?text=Delay', badge: '', featured: false },
    { id: 111, name: 'Reverb Pedal', category: 'pedals', brand: 'electroharmonix', price: 169.99, image: 'https://via.placeholder.com/300x300/8ec5fc/ffffff?text=Reverb', badge: 'New', featured: false },
    { id: 112, name: 'Chromatic Tuner Pedal', category: 'tuners', brand: 'boss', price: 99.99, image: 'https://via.placeholder.com/300x300/e0aaff/ffffff?text=Tuner', badge: '', featured: false },
    { id: 113, name: 'Clip-On Tuner', category: 'tuners', brand: 'snark', price: 19.99, image: 'https://via.placeholder.com/300x300/b8f2e6/ffffff?text=Clip+Tuner', badge: 'Sale', featured: false },
    { id: 114, name: 'Bass Guitar Strings', category: 'strings', brand: 'ernieball', price: 29.99, image: 'https://via.placeholder.com/300x300/ffc6ff/ffffff?text=Bass+Strings', badge: '', featured: false },
    { id: 115, name: 'Guitar Strap Leather', category: 'cases', brand: 'levy', price: 49.99, image: 'https://via.placeholder.com/300x300/bde0fe/ffffff?text=Strap', badge: 'Popular', featured: false },
    { id: 116, name: 'Pedalboard Case', category: 'cases', brand: 'pedaltrain', price: 199.99, image: 'https://via.placeholder.com/300x300/ffafcc/ffffff?text=Pedalboard', badge: 'New', featured: true },
];

class AccessoriesPage {
    constructor() {
        this.allProducts = [...ACCESSORIES_DATABASE];
        this.filteredProducts = [...this.allProducts];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentSort = 'featured';
        this.currentView = 'grid';
        this.filters = {
            category: [],
            price: [],
            brand: []
        };
        
        this.init();
    }

    init() {
        this.loadUrlParams();
        this.setupEventListeners();
        this.applyFilters();
        this.renderProducts();
        this.renderPagination();
        
        // Initialize navigation
        this.initNavigation();
    }

    initNavigation() {
        const header = document.getElementById('header');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navCenter = document.querySelector('.nav-center');
        const searchToggle = document.getElementById('searchToggle');
        const searchBox = document.getElementById('searchBox');
        
        // Sticky header
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Mobile menu
        if (mobileMenuToggle && navCenter) {
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
                    if (query) window.location.href = `accessories.html?search=${encodeURIComponent(query)}`;
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

    loadUrlParams() {
        const params = new URLSearchParams(window.location.search);
        
        // Handle category filter
        if (params.get('category')) {
            this.filters.category = [params.get('category')];
            this.checkFilterCheckbox('category', params.get('category'));
        }
        
        // Handle sale filter
        if (params.get('sale') === 'true') {
            this.allProducts = this.allProducts.filter(p => p.badge === 'Sale');
            this.filteredProducts = [...this.allProducts];
        }
        
        // Handle featured filter
        if (params.get('featured') === 'true') {
            this.allProducts = this.allProducts.filter(p => p.featured);
            this.filteredProducts = [...this.allProducts];
        }
        
        // Handle search
        if (params.get('search')) {
            const query = params.get('search').toLowerCase();
            this.allProducts = this.allProducts.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.category.toLowerCase().includes(query)
            );
            this.filteredProducts = [...this.allProducts];
        }
    }

    checkFilterCheckbox(type, value) {
        const checkbox = document.querySelector(`input[name="${type}"][value="${value}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    }

    setupEventListeners() {
        // Filter checkboxes
        document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleFilterChange());
        });
        
        // Reset filters button
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }
        
        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortProducts();
                this.renderProducts();
            });
        }
        
        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentView = btn.dataset.view;
                this.updateView();
            });
        });
    }

    handleFilterChange() {
        // Get selected filters
        this.filters.category = this.getSelectedFilters('category');
        this.filters.price = this.getSelectedFilters('price');
        this.filters.brand = this.getSelectedFilters('brand');
        
        this.currentPage = 1;
        this.applyFilters();
        this.renderProducts();
        this.renderPagination();
    }

    getSelectedFilters(type) {
        return Array.from(document.querySelectorAll(`input[name="${type}"]:checked`))
            .map(cb => cb.value);
    }

    applyFilters() {
        this.filteredProducts = this.allProducts.filter(product => {
            // Category filter
            if (this.filters.category.length > 0 && !this.filters.category.includes(product.category)) {
                return false;
            }
            
            // Price filter
            if (this.filters.price.length > 0) {
                const inPriceRange = this.filters.price.some(range => {
                    if (range === '0-50') return product.price < 50;
                    if (range === '50-100') return product.price >= 50 && product.price < 100;
                    if (range === '100-200') return product.price >= 100 && product.price < 200;
                    if (range === '200+') return product.price >= 200;
                    return false;
                });
                if (!inPriceRange) return false;
            }
            
            // Brand filter
            if (this.filters.brand.length > 0 && !this.filters.brand.includes(product.brand)) {
                return false;
            }
            
            return true;
        });
        
        this.sortProducts();
        this.updateProductCount();
    }

    sortProducts() {
        switch (this.currentSort) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'featured':
            default:
                this.filteredProducts.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return 0;
                });
                break;
        }
    }

    resetFilters() {
        // Uncheck all checkboxes
        document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        this.filters = {
            category: [],
            price: [],
            brand: []
        };
        
        this.currentPage = 1;
        this.applyFilters();
        this.renderProducts();
        this.renderPagination();
    }

    updateProductCount() {
        const countEl = document.getElementById('productsCount');
        if (countEl) {
            const start = (this.currentPage - 1) * this.productsPerPage + 1;
            const end = Math.min(this.currentPage * this.productsPerPage, this.filteredProducts.length);
            const total = this.filteredProducts.length;
            
            if (total === 0) {
                countEl.textContent = 'No products found';
            } else {
                countEl.textContent = `Showing ${start}-${end} of ${total} products`;
            }
        }
    }

    updateView() {
        const grid = document.getElementById('productsGrid');
        if (this.currentView === 'list') {
            grid.classList.add('list-view');
        } else {
            grid.classList.remove('list-view');
        }
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        
        // Calculate products for current page
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
        
        // Clear grid
        grid.innerHTML = '';
        
        // Check if no products
        if (productsToShow.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-guitar"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            return;
        }
        
        // Render products
        productsToShow.forEach((product, index) => {
            const card = this.createProductCard(product);
            card.style.animationDelay = `${index * 0.1}s`;
            grid.appendChild(card);
        });
        
        // Update view
        this.updateView();
        this.updateProductCount();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card scroll-reveal revealed';
        card.onclick = () => window.location.href = `accessories-detail.html?id=${product.id}`;
        
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
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCartAccessory(${product.id})">
                        <i class="fas fa-shopping-cart"></i> <span data-lang-en="Add to Cart" data-lang-zh="加入購物車">Add to Cart</span>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    renderPagination() {
        const paginationEl = document.getElementById('pagination');
        if (!paginationEl) return;
        
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (totalPages <= 1) {
            paginationEl.innerHTML = '';
            return;
        }
        
        let html = '';
        
        // Previous button
        html += `
            <button onclick="accessoriesPage.goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `
                    <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                            onclick="accessoriesPage.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += '<span class="page-dots">...</span>';
            }
        }
        
        // Next button
        html += `
            <button onclick="accessoriesPage.goToPage(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        paginationEl.innerHTML = html;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderProducts();
        this.renderPagination();
    }
}

// Add accessory to cart
window.addToCartAccessory = function(productId) {
    const product = ACCESSORIES_DATABASE.find(p => p.id === productId);
    if (product && typeof cartManager !== 'undefined') {
        cartManager.addItem(product);
    }
};

// Initialize accessories page
let accessoriesPage;
document.addEventListener('DOMContentLoaded', () => {
    accessoriesPage = new AccessoriesPage();
});
