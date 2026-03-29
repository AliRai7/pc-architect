# GitHub Hosting Guide for PC Architect

This guide will walk you through hosting your PC Architect 3D website on GitHub Pages for free.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create GitHub Repository](#create-github-repository)
3. [Configure Next.js for Static Export](#configure-nextjs-for-static-export)
4. [Push Code to GitHub](#push-code-to-github)
5. [Enable GitHub Pages](#enable-github-pages)
6. [Set Up GitHub Actions (Auto-Deploy)](#set-up-github-actions-auto-deploy)
7. [Custom Domain (Optional)](#custom-domain-optional)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, make sure you have:

1. **GitHub Account**: [Sign up here](https://github.com/join) (free)
2. **Git Installed**: [Download Git](https://git-scm.com/downloads)
3. **Node.js 18+**: [Download Node.js](https://nodejs.org/)
4. **Your Project**: The PC Architect code ready to deploy

---

## Create GitHub Repository

### Step 1: Create a New Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `pc-architect` (or any name you prefer)
   - **Description**: "Interactive 3D PC builder with exploded view"
   - **Visibility**: Public (for free GitHub Pages)
   - **Initialize with README**: ✅ Check this box
5. Click **"Create repository"**

### Step 2: Clone the Repository Locally

```bash
# Clone to your computer
git clone https://github.com/YOUR_USERNAME/pc-architect.git

# Navigate into the folder
cd pc-architect
```

---

## Configure Next.js for Static Export

### Step 1: Update next.config.js

Edit your `next.config.js` file:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/pc-architect', // Replace with your repo name
  assetPrefix: '/pc-architect/', // Replace with your repo name
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

**Important**: Replace `pc-architect` with your actual repository name.

### Step 2: Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next build",
    "deploy": "next build && touch dist/.nojekyll"
  }
}
```

### Step 3: Create .nojekyll File

GitHub Pages uses Jekyll by default, which can interfere with Next.js. Create an empty file:

```bash
# Create .nojekyll file in public folder
touch public/.nojekyll
```

This tells GitHub Pages to skip Jekyll processing.

---

## Push Code to GitHub

### Step 1: Copy Your Project Files

Copy all your PC Architect files into the cloned repository folder:

```bash
# If your project is elsewhere, copy files
cp -r /path/to/your/pc-architect/* .
```

### Step 2: Commit and Push

```bash
# Add all files
git add .

# Commit with a message
git commit -m "Initial commit: PC Architect 3D website"

# Push to GitHub
git push origin main
```

---

## Enable GitHub Pages

### Step 1: Go to Repository Settings

1. Open your repository on GitHub
2. Click **"Settings"** tab
3. Scroll down to **"Pages"** in the left sidebar

### Step 2: Configure GitHub Pages

1. Under **"Source"**, select **"Deploy from a branch"**
2. Under **"Branch"**, select:
   - Branch: `main`
   - Folder: `/root` (or `/docs` if you prefer)
3. Click **"Save"**

### Step 3: Wait for Deployment

- GitHub will build and deploy your site
- This takes 1-5 minutes
- Refresh the page to see the deployment status

### Step 4: Access Your Site

Once deployed, your site will be available at:

```
https://YOUR_USERNAME.github.io/pc-architect/
```

**Example**: `https://johndoe.github.io/pc-architect/`

---

## Set Up GitHub Actions (Auto-Deploy)

For automatic deployment on every push, set up GitHub Actions:

### Step 1: Create Workflow File

Create the directory and file:

```bash
mkdir -p .github/workflows
touch .github/workflows/deploy.yml
```

### Step 2: Add Workflow Configuration

Edit `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install Dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Add .nojekyll
      run: touch dist/.nojekyll
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Step 3: Commit and Push

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

Now every push to `main` will automatically deploy your site!

---

## Custom Domain (Optional)

### Step 1: Purchase a Domain

Buy a domain from:
- [Namecheap](https://namecheap.com)
- [Google Domains](https://domains.google)
- [Cloudflare](https://cloudflare.com)

### Step 2: Add Domain to GitHub

1. Go to repository **Settings** → **Pages**
2. Under **"Custom domain"**, enter your domain
3. Click **"Save"**

### Step 3: Configure DNS

Add these DNS records at your domain registrar:

**For Apex Domain (example.com)**:
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

**For WWW (www.example.com)**:
```
Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

### Step 4: Create CNAME File

Create `public/CNAME`:

```
yourdomain.com
```

Commit and push:

```bash
git add public/CNAME
git commit -m "Add custom domain"
git push origin main
```

### Step 5: Enable HTTPS

1. In GitHub Pages settings
2. Check **"Enforce HTTPS"**
3. Wait for SSL certificate (can take up to 24 hours)

---

## Troubleshooting

### Issue: "404 File Not Found"

**Solution**: Check your `basePath` in `next.config.js`:

```javascript
// Must match your repository name
basePath: '/pc-architect',
```

### Issue: Styles Not Loading

**Solution**: Add `assetPrefix`:

```javascript
// next.config.js
assetPrefix: '/pc-architect/',
```

### Issue: Images Not Showing

**Solution**: Use unoptimized images:

```javascript
// next.config.js
images: {
  unoptimized: true,
}
```

### Issue: 3D Models Not Loading

**Solution**: Place models in `public/models/` and reference with relative paths:

```typescript
// Use relative paths
const modelPath = '/pc-architect/models/pc.glb';
```

### Issue: Routing Not Working

**Solution**: Add `trailingSlash`:

```javascript
// next.config.js
trailingSlash: true,
```

### Issue: Build Fails

**Solution**: Check build logs:

```bash
# Run build locally to see errors
npm run build
```

Common fixes:
- Update Node.js to 18+
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

### Issue: Changes Not Deploying

**Solution**: 
1. Check GitHub Actions tab for build errors
2. Clear browser cache (Ctrl+Shift+R)
3. Wait 5-10 minutes for deployment

---

## Quick Reference Commands

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/pc-architect.git

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# Check status
git status

# View commit history
git log --oneline
```

---

## Next Steps

After successful deployment:

1. **Test Your Site**: Visit the URL and test all features
2. **Share**: Share your GitHub URL with others
3. **Monitor**: Check GitHub Actions for deployment status
4. **Update**: Make changes and push to update your site

---

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Your 3D PC website will be live at:**
```
https://YOUR_USERNAME.github.io/pc-architect/
```

Happy deploying! 🚀
