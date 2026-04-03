import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = path.join(process.cwd(), 'data', 'digitalbite.db')

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initializeSchema()
  }
  return db
}

function initializeSchema() {
  const database = db

  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      short_description TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      category TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      image_url TEXT NOT NULL,
      preview_images TEXT DEFAULT '[]',
      file_path TEXT,
      file_name TEXT,
      download_count INTEGER DEFAULT 0,
      max_downloads INTEGER DEFAULT 100,
      featured INTEGER DEFAULT 0,
      is_bestseller INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 1,
      rating REAL DEFAULT 5.0,
      review_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      product_price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      total_price REAL NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      customer_city TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'cash',
      status TEXT NOT NULL DEFAULT 'pending',
      download_token TEXT,
      download_expires_at TEXT,
      download_count INTEGER DEFAULT 0,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS download_links (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      download_count INTEGER DEFAULT 0,
      max_downloads INTEGER DEFAULT 5,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
    CREATE INDEX IF NOT EXISTS idx_download_links_token ON download_links(token);
  `)

  // Seed sample products if empty
  const count = database.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number }
  if (count.count === 0) {
    seedSampleData(database)
  }
}

function seedSampleData(database: Database.Database) {
  const { v4: uuidv4 } = require('uuid')

  const products = [
    {
      id: uuidv4(), name: 'Mastering UI/UX Design Course', slug: 'mastering-uiux-design-course',
      description: 'The ultimate comprehensive guide to high-end interface design, visual hierarchy, and digital product strategy. Learn from industry experts and build a portfolio that gets you hired. Includes 40+ hours of video content, project files, design templates, and lifetime access to community updates.',
      short_description: 'Complete UI/UX course with 40+ hours of content, templates, and lifetime access.',
      price: 49.99, original_price: 99.99, category: 'courses',
      tags: JSON.stringify(['design', 'ui', 'ux', 'figma', 'course']),
      image_url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80',
      preview_images: JSON.stringify([
        'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
      ]),
      featured: 1, is_bestseller: 1, is_new: 0, rating: 4.9, review_count: 2847, max_downloads: 999
    },
    {
      id: uuidv4(), name: 'Next.js SaaS Starter Kit', slug: 'nextjs-saas-starter-kit',
      description: 'Production-ready Next.js 14 boilerplate with authentication, billing, dashboard, API routes, and everything you need to launch your SaaS in days not months. Built with TypeScript, Tailwind CSS, Prisma, and integrated payment processing.',
      short_description: 'Launch your SaaS in days with this complete Next.js 14 boilerplate.',
      price: 79.99, original_price: 149.99, category: 'templates',
      tags: JSON.stringify(['nextjs', 'saas', 'boilerplate', 'typescript']),
      image_url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80',
      preview_images: JSON.stringify([
        'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80',
      ]),
      featured: 1, is_bestseller: 1, is_new: 0, rating: 4.8, review_count: 1203, max_downloads: 999
    },
    {
      id: uuidv4(), name: 'AI Prompt Engineering Bible', slug: 'ai-prompt-engineering-bible',
      description: 'Master the art of prompting ChatGPT, Claude, Gemini, and Midjourney. 500+ battle-tested prompts for business, marketing, coding, creative writing, and image generation. Updated monthly with new prompts and techniques.',
      short_description: '500+ expert prompts for ChatGPT, Claude, Midjourney & more. Monthly updates.',
      price: 19.99, original_price: 39.99, category: 'ai-tools',
      tags: JSON.stringify(['ai', 'prompts', 'chatgpt', 'claude', 'midjourney']),
      image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
      preview_images: JSON.stringify([
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
      ]),
      featured: 1, is_bestseller: 0, is_new: 1, rating: 4.7, review_count: 892, max_downloads: 999
    },
    {
      id: uuidv4(), name: 'Figma Design System Pro', slug: 'figma-design-system-pro',
      description: 'Enterprise-grade Figma component library with 1200+ components, auto-layout mastery, and advanced prototyping techniques. Perfect for design teams and freelancers building scalable products.',
      short_description: '1200+ Figma components with auto-layout and advanced prototyping.',
      price: 34.99, original_price: 69.99, category: 'templates',
      tags: JSON.stringify(['figma', 'design-system', 'components', 'ui']),
      image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
      preview_images: JSON.stringify([
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
      ]),
      featured: 0, is_bestseller: 1, is_new: 0, rating: 4.9, review_count: 634, max_downloads: 999
    },
    {
      id: uuidv4(), name: 'Python Automation Masterclass', slug: 'python-automation-masterclass',
      description: 'Automate everything with Python. Web scraping, browser automation, data processing, API integrations, file management, and building your own automation tools. Real projects, real results.',
      short_description: 'Automate anything with Python. Scraping, browser automation, and more.',
      price: 39.99, original_price: 79.99, category: 'courses',
      tags: JSON.stringify(['python', 'automation', 'scraping', 'programming']),
      image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
      preview_images: JSON.stringify([
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
      ]),
      featured: 0, is_bestseller: 0, is_new: 1, rating: 4.6, review_count: 421, max_downloads: 999
    },
    {
      id: uuidv4(), name: 'Digital Marketing Playbook 2024', slug: 'digital-marketing-playbook-2024',
      description: 'Complete digital marketing strategy guide covering SEO, paid ads, social media, email marketing, content strategy, and analytics. Includes 50+ templates, swipe files, and campaign blueprints.',
      short_description: 'Complete marketing playbook with 50+ templates and campaign blueprints.',
      price: 24.99, original_price: 49.99, category: 'ebooks',
      tags: JSON.stringify(['marketing', 'seo', 'social-media', 'ads']),
      image_url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&q=80',
      preview_images: JSON.stringify([
        'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&q=80',
      ]),
      featured: 0, is_bestseller: 0, is_new: 0, rating: 4.5, review_count: 287, max_downloads: 999
    },
  ]

  const insert = database.prepare(`
    INSERT INTO products (id, name, slug, description, short_description, price, original_price, category, tags, image_url, preview_images, featured, is_bestseller, is_new, rating, review_count, max_downloads)
    VALUES (@id, @name, @slug, @description, @short_description, @price, @original_price, @category, @tags, @image_url, @preview_images, @featured, @is_bestseller, @is_new, @rating, @review_count, @max_downloads)
  `)

  const insertMany = database.transaction((products: typeof products) => {
    for (const p of products) insert.run(p)
  })

  insertMany(products)
}
