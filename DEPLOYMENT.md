# Deployment Guide - Rewrite the Curse Website

This guide provides step-by-step instructions for deploying the Rewrite the Curse website to various hosting platforms.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - Free Tier)

**Best for:** Performance, ease of use, automatic deployments

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow prompts:**
   - Project name: `rewrite-the-curse`
   - Framework preset: `Other`
   - Output directory: `.` (current directory)
   - Override settings: `No`

5. **Configure custom domain:**
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings → Domains
   - Add your domain (e.g., `rewritethecurse.org`)

### Option 2: Netlify (Free Tier)

**Best for:** Form handling, drag-and-drop simplicity

1. **Drag and drop deployment:**
   - Go to [netlify.com](https://netlify.com)
   - Drag your project folder to the deploy area
   - Wait for build to complete

2. **Configure form handling:**
   - Go to Site settings → Forms
   - Enable form detection
   - Set up email notifications

3. **Custom domain:**
   - Go to Site settings → Domain management
   - Add custom domain
   - Configure DNS records

### Option 3: GitHub Pages (Free)

**Best for:** Open source projects, version control integration

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/rewrite-the-curse.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Scroll to Pages section
   - Select source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`

3. **Custom domain:**
   - Add `CNAME` file with your domain
   - Configure DNS records

## 🔧 Environment Configuration

### Required Environment Variables

Set these in your hosting platform's environment settings:

```env
# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Donorbox Integration
DONORBOX_CAMPAIGN_ID=your_campaign_id

# Analytics (Optional)
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Google Maps API Setup

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Maps JavaScript API

2. **Create API Key:**
   - Go to APIs & Services → Credentials
   - Create API Key
   - Restrict key to your domain

3. **Update script.js:**
   ```javascript
   const GMAPS_KEY = process.env.GOOGLE_MAPS_API_KEY || 'your_fallback_key';
   ```

## 📊 Analytics Setup

### Google Analytics 4

1. **Create GA4 Property:**
   - Go to [Google Analytics](https://analytics.google.com)
   - Create new property
   - Copy Measurement ID

2. **Add to HTML:**
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

### Custom Event Tracking

Add to `script.js`:
```javascript
// Track quiz completions
function trackQuizCompletion(score, riskLevel) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'quiz_completion', {
      'event_category': 'engagement',
      'event_label': riskLevel,
      'value': score
    });
  }
}

// Track dashboard visits
function trackDashboardVisit() {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'dashboard_visit', {
      'event_category': 'engagement'
    });
  }
}
```

## 🔒 Security Configuration

### Content Security Policy

Add to all HTML files in `<head>`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.google-analytics.com https://maps.googleapis.com https://donorbox.org;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://maps.googleapis.com https://donorbox.org;
  frame-src https://www.youtube.com https://donorbox.org;
">
```

### HTTPS Enforcement

Most modern hosting platforms enforce HTTPS automatically. Verify:
- SSL certificate is active
- HTTP redirects to HTTPS
- Mixed content warnings are resolved

## 📱 Performance Optimization

### Pre-deployment Checklist

- [ ] **Image Optimization:**
  ```bash
  # Install image optimization tools
  npm install -g imagemin-cli
  
  # Optimize images
  imagemin images/* --out-dir=images/optimized
  ```

- [ ] **CSS Minification:**
  ```bash
  # Install CSS minifier
  npm install -g clean-css-cli
  
  # Minify CSS
  cleancss -o styles.min.css styles.css
  ```

- [ ] **JavaScript Minification:**
  ```bash
  # Install JS minifier
  npm install -g uglify-js
  
  # Minify JS
  uglifyjs script.js -o script.min.js
  ```

### Performance Monitoring

1. **Lighthouse Audit:**
   - Open Chrome DevTools
   - Go to Lighthouse tab
   - Run audit for Performance, Accessibility, SEO

2. **Core Web Vitals:**
   - Monitor LCP (Largest Contentful Paint)
   - Monitor FID (First Input Delay)
   - Monitor CLS (Cumulative Layout Shift)

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🐛 Troubleshooting

### Common Issues

1. **Google Maps not loading:**
   - Check API key is correct
   - Verify domain restrictions
   - Check billing is enabled

2. **Forms not working:**
   - Verify form action URLs
   - Check CORS settings
   - Test with different browsers

3. **Images not loading:**
   - Check file paths are correct
   - Verify image files exist
   - Check for case sensitivity

4. **CSS not applying:**
   - Clear browser cache
   - Check file paths
   - Verify CSS syntax

### Debug Mode

Add to `script.js`:
```javascript
// Enable debug mode
const DEBUG = true;

function debug(message, data) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data);
  }
}
```

## 📞 Support

### Deployment Issues
- **Vercel:** [vercel.com/support](https://vercel.com/support)
- **Netlify:** [netlify.com/support](https://netlify.com/support)
- **GitHub Pages:** [docs.github.com/pages](https://docs.github.com/pages)

### Performance Issues
- **Lighthouse:** [developers.google.com/web/tools/lighthouse](https://developers.google.com/web/tools/lighthouse)
- **WebPageTest:** [webpagetest.org](https://webpagetest.org)

---

**Need help?** Contact the development team or create an issue in the GitHub repository. 