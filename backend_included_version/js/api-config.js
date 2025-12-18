/**
 * API Configuration
 * Centralized API endpoint management and authentication helpers
 */

const API_BASE_URL = window.location.origin + '/api';

// API Endpoints
const API = {
    // Authentication
    AUTH: {
        REGISTER: `${API_BASE_URL}/auth/register`,
        LOGIN: `${API_BASE_URL}/auth/login`,
        ME: `${API_BASE_URL}/auth/me`,
        VERIFY: `${API_BASE_URL}/auth/verify`
    },
    // Products
    PRODUCTS: {
        LIST: `${API_BASE_URL}/products`,
        DETAIL: (id) => `${API_BASE_URL}/products/${id}`,
        FEATURED: `${API_BASE_URL}/products/featured/list`
    },
    // Accessories
    ACCESSORIES: {
        LIST: `${API_BASE_URL}/accessories`,
        DETAIL: (id) => `${API_BASE_URL}/accessories/${id}`
    },
    // Cart
    CART: {
        GET: `${API_BASE_URL}/cart`,
        ADD: `${API_BASE_URL}/cart`,
        UPDATE: (itemId) => `${API_BASE_URL}/cart/${itemId}`,
        REMOVE: (itemId) => `${API_BASE_URL}/cart/${itemId}`,
        CLEAR: `${API_BASE_URL}/cart`
    },
    // Orders
    ORDERS: {
        CREATE: `${API_BASE_URL}/orders`,
        LIST: `${API_BASE_URL}/orders`,
        DETAIL: (id) => `${API_BASE_URL}/orders/${id}`
    },
    // Reviews
    REVIEWS: {
        LIST: (productType, productId) => `${API_BASE_URL}/reviews/${productType}/${productId}`,
        CREATE: `${API_BASE_URL}/reviews`,
        DELETE: (id) => `${API_BASE_URL}/reviews/${id}`
    }
};

// Authentication Helper
const AuthHelper = {
    // Get token from localStorage
    getToken() {
        return localStorage.getItem('authToken');
    },

    // Set token in localStorage
    setToken(token) {
        localStorage.setItem('authToken', token);
        window.dispatchEvent(new Event('authStateChanged'));
    },

    // Remove token from localStorage
    removeToken() {
        localStorage.removeItem('authToken');
        window.dispatchEvent(new Event('authStateChanged'));
    },

    // Get user from localStorage
    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Set user in localStorage
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('authStateChanged'));
    },

    // Remove user from localStorage
    removeUser() {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('authStateChanged'));
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!this.getToken();
    },

    // Logout
    logout() {
        this.removeToken();
        this.removeUser();
        window.dispatchEvent(new Event('authStateChanged'));
    },

    // Get authorization headers
    getAuthHeaders() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};

// API Request Helper
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...AuthHelper.getAuthHeaders()
        }
    };

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {})
        }
    };

    try {
        const response = await fetch(url, finalOptions);
        const data = await response.json();

        if (!response.ok) {
            // Handle authentication errors
            if (response.status === 401 || response.status === 403) {
                AuthHelper.logout();
                // Optionally redirect to login
                // window.location.href = '/pages/login.html';
            }
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API, AuthHelper, apiRequest };
}
