# Security Guide for PC Architect 3D Website

## Overview

This document outlines security best practices and configurations for the PC Architect 3D website to prevent common vulnerabilities and attacks.

## Security Headers Configuration

### next.config.js Security Headers

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; frame-ancestors 'self'; base-uri 'self'; form-action 'self';",
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

## Dependency Security

### Regular Auditing

```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Check for outdated packages
npm outdated
```

### Secure Package Installation

```bash
# Use exact versions in package.json
# Avoid ^ or ~ prefixes for critical dependencies

# Example secure package.json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
```

## WebGL/Three.js Security Considerations

### 1. Shader Injection Prevention

```typescript
// BAD: Direct user input in shaders
const userColor = getUserInput();
const shader = `color = ${userColor};`; // DANGEROUS

// GOOD: Validate and sanitize inputs
const allowedColors = ['#7C3AED', '#00F0FF', '#C6FF00'];
const userColor = getUserInput();
if (allowedColors.includes(userColor)) {
  const shader = `color = ${userColor};`;
}
```

### 2. Texture Loading Security

```typescript
// Validate texture URLs
const allowedDomains = ['localhost', 'your-cdn.com'];

function isValidTextureUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return allowedDomains.includes(parsed.hostname);
  } catch {
    return false;
  }
}

// Use in component
const textureUrl = getTextureUrl();
if (isValidTextureUrl(textureUrl)) {
  const texture = useLoader(THREE.TextureLoader, textureUrl);
}
```

### 3. Model Loading Security

```typescript
// Validate GLTF/GLB models before loading
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const validateGLB = (buffer: ArrayBuffer): boolean => {
  const header = new Uint32Array(buffer, 0, 2);
  const magic = header[0];
  const version = header[1];
  
  // GLB magic number: 0x46546C67 (glTF in ASCII)
  return magic === 0x46546C67 && (version === 1 || version === 2);
};

// Use with loader
const loader = new GLTFLoader();
loader.load(url, (gltf) => {
  // Validate before using
  if (gltf.scene) {
    scene.add(gltf.scene);
  }
});
```

## Client-Side Security

### 1. XSS Prevention

```typescript
// Sanitize user inputs
import DOMPurify from 'dompurify';

const userInput = '<script>alert("xss")</script>';
const clean = DOMPurify.sanitize(userInput);

// Use in component
<div dangerouslySetInnerHTML={{ __html: clean }} />
```

### 2. State Management Security

```typescript
// Never store sensitive data in client-side state
// BAD
const useStore = create(() => ({
  apiKey: 'sk-1234567890', // NEVER DO THIS
}));

// GOOD
const useStore = create(() => ({
  // Only store UI state
  isPanelOpen: false,
  selectedComponent: null,
}));
```

### 3. Event Handler Security

```typescript
// Validate event data
const handleClick = (event: React.MouseEvent) => {
  // Prevent event bubbling attacks
  event.stopPropagation();
  
  // Validate target
  const target = event.target as HTMLElement;
  if (!target.dataset.componentId) return;
  
  // Use validated data
  selectComponent(target.dataset.componentId);
};
```

## Build Security

### Environment Variables

```bash
# .env.local - NEVER commit this file
# Add to .gitignore

# Public variables (accessible in browser)
NEXT_PUBLIC_SITE_URL=https://your-site.com

# Private variables (server-side only)
# API_KEY=secret_key_here
```

### Build Configuration

```javascript
// next.config.js
module.exports = {
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Disable X-Powered-By header
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
};
```

## Deployment Security

### Vercel Security Settings

1. **Enable HTTPS Only**
   - Force all traffic to HTTPS
   - Enable HSTS

2. **Configure Environment Variables**
   - Store secrets in Vercel dashboard
   - Never expose API keys to client

3. **Set Security Headers**
   - Use the headers configuration above
   - Test with securityheaders.com

4. **Enable DDoS Protection**
   - Vercel provides basic DDoS protection
   - Consider Cloudflare for additional protection

### GitHub Security

1. **Branch Protection**
   - Require pull request reviews
   - Require status checks to pass
   - Restrict push to main branch

2. **Dependency Updates**
   - Enable Dependabot alerts
   - Enable automatic security updates

3. **Secret Scanning**
   - Enable secret scanning
   - Add custom patterns if needed

## Security Checklist

### Pre-Deployment

- [ ] Run `npm audit` and fix issues
- [ ] Verify no secrets in code
- [ ] Check .gitignore includes sensitive files
- [ ] Test security headers
- [ ] Validate CSP policy
- [ ] Check for console.log statements
- [ ] Verify no debugger statements

### Post-Deployment

- [ ] Test HTTPS enforcement
- [ ] Verify security headers with securityheaders.com
- [ ] Test XSS vulnerabilities
- [ ] Verify CORS settings
- [ ] Check for information disclosure
- [ ] Monitor for errors

## Common Vulnerabilities to Avoid

### 1. Prototype Pollution

```typescript
// BAD
const obj = {};
const key = '__proto__';
obj[key] = { polluted: true }; // Pollutes all objects

// GOOD
const obj = Object.create(null); // No prototype
const key = '__proto__';
if (key !== '__proto__' && key !== 'constructor') {
  obj[key] = value;
}
```

### 2. ReDoS (Regular Expression Denial of Service)

```typescript
// BAD - Catastrophic backtracking
const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
emailRegex.test('a@' + 'a'.repeat(100) + '.com'); // Hangs

// GOOD - Use simple validation
const isValidEmail = (email: string): boolean => {
  return email.length < 254 && email.includes('@');
};
```

### 3. Insecure Randomness

```typescript
// BAD - Predictable
const token = Math.random().toString(36);

// GOOD - Cryptographically secure
import { randomBytes } from 'crypto';
const token = randomBytes(32).toString('hex');
```

## Security Testing

### Manual Testing

```bash
# Test security headers
curl -I https://your-site.com

# Test for XSS
curl "https://your-site.com/?q=<script>alert(1)</script>"

# Test for SQL injection (if applicable)
curl "https://your-site.com/api?id=1' OR '1'='1"
```

### Automated Scanning

- Use OWASP ZAP for vulnerability scanning
- Use Snyk for dependency scanning
- Use Lighthouse for security audits

## Incident Response

### If Compromised

1. **Immediate Actions**
   - Take site offline if necessary
   - Rotate all secrets/keys
   - Check access logs

2. **Investigation**
   - Identify attack vector
   - Determine scope of breach
   - Preserve evidence

3. **Recovery**
   - Patch vulnerabilities
   - Restore from clean backup
   - Monitor for re-attack

4. **Post-Incident**
   - Document lessons learned
   - Update security measures
   - Notify affected users if required

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Snyk Vulnerability Database](https://snyk.io/vuln)

---

**Last Updated:** 2024
**Review Schedule:** Quarterly
