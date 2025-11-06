/**
 * Accessories Page Manager
 * Handles accessories display, filtering, and sorting
 */

// Accessories database
const ACCESSORIES_DATABASE = [
    {
        id: 101,
        name: 'Electric Guitar Strings Set',
        category: 'strings',
        brand: "D'Addario",
        price: 12.99,
        originalPrice: 15.99,
        image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
        rating: 4.8,
        reviews: 342
    },
    {
        id: 102,
        name: 'Acoustic Guitar Strings',
        category: 'strings',
        brand: 'Ernie Ball',
        price: 14.99,
        originalPrice: 17.99,
        image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
        rating: 4.7,
        reviews: 289
    },
    {
        id: 103,
        name: 'Premium Guitar Picks Pack (12pcs)',
        category: 'picks',
        brand: 'Dunlop',
        price: 8.99,
        originalPrice: 11.99,
        image: 'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=800',
        rating: 4.9,
        reviews: 567
    },
    {
        id: 104,
        name: 'Jazz III Guitar Picks',
        category: 'picks',
        brand: 'Dunlop',
        price: 6.99,
        originalPrice: 8.99,
        image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800',
        rating: 4.8,
        reviews: 423
    },
    {
        id: 105,
        name: 'Hard Shell Guitar Case',
        category: 'cases',
        brand: 'Fender',
        price: 149.99,
        originalPrice: 199.99,
        image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
        rating: 4.9,
        reviews: 156
    },
    {
        id: 106,
        name: 'Gig Bag Deluxe',
        category: 'cases',
        brand: 'Mono',
        price: 89.99,
        originalPrice: 119.99,
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
        rating: 4.7,
        reviews: 234
    },
    {
        id: 107,
        name: 'Professional Guitar Cable 20ft',
        category: 'cables',
        brand: 'Monster',
        price: 39.99,
        originalPrice: 49.99,
        image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
        rating: 4.6,
        reviews: 189
    },
    {
        id: 108,
        name: 'Instrument Cable 10ft',
        category: 'cables',
        brand: 'Planet Waves',
        price: 24.99,
        originalPrice: 29.99,
        image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800',
        rating: 4.5,
        reviews: 267
    },
    {
        id: 109,
        name: 'Overdrive Pedal',
        category: 'pedals',
        brand: 'Boss',
        price: 129.99,
        originalPrice: 159.99,
        image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
        rating: 4.9,
        reviews: 445
    },
    {
        id: 110,
        name: 'Delay Pedal',
        category: 'pedals',
        brand: 'TC Electronic',
        price: 149.99,
        originalPrice: 189.99,
        image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
        rating: 4.8,
        reviews: 312
    },
    {
        id: 111,
        name: 'Reverb Pedal',
        category: 'pedals',
        brand: 'Electro-Harmonix',
        price: 169.99,
        originalPrice: 209.99,
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
        rating: 4.9,
        reviews: 278
    },
    {
        id: 112,
        name: 'Chromatic Tuner Pedal',
        category: 'tuners',
        brand: 'Boss',
        price: 99.99,
        originalPrice: 129.99,
        image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
        rating: 4.8,
        reviews: 523
    },
    {
        id: 113,
        name: 'Clip-On Tuner',
        category: 'tuners',
        brand: 'Snark',
        price: 19.99,
        originalPrice: 24.99,
        image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800',
        rating: 4.6,
        reviews: 892
    },
    {
        id: 114,
        name: 'Bass Guitar Strings',
        category: 'strings',
        brand: 'Ernie Ball',
        price: 29.99,
        originalPrice: 34.99,
        image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
        rating: 4.7,
        reviews: 178
    },
    {
        id: 115,
        name: 'Guitar Strap Leather',
        category: 'cases',
        brand: 'Levy',
        price: 49.99,
        originalPrice: 59.99,
        image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
        rating: 4.8,
        reviews: 445
    },
    {
        id: 116,
        name: 'Pedalboard Case',
        category: 'cases',
        brand: 'Pedaltrain',
        price: 199.99,
        originalPrice: 249.99,
        image: 'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=800',
        rating: 4.9,
        reviews: 201
    }
];

class AccessoriesPage {
    constructor() {
        this.allAccessories = ACCESSORIES_DATABASE;
        this.filteredAccessories = [...this.allAccessories];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentView = 'grid';
        this.filters = {
            categories: ['all'],
            priceRanges: []
        };
        
        this.init();
    }

    init() {
        this.renderAccessories();
        this.renderPagination();
        this.initFilters();
        this.initSort();
        this.initViewToggle();
        this.updateProductCount();
    }

    /**
     * Initialize Filters
     */
    initFilters() {
        // Category filters
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleCategoryFilter());
        });

        // Price filters
        const priceCheckboxes = document.querySelectorAll('input[name="price"]');
        priceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handlePriceFilter());
        });

        // Reset button
        const resetBtn = document.querySelector('.reset-filters');
        resetBtn.addEventListener('click', () => this.resetFilters());
    }

    /**
     * Handle Category Filter
     */
    handleCategoryFilter() {
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
        const allCheckbox = document.querySelector('input[name="category"][value="all"]');
        const otherCheckboxes = Array.from(categoryCheckboxes).filter(cb => cb.value !== 'all');

        // If "All" is checked, uncheck others
        if (allCheckbox.checked) {
            otherCheckboxes.forEach(cb => cb.checked = false);
            this.filters.categories = ['all'];
        } else {
            // If any other is checked, uncheck "All"
            const checkedCategories = otherCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
            
            if (checkedCategories.length > 0) {
                allCheckbox.checked = false;
                this.filters.categories = checkedCategories;
            } else {
                // If none are checked, check "All"
                allCheckbox.checked = true;
                this.filters.categories = ['all'];
            }
        }

        this.applyFilters();
    }

    /**
     * Handle Price Filter
     */
    handlePriceFilter() {
        const priceCheckboxes = document.querySelectorAll('input[name="price"]:checked');
        this.filters.priceRanges = Array.from(priceCheckboxes).map(cb => cb.value);
        this.applyFilters();
    }

    /**
     * Apply Filters
     */
    applyFilters() {
        this.filteredAccessories = this.allAccessories.filter(accessory => {
            // Category filter
            const categoryMatch = this.filters.categories.includes('all') || 
                                 this.filters.categories.includes(accessory.category);

            // Price filter
            let priceMatch = this.filters.priceRanges.length === 0;
            if (!priceMatch) {
                priceMatch = this.filters.priceRanges.some(range => {
                    if (range === '0-50') return accessory.price < 50;
                    if (range === '50-100') return accessory.price >= 50 && accessory.price < 100;
                    if (range === '100-200') return accessory.price >= 100 && accessory.price < 200;
                    if (range === '200+') return accessory.price >= 200;
                    return false;
                });
            }

            return categoryMatch && priceMatch;
        });

        this.currentPage = 1;
        this.renderAccessories();
        this.renderPagination();
        this.updateProductCount();
    }

    /**
     * Reset Filters
     */
    resetFilters() {
        // Reset checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = cb.value === 'all';
        });

        // Reset filters
        this.filters = {
            categories: ['all'],
            priceRanges: []
        };

        this.applyFilters();
    }

    /**
     * Initialize Sort
     */
    initSort() {
        const sortSelect = document.getElementById('sortSelect');
        sortSelect.addEventListener('change', (e) => {
            this.sortAccessories(e.target.value);
        });
    }

    /**
     * Sort Accessories
     */
    sortAccessories(sortBy) {
        switch (sortBy) {
            case 'price-low':
                this.filteredAccessories.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredAccessories.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.filteredAccessories.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Featured (default order)
                this.filteredAccessories = [...this.allAccessories].filter(accessory => {
                    const categoryMatch = this.filters.categories.includes('all') || 
                                         this.filters.categories.includes(accessory.category);
                    let priceMatch = this.filters.priceRanges.length === 0;
                    if (!priceMatch) {
                        priceMatch = this.filters.priceRanges.some(range => {
                            if (range === '0-50') return accessory.price < 50;
                            if (range === '50-100') return accessory.price >= 50 && accessory.price < 100;
                            if (range === '100-200') return accessory.price >= 100 && accessory.price < 200;
                            if (range === '200+') return accessory.price >= 200;
                            return false;
                        });
                    }
                    return categoryMatch && priceMatch;
                });
        }

        this.renderAccessories();
    }

    /**
     * Initialize View Toggle
     */
    initViewToggle() {
        const viewButtons = document.querySelectorAll('.view-btn');
        const productsGrid = document.getElementById('productsGrid');

        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                productsGrid.classList.remove('grid-view', 'list-view');
                productsGrid.classList.add(`${view}-view`);
                
                this.currentView = view;
                this.renderAccessories();
            });
        });
    }

    /**
     * Render Accessories
     */
    renderAccessories() {
        const productsGrid = document.getElementById('productsGrid');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const accessoriesToShow = this.filteredAccessories.slice(startIndex, endIndex);

        productsGrid.innerHTML = accessoriesToShow.map(accessory => {
            const discount = Math.round(((accessory.originalPrice - accessory.price) / accessory.originalPrice) * 100);
            
            return `
                <div class="product-card scroll-reveal">
                    <div class="product-image">
                        <img src="${accessory.image}" alt="${accessory.name}" loading="lazy">
                        <span class="product-badge">-${discount}%</span>
                    </div>
                    <div class="product-content">
                        <span class="product-category">${accessory.brand}</span>
                        <h3 class="product-name">${accessory.name}</h3>
                        <div class="product-rating">
                            <div class="stars">
                                ${this.renderStars(accessory.rating)}
                            </div>
                            <span class="rating-count">(${accessory.reviews})</span>
                        </div>
                        <div class="product-footer">
                            <div class="product-price">
                                <span class="current-price">$${accessory.price}</span>
                                <span class="original-price">$${accessory.originalPrice}</span>
                            </div>
                            <button class="btn-icon add-to-cart" data-id="${accessory.id}" aria-label="Add to cart">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners to add-to-cart buttons
        productsGrid.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const accessoryId = parseInt(btn.dataset.id);
                const accessory = this.allAccessories.find(a => a.id === accessoryId);
                
                if (accessory) {
                    const cartManager = new CartManager();
                    cartManager.addItem(accessory);
                }
            });
        });
    }

    /**
     * Render Stars
     */
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    /**
     * Render Pagination
     */
    renderPagination() {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(this.filteredAccessories.length / this.itemsPerPage);

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <button class="page-btn" data-page="prev" ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += '<span class="page-dots">...</span>';
            }
        }

        paginationHTML += `
            <button class="page-btn" data-page="next" ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        pagination.innerHTML = paginationHTML;

        // Add event listeners
        pagination.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                
                if (page === 'prev' && this.currentPage > 1) {
                    this.currentPage--;
                } else if (page === 'next' && this.currentPage < totalPages) {
                    this.currentPage++;
                } else if (page !== 'prev' && page !== 'next') {
                    this.currentPage = parseInt(page);
                }

                this.renderAccessories();
                this.renderPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    /**
     * Update Product Count
     */
    updateProductCount() {
        const countElement = document.getElementById('productCount');
        countElement.textContent = this.filteredAccessories.length;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AccessoriesPage();
});
