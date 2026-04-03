import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('x-admin-token')
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDb()

    const totalRevenue = (db.prepare(`SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE status != 'cancelled'`).get() as { total: number }).total
    const totalOrders = (db.prepare(`SELECT COUNT(*) as count FROM orders`).get() as { count: number }).count
    const pendingOrders = (db.prepare(`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`).get() as { count: number }).count
    const totalProducts = (db.prepare(`SELECT COUNT(*) as count FROM products`).get() as { count: number }).count
    const totalSubscribers = (db.prepare(`SELECT COUNT(*) as count FROM newsletter_subscribers`).get() as { count: number }).count

    const recentOrders = db.prepare(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 5`).all()

    const topProducts = db.prepare(`
      SELECT p.name, p.price, p.category, COUNT(o.id) as order_count, COALESCE(SUM(o.total_price), 0) as revenue
      FROM products p
      LEFT JOIN orders o ON o.product_id = p.id AND o.status != 'cancelled'
      GROUP BY p.id
      ORDER BY revenue DESC
      LIMIT 5
    `).all()

    const ordersByStatus = db.prepare(`
      SELECT status, COUNT(*) as count FROM orders GROUP BY status
    `).all()

    const revenueByDay = db.prepare(`
      SELECT DATE(created_at) as date, COALESCE(SUM(total_price), 0) as revenue, COUNT(*) as orders
      FROM orders
      WHERE status != 'cancelled' AND created_at >= DATE('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `).all()

    return NextResponse.json({
      success: true,
      data: {
        summary: { totalRevenue, totalOrders, pendingOrders, totalProducts, totalSubscribers },
        recentOrders,
        topProducts,
        ordersByStatus,
        revenueByDay,
      }
    })
  } catch (err) {
    console.error('[Analytics]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
