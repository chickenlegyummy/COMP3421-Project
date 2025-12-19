/**
 * Product Detail Page Manager
 * Handles product detail display, image gallery, tabs, and related products
 */

// Mobile menu position calculator
const updateMobileMenuPosition = () => {
    if (window.innerWidth <= 992) {
        const navCenter = document.querySelector('.nav-center');
        const topBanner = document.querySelector('.top-banner');
        const navbar = document.querySelector('.navbar');
        const topOffset = (topBanner?.offsetHeight || 0) + (navbar?.offsetHeight || 0);
        if (navCenter) {
            navCenter.style.top = `${topOffset}px`;
            navCenter.style.height = `calc(100vh - ${topOffset}px)`;
        }
        document.documentElement.style.setProperty('--menu-top-offset', `${topOffset}px`);
    } else {
        const navCenter = document.querySelector('.nav-center');
        if (navCenter) {
            navCenter.style.top = '';
            navCenter.style.height = '';
        }
        document.documentElement.style.removeProperty('--menu-top-offset');
    }
};
window.updateMobileMenuPosition = updateMobileMenuPosition;

// NOTE: Frontend-only version - Product data is hardcoded since there's no backend API
// In the backend version, this data is fetched from the database via API calls
const PRODUCT_DATABASE = [
    {
        id: 1,
        name: 'Les Paul Standard',
        brand: 'Gibson',
        category: 'electric',
        price: 2499,
        originalPrice: 2999,
        badge: 'New',
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
        name: 'Stratocaster Deluxe',
        brand: 'Fender',
        category: 'electric',
        price: 2099,
        originalPrice: 2499,
        badge: 'Sale',
        image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800',
        images: [
            'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'
        ],
        description: 'The Stratocaster Deluxe combines classic Fender tone with modern innovations. Featuring premium pickups and exceptional playability, this guitar is perfect for players seeking versatile tones.',
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
        name: 'Acoustic Dreadnought',
        brand: 'Martin',
        category: 'acoustic',
        price: 1899,
        originalPrice: 2199,
        badge: '',
        image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
        images: [
            'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
            'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800'
        ],
        description: 'Classic dreadnought acoustic guitar with rich, powerful tone. Perfect for strumming and fingerpicking, this instrument delivers exceptional sound quality.',
        rating: 4.7,
        reviews: 156,
        specs: {
            'Body Style': 'Dreadnought',
            'Top Material': 'Sitka Spruce',
            'Back & Sides': 'Rosewood',
            'Neck Material': 'Mahogany',
            'Fretboard': 'Rosewood',
            'Scale Length': '25.4"',
            'Frets': '20',
            'Electronics': 'None'
        }
    },
    {
        id: 4,
        name: 'Jazz Bass Premium',
        brand: 'Fender',
        category: 'bass',
        price: 2299,
        originalPrice: 2699,
        badge: 'Popular',
        image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800',
        images: [
            'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'
        ],
        description: 'Premium Jazz Bass featuring classic tone and modern playability. Dual single-coil pickups deliver the iconic sound that has defined bass playing for decades.',
        rating: 4.8,
        reviews: 189,
        specs: {
            'Body Material': 'Alder',
            'Neck Material': 'Maple',
            'Fretboard': 'Rosewood',
            'Scale Length': '34"',
            'Frets': '20',
            'Pickups': 'Single-Coil x2',
            'Strings': '4',
            'Hardware': 'Chrome'
        }
    },
    {
        id: 5,
        name: 'SG Special',
        brand: 'Gibson',
        category: 'electric',
        price: 1599,
        originalPrice: 1899,
        badge: '',
        image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
        images: [
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'
        ],
        description: 'The SG Special delivers classic Gibson tone in a lightweight, double-cutaway design. Perfect for rock and blues players seeking powerful humbucker tones.',
        rating: 4.7,
        reviews: 134,
        specs: {
            'Body Material': 'Mahogany',
            'Neck Material': 'Mahogany',
            'Fretboard': 'Rosewood',
            'Scale Length': '24.75"',
            'Frets': '22',
            'Pickups': 'Humbucker x2',
            'Hardware': 'Chrome',
            'Weight': 'Light'
        }
    },
    {
        id: 6,
        name: 'Telecaster Classic',
        brand: 'Fender',
        category: 'electric',
        price: 1899,
        originalPrice: 2199,
        badge: 'Sale',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
        images: [
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800'
        ],
        description: 'Classic Telecaster offering legendary twang and versatile tones. From country to rock, this guitar delivers the authentic Fender sound.',
        rating: 4.8,
        reviews: 167,
        specs: {
            'Body Material': 'Ash',
            'Neck Material': 'Maple',
            'Fretboard': 'Maple',
            'Scale Length': '25.5"',
            'Frets': '21',
            'Pickups': 'Single-Coil x2',
            'Hardware': 'Chrome',
            'Bridge': 'Fixed'
        }
    },
    {
        id: 7,
        name: 'Classical Pro',
        brand: 'Martin',
        category: 'classical',
        price: 899,
        originalPrice: 1099,
        badge: '',
        image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800',
        images: [
            'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800',
            'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800'
        ],
        description: 'Professional classical guitar with warm, resonant tone. Features traditional construction with premium tonewoods and nylon strings.',
        rating: 4.6,
        reviews: 98,
        specs: {
            'Body Style': 'Classical',
            'Top Material': 'Cedar',
            'Back & Sides': 'Mahogany',
            'Neck Material': 'Mahogany',
            'Fretboard': 'Rosewood',
            'Scale Length': '25.6"',
            'Frets': '19',
            'Strings': 'Nylon'
        }
    },
    {
        id: 8,
        name: 'RG Series',
        brand: 'Ibanez',
        category: 'electric',
        price: 799,
        originalPrice: 999,
        badge: 'New',
        image: 'https://images.unsplash.com/photo-1558272287-4fbd5d9bfd9d?w=800',
        images: [
            'https://images.unsplash.com/photo-1558272287-4fbd5d9bfd9d?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'
        ],
        description: 'High-performance electric guitar designed for speed and precision. Perfect for metal and rock players seeking aggressive tones and fast playability.',
        rating: 4.7,
        reviews: 223,
        specs: {
            'Body Material': 'Basswood',
            'Neck Material': 'Maple',
            'Fretboard': 'Rosewood',
            'Scale Length': '25.5"',
            'Frets': '24',
            'Pickups': 'Humbucker x2, Single-Coil x1',
            'Hardware': 'Black',
            'Bridge': 'Floyd Rose'
        }
    },
    {
        id: 9,
        name: 'Precision Bass',
        brand: 'Fender',
        category: 'bass',
        price: 1799,
        originalPrice: 2099,
        badge: '',
        image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
        images: [
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'
        ],
        description: 'The legendary Precision Bass delivers powerful, punchy tone. Split-coil pickup provides the classic sound that has defined bass playing.',
        rating: 4.9,
        reviews: 245,
        specs: {
            'Body Material': 'Alder',
            'Neck Material': 'Maple',
            'Fretboard': 'Maple',
            'Scale Length': '34"',
            'Frets': '20',
            'Pickups': 'Split-Coil',
            'Strings': '4',
            'Hardware': 'Chrome'
        }
    },
    {
        id: 10,
        name: 'J-45 Acoustic',
        brand: 'Gibson',
        category: 'acoustic',
        price: 2799,
        originalPrice: 3199,
        badge: 'Popular',
        image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
        images: [
            'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
            'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800'
        ],
        description: 'Iconic Gibson acoustic guitar with warm, balanced tone. The J-45 has been a favorite of songwriters for generations.',
        rating: 4.9,
        reviews: 178,
        specs: {
            'Body Style': 'Round Shoulder',
            'Top Material': 'Sitka Spruce',
            'Back & Sides': 'Mahogany',
            'Neck Material': 'Mahogany',
            'Fretboard': 'Rosewood',
            'Scale Length': '24.75"',
            'Frets': '20',
            'Electronics': 'Optional'
        }
    },
    {
        id: 11,
        name: 'Explorer',
        brand: 'Gibson',
        category: 'electric',
        price: 2199,
        originalPrice: 2599,
        badge: '',
        image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
        images: [
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'
        ],
        description: 'Bold and aggressive Explorer design with powerful humbucker pickups. Perfect for rock and metal players seeking distinctive tone and style.',
        rating: 4.7,
        reviews: 142,
        specs: {
            'Body Material': 'Mahogany',
            'Neck Material': 'Mahogany',
            'Fretboard': 'Rosewood',
            'Scale Length': '24.75"',
            'Frets': '22',
            'Pickups': 'Humbucker x2',
            'Hardware': 'Chrome',
            'Shape': 'Explorer'
        }
    },
    {
        id: 12,
        name: 'SR Bass',
        brand: 'Ibanez',
        category: 'bass',
        price: 699,
        originalPrice: 899,
        badge: 'Sale',
        image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800',
        images: [
            'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'
        ],
        description: 'Versatile SR Bass with slim neck profile and active electronics. Perfect for modern players seeking fast playability and tonal flexibility.',
        rating: 4.6,
        reviews: 198,
        specs: {
            'Body Material': 'Mahogany',
            'Neck Material': 'Maple',
            'Fretboard': 'Rosewood',
            'Scale Length': '34"',
            'Frets': '24',
            'Pickups': 'Active x2',
            'Strings': '4',
            'Electronics': 'Active EQ'
        }
    },
    {
        id: 13,
        name: 'D-28 Acoustic',
        brand: 'Martin',
        category: 'acoustic',
        price: 3199,
        originalPrice: 3599,
        badge: 'New',
        image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
        images: [
            'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
            'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800'
        ],
        description: 'The legendary Martin D-28 has been a favorite of musicians for decades. Rich, powerful tone and stunning craftsmanship define this classic dreadnought.',
        rating: 4.9,
        reviews: 267,
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
    },
    {
        id: 14,
        name: 'Jem Series',
        brand: 'Ibanez',
        category: 'electric',
        price: 1999,
        originalPrice: 2399,
        badge: '',
        image: 'https://images.unsplash.com/photo-1558272287-4fbd5d9bfd9d?w=800',
        images: [
            'https://images.unsplash.com/photo-1558272287-4fbd5d9bfd9d?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'
        ],
        description: 'Signature Jem Series guitar featuring unique styling and premium components. Designed for virtuoso players seeking exceptional tone and playability.',
        rating: 4.8,
        reviews: 156,
        specs: {
            'Body Material': 'Basswood',
            'Neck Material': 'Maple',
            'Fretboard': 'Maple',
            'Scale Length': '25.5"',
            'Frets': '24',
            'Pickups': 'DiMarzio',
            'Hardware': 'Gold',
            'Bridge': 'Edge Tremolo'
        }
    },
    {
        id: 15,
        name: 'Nylon Classical',
        brand: 'Gibson',
        category: 'classical',
        price: 1299,
        originalPrice: 1599,
        badge: '',
        image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800',
        images: [
            'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800',
            'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800'
        ],
        description: 'Premium classical guitar with exceptional tonal clarity. Traditional construction with modern refinements for discerning players.',
        rating: 4.7,
        reviews: 112,
        specs: {
            'Body Style': 'Classical',
            'Top Material': 'Spruce',
            'Back & Sides': 'Rosewood',
            'Neck Material': 'Mahogany',
            'Fretboard': 'Ebony',
            'Scale Length': '25.6"',
            'Frets': '19',
            'Strings': 'Nylon'
        }
    },
    {
        id: 16,
        name: 'American Ultra',
        brand: 'Fender',
        category: 'electric',
        price: 2899,
        originalPrice: 3299,
        badge: 'Popular',
        image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800',
        images: [
            'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800'
        ],
        description: 'The ultimate Fender performance guitar featuring modern appointments and premium craftsmanship. Ultra Noiseless pickups and advanced ergonomics.',
        rating: 4.9,
        reviews: 189,
        specs: {
            'Body Material': 'Alder',
            'Neck Material': 'Maple',
            'Fretboard': 'Maple',
            'Scale Length': '25.5"',
            'Frets': '22',
            'Pickups': 'Ultra Noiseless x3',
            'Hardware': 'Chrome',
            'Bridge': '2-Point Tremolo'
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
        this.initNavigation();
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
