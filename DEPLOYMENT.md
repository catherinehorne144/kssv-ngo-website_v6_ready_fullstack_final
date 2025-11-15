# Deployment Guide

This guide provides detailed instructions for deploying the KSSV website to various hosting platforms.

## Prerequisites

Before deploying, ensure you have:
- Completed all backend integrations (forms, payments)
- Tested the website locally
- Replaced all placeholder content and images
- Set up environment variables
- Configured analytics (optional)

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest option for Next.js applications and offers excellent performance.

#### Steps:

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/kssv-website.git
   git push -u origin main
   \`\`\`

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from your `.env.local` file
   - Remember to add them for Production, Preview, and Development environments

4. **Deploy**
   - Click "Deploy"
   - Your site will be live at `your-project.vercel.app`

5. **Custom Domain**
   - Go to Settings → Domains
   - Add your custom domain (e.g., kssv.org)
   - Follow DNS configuration instructions

#### Automatic Deployments

Vercel automatically deploys:
- Production: When you push to `main` branch
- Preview: When you create a pull request

### 2. Netlify

Netlify is another excellent option with similar features to Vercel.

#### Steps:

1. **Push to GitHub** (same as Vercel)

2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18 or higher

4. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add all variables from `.env.local`

5. **Deploy**
   - Click "Deploy site"
   - Your site will be live at `random-name.netlify.app`

6. **Custom Domain**
   - Go to Domain settings
   - Add custom domain and configure DNS

### 3. GitHub Pages

GitHub Pages is free but requires static export (some Next.js features won't work).

#### Steps:

1. **Update next.config.mjs**
   \`\`\`javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   }
   
   export default nextConfig
   \`\`\`

2. **Create GitHub Actions Workflow**
   
   Create `.github/workflows/deploy.yml`:
   \`\`\`yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [main]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3
         
         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: npm run build
         
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   \`\`\`

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`

4. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push
   \`\`\`

**Note**: GitHub Pages doesn't support server-side features. Forms and API routes won't work. Use client-side integrations only.

### 4. Self-Hosted (VPS/Dedicated Server)

For full control, you can host on your own server.

#### Requirements:
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+
- Nginx or Apache
- SSL certificate (Let's Encrypt recommended)

#### Steps:

1. **Set up server**
   \`\`\`bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2 (process manager)
   sudo npm install -g pm2
   \`\`\`

2. **Clone repository**
   \`\`\`bash
   cd /var/www
   git clone https://github.com/yourusername/kssv-website.git
   cd kssv-website
   \`\`\`

3. **Install dependencies and build**
   \`\`\`bash
   npm install
   npm run build
   \`\`\`

4. **Create environment file**
   \`\`\`bash
   nano .env.local
   # Add your environment variables
   \`\`\`

5. **Start with PM2**
   \`\`\`bash
   pm2 start npm --name "kssv-website" -- start
   pm2 save
   pm2 startup
   \`\`\`

6. **Configure Nginx**
   \`\`\`nginx
   server {
       listen 80;
       server_name kssv.org www.kssv.org;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   \`\`\`

7. **Set up SSL with Let's Encrypt**
   \`\`\`bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d kssv.org -d www.kssv.org
   \`\`\`

## Post-Deployment Checklist

After deploying, verify:

- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Forms submit successfully
- [ ] Donation flows work (test mode)
- [ ] Navigation works smoothly
- [ ] Mobile responsiveness
- [ ] SSL certificate is active (HTTPS)
- [ ] Analytics tracking works
- [ ] SEO meta tags are correct
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Contact information is correct
- [ ] Social media links work

## Monitoring & Maintenance

### Performance Monitoring

1. **Google PageSpeed Insights**
   - Test at [pagespeed.web.dev](https://pagespeed.web.dev)
   - Aim for 90+ score

2. **Vercel Analytics** (if using Vercel)
   - Automatically enabled
   - View in Vercel dashboard

3. **Uptime Monitoring**
   - Use services like UptimeRobot or Pingdom
   - Set up alerts for downtime

### Regular Updates

- Update dependencies monthly: `npm update`
- Review and update content regularly
- Monitor form submissions
- Check analytics for user behavior
- Test payment integrations monthly

## Troubleshooting

### Build Fails

- Check Node.js version (must be 18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### Forms Not Working

- Verify environment variables are set
- Check API endpoint URLs
- Review browser console for errors
- Test backend integration separately

### Images Not Loading

- Ensure images are in `/public` directory
- Check file paths are correct
- Verify image optimization settings

### Slow Performance

- Enable caching in hosting platform
- Optimize images (use WebP format)
- Minimize JavaScript bundles
- Use CDN for static assets

## Support

For deployment issues:
- Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
- Vercel support: [vercel.com/support](https://vercel.com/support)
- Community forums: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)

---

**Need help?** Contact the development team or refer to the main README.md for additional information.
