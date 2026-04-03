import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { Product } from '@/types'

function parseProduct(p: Product) {
  return {
    ...p,
    tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
    preview_images: typeof p.preview_images === 'string' ? JSON.parse(p.preview_images) : p.preview_images,
    featured: Boolean(p.featured),
    is_bestseller: Boolean(p.is_bestseller),
    is_new: Boolean(p.is_new),
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = getDb()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const sort = searchParams.get('sort')

    let query = 'SELECT * FROM products WHERE 1=1'
    const params: (string | number)[] = []

    if (category) { query += ' AND category = ?'; params.push(category) }
    if (featured === 'true') query += ' AND featured = 1'

    if (sort === 'bestseller') query += ' ORDER BY rating DESC'
    else if (sort === 'new') query += ' ORDER BY created_at DESC'
    else if (sort === 'price_asc') query += ' ORDER BY price ASC'
    else if (sort === 'price_desc') query += ' ORDER BY price DESC'
    else query += ' ORDER BY featured DESC, created_at DESC'

    const products = db.prepare(query).all(...params) as Product[]
    return NextResponse.json({ success: true, data: products.map(parseProduct) })
  } catch (err) {
    console.error('[Products GET]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('x-admin-token')
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDb()
    const body = await req.json()
    const id = uuidv4()
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    db.prepare(`
      INSERT INTO products (id, name, slug, description, short_description, price, original_price, category, tags, image_url, preview_images, file_path, file_name, featured, is_bestseller, is_new, max_downloads)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, body.name, slug, body.description, body.short_description,
      body.price, body.original_price || null, body.category,
      JSON.stringify(body.tags || []),
      body.image_url, JSON.stringify(body.preview_images || []),
      body.file_path || null, body.file_name || null,
      body.featured ? 1 : 0, body.is_bestseller ? 1 : 0, body.is_new ? 1 : 0,
      body.max_downloads || 100
    )

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product
    return NextResponse.json({ success: true, data: parseProduct(product) }, { status: 201 })
  } catch (err) {
    console.error('[Products POST]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
