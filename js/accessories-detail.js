/**
 * Accessories Detail Page Manager
 * Handles accessory detail display, image gallery, tabs, and related products
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

// NOTE: Frontend-only version - Accessory data is hardcoded since there's no backend API
// In the backend version, this data is fetched from the database via API calls
const ACCESSORIES_DATABASE_DETAIL = [
    {
        id: 101,
        name: 'Electric Guitar Strings Set',
        brand: "D'Addario",
        category: 'strings',
        price: 12.99,
        originalPrice: 15.99,
        badge: 'Popular',
        image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
        images: [
            'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
            'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
            'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=800',
            'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800'
        ],
        description: 'Premium electric guitar strings designed for professional musicians. These strings offer exceptional tone, durability, and playability. Engineered with precision-wound construction for consistent intonation and long-lasting performance.',
        rating: 4.8,
        reviews: 342,
        specs: {
            'Gauge': '.010-.046',
            'Material': 'Nickel Wound',
            'Coating': 'No',
            'Strings': '6',
            'Tone': 'Bright',
            'Durability': 'High',
            'Package': 'Single Set',
            'Brand': "D'Addario"
        }
    },
    {
        id: 102,
        name: 'Acoustic Guitar Strings',
        brand: 'Ernie Ball',
        category: 'strings',
        price: 14.99,
        originalPrice: 17.99,
        badge: 'Sale',
        image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
        images: [
            'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
            'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
            'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=800',
            'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800'
        ],
        description: 'High-quality acoustic guitar strings that deliver rich, warm tone with excellent projection. Perfect for both strumming and fingerpicking styles. Made with premium bronze alloy for optimal sound quality.',
        rating: 4.7,
        reviews: 289,
        specs: {
            'Gauge': '.012-.054',
            'Material': '80/20 Bronze',
            'Coating': 'No',
            'Strings': '6',
            'Tone': 'Warm',
            'Durability': 'Medium',
            'Package': 'Single Set',
            'Brand': 'Ernie Ball'
        }
    },
    {
        id: 103,
        name: 'Premium Guitar Picks Pack',
        brand: 'Dunlop',
        category: 'picks',
        price: 8.99,
        originalPrice: 11.99,
        badge: '',
        image: 'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=800',
        images: [
            'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=800',
            'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
            'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
            'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800'
        ],
        description: 'Professional grade guitar picks designed for optimal grip and tone. This variety pack includes multiple gauges to suit different playing styles. Made from durable material that provides consistent performance.',
        rating: 4.9,
        reviews: 567,
        specs: {
            'Quantity': '12 picks',
            'Gauges': '0.60mm, 0.73mm, 0.88mm, 1.00mm',
            'Material': 'Tortex',
            'Shape': 'Standard',
            'Grip': 'Textured',
            'Colors': 'Assorted',
            'Package': 'Display Pack',
            'Brand': 'Dunlop'
        }
    },
    {
        id: 104,
        name: 'Jazz III Guitar Picks',
        brand: 'Dunlop',
        category: 'picks',
        price: 6.99,
        originalPrice: 8.99,
        badge: 'New',
        image: 'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=800',
        images: [
            'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=800',
            'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
            'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
            'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800'
        ],
        description: 'Legendary Jazz III picks favored by speed players and technical guitarists. Small, sharp tip provides precision and control for fast playing.',
        rating: 4.9,
        reviews: 423,
        specs: {
            'Quantity': '6 picks',
            'Gauge': '1.38mm',
            'Material': 'Nylon',
            'Shape': 'Jazz III',
            'Grip': 'Standard',
            'Color': 'Black',
            'Package': 'Bag',
            'Brand': 'Dunlop'
        }
    },
    {
        id: 105,
        name: 'Hard Shell Guitar Case',
        brand: 'Fender',
        category: 'cases',
        price: 149.99,
        originalPrice: 199.99,
        badge: '',
        image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
        images: [
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'
        ],
        description: 'Premium hard shell case providing maximum protection for your guitar. Features plush interior lining, secure locking latches, and reinforced construction. Includes storage compartment for accessories.',
        rating: 4.9,
        reviews: 156,
        specs: {
            'Type': 'Hard Shell',
            'Fit': 'Universal Electric',
            'Interior': 'Plush Lined',
            'Latches': '3 Secure Locks',
            'Handle': 'Padded',
            'Storage': 'Accessory Compartment',
            'Weight': '8 lbs',
            'Brand': 'Fender'
        }
    },
    {
        id: 106,
        name: 'Gig Bag Deluxe',
        brand: 'Mono',
        category: 'cases',
        price: 89.99,
        originalPrice: 109.99,
        badge: 'Popular',
        image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
        images: [
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'
        ],
        description: 'Deluxe gig bag with excellent protection and comfort. Multiple pockets for accessories, padded straps, and weather-resistant exterior.',
        rating: 4.7,
        reviews: 234,
        specs: {
            'Type': 'Gig Bag',
            'Fit': 'Universal',
            'Interior': '20mm Padding',
            'Pockets': 'Multiple',
            'Straps': 'Padded Backpack',
            'Exterior': 'Water Resistant',
            'Weight': '3 lbs',
            'Brand': 'Mono'
        }
    },
    {
        id: 107,
        name: 'Professional Guitar Cable 20ft',
        brand: 'Monster',
        category: 'cables',
        price: 39.99,
        originalPrice: 49.99,
        badge: 'Sale',
        image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
        images: [
            'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
            'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
            'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=800',
            'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800'
        ],
        description: 'Professional quality guitar cable with superior shielding and low capacitance. Gold-plated connectors ensure reliable signal transmission.',
        rating: 4.8,
        reviews: 312,
        specs: {
            'Length': '20 feet',
            'Connectors': '1/4" Gold Plated',
            'Shielding': '95% Coverage',
            'Capacitance': 'Low',
            'Jacket': 'Braided',
            'Warranty': 'Lifetime',
            'Color': 'Black',
            'Brand': 'Monster'
        }
    },
    {
        id: 108,
        name: 'Instrument Cable 10ft',
        brand: 'Planet Waves',
        category: 'cables',
        price: 24.99,
        originalPrice: 29.99,
        badge: '',
        image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
        images: [
            'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
            'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
            'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=800',
            'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800'
        ],
        description: 'Reliable instrument cable perfect for studio and stage use. Features molded connectors and high-quality copper conductors.',
        rating: 4.6,
        reviews: 267,
        specs: {
            'Length': '10 feet',
            'Connectors': '1/4" Nickel',
            'Shielding': '90% Coverage',
            'Capacitance': 'Standard',
            'Jacket': 'PVC',
            'Warranty': 'Limited Lifetime',
            'Color': 'Black',
            'Brand': 'Planet Waves'
        }
    },
    {
        id: 109,
        name: 'Overdrive Pedal',
        brand: 'Boss',
        category: 'pedals',
        price: 129.99,
        originalPrice: 159.99,
        badge: 'Popular',
        image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
        images: [
            'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800'
        ],
        description: 'Classic overdrive pedal that delivers warm, tube-like tone. Features versatile controls for shaping your sound from subtle boost to heavy crunch. Industry-standard pedal used by professionals worldwide.',
        rating: 4.9,
        reviews: 445,
        specs: {
            'Type': 'Overdrive',
            'Controls': 'Level, Tone, Drive',
            'Bypass': 'True Bypass',
            'Input': '1/4" Jack',
            'Output': '1/4" Jack',
            'Power': '9V DC',
            'Dimensions': '2.87" x 5" x 2.25"',
            'Brand': 'Boss'
        }
    },
    {
        id: 110,
        name: 'Delay Pedal',
        brand: 'TC Electronic',
        category: 'pedals',
        price: 149.99,
        originalPrice: 179.99,
        badge: '',
        image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
        images: [
            'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800'
        ],
        description: 'Professional delay pedal with crystal-clear repeats and extensive control. Multiple delay modes and tap tempo functionality.',
        rating: 4.8,
        reviews: 356,
        specs: {
            'Type': 'Digital Delay',
            'Controls': 'Time, Feedback, Mix, Type',
            'Bypass': 'True Bypass',
            'Delay Time': 'Up to 7 seconds',
            'Modes': '4 Delay Types',
            'Power': '9V DC',
            'Dimensions': '2.8" x 4.8" x 2.2"',
            'Brand': 'TC Electronic'
        }
    },
    {
        id: 111,
        name: 'Reverb Pedal',
        brand: 'Electro-Harmonix',
        category: 'pedals',
        price: 169.99,
        originalPrice: 199.99,
        badge: 'New',
        image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
        images: [
            'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800'
        ],
        description: 'Versatile reverb pedal with multiple hall, room, and plate algorithms. Create lush ambient soundscapes or subtle space.',
        rating: 4.7,
        reviews: 298,
        specs: {
            'Type': 'Digital Reverb',
            'Controls': 'Decay, Mix, Tone, Type',
            'Bypass': 'Buffered',
            'Modes': '9 Reverb Types',
            'Trails': 'Yes',
            'Power': '9V DC',
            'Dimensions': '4.5" x 2.75" x 2.1"',
            'Brand': 'Electro-Harmonix'
        }
    },
    {
        id: 112,
        name: 'Chromatic Tuner Pedal',
        brand: 'Boss',
        category: 'tuners',
        price: 99.99,
        originalPrice: 119.99,
        badge: '',
        image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
        images: [
            'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
            'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
            'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=800',
            'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800'
        ],
        description: 'Professional chromatic tuner pedal with large LED display. Fast, accurate tuning with true bypass for transparent operation.',
        rating: 4.9,
        reviews: 478,
        specs: {
            'Type': 'Chromatic',
            'Display': 'LED',
            'Accuracy': '+/- 1 cent',
            'Bypass': 'True Bypass',
            'Modes': 'Chromatic, Guitar, Bass',
            'Power': '9V DC',
            'Dimensions': '2.87" x 5" x 2.25"',
            'Brand': 'Boss'
        }
    },
    {
        id: 113,
        name: 'Clip-On Tuner',
        brand: 'Snark',
        category: 'tuners',
        price: 19.99,
        originalPrice: 24.99,
        badge: 'Sale',
        image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
        images: [
            'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
            'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
            'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=800',
            'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800'
        ],
        description: 'Compact clip-on tuner with bright display. Perfect for quick tuning adjustments on stage or in the studio.',
        rating: 4.6,
        reviews: 612,
        specs: {
            'Type': 'Clip-On Chromatic',
            'Display': 'Full Color',
            'Accuracy': '+/- 1 cent',
            'Battery': 'CR2032',
            'Modes': 'Guitar, Bass, Violin',
            'Rotation': '360°',
            'Auto Off': 'Yes',
            'Brand': 'Snark'
        }
    },
    {
        id: 114,
        name: 'Bass Guitar Strings',
        brand: 'Ernie Ball',
        category: 'strings',
        price: 29.99,
        originalPrice: 34.99,
        badge: '',
        image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
        images: [
            'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
            'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
            'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=800',
            'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800'
        ],
        description: 'Professional bass guitar strings with punchy tone and excellent sustain. Round-wound construction for bright attack.',
        rating: 4.8,
        reviews: 245,
        specs: {
            'Gauge': '.045-.105',
            'Material': 'Nickel Wound',
            'Coating': 'No',
            'Strings': '4',
            'Tone': 'Bright',
            'Durability': 'High',
            'Package': 'Single Set',
            'Brand': 'Ernie Ball'
        }
    },
    {
        id: 115,
        name: 'Guitar Strap Leather',
        brand: "Levy's",
        category: 'cases',
        price: 49.99,
        originalPrice: 59.99,
        badge: 'Popular',
        image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
        images: [
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'
        ],
        description: 'Premium leather guitar strap with comfortable padding. Adjustable length and durable construction for long-lasting use.',
        rating: 4.9,
        reviews: 389,
        specs: {
            'Material': 'Genuine Leather',
            'Width': '2.5"',
            'Length': 'Adjustable 42"-60"',
            'Padding': 'Yes',
            'Ends': 'Leather Reinforced',
            'Color': 'Brown',
            'Style': 'Classic',
            'Brand': "Levy's"
        }
    },
    {
        id: 116,
        name: 'Pedalboard Case',
        brand: 'Pedaltrain',
        category: 'cases',
        price: 199.99,
        originalPrice: 249.99,
        badge: 'New',
        image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
        images: [
            'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800'
        ],
        description: 'Professional pedalboard with tour-grade case. Includes mounting tape and cable management. Perfect for gigging musicians.',
        rating: 4.9,
        reviews: 234,
        specs: {
            'Size': 'Medium (24" x 12.5")',
            'Case': 'Soft Case Included',
            'Material': 'Aircraft Aluminum',
            'Weight': '6 lbs',
            'Cable Management': 'Yes',
            'Mounting': 'Hook & Loop',
            'Capacity': '8-10 pedals',
            'Brand': 'Pedaltrain'
        }
    }
];

class AccessoriesDetailPage {
    constructor() {
        this.currentProduct = null;
        this.currentImage = 0;
        this.quantity = 1;
        
        this.init();
    }

    init() {
        this.loadProduct();
        this.initImageGallery();
        this.initTabs();
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
                    window.location.href = `accessories.html?search=${searchOverlayInput.value}`;
                }
            });
        }
        
        const searchSuggestions = document.querySelectorAll('.search-suggestion-item');
        searchSuggestions.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.querySelector('span').textContent;
                if (searchOverlayInput) {
                    searchOverlayInput.value = text;
                    window.location.href = `accessories.html?search=${text}`;
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
        const productId = parseInt(urlParams.get('id')) || 101;

        // Find product in database
        this.currentProduct = ACCESSORIES_DATABASE_DETAIL.find(p => p.id === productId) || ACCESSORIES_DATABASE_DETAIL[0];

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
        document.title = `${product.name} - GuitarHub`;
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
        const relatedProducts = ACCESSORIES_DATABASE_DETAIL
            .filter(p => p.category === this.currentProduct.category && p.id !== this.currentProduct.id)
            .slice(0, 4);

        relatedGrid.innerHTML = relatedProducts.map(product => {
            const badge = product.badge || '';
            
            return `
                <div class="product-card scroll-reveal revealed" onclick="window.location.href='accessories-detail.html?id=${product.id}'">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        ${badge ? `<span class="product-badge">${badge}</span>` : ''}
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
    new AccessoriesDetailPage();
});
