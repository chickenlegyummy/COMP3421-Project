/**
 * Authentication Manager
 * Handles login, registration, and form validation
 */
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        // Initialize based on page
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            this.initLoginForm(loginForm);
        }

        if (registerForm) {
            this.initRegisterForm(registerForm);
        }

        // Initialize password toggles
        this.initPasswordToggles();
    }

    /**
     * Initialize Login Form
     */
    initLoginForm(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous errors
            this.clearErrors(form);

            // Get form data
            const email = form.querySelector('#email').value;
            const password = form.querySelector('#password').value;
            const remember = form.querySelector('#remember').checked;

            // Validate
            let isValid = true;

            if (!this.validateEmail(email)) {
                this.showError('email', 'Please enter a valid email address');
                isValid = false;
            }

            if (!password || password.length < 6) {
                this.showError('password', 'Password must be at least 6 characters');
                isValid = false;
            }

            if (!isValid) return;

            // Show loading state
            const submitBtn = form.querySelector('.btn-auth');
            submitBtn.classList.add('loading');

            // Simulate API call
            try {
                await this.login(email, password, remember);
                
                // Success - redirect to homepage
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1000);
            } catch (error) {
                submitBtn.classList.remove('loading');
                this.showError('password', error.message);
            }
        });
    }

    /**
     * Initialize Register Form
     */
    initRegisterForm(form) {
        const passwordInput = form.querySelector('#password');
        const confirmPasswordInput = form.querySelector('#confirmPassword');

        // Real-time password strength checking
        passwordInput.addEventListener('input', () => {
            this.checkPasswordStrength(passwordInput.value);
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous errors
            this.clearErrors(form);

            // Get form data
            const firstName = form.querySelector('#firstName').value;
            const lastName = form.querySelector('#lastName').value;
            const email = form.querySelector('#email').value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const acceptTerms = form.querySelector('#acceptTerms').checked;

            // Validate
            let isValid = true;

            if (!firstName.trim()) {
                this.showError('firstName', 'First name is required');
                isValid = false;
            }

            if (!lastName.trim()) {
                this.showError('lastName', 'Last name is required');
                isValid = false;
            }

            if (!this.validateEmail(email)) {
                this.showError('email', 'Please enter a valid email address');
                isValid = false;
            }

            const passwordStrength = this.getPasswordStrength(password);
            if (passwordStrength === 'weak') {
                this.showError('password', 'Please choose a stronger password');
                isValid = false;
            }

            if (password !== confirmPassword) {
                this.showError('confirmPassword', 'Passwords do not match');
                isValid = false;
            }

            if (!acceptTerms) {
                this.showError('acceptTerms', 'You must accept the terms and conditions');
                isValid = false;
            }

            if (!isValid) return;

            // Show loading state
            const submitBtn = form.querySelector('.btn-auth');
            submitBtn.classList.add('loading');

            // Simulate API call
            try {
                await this.register(firstName, lastName, email, password);
                
                // Success - redirect to login
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 1000);
            } catch (error) {
                submitBtn.classList.remove('loading');
                this.showError('email', error.message);
            }
        });
    }

    /**
     * Initialize Password Toggle Buttons
     */
    initPasswordToggles() {
        const toggles = document.querySelectorAll('.password-toggle');

        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.previousElementSibling;
                const icon = toggle.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    /**
     * Check Password Strength
     */
    checkPasswordStrength(password) {
        const strengthIndicator = document.querySelector('.password-strength');
        if (!strengthIndicator) return;

        if (!password) {
            strengthIndicator.classList.remove('active');
            return;
        }

        strengthIndicator.classList.add('active');

        const strength = this.getPasswordStrength(password);
        const meterFill = strengthIndicator.querySelector('.strength-meter-fill');
        const strengthText = strengthIndicator.querySelector('.strength-text');

        // Remove all classes
        meterFill.classList.remove('weak', 'medium', 'strong');

        // Add appropriate class
        meterFill.classList.add(strength);

        // Update text
        if (strength === 'weak') {
            strengthText.textContent = strengthText.getAttribute('data-lang-en') === 'Weak password' 
                ? 'Weak password' 
                : '弱密碼';
        } else if (strength === 'medium') {
            strengthText.textContent = strengthText.getAttribute('data-lang-en') === 'Weak password' 
                ? 'Medium password' 
                : '中等密碼';
        } else {
            strengthText.textContent = strengthText.getAttribute('data-lang-en') === 'Weak password' 
                ? 'Strong password' 
                : '強密碼';
        }
    }

    /**
     * Get Password Strength
     */
    getPasswordStrength(password) {
        let strength = 0;

        if (!password || password.length < 6) return 'weak';

        // Length
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;

        // Contains lowercase
        if (/[a-z]/.test(password)) strength++;

        // Contains uppercase
        if (/[A-Z]/.test(password)) strength++;

        // Contains numbers
        if (/\d/.test(password)) strength++;

        // Contains special characters
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        if (strength <= 2) return 'weak';
        if (strength <= 4) return 'medium';
        return 'strong';
    }

    /**
     * Validate Email
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Show Error Message
     */
    showError(fieldId, message) {
        const formGroup = document.getElementById(fieldId)?.closest('.form-group');
        if (!formGroup) return;

        formGroup.classList.add('error');

        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('active');
        }
    }

    /**
     * Clear All Errors
     */
    clearErrors(form) {
        const errorGroups = form.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
            const errorMsg = group.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.classList.remove('active');
            }
        });
    }

    /**
     * Simulate Login API Call
     */
    async login(email, password, remember) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock validation
                if (email === 'test@example.com' && password === 'password123') {
                    // Store user data (mock)
                    const userData = {
                        email,
                        name: 'Test User',
                        loggedIn: true,
                        timestamp: Date.now()
                    };

                    if (remember) {
                        localStorage.setItem('user', JSON.stringify(userData));
                    } else {
                        sessionStorage.setItem('user', JSON.stringify(userData));
                    }

                    resolve(userData);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1500);
        });
    }

    /**
     * Simulate Register API Call
     */
    async register(firstName, lastName, email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock check if email already exists
                if (email === 'exists@example.com') {
                    reject(new Error('This email is already registered'));
                } else {
                    resolve({
                        firstName,
                        lastName,
                        email
                    });
                }
            }, 1500);
        });
    }

    /**
     * Logout
     */
    logout() {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        window.location.href = './login.html';
    }

    /**
     * Check if User is Logged In
     */
    static isLoggedIn() {
        const user = localStorage.getItem('user') || sessionStorage.getItem('user');
        return !!user;
    }

    /**
     * Get Current User
     */
    static getCurrentUser() {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Social login handlers (mock implementation)
document.addEventListener('DOMContentLoaded', () => {
    const socialBtns = document.querySelectorAll('.social-btn');
    
    socialBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const provider = btn.classList.contains('google-btn') ? 'Google' : 'Facebook';
            alert(`${provider} authentication would be implemented here. This is a frontend demo.`);
        });
    });
});
