import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { generateOrderNumber, createDownloadLink } from '@/lib/security'
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email'
import { sendOrderWebhook } from '@/lib/webhook'
import { v4 as uuidv4 } from 'uuid'
import { Order, Product } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { product_id, quantity = 1, customer_name, customer_phone, customer_email, customer_city, customer_address, payment_method = 'cash' } = body

    if (!product_id || !customer_name || !customer_phone || !customer_city || !customer_address) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const db = getDb()

    // Get product
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id) as Product | undefined
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    const id = uuidv4()
    const order_number = generateOrderNumber()
    const total_price = product.price * quantity

    // Create order
    db.prepare(`
      INSERT INTO orders (id, order_number, product_id, product_name, product_price, quantity, total_price, customer_name, customer_phone, customer_email, customer_city, customer_address, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, order_number, product_id, product.name, product.price, quantity, total_price, customer_name, customer_phone, customer_email || null, customer_city, customer_address, payment_method)

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as Order

    // Generate download link
    let downloadUrl: string | undefined
    if (product.file_path) {
      downloadUrl = createDownloadLink(id, product_id)
      db.prepare('UPDATE orders SET download_token = ? WHERE id = ?').run(downloadUrl, id)
    }

    // Background tasks (non-blocking)
    Promise.allSettled([
      customer_email ? sendOrderConfirmationEmail(order, product, downloadUrl) : Promise.resolve(),
      sendAdminNotificationEmail(order),
      sendOrderWebhook(order),
    ]).catch(console.error)

    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (err) {
    console.error('[Orders POST]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    // Simple admin check
    const token = req.headers.get('x-admin-token')
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDb()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    let query = 'SELECT * FROM orders'
    const params: (string | number)[] = []
    if (status) { query += ' WHERE status = ?'; params.push(status) }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const orders = db.prepare(query).all(...params)
    const total = (db.prepare(status ? 'SELECT COUNT(*) as count FROM orders WHERE status = ?' : 'SELECT COUNT(*) as count FROM orders').get(status ? [status] : []) as { count: number }).count

    return NextResponse.json({ success: true, data: orders, total, page, limit })
  } catch (err) {
    console.error('[Orders GET]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
