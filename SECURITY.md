# Security Checklist & Guidelines

## 🔐 Critical Security Requirements

### ✅ Pre-Deployment Checklist

- [ ] **API Keys Secured**
  - [ ] Google Maps API key replaced with environment variable
  - [ ] Supabase keys moved to environment variables
  - [ ] No hardcoded secrets in source code
  - [ ] API keys restricted to specific domains

- [ ] **HTTPS Enforcement**
  - [ ] SSL certificate installed
  - [ ] HTTP to HTTPS redirect configured
  - [ ] HSTS headers enabled
  - [ ] Mixed content warnings resolved

- [ ] **Content Security Policy**
  - [ ] CSP headers configured
  - [ ] Script sources whitelisted
  - [ ] Style sources restricted
  - [ ] Frame sources controlled

- [ ] **Input Validation**
  - [ ] Email validation implemented
  - [ ] Form inputs sanitized
  - [ ] XSS prevention measures
  - [ ] CSRF protection enabled

### 🔒 Security Headers

Add these headers to your server configuration:

```apache
# Apache (.htaccess)
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
```

```nginx
# Nginx
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
```

### 🛡️ Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.supabase.co https://donorbox.org;
  frame-src https://donorbox.org;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
">
```

## 🔍 Security Testing

### Automated Security Scans

```bash
# Install security tools
npm install -g security-checker
npm install -g snyk

# Run security checks
security-checker --url https://your-domain.com
snyk test
```

### Manual Security Testing

- [ ] **Cross-Site Scripting (XSS)**
  - [ ] Test form inputs with script tags
  - [ ] Verify output encoding
  - [ ] Check for reflected XSS

- [ ] **Cross-Site Request Forgery (CSRF)**
  - [ ] Test form submissions
  - [ ] Verify token validation
  - [ ] Check for CSRF protection

- [ ] **Information Disclosure**
  - [ ] Check for exposed API keys
  - [ ] Verify error messages don't leak info
  - [ ] Test for directory traversal

- [ ] **Authentication & Authorization**
  - [ ] Test magic link security
  - [ ] Verify session management
  - [ ] Check for privilege escalation

## 🚨 Security Incidents

### Incident Response Plan

1. **Detection**
   - Monitor logs for suspicious activity
   - Set up alerts for failed login attempts
   - Watch for unusual traffic patterns

2. **Response**
   - Immediately revoke compromised credentials
   - Block suspicious IP addresses
   - Update security measures

3. **Recovery**
   - Restore from clean backup
   - Update all passwords and keys
   - Implement additional security measures

4. **Post-Incident**
   - Document the incident
   - Update security procedures
   - Conduct security audit

### Emergency Contacts

- **Security Team**: security@rewritethecurse.org
- **Hosting Provider**: [Your hosting provider support]
- **Domain Registrar**: [Your domain registrar support]

## 📋 Regular Security Maintenance

### Monthly Tasks

- [ ] Update dependencies and packages
- [ ] Review access logs for suspicious activity
- [ ] Test backup and recovery procedures
- [ ] Update security documentation

### Quarterly Tasks

- [ ] Conduct security audit
- [ ] Review and update security policies
- [ ] Test incident response procedures
- [ ] Update SSL certificates

### Annual Tasks

- [ ] Comprehensive security assessment
- [ ] Penetration testing
- [ ] Security training for team
- [ ] Update disaster recovery plan

## 🔧 Security Configuration

### Environment Variables

```env
# Production environment variables
NODE_ENV=production
GOOGLE_MAPS_API_KEY=your_restricted_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DONORBOX_WEBHOOK_SECRET=your_webhook_secret
SESSION_SECRET=your_session_secret
```

### API Key Restrictions

#### Google Maps API
- Restrict to your domain only
- Enable billing alerts
- Monitor usage regularly
- Use least privilege principle

#### Supabase
- Use Row Level Security (RLS)
- Restrict database access
- Monitor query logs
- Regular key rotation

### Database Security

```sql
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

## 📊 Security Monitoring

### Log Monitoring

Monitor these logs regularly:
- Web server access logs
- Application error logs
- Database query logs
- Authentication logs

### Security Metrics

Track these metrics:
- Failed login attempts
- Suspicious IP addresses
- Unusual traffic patterns
- API usage anomalies

### Alerting

Set up alerts for:
- Multiple failed login attempts
- Unusual traffic spikes
- API key usage anomalies
- Security header violations

## 🛠️ Security Tools

### Recommended Tools

- **Static Analysis**: ESLint with security plugins
- **Dependency Scanning**: Snyk, npm audit
- **Vulnerability Scanning**: OWASP ZAP
- **Monitoring**: Sentry, LogRocket
- **Backup**: Automated daily backups

### Security Headers Testing

```bash
# Test security headers
curl -I https://your-domain.com

# Expected headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
```

## 📚 Security Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Security Guidelines](https://infosec.mozilla.org/guidelines/)
- [Google Security Best Practices](https://developers.google.com/web/fundamentals/security/)

### Tools
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

### Training
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)

---

**Remember: Security is an ongoing process, not a one-time task.** 