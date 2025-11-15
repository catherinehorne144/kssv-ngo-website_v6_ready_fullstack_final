# Karungu Survivors of Sexual Violence (KSSV) Website

A modern, responsive NGO website built with Next.js, React, and Tailwind CSS. This website provides comprehensive information about KSSV's mission, programs, and impact while offering multiple ways for visitors to get involved and support survivors of sexual violence.

## 🌟 Features

- **Modern Design**: Vibrant, colorful design with professional aesthetics
- **Dark Mode**: Full dark/light theme support with smooth transitions
- **Responsive Design**: Mobile-first design that works beautifully on all devices
- **Smooth Animations**: Framer Motion animations with scroll-reveal effects
- **PWA Support**: Installable as a Progressive Web App with offline functionality
- **Comprehensive Sections**:
  - Hero with parallax background and animated elements
  - About Us with mission, vision, and values
  - Programs showcase with detailed modals
  - Impact metrics with animated counters
  - Projects gallery with filtering
  - Testimonials carousel
  - Dedicated blog system with individual post pages
  - Get Involved forms (volunteer, membership, partnership)
  - Donation system (MPesa & PayPal)
  - Contact form
- **SEO Optimized**: 
  - Comprehensive meta tags and Open Graph
  - Schema.org structured data
  - Dynamic sitemap and robots.txt
  - Twitter Cards
- **Accessible**: 
  - WCAG 2.1 AA compliant
  - ARIA labels and semantic HTML
  - Keyboard navigation
  - Skip-to-content link
  - Screen reader support
- **Performance Optimized**:
  - AVIF/WebP image formats
  - SWC minification
  - Code splitting
  - Lazy loading
- **Analytics Ready**:
  - Vercel Analytics integration
  - Vercel Speed Insights
  - Optional Google Analytics support
- **Integration Ready**: Code comments for connecting to Airtable, SheetDB, Firebase, MPesa, and PayPal

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone or download the repository**

\`\`\`bash
git clone https://github.com/yourusername/kssv-website.git
cd kssv-website
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. **Set up environment variables (optional for development)**

\`\`\`bash
cp .env.example .env.local
\`\`\`

The dummy values in `.env.example` will allow the site to run without errors. Forms will show success messages but won't actually store data.

4. **Run the development server**

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect Next.js and deploy
5. Set environment variables in Vercel dashboard

**Vercel automatically provides:**
- Analytics (no configuration needed)
- Speed Insights (no configuration needed)
- Image optimization
- CDN and edge caching

### Deploy to Netlify

See `DEPLOYMENT.md` for detailed instructions.

### Deploy to GitHub Pages

See `DEPLOYMENT.md` for detailed instructions.

## 🔧 Configuration

### Environment Variables

**For Development/Testing:**

1. Copy the example environment file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

2. The dummy values in `.env.example` will allow the site to run without errors. Forms will show success messages but won't actually store data, and payments will simulate the flow without processing real transactions.

3. When ready to go live, replace the dummy values with real credentials from the respective services.

**Environment Variables Explained:**

- `NEXT_PUBLIC_BASE_URL`: Your website URL (use `http://localhost:3000` for development)
- `AIRTABLE_API_KEY` & `AIRTABLE_BASE_ID`: For storing form submissions in Airtable
- `NEXT_PUBLIC_FIREBASE_*`: For using Firebase/Firestore as form backend
- `MPESA_*`: For processing MPesa mobile payments (Kenya)
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: For processing PayPal payments
- `SENDGRID_API_KEY` or `RESEND_API_KEY`: For sending contact form emails
- `NEXT_PUBLIC_GA_ID`: For Google Analytics tracking (optional - leave empty to use only Vercel Analytics)
- `SHEETDB_API_URL`: For storing form data in Google Sheets
- `FORMSPREE_FORM_ID`: For simple form handling via Formspree

**Important Security Notes:**
- Never commit `.env.local` to version control (it's already in `.gitignore`)
- Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Keep API secrets (MPesa, Airtable, SendGrid) server-side only
- Use API routes for sensitive operations

### Backend Integration

See `INTEGRATION_GUIDE.md` for detailed step-by-step instructions on connecting:
- Airtable
- SheetDB
- Firebase/Firestore
- Formspree
- MPesa Daraja API
- PayPal
- Email services (SendGrid/Resend)

## 🎨 Customization

### Theme & Colors

The website uses a vibrant color palette with teal, green, coral, sunny yellow, purple, and sky blue accents. Update colors in `app/globals.css`:

\`\`\`css
:root {
  --brand-teal: oklch(0.58 0.12 195);
  --brand-green: oklch(0.75 0.1 155);
  --brand-coral: oklch(0.68 0.18 25);
  --brand-sunny: oklch(0.85 0.15 85);
  --brand-purple: oklch(0.62 0.15 300);
  --brand-sky: oklch(0.75 0.12 230);
}
\`\`\`

Dark mode colors are automatically adjusted for optimal contrast.

### Fonts

The website uses three fonts:
- **Playfair Display** (serif) for headings
- **Inter** (sans-serif) for body text
- **Outfit** (accent) for CTAs

Change fonts in `app/layout.tsx`:

\`\`\`typescript
import { Cute_Font as YourFont } from 'next/font/google'

const yourFont = YourFont({ 
  subsets: ['latin'], 
  variable: '--font-your-font',
  display: 'swap'
})
\`\`\`

### Content

Update content directly in the component files:
- Hero: `components/hero.tsx`
- About: `components/about.tsx`
- Programs: `components/programs.tsx`
- Projects: `components/projects.tsx`
- Blog posts: `lib/blog-data.ts`

### Images

Replace placeholder images in the `/public` directory with your own images. Maintain the same filenames or update the references in components.

## 📊 Analytics & Monitoring

### Vercel Analytics (Included)

Vercel Analytics and Speed Insights are automatically enabled when deployed to Vercel. No configuration needed.

**Features:**
- Real-time visitor analytics
- Page views and unique visitors
- Top pages and referrers
- Device and browser distribution
- Core Web Vitals monitoring

### Google Analytics (Optional)

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Add to your `.env.local`:

\`\`\`
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
\`\`\`

4. The GoogleAnalytics component is already integrated in the layout

### Performance Monitoring

See `PERFORMANCE.md` for:
- Performance optimization strategies
- Core Web Vitals targets
- Monitoring guidelines
- Troubleshooting tips

**Performance Targets:**
- Lighthouse Performance: ≥ 90
- Lighthouse Accessibility: ≥ 95
- Lighthouse SEO: ≥ 95
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## ♿ Accessibility

This website follows WCAG 2.1 Level AA guidelines:

- Semantic HTML elements (`<main>`, `<nav>`, `<article>`, etc.)
- ARIA labels and roles for interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Skip-to-content link for keyboard users
- High contrast text (tested in both light and dark modes)
- Alt text for all images
- Screen reader friendly
- Focus indicators on all interactive elements
- Proper heading hierarchy

## 🔒 Security

- All forms include client-side validation
- API keys stored in environment variables
- Use API routes for sensitive operations
- Implement rate limiting for form submissions
- Sanitize user inputs on the backend
- HTTPS enforced in production
- Content Security Policy headers

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Progressive Web App (PWA)

The website can be installed as a PWA:

**Features:**
- Offline functionality via Service Worker
- Install prompt for supported browsers
- App-like experience on mobile devices
- Fast loading with caching strategies

**To install:**
1. Visit the website on a supported browser
2. Look for the install prompt (or use browser menu)
3. Click "Install" to add to home screen

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📚 Documentation

- `README.md` - This file (overview and quick start)
- `DEPLOYMENT.md` - Detailed deployment instructions
- `INTEGRATION_GUIDE.md` - Backend integration step-by-step
- `PERFORMANCE.md` - Performance optimization guide

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support:
- Email: info@kssv.org
- Phone: +254 700 000 000
- Website: https://kssv.org

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Animations with [Framer Motion](https://www.framer.com/motion/)
- Theme management with [next-themes](https://github.com/pacocoursey/next-themes)
- Analytics by [Vercel](https://vercel.com/analytics)

## 🎯 Roadmap

- [ ] Multi-language support (English/Swahili)
- [ ] Admin dashboard for content management
- [ ] Real-time donation tracking
- [ ] Newsletter subscription
- [ ] Event calendar
- [ ] Volunteer portal

---

**Made with ❤️ for Karungu Survivors of Sexual Violence**

© 2025 – 2027 Karungu Survivors of Sexual Violence. All rights reserved.


# KSSV NGO Website - v6 Ready (Supabase + Vercel)

This package is a ready-to-deploy Next.js project prewired to use **Supabase** (Auth, Database, Storage)
and optimized for **Vercel** deployment.

## Quick setup steps (summary)

1. Create a Supabase project at https://supabase.com and note these values:
   - Project URL
   - anon public key
   - service_role key (keep secret)

2. In the Supabase project:
   - Open **SQL Editor** and paste the contents of `supabase_schema.sql` then Run.
   - Open **Storage** and create buckets:
     - `carousel`
     - `projects`
     - `partners`
     - `blog`
     - `branding`
   - (Optional) Configure CORS and Edge settings as needed.

3. Copy `.env.example` to `.env.local` and fill in your keys:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
4. Install dependencies and run locally:
```
pnpm install
pnpm dev
```
5. Deploy to Vercel:
   - Push to GitHub and import to Vercel or upload the project.
   - Set Environment Variables in Vercel (same as in `.env.local`).
   - Deploy.

## Admin & Auth

This build uses **Supabase Auth** (email/password). Admins can be invited from the Admin panel (Invite Admin form)
which will create a new Supabase Auth user. Protect admin routes with the provided `middleware.ts`.

## Image Uploads

Uploads use client-side compression to WebP (recommended) and store images in Supabase Storage buckets noted above.
The Admin panels include upload UI with previews and progress bars.

## Notes & Caveats

- Do NOT commit your `SUPABASE_SERVICE_ROLE_KEY` to public repos. Add to Vercel env vars only.
- This package includes placeholder assets in `/public/default-assets` to make the site look complete immediately.
- If you want automated email invites (magic links), configure SMTP in Supabase (not enabled by default).