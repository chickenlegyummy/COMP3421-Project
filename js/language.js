/**
 * Language Manager - Handles bilingual support (EN/中文)
 * Follows Hiei-Blog approach with localStorage persistence
 */

class LanguageManager {
    constructor() {
        this.language = localStorage.getItem('language') || 'en';
        this.languageToggle = null;
        this.translations = {
            en: {
                name: 'English',
                code: 'EN'
            },
            zh: {
                name: '中文',
                code: '中'
            }
        };
        this.init();
    }

    init() {
        // Apply saved language
        this.applyLanguage(this.language);
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupToggle());
        } else {
            this.setupToggle();
        }
    }

    setupToggle() {
        this.languageToggle = document.getElementById('languageToggle');
        
        if (this.languageToggle) {
            // Set initial text
            this.updateToggleText();
            
            // Add event listener
            this.languageToggle.addEventListener('click', () => this.toggleLanguage());
        }
    }

    toggleLanguage() {
        this.language = this.language === 'en' ? 'zh' : 'en';
        this.applyLanguage(this.language);
        this.updateToggleText();
        localStorage.setItem('language', this.language);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: this.language } }));
    }

    applyLanguage(lang) {
        this.language = lang;
        document.documentElement.setAttribute('lang', lang);
        
        // Update all elements with data-lang attributes
        this.updateElements();
        
        // Update input placeholders
        this.updatePlaceholders();
    }

    updateElements() {
        // Update text content
        const elements = document.querySelectorAll('[data-lang-en], [data-lang-zh]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-lang-${this.language}`);
            if (text) {
                // Check if it's a title element
                if (element.tagName === 'TITLE') {
                    element.textContent = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }

    updatePlaceholders() {
        const inputs = document.querySelectorAll('[data-lang-en-placeholder], [data-lang-zh-placeholder]');
        inputs.forEach(input => {
            const placeholder = input.getAttribute(`data-lang-${this.language}-placeholder`);
            if (placeholder) {
                input.setAttribute('placeholder', placeholder);
            }
        });
    }

    updateToggleText() {
        if (!this.languageToggle) return;
        
        const langText = this.languageToggle.querySelector('.lang-text');
        if (langText) {
            langText.textContent = this.translations[this.language].code;
        }
    }

    getCurrentLanguage() {
        return this.language;
    }

    translate(key, lang = this.language) {
        // Method for programmatic translations
        return this.translations[lang][key] || key;
    }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
