# 🎸 GuitarHub - Premium Guitar E-Commerce Platform

A full-stack e-commerce website for guitar sales featuring Node.js Express backend, SQLite database, JWT authentication, and a modern responsive frontend with bilingual support and theme switching.

## 🎯 Project Overview

This project is a comprehensive e-commerce platform for selling guitars and accessories. It includes both a frontend-only version and a **full-stack backend-included version** (recommended) with complete user authentication, database integration, and RESTful API.

---

## 📂 Repository Structure

```
COMP3421-Project/
│
├── 📁 Root Directory (Frontend-Only Version)
│   ├── index.html            # Homepage
│   ├── js/                   # Client-side JavaScript
│   ├── css/                  # Stylesheets
│   ├── pages/                # HTML pages
│   └── README.md             # This file
│
└── 📁 backend_included_version/    ⭐ MAIN PROJECT (RECOMMENDED)
    ├── server.js             # Express server
    ├── database.js           # SQLite database
    ├── routes/               # API endpoints
    ├── middleware/           # Authentication middleware
    ├── scripts/              # Database initialization
    ├── js/                   # Frontend with API integration
    ├── css/                  # Stylesheets
    ├── pages/                # HTML pages
    └── Full documentation files
```

## 🚀 Quick Start

### Option 1: Backend-Included Version (Recommended) ⭐

Full-stack application with database and authentication:

```bash
cd backend_included_version
npm install
npm run init-db
npm start
# Visit: http://localhost:3000
```

**See [backend_included_version/README.md](backend_included_version/README.md) for complete setup guide.**

### Option 2: Frontend-Only Version

Simple client-side application (root directory):

```bash
# Open index.html in browser or use a local server
python -m http.server 8000
# Visit: http://localhost:8000
```

---

## ✨ Features Overview

### Frontend Features (Both Versions)
- ✅ **Bilingual Support**: English / Traditional Chinese (Hong Kong)
- ✅ **Dark/Light Theme**: Persistent theme switching
- ✅ **Responsive Design**: Optimized for mobile, tablet, and desktop
- ✅ **Shopping Cart**: Full cart management with persistence
- ✅ **Product Filtering**: By category, price, and brand
- ✅ **Product Sorting**: Multiple sort options
- ✅ **Search Functionality**: Real-time product search
- ✅ **Smooth Animations**: CSS transitions throughout
- ✅ **Accessibility**: ARIA labels and semantic HTML

### Backend Features (Backend Version Only) ⭐
- ✅ **User Authentication**: JWT-based secure login/registration
- ✅ **RESTful API**: 16+ endpoints for all operations
- ✅ **SQLite Database**: Persistent data storage with 7 tables
- ✅ **Password Encryption**: Bcrypt hashing
- ✅ **Shopping Cart Sync**: Database-backed cart
- ✅ **Order Management**: Complete order system
- ✅ **Product Reviews**: User review functionality
- ✅ **Input Validation**: Comprehensive validation
- ✅ **Error Handling**: Robust error management
- ✅ **CORS Support**: Cross-origin resource sharing

---

## 🗄️ Database Contents (Backend Version)

After initialization:
- **16 Products**: Electric, acoustic, bass, and classical guitars
- **16 Accessories**: Strings, picks, cases, cables, pedals, tuners
- **User Management**: Registration and authentication
- **Shopping Carts**: User-specific carts
- **Orders**: Order history and tracking
- **Reviews**: Product and accessory reviews

---

## 🔌 API Endpoints (Backend Version)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/verify` - Verify JWT token

### Products & Accessories
- `GET /api/products` - Get all products (with filtering & pagination)
- `GET /api/products/:id` - Get product details
- `GET /api/accessories` - Get all accessories
- `GET /api/accessories/:id` - Get accessory details

### Shopping Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item
- `DELETE /api/cart` - Clear cart

### Orders (Protected)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

### Reviews
- `GET /api/reviews/:productType/:productId` - Get reviews
- `POST /api/reviews` - Create review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

---

## 📁 Frontend-Only Version Details

This section describes the root directory frontend-only version.

### Project Structure

```
Root Directory (Frontend-Only)/
├── index.html                 # Homepage
├── css/
│   ├── styles.css            # Main stylesheet
│   ├── animations.css        # Animation utilities
│   ├── products.css          # Products page styles
│   ├── cart.css              # Cart page styles
│   ├── auth.css              # Authentication pages
│   ├── product-detail.css    # Product detail styles
│   └── about.css             # About page styles
├── js/
│   ├── theme.js              # Theme switching
│   ├── language.js           # Language switching
│   ├── cart.js               # Shopping cart (localStorage)
│   ├── main.js               # Main application logic
│   ├── products.js           # Products page
│   ├── cart-page.js          # Cart page
│   ├── auth.js               # Mock authentication
│   ├── product-detail.js     # Product detail page
│   ├── accessories.js        # Accessories page
│   └── about.js              # About page
└── pages/
    ├── products.html         # Product listing
    ├── product-detail.html   # Product details
    ├── cart.html             # Shopping cart
    ├── login.html            # Login page
    ├── register.html         # Registration page
    ├── accessories.html      # Accessories page
    └── accessories-detail.html
```

### Running the Frontend-Only Version

**Using Python 3:**
```bash
python -m http.server 8000
# Visit: http://localhost:8000
```

**Using Node.js:**
```bash
npx http-server
# Visit: http://localhost:8080
```

**Using PHP:**
```bash
php -S localhost:8000
# Visit: http://localhost:8000
```

---

## 🛠️ Technologies Used

### Backend (Backend Version)
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **SQLite3** - Database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **express-validator** - Input validation

### Frontend (Both Versions)
- **HTML5** - Semantic structure
- **CSS3** - Styling with CSS variables
- **JavaScript (ES6+)** - Modern JavaScript
- **Fetch API** - HTTP requests (backend version)
- **localStorage** - Client-side persistence
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Montserrat, Noto Sans TC)

---

## 🎨 Design Features (Both Versions)

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

---

## 🎯 Key Frontend Components

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
- Smooth animations

### 4. Shopping Cart
- Add/remove items
- Quantity management
- Price calculation
- Persistence (localStorage or database)
- Notification system

### 5. Filter System
- Category filters
- Price range filters
- Brand filters
- Reset filters button
- Real-time filtering

### 6. Theme Switching
- Light/Dark mode toggle
- Smooth transitions
- localStorage persistence
- Icon updates (sun/moon)

### 7. Language Switching
- English/Chinese toggle
- Instant updates
- localStorage persistence
- Updates all text elements

---

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1200px+ (max-width container)
- **Tablet**: 992px and below (stacked navigation)
- **Mobile**: 768px and below (mobile menu)
- **Small Mobile**: 480px and below (single column)

---

## 🧪 Testing

### Frontend Testing (Both Versions)
1. Navigate through all pages
2. Test theme and language switching
3. Add products to cart
4. Test filters and search
5. Check responsive design

### Backend Testing (Backend Version Only)
1. Register a new account
2. Login with credentials
3. Add items to cart (synced to database)
4. Create an order
5. View order history
6. Leave product reviews

### API Testing Tools
- **Postman** - API testing suite
- **Thunder Client** - VS Code extension
- **cURL** - Command-line testing
- Browser DevTools - Network inspection

---

## 📖 Usage Guide

### For Frontend-Only Version
1. Open the website in your browser
2. Browse products on homepage or products page
3. Use filters and search
4. Add items to cart
5. View cart and adjust quantities
6. Note: Cart data stored in localStorage only

### For Backend Version
1. Register an account or login
2. Browse authenticated/public features
3. Add items to cart (synced to database)
4. Proceed to checkout
5. View order history in account
6. Leave reviews on products

---

## 🔒 Security Features (Backend Version)

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Controlled origins
- **Environment Variables**: Sensitive data protection
- **HTTP-Only Cookies**: Optional cookie storage

---

## 🤝 Contributing

This is a course project. For suggestions or improvements:
1. Review the documentation
2. Test the application thoroughly
3. Report issues with details
4. Suggest enhancements

---

## 📝 License

This project is created for educational purposes as part of a web development course.

---

## 🎓 Course Information

**Course**: Web Development
**Project**: GuitarHub E-Commerce Platform
**Features**:
- Full-stack development
- RESTful API design
- Database integration
- User authentication
- Responsive frontend
- Modern JavaScript (ES6+)

---

## 📧 Support

For issues or questions:
1. Check the documentation in [backend_included_version/](backend_included_version/)
2. Review [API_DOCUMENTATION.md](backend_included_version/API_DOCUMENTATION.md)
3. See [QUICKSTART.md](backend_included_version/QUICKSTART.md) for setup help

---

## ✅ Project Status

**Current Version**: Backend-Included (Recommended)
- ✅ Backend API functional
- ✅ Database integration complete
- ✅ Authentication working
- ✅ Frontend integrated with API
- ✅ Full documentation available
- ✅ Testing completed
- ✅ Ready for deployment

**Frontend-Only Version**: Maintained for reference
- ✅ Functional with localStorage
- ✅ No backend required
- ✅ Good for learning purposes

---

**🎸 GuitarHub** - Premium Guitar E-Commerce Platform

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

---

**🎸 GuitarHub** - Premium Guitar E-Commerce Platform
