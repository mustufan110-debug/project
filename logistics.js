// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Validation and Submission
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.phone || !data.service) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        if (!isValidPhone(data.phone)) {
            showNotification('Please enter a valid phone number.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Thank you! Your quote request has been sent successfully.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .industry-card, .contact-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const elements = document.querySelectorAll('.element');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
    
    elements.forEach((element, index) => {
        const rate = scrolled * (0.1 + index * 0.05);
        element.style.transform = `translateY(${rate}px)`;
    });
});

// Service card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Industry card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const industryCards = document.querySelectorAll('.industry-card');
    
    industryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Contact form focus effects
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});

// Button click effects
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Lazy loading for images (if any are added later)
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Scroll-based animations can go here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading states to forms
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading"></span> Processing...';
            }
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #ff6b35';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Add ARIA labels where needed
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Cookie Consent Management
class CookieConsent {
    constructor() {
        this.cookieBanner = document.getElementById('cookieConsent');
        this.acceptAllBtn = document.getElementById('acceptAll');
        this.savePreferencesBtn = document.getElementById('savePreferences');
        this.rejectAllBtn = document.getElementById('rejectAll');
        this.analyticsCookies = document.getElementById('analyticsCookies');
        this.marketingCookies = document.getElementById('marketingCookies');
        this.functionalCookies = document.getElementById('functionalCookies');
        
        this.init();
    }
    
    init() {
        // Check if user has already made a choice
        if (!this.getCookie('cookieConsent')) {
            this.showBanner();
        }
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.acceptAllBtn.addEventListener('click', () => this.acceptAll());
        this.savePreferencesBtn.addEventListener('click', () => this.savePreferences());
        this.rejectAllBtn.addEventListener('click', () => this.rejectAll());
    }
    
    showBanner() {
        setTimeout(() => {
            this.cookieBanner.classList.add('show');
        }, 1000);
    }
    
    hideBanner() {
        this.cookieBanner.classList.remove('show');
    }
    
    acceptAll() {
        this.setCookie('cookieConsent', 'all', 365);
        this.setCookie('analyticsCookies', 'true', 365);
        this.setCookie('marketingCookies', 'true', 365);
        this.setCookie('functionalCookies', 'true', 365);
        
        this.hideBanner();
        this.showNotification('All cookies have been accepted.', 'success');
        this.initializeCookies();
    }
    
    savePreferences() {
        const preferences = {
            analytics: this.analyticsCookies.checked,
            marketing: this.marketingCookies.checked,
            functional: this.functionalCookies.checked
        };
        
        this.setCookie('cookieConsent', 'custom', 365);
        this.setCookie('cookiePreferences', JSON.stringify(preferences), 365);
        
        this.hideBanner();
        this.showNotification('Your cookie preferences have been saved.', 'success');
        this.initializeCookies();
    }
    
    rejectAll() {
        this.setCookie('cookieConsent', 'rejected', 365);
        this.setCookie('analyticsCookies', 'false', 365);
        this.setCookie('marketingCookies', 'false', 365);
        this.setCookie('functionalCookies', 'false', 365);
        
        this.hideBanner();
        this.showNotification('Non-essential cookies have been rejected.', 'info');
    }
    
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
    
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    initializeCookies() {
        const consent = this.getCookie('cookieConsent');
        
        if (consent === 'all' || consent === 'custom') {
            // Initialize analytics (Google Analytics example)
            if (this.getCookie('analyticsCookies') === 'true') {
                this.loadAnalytics();
            }
            
            // Initialize marketing cookies
            if (this.getCookie('marketingCookies') === 'true') {
                this.loadMarketingCookies();
            }
            
            // Initialize functional cookies
            if (this.getCookie('functionalCookies') === 'true') {
                this.loadFunctionalCookies();
            }
        }
    }
    
    loadAnalytics() {
        // Example: Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        
        // Example: Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('consent', 'grant');
        }
    }
    
    loadMarketingCookies() {
        // Example: Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('consent', 'grant');
        }
        
        // Example: LinkedIn Insight Tag
        if (typeof _linkedin_partner_id !== 'undefined') {
            // LinkedIn tracking code
        }
    }
    
    loadFunctionalCookies() {
        // Example: User preferences, language settings, etc.
        console.log('Functional cookies loaded');
    }
    
    showNotification(message, type) {
        // Use existing notification system
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize cookie consent when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new CookieConsent();
});

// Console log for debugging
console.log('Eastern Cargo Logistics - Clean & Innovative Design Loaded Successfully!');
