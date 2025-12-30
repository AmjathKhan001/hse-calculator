// update-all-nav.js - Loads consistent header and footer across all pages
// IMPORTANT: This runs in the BROWSER, not Node.js

class NavigationManager {
    constructor() {
        this.headerLoaded = false;
        this.footerLoaded = false;
        this.currentPage = this.getCurrentPage();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop();
        return page || 'index.html';
    }

    // Load header
    async loadHeader() {
        try {
            const headerContainer = document.getElementById('header-container');
            if (!headerContainer) {
                console.warn('Header container not found');
                return;
            }

            // Determine template based on location
            let template = '';
            const isRoot = window.location.pathname.includes('index.html') || 
                          window.location.pathname.split('/').filter(Boolean).length <= 1;
            const isCalculator = window.location.pathname.includes('/calculators/');
            const isPage = window.location.pathname.includes('/pages/');

            if (isRoot) {
                template = this.getHeaderTemplate('root');
            } else if (isCalculator) {
                template = this.getHeaderTemplate('calculators');
            } else if (isPage) {
                template = this.getHeaderTemplate('pages');
            }

            headerContainer.innerHTML = template;
            this.headerLoaded = true;
            
            // Initialize mobile menu after header loads
            setTimeout(() => this.initMobileMenu(), 100);
            
        } catch (error) {
            console.error('Error loading header:', error);
            this.loadFallbackHeader();
        }
    }

    // Load footer
    async loadFooter() {
        try {
            const footerContainer = document.getElementById('footer-container');
            if (!footerContainer) {
                console.warn('Footer container not found');
                return;
            }

            const template = this.getFooterTemplate();
            footerContainer.innerHTML = template;
            this.footerLoaded = true;
            
        } catch (error) {
            console.error('Error loading footer:', error);
            this.loadFallbackFooter();
        }
    }

    // Get header template based on location
    getHeaderTemplate(type) {
        const basePath = type === 'root' ? '' : '../';
        const calculatorPath = type === 'calculators' ? '../pages/' : 'pages/';
        const pagePath = type === 'pages' ? '' : '../pages/';
        
        // Determine active link
        const getActiveClass = (page) => {
            return this.currentPage === page || 
                   (this.currentPage.includes(page) && page !== 'index.html') ? 'active' : '';
        };

        return `
<!-- Header -->
<header class="header">
    <div class="container">
        <nav class="navbar">
            <a href="${basePath}index.html" class="logo">
                <img src="${basePath}assets/logo.png" alt="HSE Calculator Logo" class="logo-img">
                <span>HSE Calculator</span>
            </a>
            
            <div class="nav-links" id="navLinks">
                <a href="${basePath}index.html" class="nav-link ${getActiveClass('index.html')}">
                    <i class="fas fa-home"></i> Home
                </a>
                <a href="${calculatorPath}all-calculators.html" class="nav-link ${getActiveClass('all-calculators.html')}">
                    <i class="fas fa-calculator"></i> All Calculators
                </a>
                <a href="${pagePath}products.html" class="nav-link ${getActiveClass('products.html')}">
                    <i class="fas fa-shopping-bag"></i> Safety Products
                </a>
                <a href="${pagePath}tools.html" class="nav-link ${getActiveClass('tools.html')}">
                    <i class="fas fa-tools"></i> Tools
                </a>
                <a href="${pagePath}blog.html" class="nav-link ${getActiveClass('blog.html')}">
                    <i class="fas fa-blog"></i> Blog
                </a>
                <a href="${pagePath}contact.html" class="nav-link ${getActiveClass('contact.html')}">
                    <i class="fas fa-envelope"></i> Contact
                </a>
            </div>
            
            <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation">
                <i class="fas fa-bars"></i>
            </button>
        </nav>
    </div>
</header>`;
    }

    // Get footer template
    getFooterTemplate() {
        const isRoot = !window.location.pathname.includes('/pages/') && 
                      !window.location.pathname.includes('/calculators/');
        const basePath = isRoot ? '' : '../';

        return `
<!-- Footer -->
<footer class="footer">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-col">
                <div class="footer-logo">
                    <img src="${basePath}assets/logo.png" alt="HSE Calculator Logo" style="height: 30px;">
                    <span>HSE Calculator</span>
                </div>
                <p>Professional Health, Safety & Environment calculators and tools for industry professionals.</p>
                <div class="footer-social">
                    <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
            
            <div class="footer-col">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="${basePath}index.html">Home</a></li>
                    <li><a href="${basePath}pages/all-calculators.html">All Calculators</a></li>
                    <li><a href="${basePath}pages/products.html">Safety Products</a></li>
                    <li><a href="${basePath}pages/tools.html">Tools</a></li>
                </ul>
            </div>
            
            <div class="footer-col">
                <h4>Resources</h4>
                <ul>
                    <li><a href="${basePath}pages/blog.html">Blog</a></li>
                    <li><a href="${basePath}pages/contact.html">Contact Us</a></li>
                    <li><a href="${basePath}pages/privacy.html">Privacy Policy</a></li>
                    <li><a href="${basePath}pages/terms.html">Terms of Service</a></li>
                </ul>
            </div>
            
            <div class="footer-col">
                <h4>Contact Info</h4>
                <ul class="contact-info">
                    <li><i class="fas fa-envelope"></i> support@hsecalculator.com</li>
                    <li><i class="fas fa-phone"></i> +1 (555) 123-4567</li>
                    <li><i class="fas fa-map-marker-alt"></i> 123 Safety St, Industrial Area</li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} HSE Calculator. All rights reserved.</p>
            <p>Professional tools for safety professionals worldwide</p>
        </div>
    </div>
</footer>`;
    }

    // Fallback header if loading fails
    loadFallbackHeader() {
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            headerContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; background: #f8f9fa;">
                    <a href="index.html" style="font-size: 1.5rem; font-weight: bold; color: #2c5aa0;">
                        HSE Calculator
                    </a>
                </div>`;
        }
    }

    // Fallback footer if loading fails
    loadFallbackFooter() {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; background: #333; color: white;">
                    <p>&copy; ${new Date().getFullYear()} HSE Calculator</p>
                </div>`;
        }
    }

    // Initialize mobile menu functionality
    initMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const navLinks = document.getElementById('navLinks');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                navLinks.classList.toggle('active');
                
                const icon = this.querySelector('i');
                if (icon) {
                    if (navLinks.classList.contains('active')) {
                        icon.classList.replace('fa-bars', 'fa-times');
                    } else {
                        icon.classList.replace('fa-times', 'fa-bars');
                    }
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!navLinks.contains(event.target) && !mobileToggle.contains(event.target)) {
                    navLinks.classList.remove('active');
                    const icon = mobileToggle.querySelector('i');
                    if (icon) {
                        icon.classList.replace('fa-times', 'fa-bars');
                    }
                }
            });

            // Close menu when clicking a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                    const icon = mobileToggle.querySelector('i');
                    if (icon) {
                        icon.classList.replace('fa-times', 'fa-bars');
                    }
                });
            });
        }
    }

    // Load both header and footer
    async loadAll() {
        await Promise.all([
            this.loadHeader(),
            this.loadFooter()
        ]);
        
        console.log('Navigation loaded successfully');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const navManager = new NavigationManager();
    navManager.loadAll();
    
    // Make it globally available
    window.navigationManager = navManager;
});
