'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Order } from '@/types'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    // Try sessionStorage first
    const stored = sessionStorage.getItem('last_order')
    if (stored) {
      try {
        const o = JSON.parse(stored)
        if (o.order_number === orderNumber) {
          setOrder(o)
          return
        }
      } catch { /* ignore */ }
    }
    // Fallback: fetch by order number
    if (orderNumber) {
      fetch(`/api/orders/${orderNumber}`)
        .then(r => r.json())
        .then(d => { if (d.success) setOrder(d.data) })
    }
  }, [orderNumber])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-24 px-6 md:px-10 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto space-y-6">
          {/* Success banner */}
          <div className="relative rounded-3xl overflow-hidden text-center p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface-container to-secondary/10" />
            <div className="absolute inset-0 border border-primary/10 rounded-3xl" />
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              {/* Animated checkmark */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 animate-fade-up">
                <span className="material-symbols-outlined text-4xl text-on-primary font-bold"
                  style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>

              <h1 className="font-headline font-black text-4xl md:text-5xl text-on-surface tracking-tight mb-3 animate-fade-up">
                Order Confirmed! 🎉
              </h1>
              <p className="text-on-surface-variant text-lg mb-2 animate-fade-up">
                Thank you{order ? `, ${order.customer_name}` : ''}!
              </p>
              {order && (
                <div className="inline-flex items-center gap-2 bg-surface-container-highest/60 rounded-full px-5 py-2 mt-2">
                  <span className="text-on-surface-variant text-sm font-label">Order</span>
                  <span className="text-primary font-label font-bold text-sm">#{order.order_number}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order details */}
          {order && (
            <div className="bg-surface-container rounded-3xl p-7 space-y-4">
              <h2 className="font-headline font-bold text-base text-on-surface">Order Details</h2>
              {[
                { label: 'Product', value: order.product_name },
                { label: 'Quantity', value: order.quantity.toString() },
                { label: 'Unit Price', value: `$${order.product_price.toFixed(2)}` },
                { label: 'Total', value: `$${order.total_price.toFixed(2)}`, highlight: true },
                { label: 'Payment Method', value: order.payment_method === 'cash' ? 'Cash on Delivery' : 'Digital Payment' },
                { label: 'City', value: order.customer_city },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                  <span className="text-on-surface-variant text-sm font-label">{label}</span>
                  <span className={`text-sm font-label font-bold ${highlight ? 'text-primary text-base' : 'text-on-surface'}`}>{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Delivery info */}
          <div className="bg-surface-container rounded-3xl p-7 space-y-4">
            <h2 className="font-headline font-bold text-base text-on-surface">What Happens Next?</h2>
            <div className="space-y-4">
              {[
                {
                  icon: 'mark_email_read', color: 'text-primary',
                  title: 'Email Confirmation',
                  desc: order?.customer_email
                    ? `We sent a confirmation to ${order.customer_email} with your download link.`
                    : 'If you provided an email, we sent a confirmation with your download link.',
                },
                {
                  icon: 'phone_in_talk', color: 'text-secondary',
                  title: 'WhatsApp Contact',
                  desc: `Our team will contact you on ${order?.customer_phone || 'your phone number'} via WhatsApp to deliver your product.`,
                },
                {
                  icon: 'download', color: 'text-tertiary',
                  title: 'Digital Delivery',
                  desc: 'Your secure download link will be delivered within minutes to a few hours.',
                },
              ].map(({ icon, color, title, desc }) => (
                <div key={icon} className="flex gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center ${color}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                  <div>
                    <p className="font-label font-bold text-sm text-on-surface">{title}</p>
                    <p className="text-on-surface-variant text-sm mt-0.5 font-body">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/products" className="btn-primary flex-1 py-4 text-sm text-center flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base">shopping_bag</span>
              Browse More Products
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '213500000000'}?text=Hi! My order number is ${order?.order_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost flex-1 py-4 text-sm text-center flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              Contact via WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
