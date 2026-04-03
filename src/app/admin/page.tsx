import { getDb } from '@/lib/db'

async function getAnalytics() {
  try {
    const db = getDb()
    const totalRevenue = (db.prepare(`SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE status != 'cancelled'`).get() as { total: number }).total
    const totalOrders = (db.prepare(`SELECT COUNT(*) as count FROM orders`).get() as { count: number }).count
    const pendingOrders = (db.prepare(`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`).get() as { count: number }).count
    const totalProducts = (db.prepare(`SELECT COUNT(*) as count FROM products`).get() as { count: number }).count
    const totalSubscribers = (db.prepare(`SELECT COUNT(*) as count FROM newsletter_subscribers`).get() as { count: number }).count
    const recentOrders = db.prepare(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 8`).all()
    const topProducts = db.prepare(`
      SELECT p.name, p.price, p.category, p.image_url, COUNT(o.id) as order_count, COALESCE(SUM(o.total_price), 0) as revenue
      FROM products p LEFT JOIN orders o ON o.product_id = p.id AND o.status != 'cancelled'
      GROUP BY p.id ORDER BY revenue DESC LIMIT 5
    `).all()
    return { totalRevenue, totalOrders, pendingOrders, totalProducts, totalSubscribers, recentOrders, topProducts }
  } catch (e) {
    return { totalRevenue: 0, totalOrders: 0, pendingOrders: 0, totalProducts: 0, totalSubscribers: 0, recentOrders: [], topProducts: [] }
  }
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-primary/10 text-primary',
  delivered: 'bg-green-500/10 text-green-400',
  cancelled: 'bg-error/10 text-error',
}

export default async function AdminDashboard() {
  const data = await getAnalytics()

  const stats = [
    { label: 'Total Revenue', value: `$${data.totalRevenue.toFixed(2)}`, icon: 'payments', color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Orders', value: data.totalOrders.toString(), icon: 'receipt_long', color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Pending Orders', value: data.pendingOrders.toString(), icon: 'pending_actions', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Products', value: data.totalProducts.toString(), icon: 'inventory_2', color: 'text-tertiary', bg: 'bg-tertiary/10' },
    { label: 'Subscribers', value: data.totalSubscribers.toString(), icon: 'mail', color: 'text-primary-dim', bg: 'bg-primary-dim/10' },
  ]

  return (
    <div className="p-6 md:p-10 max-w-7xl">
      {/* Header */}
      <div className="mb-10 pt-4 md:pt-0">
        <h1 className="font-headline font-black text-3xl md:text-4xl text-on-surface tracking-tight">Dashboard</h1>
        <p className="text-on-surface-variant mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10 stagger">
        {stats.map(({ label, value, icon, color, bg }) => (
          <div key={label} className="bg-surface-container rounded-2xl p-5 space-y-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <span className={`material-symbols-outlined text-xl ${color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
            </div>
            <div>
              <div className="font-headline font-black text-2xl text-on-surface">{value}</div>
              <div className="text-on-surface-variant text-xs font-label mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-surface-container rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
            <h2 className="font-headline font-bold text-base text-on-surface">Recent Orders</h2>
            <a href="/admin/orders" className="text-primary text-xs font-label font-bold hover:underline">View all</a>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {(data.recentOrders as any[]).length === 0 ? (
              <div className="px-6 py-10 text-center text-on-surface-variant text-sm">No orders yet</div>
            ) : (
              (data.recentOrders as any[]).map((order) => (
                <div key={order.id} className="px-6 py-4 flex items-center gap-4 hover:bg-surface-container-high transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-label font-bold text-sm text-on-surface truncate">{order.customer_name}</div>
                    <div className="text-on-surface-variant text-xs truncate">{order.product_name}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-label font-bold text-sm text-primary">${Number(order.total_price).toFixed(2)}</div>
                    <div className="text-on-surface-variant text-xs">#{order.order_number}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-label font-bold flex-shrink-0 ${STATUS_COLORS[order.status] || ''}`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-surface-container rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
            <h2 className="font-headline font-bold text-base text-on-surface">Top Products</h2>
            <a href="/admin/products" className="text-primary text-xs font-label font-bold hover:underline">View all</a>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {(data.topProducts as any[]).length === 0 ? (
              <div className="px-6 py-10 text-center text-on-surface-variant text-sm">No data yet</div>
            ) : (
              (data.topProducts as any[]).map((p, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center text-xs font-label font-black text-on-surface-variant flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-label font-bold text-xs text-on-surface truncate">{p.name}</div>
                    <div className="text-on-surface-variant text-xs">{p.order_count} sold</div>
                  </div>
                  <div className="text-primary font-label font-bold text-sm flex-shrink-0">${Number(p.revenue).toFixed(0)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
