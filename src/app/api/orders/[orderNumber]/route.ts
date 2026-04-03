import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const db = getDb()
    const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(params.orderNumber)
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: order })
  } catch (err) {
    console.error('[Order GET]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const token = req.headers.get('x-admin-token')
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDb()
    const { status } = await req.json()
    db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE order_number = ?").run(status, params.orderNumber)
    const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(params.orderNumber)
    return NextResponse.json({ success: true, data: order })
  } catch (err) {
    console.error('[Order PATCH]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
