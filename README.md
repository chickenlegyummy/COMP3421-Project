# GuitarHub - Premium Guitar Shop Website

A modern, fully-featured guitar shop e-commerce website built with pure HTML5, CSS3, and JavaScript (no frameworks). Features bilingual support (English/中文), dark/light theme switching, shopping cart functionality, and comprehensive product management.

## 🎯 Project Overview

This project follows the COMP3421 assignment requirements, creating a professional e-commerce website for selling guitars and accessories with modern UI/UX design inspired by Gibson's website and implementing theme/language switching features from the Hiei-Blog approach.

## ✨ Features

### Core Functionality
- ✅ **Bilingual Support**: Switch between English and Traditional Chinese (Hong Kong)
- ✅ **Dark/Light Theme**: Toggle between light and dark themes with localStorage persistence
- ✅ **Shopping Cart**: Full cart management with localStorage persistence
- ✅ **Product Filtering**: Filter by category, price range, and brand
- ✅ **Product Sorting**: Sort by featured, price (low-high), price (high-low), and name
- ✅ **Product Search**: Search products by name or category
- ✅ **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ✅ **Smooth Animations**: CSS animations and transitions throughout
- ✅ **Hero Slider**: Auto-playing hero slider with manual controls
- ✅ **Pagination**: Navigate through product pages
- ✅ **Grid/List View**: Toggle between grid and list view for products

### Technical Features
- **Pure Vanilla JavaScript**: No frameworks or dependencies
- **HTML5 Semantic Markup**: Proper semantic HTML structure
- **CSS Custom Properties**: Dynamic theming with CSS variables
- **Modern ES6+ Syntax**: Uses classes, async/await, and modern JavaScript features
- **LocalStorage**: Persistent user preferences and cart data
- **Accessible Design**: ARIA labels and semantic HTML for accessibility
- **Performance Optimized**: Lazy loading images, debounced search

## 📁 Project Structure

```
COMP3421-Project/
├── index.html                 # Homepage
├── css/
│   ├── styles.css            # Main stylesheet with theme variables
│   ├── animations.css        # Animation keyframes and utilities
│   ├── products.css          # Products page specific styles
│   ├── cart.css              # Cart page specific styles
│   ├── auth.css              # Authentication pages styles
│   ├── product-detail.css    # Product detail page styles
│   └── about.css             # About page styles
├── js/
│   ├── theme.js              # Theme switching functionality
│   ├── language.js           # Language switching functionality
│   ├── cart.js               # Shopping cart management
│   ├── main.js               # Main application logic
│   ├── products.js           # Products page functionality
│   ├── cart-page.js          # Cart page functionality
│   ├── auth.js               # Authentication functionality
│   ├── product-detail.js     # Product detail page functionality
│   ├── accessories.js        # Accessories page functionality
│   └── about.js              # About page animations
├── pages/
│   ├── products.html         # Product listing page
│   ├── product-detail.html   # Individual product detail page
│   ├── cart.html             # Shopping cart page
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── accessories.html      # Accessories page
│   └── about.html            # About page
├── assets/
│   └── images/               # Product images and assets
└── data/
    └── products.json         # Product database (optional)
```

## 🚀 Getting Started

### Installation

1. Clone or download the repository
2. Open the project folder
3. Serve the files using a local server (required for best experience)

### Running the Project

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Node.js:**
```bash
npx http-server
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```

### Or Simply Open index.html

For basic functionality, you can directly open `index.html` in your browser. However, using a local server is recommended for full functionality.

## 🎨 Design Features

### Color Scheme

**Light Theme:**
- Background: #ffffff
- Text: #212529
- Accent: #8b5cf6 (Purple)
- Gradients: Multiple gradient combinations

**Dark Theme:**
- Background: #1a1a1a
- Text: #f5f5f5
- Accent: #a78bfa (Light Purple)
- Shadows: Enhanced for dark mode

### Typography
- Primary Font: 'Montserrat' (English)
- Secondary Font: 'Noto Sans TC' (Chinese)
- Responsive font sizes with CSS custom properties

## 🛠️ Key Components

### 1. Navigation Bar
- Sticky header with scroll effects
- Dropdown menus for categories
- Search functionality
- Theme toggle button
- Language toggle button
- Shopping cart with item count
- Responsive mobile menu

### 2. Hero Slider
- Auto-playing slideshow
- Manual navigation controls
- Smooth transitions
- Indicator dots
- Pause on hover

### 3. Product Cards
- Product image with hover effects
- Category and name display
- Price display
- Add to cart button
- Badge system (New, Sale, Popular)
- Smooth animations on scroll

### 4. Shopping Cart
- Add/remove items
- Quantity management
- Price calculation
- localStorage persistence
- Notification system

### 5. Filter System
- Category filters
- Price range filters
- Brand filters
- Reset filters button
- Real-time filtering

### 6. Theme Switching
- Light/Dark mode toggle
- Smooth transitions between themes
- localStorage persistence
- Consistent across all pages
- Icon updates (sun/moon)

### 7. Language Switching
- English/Chinese toggle
- Instant language updates
- localStorage persistence
- Updates all text elements
- Updates placeholders

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (max-width container)
- **Tablet**: 992px and below (stacked navigation)
- **Mobile**: 768px and below (mobile menu)
- **Small Mobile**: 480px and below (single column)

## 🎯 Usage

### Theme Toggle
Click the sun/moon button in the navigation to switch between light and dark themes. Your preference is automatically saved.

### Language Toggle
Click the EN/中 button to switch between English and Traditional Chinese. Your preference is automatically saved.

### Shopping Cart
1. Browse products on homepage or products page
2. Click "Add to Cart" on any product
3. View cart by clicking the cart icon
4. Adjust quantities or remove items
5. Cart data persists across sessions

### Product Filtering
1. Navigate to Products page
2. Use sidebar filters to narrow down products
3. Select multiple filters in each category
4. Click "Reset Filters" to clear all filters

### Product Sorting
Use the dropdown menu to sort products by:
- Featured (default)
- Price: Low to High
- Price: High to Low
- Name (alphabetical)

## 🔧 Customization

### Changing Colors
Edit CSS custom properties in `css/styles.css`:

```css
:root {
    --accent-primary: #8b5cf6;
    --accent-secondary: #7c3aed;
    /* ... other variables */
}
```

### Adding Products
Products are currently defined in `js/products.js` in the `PRODUCTS_DATABASE` array. In a production environment, these would come from a backend API.

### Adding New Languages
1. Add language data attributes to HTML elements
2. Update `js/language.js` to handle new language
3. Add translations for all text elements

### Modifying Animations
All animations are defined in `css/animations.css`. You can:
- Modify existing keyframes
- Add new animation classes
- Adjust animation timing and easing

## 🌐 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+
- **Mobile**: All modern mobile browsers

## 📄 Technologies Used

- **HTML5**: Semantic markup, ARIA labels
- **CSS3**: Custom properties, Grid, Flexbox, Animations
- **JavaScript (ES6+)**: Classes, Modules, Arrow Functions, Async/Await
- **Font Awesome**: Icon library
- **Google Fonts**: Typography

## 🎓 Academic Context

This project is developed for **COMP3421** course assignment, demonstrating:
- Pure JavaScript programming (no frameworks)
- HTML5 best practices
- CSS3 advanced features
- Responsive web design
- Web accessibility
- Modern UI/UX patterns
- Client-side state management

## 📝 Future Enhancements (Backend Integration)

When implementing the backend, consider:
- User authentication and authorization
- Product management API
- Order processing system
- Payment gateway integration
- User profile management
- Order history
- Product reviews and ratings
- Email notifications
- Inventory management

## 🤝 Credits

- **Design Inspiration**: Gibson Guitars (www.gibson.com)
- **Language/Theme Switching Approach**: Hiei-Blog project
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Montserrat, Noto Sans TC)

## 📧 Contact

For questions or support regarding this project, please contact through the university portal.

---

**Note**: This is a frontend-only implementation. Backend functionality (user authentication, payment processing, actual product database) needs to be implemented separately using your preferred backend technology (Node.js, Python, PHP, etc.).

## 🎉 Getting Started Quick Guide

1. **View the Homepage**
   - Open `index.html` in your browser
   - Explore the hero slider and featured products

2. **Browse Products**
   - Click "Guitars" in navigation
   - Use filters and sorting options
   - Toggle between grid and list view

3. **Test Theme & Language**
   - Click the moon/sun icon to switch themes
   - Click EN/中 to switch languages
   - Settings are saved automatically

4. **Add to Cart**
   - Click "Add to Cart" on any product
   - See cart count update in navigation
   - View cart by clicking cart icon

## ✅ Completed Features

- ✅ Homepage with hero slider
- ✅ Product listing page with filters
- ✅ Product detail page with image gallery
- ✅ Shopping cart page with summary
- ✅ Login & Registration pages with validation
- ✅ Accessories page with filtering
- ✅ About page with team section
- ✅ Theme switching (light/dark)
- ✅ Language switching (EN/中)
- ✅ Shopping cart functionality
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Product search
- ✅ Product sorting
- ✅ Pagination
- ✅ Form validation
- ✅ Password strength indicator
- ✅ Wishlist functionality
- ✅ Related products
- ✅ Product reviews section

## 🚧 Backend Integration Required

For a fully functional e-commerce site, implement:
- User authentication API
- Product management API
- Order processing system
- Payment gateway integration
- Database for products and users
- Email notifications
- Inventory management
- Order history tracking

---

Made with ❤️ for COMP3421 Project | © 2025 GuitarHub
