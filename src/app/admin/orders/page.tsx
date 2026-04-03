'use client'
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['pending', 'confirmed', 'delivered', 'cancelled']
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-primary/10 text-primary border-primary/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-error/10 text-error border-error/20',
}

interface Order {
  id: string; order_number: string; product_name: string; product_price: number
  quantity: number; total_price: number; customer_name: string; customer_phone: string
  customer_email?: string; customer_city: string; customer_address: string
  payment_method: string; status: string; created_at: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)
  const adminToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-dev-token'

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const url = filter ? `/api/orders?status=${filter}` : '/api/orders'
      const res = await fetch(url, { headers: { 'x-admin-token': adminToken } })
      const data = await res.json()
      if (data.success) setOrders(data.data)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [filter, adminToken])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  async function updateStatus(orderNumber: string, status: string) {
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Order updated to ${status}`)
        setOrders(prev => prev.map(o => o.order_number === orderNumber ? { ...o, status } : o))
        if (selected?.order_number === orderNumber) setSelected(prev => prev ? { ...prev, status } : null)
      }
    } catch {
      toast.error('Failed to update order')
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl">
      <div className="mb-8 pt-4 md:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-black text-3xl text-on-surface tracking-tight">Orders</h1>
          <p className="text-on-surface-variant mt-1">{orders.length} total orders</p>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {['', ...STATUS_OPTIONS].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-label font-bold transition-all ${filter === s ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">No orders found.</div>
      ) : (
        <div className="bg-surface-container rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-outline-variant/10 text-on-surface-variant text-xs font-label font-bold uppercase tracking-wider">
            <div className="col-span-2">Order</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-3">Product</div>
            <div className="col-span-1">Total</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Action</div>
          </div>

          <div className="divide-y divide-outline-variant/10">
            {orders.map(order => (
              <div
                key={order.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-surface-container-high transition-colors cursor-pointer"
                onClick={() => setSelected(order)}
              >
                <div className="md:col-span-2">
                  <div className="font-label font-bold text-sm text-primary">#{order.order_number}</div>
                  <div className="text-on-surface-variant text-xs">{new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <div className="md:col-span-3">
                  <div className="font-label font-bold text-sm text-on-surface">{order.customer_name}</div>
                  <div className="text-on-surface-variant text-xs">{order.customer_phone}</div>
                </div>
                <div className="md:col-span-3 text-on-surface-variant text-sm truncate">{order.product_name}</div>
                <div className="md:col-span-1">
                  <span className="font-label font-bold text-sm text-on-surface">${Number(order.total_price).toFixed(2)}</span>
                </div>
                <div className="md:col-span-2">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-label font-bold border ${STATUS_COLORS[order.status] || ''}`}>
                    {order.status}
                  </span>
                </div>
                <div className="md:col-span-1">
                  <select
                    value={order.status}
                    onClick={e => e.stopPropagation()}
                    onChange={e => updateStatus(order.order_number, e.target.value)}
                    className="glass-input text-xs px-2 py-1.5 rounded-lg text-on-surface w-full cursor-pointer"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-surface-container-high rounded-3xl p-8 max-w-lg w-full space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-xl text-on-surface">#{selected.order_number}</h2>
              <button onClick={() => setSelected(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {[
              ['Customer', selected.customer_name],
              ['Phone', selected.customer_phone],
              ['Email', selected.customer_email || 'N/A'],
              ['City', selected.customer_city],
              ['Address', selected.customer_address],
              ['Product', selected.product_name],
              ['Qty', selected.quantity],
              ['Total', `$${Number(selected.total_price).toFixed(2)}`],
              ['Payment', selected.payment_method],
              ['Date', new Date(selected.created_at).toLocaleString()],
            ].map(([label, value]) => (
              <div key={label as string} className="flex justify-between py-2 border-b border-outline-variant/10 last:border-0">
                <span className="text-on-surface-variant text-sm font-label">{label}</span>
                <span className="text-on-surface text-sm font-label font-semibold text-right max-w-[60%] break-words">{value as string}</span>
              </div>
            ))}
            <div className="flex gap-2 flex-wrap pt-2">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.order_number, s)}
                  className={`px-4 py-2 rounded-full text-xs font-label font-bold transition-all border ${
                    selected.status === s ? STATUS_COLORS[s] : 'border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-highest'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
