# Digital Bite — Premium Digital Marketplace

A modern, high-conversion digital product store built with Next.js 14, TailwindCSS, and SQLite. Inspired by the **Neon Glass Ethos** design system from Stitch AI.

---

## ✨ Features

- 🎨 **Neon Glass design** — glassmorphism, neon glows, premium dark theme
- 🛒 **Full order system** — no Stripe required, COD + digital payment
- 📧 **Email delivery** — auto-send download links after order
- 🔐 **Secure downloads** — token-based, expiry + download limits
- 🔗 **Webhook integration** — connect n8n, Zapier, Make
- 🛡️ **Admin dashboard** — manage products, view orders, analytics
- 📱 **Mobile responsive** — works on all screen sizes
- ⚡ **Fast & SEO-ready** — Next.js App Router with SSR

---

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-repo/digitalbite
cd digitalbite
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 3. Run development server

```bash
npm run dev
# Open http://localhost:3000
```

The SQLite database and sample products are created automatically on first run.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── products/
│   │   ├── page.tsx               # Product listing + filters
│   │   └── [slug]/page.tsx        # Product detail page
│   ├── checkout/page.tsx           # Checkout form
│   ├── confirmation/page.tsx       # Order confirmation
│   ├── admin/
│   │   ├── page.tsx               # Admin dashboard
│   │   ├── orders/page.tsx        # Order management
│   │   └── products/              # Product CRUD
│   └── api/
│       ├── orders/                # Order API
│       ├── products/              # Products API
│       ├── download/[token]/      # Secure file delivery
│       ├── newsletter/            # Newsletter signup
│       └── admin/                 # Upload + analytics
├── components/
│   ├── layout/                    # Navbar, Footer
│   ├── home/                      # Hero, Categories, FAQ, etc.
│   ├── product/                   # ProductCard
│   └── admin/                     # ProductForm
└── lib/
    ├── db.ts                      # SQLite + auto-schema
    ├── email.ts                   # Nodemailer email
    ├── security.ts                # Token generation
    └── webhook.ts                 # n8n/automation webhook
```

---

## ⚙️ Configuration

### Email (SMTP)

Use any SMTP provider. For Gmail:

1. Enable 2FA on your Google account
2. Generate an App Password at myaccount.google.com/apppasswords
3. Set `SMTP_USER` and `SMTP_PASS` in `.env.local`

For production, use [Resend](https://resend.com) or [Brevo](https://brevo.com).

### Admin Access

The admin panel is at `/admin`. All admin API routes require the `x-admin-token` header matching `ADMIN_TOKEN` in your env.

**Set a strong token** in production:
```bash
openssl rand -hex 32
```

### n8n Webhook

Set `WEBHOOK_URL` to your n8n webhook URL. On every new order, Digital Bite sends:

```json
{
  "event": "order.created",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "order": {
    "order_number": "DB-ABC123-XYZ",
    "product_name": "...",
    "customer_name": "...",
    "customer_phone": "...",
    "customer_email": "...",
    "total_price": 49.99
  }
}
```

### Digital File Delivery

1. Upload product files via Admin → Edit Product → Upload File
2. Files are stored in `/uploads` (never committed to git)
3. Secure download tokens expire after **48 hours** and allow **5 downloads**

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

**Important:** SQLite doesn't persist on serverless. For production, either:
- Use **Vercel + PlanetScale/Turso** (swap `better-sqlite3` for Turso client)
- Deploy to a **VPS** (DigitalOcean, Hetzner, Railway) where the filesystem persists

### Railway (VPS-style, recommended for SQLite)

1. Push to GitHub
2. Connect Railway to your repo
3. Add environment variables in Railway dashboard
4. Railway auto-deploys on push

### Cloudflare Pages

Cloudflare Pages doesn't support Node.js filesystem APIs. Use the **Cloudflare D1** adapter instead of SQLite, or deploy the API separately to Cloudflare Workers.

---

## 🔧 Adding Products

### Via Admin Dashboard
1. Go to `/admin/products/new`
2. Fill in product details
3. Upload the digital file
4. Click "Create Product"

### Via API

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-admin-token: your-admin-token" \
  -d '{
    "name": "My Product",
    "description": "Full description here",
    "short_description": "One-liner",
    "price": 29.99,
    "original_price": 59.99,
    "category": "courses",
    "image_url": "https://...",
    "tags": ["tag1", "tag2"],
    "featured": true
  }'
```

---

## 🔒 Security Notes

- Download files are **never served directly** — always through the token API
- Admin routes require `ADMIN_TOKEN` — never expose this client-side
- `NEXT_PUBLIC_ADMIN_TOKEN` is only for development; remove it in production
- The `uploads/` directory should not be web-accessible directly
- Set `X-Robots-Tag: noindex` on download responses (already done)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | TailwindCSS + custom design tokens |
| Database | SQLite via better-sqlite3 |
| Email | Nodemailer |
| Fonts | Plus Jakarta Sans, Inter, Manrope |
| Icons | Material Symbols |
| Deployment | Vercel / Railway |

---

## 📞 Support

- WhatsApp: Configured via `NEXT_PUBLIC_WHATSAPP_NUMBER`
- Email: Configured via `ADMIN_EMAIL`

---

© 2024 Digital Bite. The Digital Nebula Experience.
