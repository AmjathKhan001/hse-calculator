HSE Calculator - Professional Health, Safety & Environment Tools
https://assets/logo.png

A comprehensive collection of professional calculators and tools for Health, Safety, and Environment (HSE) professionals. Built with clean HTML5, CSS3, and Vanilla JavaScript.

🌐 Live Website
https://www.hsecalculator.com/

🚀 Features
🧮 Professional HSE Calculators
Risk Assessment Calculator - Calculate risk levels based on probability and severity

Noise Exposure Calculator - Determine daily noise exposure compliance

Chemical Exposure Calculator - Assess workplace chemical exposure

Incident Rate Calculator - Calculate TRIR, DART, and safety metrics

Fall Protection Calculator - Calculate required fall clearance

Heat Stress Calculator - Calculate WBGT index

Ventilation Calculator - Calculate required ventilation rates

PPE Selection Calculator - Determine appropriate personal protective equipment

Lifting Safety Calculator - Calculate NIOSH lifting equation

Environmental Impact Calculator - Calculate carbon footprint

🛍️ Safety Products Marketplace
10+ Safety Products - Professional PPE and safety equipment

Affiliate Links - Amazon Associates integration

Scalable Product System - Easy to add 100+ products

Product Filtering - Filter by category and type

🔧 Additional Features
Print/Save as PDF - All calculators include PDF export

Website Visitor Counter - Real-time visitor tracking

Social Sharing - Share tools on social media

Mobile Responsive - Fully responsive design

SEO Optimized - Built for search engine visibility

Legal Pages - Privacy, Terms, Affiliate Disclosure

Blog Section - HSE articles and guides

Tools Library - External HSE resources

📁 Project Structure
text
hse-calculator/
├── index.html                    # Homepage
├── sitemap.xml                   # XML sitemap
├── robots.txt                    # Robots exclusion rules
├── vercel.json                   # Vercel configuration
├── assets/                       # Images and media
│   ├── logo.png                  # Website logo
│   ├── products/                 # Product images
│   └── blog/                     # Blog images
├── calculators/                  # Individual calculator pages
│   ├── risk-assessment.html
│   ├── noise-exposure.html
│   ├── chemical-exposure.html
│   ├── incident-rate.html
│   ├── fall-protection.html
│   ├── heat-stress.html
│   ├── ventilation.html
│   ├── ppe-selection.html
│   ├── lifting-safety.html
│   └── environmental-impact.html
├── pages/                        # Additional pages
│   ├── products.html            # Safety products
│   ├── tools.html               # External tools library
│   ├── blog.html                # Blog articles
│   ├── privacy.html             # Privacy policy
│   ├── terms.html               # Terms of use
│   ├── affiliate-disclosure.html # Affiliate disclosure
│   └── sitemap.html             # HTML sitemap
├── css/                          # Stylesheets
│   └── style.css                # Main stylesheet
└── js/                           # JavaScript files
    ├── main.js                  # Main JavaScript
    ├── calculators.js           # Calculator logic
    └── visitor-counter.js       # Visitor counter
🛠️ Technology Stack
Frontend: HTML5, CSS3, Vanilla JavaScript

Icons: Font Awesome 6

PDF Generation: html2pdf.js

Analytics: Google Analytics

Ads: Google Auto-Ads

Hosting: Vercel (Static Hosting)

Version Control: Git & GitHub

📦 Installation & Setup
Local Development
Clone the repository

bash
git clone https://github.com/AmjathKhan001/hse-calculator.git
cd hse-calculator
Install a local server (optional)

bash
# Using Python
python -m http.server 8000

# Or using Node.js with http-server
npx http-server
Open in browser

Navigate to http://localhost:8000

Adding New Products
To add more safety products, edit pages/products.html:

javascript
// Add to the allProducts array
{
    id: 11,
    name: "Product Name",
    image: "../assets/products/product-image.jpg",
    link: "https://amzn.to/affiliate-link",
    category: "Category Name",
    description: "Product description"
}
Adding New Calculators
Create a new HTML file in calculators/ folder

Copy the structure from existing calculators

Update the navigation in all HTML files

Add calculator logic to js/main.js

🔧 Configuration
Google Analytics
Update tracking ID in all HTML files:

html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DRRTSHLC01"></script>
Google Auto-Ads
Update client ID in all HTML files:

html
<script async src="https://pagead2.googletagservices.com/pagead/js/adsbygoogle.js?client=pub-6687860250561653"></script>
Amazon Affiliate Links
Replace existing affiliate links in pages/products.html

Update Clearance Sale banner link

Contact Information
Update in all HTML footer sections:

Email: contact@amjathkhan.com

Phone: +91-9750816163

Website: https://www.amjathkhan.com

🚀 Deployment
Deploy to Vercel
Push to GitHub

bash
git add .
git commit -m "Initial commit"
git push origin main
Connect to Vercel

Go to vercel.com

Import GitHub repository

Configure build settings:

Framework Preset: Static

Build Command: (leave empty)

Output Directory: (leave empty)

Deploy

Configure Custom Domain (optional)

Add www.hsecalculator.com in Vercel project settings

Update DNS records with your domain provider

SEO Setup
Submit sitemap to search engines:

Google Search Console: search.google.com/search-console

Bing Webmaster Tools: bing.com/webmasters

Verify ownership using HTML tag method

Submit sitemap URL:

text
https://www.hsecalculator.com/sitemap.xml
📊 Performance Optimization
Built-in Optimizations
✅ Minified CSS and JS

✅ Lazy loading for images

✅ Optimized image sizes

✅ HTTP/2 support

✅ Browser caching

✅ GZIP compression

Additional Recommendations
Image Optimization

bash
# Use tools like ImageOptim or Squoosh
https://squoosh.app/
Lighthouse Score

Run Chrome DevTools Lighthouse audit

Target scores: Performance 90+, SEO 100, Accessibility 100

🔒 Security Features
HTTPS enforced

Secure headers configuration

XSS protection

Content Security Policy

No user data storage

Privacy-focused design

📱 Mobile Responsiveness
The website is fully responsive and tested on:

Desktop (1920px, 1366px, 1024px)

Tablet (768px, 600px)

Mobile (414px, 375px, 320px)

📈 Analytics Integration
Google Analytics 4
Page views tracking

Event tracking for calculator usage

User engagement metrics

Traffic source analysis

Visitor Counter
Real-time visitor count

Local storage fallback

CountAPI integration

Animated display

💰 Monetization
Google AdSense - Auto-ads placement

Amazon Associates - Affiliate product links

Buy Me a Coffee - User donations

Sponsored Products - Featured safety equipment

📝 Legal Compliance
Included Pages
✅ Privacy Policy

✅ Terms of Use

✅ Affiliate Disclosure

✅ Copyright Information

✅ Contact Information

GDPR Compliance
No personal data collection

Cookie consent notification (to be implemented)

Data minimization principles

Right to access/delete data

🐛 Troubleshooting
Common Issues
PDF generation not working

Check html2pdf.js CDN link

Ensure JavaScript is enabled

Check browser console for errors

Images not loading

Check file paths

Verify image file names

Ensure proper file extensions

CSS not applying

Clear browser cache

Check CSS file path

Verify CSS syntax

Mobile menu not working

Check JavaScript console

Verify Font Awesome CDN

Test with different browsers

Browser Support
Chrome 60+

Firefox 55+

Safari 12+

Edge 79+

iOS Safari 12+

Chrome for Android 90+

🤝 Contributing
Fork the repository

Create a feature branch

Make your changes

Test thoroughly

Submit a pull request

Development Guidelines
Use semantic HTML5

Follow BEM naming convention for CSS

Add comments for complex JavaScript

Test on multiple devices

Update documentation

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

📞 Support
For support, feature requests, or bug reports:

Email: contact@amjathkhan.com

Phone: +91-9750816163

Website: https://www.amjathkhan.com

GitHub Issues: Create an issue

🙏 Acknowledgments
Font Awesome for icons

html2pdf.js for PDF generation

Google Fonts for typography

CountAPI for visitor counter

All contributors and users

📊 Website Statistics
Pages: 20+ pages

Calculators: 10+ tools

Products: 10+ (scalable to 100+)

File Size: ~2MB total

Load Time: < 3 seconds

SEO Score: 100/100

Made with ❤️ by Amjath Khan
Professional HSE Tools for Safety Professionals Worldwide
