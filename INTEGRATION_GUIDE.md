# 🏪 Storefront Integration Guide
## Rewrite the Curse - Live Donation Tracking & Dashboard Setup

This guide explains how to set up the live donation tracking, real-time dashboard, and external integrations for your nonprofit website.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [External Donation Platform Setup](#external-donation-platform-setup)
3. [Real-time Dashboard Backend](#real-time-dashboard-backend)
4. [Google Maps Integration](#google-maps-integration)
5. [Authentication Setup](#authentication-setup)
6. [Webhook Configuration](#webhook-configuration)
7. [Deployment & Environment Variables](#deployment--environment-variables)
8. [Testing & Monitoring](#testing--monitoring)

---

## 🎯 Overview

Your website now features a **retail planogram layout** with:
- **Front Window**: Mission + Primary CTAs + Live donation counter
- **Browsing Aisle**: Red Cross finder + Education + Live dashboard
- **Back of Store**: Stories + Events + Social proof

### Key Integrations:
- **Donorbox** for financial donations
- **Supabase** for real-time dashboard
- **Google Maps** for Red Cross location finder
- **Magic Link** authentication

---

## 💳 External Donation Platform Setup

### Recommended: Donorbox

**Why Donorbox?**
- Nonprofit-focused
- Low fees (3.5% + $0.30)
- Easy integration
- Webhook support
- Mobile-responsive forms

#### Setup Steps:

1. **Create Donorbox Account**
   ```bash
   # Visit: https://donorbox.org
   # Sign up for nonprofit account
   # Verify your organization
   ```

2. **Create Campaign**
   - Campaign Name: "Rewrite the Curse - Hemochromatosis Awareness"
   - Goal: $10,000 (adjustable)
   - Currency: USD

3. **Customize Form**
   ```html
   <!-- Update in index.html -->
   <iframe src="https://donorbox.org/embed/YOUR-CAMPAIGN-ID"
           title="Secure donation form"
           frameborder="0" 
           scrolling="no"
           height="400" 
           width="100%" 
           loading="lazy"></iframe>
   ```

4. **Alternative Platforms**
   - **Givebutter**: 2.9% fee, excellent UX
   - **Ko-fi**: 5% fee, creator-friendly
   - **Squarespace Donations**: If using Squarespace

---

## 📊 Real-time Dashboard Backend

### Recommended: Supabase

**Why Supabase?**
- Real-time subscriptions
- Built-in authentication
- PostgreSQL database
- Generous free tier
- Easy webhook integration

#### Setup Steps:

1. **Create Supabase Project**
   ```bash
   # Visit: https://supabase.com
   # Create new project
   # Note your URL and anon key
   ```

2. **Database Schema**
   ```sql
   -- Create tables for dashboard
   CREATE TABLE donations (
     id SERIAL PRIMARY KEY,
     donorbox_id TEXT UNIQUE,
     amount DECIMAL(10,2),
     currency TEXT DEFAULT 'USD',
     donor_email TEXT,
     donor_name TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE quiz_completions (
     id SERIAL PRIMARY KEY,
     email TEXT,
     risk_score INTEGER,
     symptoms JSONB,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE user_logins (
     id SERIAL PRIMARY KEY,
     email TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE goals (
     id SERIAL PRIMARY KEY,
     type TEXT UNIQUE,
     target INTEGER,
     current INTEGER DEFAULT 0,
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Insert default goal
   INSERT INTO goals (type, target) VALUES ('daily_donations', 100);
   ```

3. **Enable Real-time**
   ```sql
   -- Enable real-time for all tables
   ALTER TABLE donations REPLICA IDENTITY FULL;
   ALTER TABLE quiz_completions REPLICA IDENTITY FULL;
   ALTER TABLE user_logins REPLICA IDENTITY FULL;
   ```

4. **Update Configuration**
   ```javascript
   // In dashboard-api.js
   const SUPABASE_CONFIG = {
     url: 'https://your-project.supabase.co',
     anonKey: 'your-anon-key'
   };
   ```

#### Alternative Backends:
- **Firebase Realtime Database**: Google's solution
- **Appsmith**: Low-code dashboard builder
- **Tinybird**: Real-time analytics platform

---

## 🗺️ Google Maps Integration

### Current Setup:
- API Key: `AIzaSyA_Zi9pvO64Isr1PwI9q663yPT1LVRhbLQ`
- Maps Embed API for Red Cross finder
- Geocoding for location search

#### Setup Steps:

1. **Google Cloud Console**
   ```bash
   # Visit: https://console.cloud.google.com
   # Create new project or use existing
   # Enable APIs:
   # - Maps Embed API
   # - Geocoding API
   # - Places API
   ```

2. **API Key Security**
   ```javascript
   // Restrict API key to your domain
   // Add HTTP referrers: *.rewritethecurse.org/*
   ```

3. **Update Configuration**
   ```javascript
   // In index.html
   const CONFIGURATION = {
     "mapsApiKey": "YOUR-API-KEY",
     // ... other config
   };
   ```

---

## 🔐 Authentication Setup

### Magic Link Authentication

**Implementation Options:**

1. **Supabase Auth** (Recommended)
   ```javascript
   // Add to index.html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   
   // Update dashboard-api.js
   const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
   ```

2. **Clerk** (Alternative)
   ```bash
   # Visit: https://clerk.com
   # Create application
   # Add magic link authentication
   ```

3. **Custom Implementation**
   ```javascript
   // In script.js - sendMagicLink function
   async sendMagicLink(email) {
     // Integrate with your preferred auth service
     const response = await fetch('/api/auth/magic-link', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email })
     });
     return response.ok;
   }
   ```

---

## 🔗 Webhook Configuration

### Donorbox Webhook Setup

1. **Webhook URL**
   ```
   https://your-domain.com/api/webhooks/donorbox
   ```

2. **Server Implementation** (Node.js/Express)
   ```javascript
   // webhook-handler.js
   app.post('/api/webhooks/donorbox', async (req, res) => {
     const { donation } = req.body;
     
     // Verify webhook signature
     const signature = req.headers['x-donorbox-signature'];
     if (!verifySignature(signature, req.body)) {
       return res.status(401).send('Invalid signature');
     }
     
     // Record donation in Supabase
     const { error } = await supabase
       .from('donations')
       .insert({
         donorbox_id: donation.id,
         amount: donation.amount,
         currency: donation.currency,
         donor_email: donation.donor.email,
         donor_name: donation.donor.name
       });
     
     if (error) {
       console.error('Error recording donation:', error);
       return res.status(500).send('Error recording donation');
     }
     
     res.status(200).send('OK');
   });
   ```

3. **Webhook Events to Listen For**
   - `donation.created`
   - `donation.updated`
   - `donation.cancelled`

---

## 🚀 Deployment & Environment Variables

### Environment Variables
```bash
# .env file
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
GOOGLE_MAPS_API_KEY=your-maps-api-key
DONORBOX_WEBHOOK_SECRET=your-webhook-secret
```

### Deployment Platforms

1. **Vercel** (Recommended)
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   
   # Set environment variables
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_ANON_KEY
   ```

2. **Netlify**
   ```bash
   # Build and deploy
   netlify deploy --prod
   
   # Set environment variables in Netlify dashboard
   ```

3. **GitHub Pages**
   ```bash
   # Update repository settings
   # Enable GitHub Pages
   # Set custom domain
   ```

---

## 🧪 Testing & Monitoring

### Testing Checklist

- [ ] **Donation Flow**
  - [ ] Donorbox form loads correctly
  - [ ] Test donation processes
  - [ ] Webhook receives donation data
  - [ ] Dashboard updates in real-time

- [ ] **Red Cross Finder**
  - [ ] Geolocation works
  - [ ] Manual search works
  - [ ] Map displays correctly
  - [ ] Links to Red Cross scheduling

- [ ] **Authentication**
  - [ ] Magic link sends correctly
  - [ ] Login modal works
  - [ ] User sessions persist

- [ ] **Dashboard**
  - [ ] Metrics load correctly
  - [ ] Real-time updates work
  - [ ] Quiz completions recorded
  - [ ] Progress bars animate

### Monitoring Tools

1. **Google Analytics 4**
   ```html
   <!-- Add to index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

2. **Supabase Dashboard**
   - Monitor database performance
   - Track real-time subscriptions
   - View authentication logs

3. **Donorbox Analytics**
   - Track donation conversions
   - Monitor campaign performance
   - Analyze donor behavior

---

## 🔧 Maintenance & Updates

### Regular Tasks

1. **Weekly**
   - Review donation metrics
   - Check webhook logs
   - Update Red Cross locations

2. **Monthly**
   - Review Google Analytics
   - Update donation goals
   - Backup database

3. **Quarterly**
   - Review and update content
   - Check API rate limits
   - Update dependencies

### Troubleshooting

**Common Issues:**

1. **Dashboard not updating**
   - Check Supabase connection
   - Verify real-time subscriptions
   - Check browser console for errors

2. **Donations not recording**
   - Verify webhook URL
   - Check webhook signature
   - Review server logs

3. **Maps not loading**
   - Check API key restrictions
   - Verify billing is enabled
   - Check API quotas

---

## 📞 Support & Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Donorbox API](https://donorbox.org/developer-docs)
- [Google Maps API](https://developers.google.com/maps/documentation)

### Community
- [Supabase Discord](https://discord.supabase.com)
- [Donorbox Support](https://donorbox.org/support)

### Emergency Contacts
- **Technical Issues**: Your development team
- **Donorbox Support**: support@donorbox.org
- **Supabase Support**: support@supabase.com

---

## 🎉 Launch Checklist

Before going live:

- [ ] All integrations tested
- [ ] Environment variables set
- [ ] SSL certificate installed
- [ ] Analytics configured
- [ ] Backup strategy in place
- [ ] Team trained on dashboard
- [ ] Emergency contact list ready
- [ ] Launch announcement prepared

**Ready to transform hemochromatosis awareness into lifesaving action! 🩸** 