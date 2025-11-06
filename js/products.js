/**
 * Products Page JavaScript
 * Handles filtering, sorting, pagination, and product display
 */

// Mock product database
const PRODUCTS_DATABASE = [
    { id: 1, name: 'Les Paul Standard', category: 'electric', brand: 'gibson', price: 2999, image: 'https://via.placeholder.com/300x300/667eea/ffffff?text=Les+Paul', badge: 'New', featured: true },
    { id: 2, name: 'Stratocaster Deluxe', category: 'electric', brand: 'fender', price: 2499, image: 'https://via.placeholder.com/300x300/764ba2/ffffff?text=Stratocaster', badge: 'Sale', featured: true },
    { id: 3, name: 'Acoustic Dreadnought', category: 'acoustic', brand: 'martin', price: 1899, image: 'https://via.placeholder.com/300x300/f093fb/ffffff?text=Acoustic', badge: '', featured: true },
    { id: 4, name: 'Jazz Bass Premium', category: 'bass', brand: 'fender', price: 2299, image: 'https://via.placeholder.com/300x300/4facfe/ffffff?text=Jazz+Bass', badge: 'Popular', featured: true },
    { id: 5, name: 'SG Special', category: 'electric', brand: 'gibson', price: 1599, image: 'https://via.placeholder.com/300x300/fa709a/ffffff?text=SG+Special', badge: '', featured: false },
    { id: 6, name: 'Telecaster Classic', category: 'electric', brand: 'fender', price: 1899, image: 'https://via.placeholder.com/300x300/fee140/ffffff?text=Telecaster', badge: 'Sale', featured: false },
    { id: 7, name: 'Classical Pro', category: 'classical', brand: 'martin', price: 899, image: 'https://via.placeholder.com/300x300/30cfd0/ffffff?text=Classical', badge: '', featured: false },
    { id: 8, name: 'RG Series', category: 'electric', brand: 'ibanez', price: 799, image: 'https://via.placeholder.com/300x300/a8edea/ffffff?text=RG+Series', badge: 'New', featured: false },
    { id: 9, name: 'Precision Bass', category: 'bass', brand: 'fender', price: 1799, image: 'https://via.placeholder.com/300x300/fed6e3/ffffff?text=P-Bass', badge: '', featured: false },
    { id: 10, name: 'J-45 Acoustic', category: 'acoustic', brand: 'gibson', price: 2799, image: 'https://via.placeholder.com/300x300/c1dfc4/ffffff?text=J-45', badge: 'Popular', featured: false },
    { id: 11, name: 'Explorer', category: 'electric', brand: 'gibson', price: 2199, image: 'https://via.placeholder.com/300x300/8ec5fc/ffffff?text=Explorer', badge: '', featured: false },
    { id: 12, name: 'SR Bass', category: 'bass', brand: 'ibanez', price: 699, image: 'https://via.placeholder.com/300x300/e0aaff/ffffff?text=SR+Bass', badge: 'Sale', featured: false },
    { id: 13, name: 'D-28 Acoustic', category: 'acoustic', brand: 'martin', price: 3199, image: 'https://via.placeholder.com/300x300/b8f2e6/ffffff?text=D-28', badge: 'New', featured: false },
    { id: 14, name: 'Jem Series', category: 'electric', brand: 'ibanez', price: 1999, image: 'https://via.placeholder.com/300x300/ffc6ff/ffffff?text=Jem', badge: '', featured: false },
    { id: 15, name: 'Nylon Classical', category: 'classical', brand: 'gibson', price: 1299, image: 'https://via.placeholder.com/300x300/bde0fe/ffffff?text=Classical', badge: '', featured: false },
    { id: 16, name: 'American Ultra', category: 'electric', brand: 'fender', price: 2899, image: 'https://via.placeholder.com/300x300/ffafcc/ffffff?text=Ultra', badge: 'Popular', featured: true },
];

class ProductsPage {
    constructor() {
        this.allProducts = [...PRODUCTS_DATABASE];
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
        const navMenu = document.getElementById('navMenu');
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
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
            });
        }
        
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
                    if (range === '0-1000') return product.price < 1000;
                    if (range === '1000-2000') return product.price >= 1000 && product.price < 2000;
                    if (range === '2000-3000') return product.price >= 2000 && product.price < 3000;
                    if (range === '3000+') return product.price >= 3000;
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
        card.className = 'product-card scroll-reveal';
        card.onclick = () => window.location.href = `product-detail.html?id=${product.id}`;
        
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
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCartProduct(${product.id})">
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
            <button onclick="productsPage.goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `
                    <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                            onclick="productsPage.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += '<span class="page-dots">...</span>';
            }
        }
        
        // Next button
        html += `
            <button onclick="productsPage.goToPage(${this.currentPage + 1})" 
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

// Add product to cart
window.addToCartProduct = function(productId) {
    const product = PRODUCTS_DATABASE.find(p => p.id === productId);
    if (product && typeof cartManager !== 'undefined') {
        cartManager.addItem(product);
    }
};

// Initialize products page
let productsPage;
document.addEventListener('DOMContentLoaded', () => {
    productsPage = new ProductsPage();
});
