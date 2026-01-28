// ========================================
// NullForums - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initModals();
    initCounters();
    initBackToTop();
    initMobileMenu();
    initSearch();
    initToast();
    initPasswordToggle();
    initForms();
    initSmoothScroll();
});

// ========================================
// Header Scroll Effect
// ========================================
function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// Modal System
// ========================================
function initModals() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    
    // Open modals
    loginBtn?.addEventListener('click', () => openModal(loginModal));
    registerBtn?.addEventListener('click', () => openModal(registerModal));
    
    // Close modals
    closeLoginModal?.addEventListener('click', () => closeModal(loginModal));
    closeRegisterModal?.addEventListener('click', () => closeModal(registerModal));
    
    // Switch between modals
    switchToRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        setTimeout(() => openModal(registerModal), 300);
    });
    
    switchToLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(registerModal);
        setTimeout(() => openModal(loginModal), 300);
    });
    
    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal);
            });
        }
    });
}

function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// Animated Counters
// ========================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
}

// ========================================
// Back to Top Button
// ========================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop?.classList.add('active');
        } else {
            backToTop?.classList.remove('active');
        }
    });
    
    backToTop?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuBtn?.addEventListener('click', () => {
        navMenu?.classList.toggle('mobile-active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu?.classList.contains('mobile-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('mobile-active');
            const icon = mobileMenuBtn?.querySelector('i');
            icon?.classList.remove('fa-times');
            icon?.classList.add('fa-bars');
        });
    });
}

// ========================================
// Search Functionality
// ========================================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                showToast(`Searching for: "${query}"`, 'info');
                // Implement actual search functionality here
            }
        }
    });
    
    // Search suggestions (placeholder)
    searchInput?.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            // Fetch and show suggestions
            console.log('Searching:', query);
        }
    }, 300));
}

// ========================================
// Toast Notifications
// ========================================
let toastTimeout;

function initToast() {
    const toast = document.getElementById('toast');
    const toastClose = toast?.querySelector('.toast-close');
    
    toastClose?.addEventListener('click', () => {
        hideToast();
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast?.querySelector('.toast-message');
    const toastIcon = toast?.querySelector('.toast-icon i');
    
    if (!toast) return;
    
    // Clear previous timeout
    clearTimeout(toastTimeout);
    
    // Set message and type
    toastMessage.textContent = message;
    toast.className = 'toast ' + type;
    
    // Set icon based on type
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toastIcon.className = 'fas ' + (icons[type] || icons.success);
    
    // Show toast
    toast.classList.add('active');
    
    // Auto hide after 4 seconds
    toastTimeout = setTimeout(() => {
        hideToast();
    }, 4000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    toast?.classList.remove('active');
}

// ========================================
// Password Toggle
// ========================================
function initPasswordToggle() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector('i');
            
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

// ========================================
// Form Handling
// ========================================
function initForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        if (validateLogin(username, password)) {
            showToast('Login successful! Welcome back.', 'success');
            closeModal(document.getElementById('loginModal'));
            loginForm.reset();
            
            // Simulate login - update UI
            setTimeout(() => {
                updateUIAfterLogin(username);
            }, 500);
        }
    });
    
    registerForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (validateRegistration(username, email, password, confirmPassword)) {
            showToast('Registration successful! Welcome to NullForums.', 'success');
            closeModal(document.getElementById('registerModal'));
            registerForm.reset();
            
            // Simulate registration - update UI
            setTimeout(() => {
                updateUIAfterLogin(username);
            }, 500);
        }
    });
}

function validateLogin(username, password) {
    if (!username || username.length < 3) {
        showToast('Username must be at least 3 characters.', 'error');
        return false;
    }
    
    if (!password || password.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return false;
    }
    
    return true;
}

function validateRegistration(username, email, password, confirmPassword) {
    if (!username || username.length < 3) {
        showToast('Username must be at least 3 characters.', 'error');
        return false;
    }
    
    if (!email || !isValidEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!password || password.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return false;
    }
    
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms?.checked) {
        showToast('You must agree to the Terms of Service.', 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function updateUIAfterLogin(username) {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn && registerBtn) {
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <div class="user-avatar">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${username}" alt="${username}">
            </div>
            <span class="user-name">${username}</span>
            <button class="btn btn-outline btn-sm" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        `;
        
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        registerBtn.parentNode.insertBefore(userInfo, registerBtn.nextSibling);
    }
}

function logout() {
    location.reload();
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ========================================
// Utility Functions
// ========================================
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

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// Dynamic Content Loading (Placeholder)
// ========================================
function loadMorePosts() {
    // Placeholder for infinite scroll or load more functionality
    console.log('Loading more posts...');
}

// ========================================
// Real-time Updates (Placeholder)
// ========================================
function initRealTimeUpdates() {
    // Placeholder for WebSocket connections
    console.log('Real-time updates initialized');
    
    // Simulate new post notification
    setInterval(() => {
        const randomUser = ['CyberNinja', 'DevMaster', 'HackerPro', 'CodeWizard'][Math.floor(Math.random() * 4)];
        console.log(`New post from ${randomUser}`);
    }, 30000);
}

// ========================================
// Theme Toggle (Future Feature)
// ========================================
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// ========================================
// Forum Interaction Handlers
// ========================================
document.addEventListener('click', (e) => {
    // Handle forum item clicks
    if (e.target.closest('.forum-item')) {
        const forumItem = e.target.closest('.forum-item');
        const forumTitle = forumItem.querySelector('.forum-details h3 a')?.textContent;
        
        if (!e.target.closest('a')) {
            console.log('Navigating to forum:', forumTitle);
        }
    }
    
    // Handle post clicks
    if (e.target.closest('.post-item')) {
        const postItem = e.target.closest('.post-item');
        const postTitle = postItem.querySelector('.post-title')?.textContent;
        
        if (!e.target.closest('a')) {
            console.log('Navigating to post:', postTitle);
        }
    }
});

// ========================================
// Keyboard Navigation
// ========================================
document.addEventListener('keydown', (e) => {
    // Quick search with /
    if (e.key === '/' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        document.getElementById('searchInput')?.focus();
    }
    
    // Close modal with Escape
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal);
        }
    }
});

// ========================================
// Initialize Everything
// ========================================
console.log('🚀 NullForums initialized successfully!');
