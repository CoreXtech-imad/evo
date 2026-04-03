import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Product } from '@/types'

function parseProduct(p: Product) {
  return {
    ...p,
    tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
    preview_images: typeof p.preview_images === 'string' ? JSON.parse(p.preview_images) : p.preview_images,
  }
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb()
    const product = db.prepare('SELECT * FROM products WHERE id = ? OR slug = ?').get(params.id, params.id) as Product | undefined
    if (!product) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: parseProduct(product) })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('x-admin-token')
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDb()
    const body = await req.json()

    db.prepare(`
      UPDATE products SET
        name = ?, description = ?, short_description = ?, price = ?,
        original_price = ?, category = ?, tags = ?, image_url = ?,
        preview_images = ?, featured = ?, is_bestseller = ?, is_new = ?,
        max_downloads = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      body.name, body.description, body.short_description, body.price,
      body.original_price || null, body.category,
      JSON.stringify(body.tags || []), body.image_url,
      JSON.stringify(body.preview_images || []),
      body.featured ? 1 : 0, body.is_bestseller ? 1 : 0, body.is_new ? 1 : 0,
      body.max_downloads || 100, params.id
    )

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(params.id) as Product
    return NextResponse.json({ success: true, data: parseProduct(product) })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('x-admin-token')
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const db = getDb()
    db.prepare('DELETE FROM products WHERE id = ?').run(params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
