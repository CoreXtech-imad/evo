'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Product } from '@/types'
import toast from 'react-hot-toast'

const ALGERIEN_WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Algiers',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem','MSila','Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued',
  'Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent',
  'Ghardaïa','Relizane','International'
]

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get('product')

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'digital'>('cash')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
  })

  useEffect(() => {
    // Try sessionStorage first, then fetch from API
    const stored = sessionStorage.getItem('checkout_product')
    if (stored) {
      try {
        const p = JSON.parse(stored)
        if (p.id === productId) {
          setProduct(p)
          return
        }
      } catch { /* ignore */ }
    }
    if (productId) {
      fetch(`/api/products/${productId}`)
        .then(r => r.json())
        .then(d => { if (d.success) setProduct(d.data) })
    }
  }, [productId])

  const total = product ? product.price * quantity : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return
    if (!form.name || !form.phone || !form.city || !form.address) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email || undefined,
          customer_city: form.city,
          customer_address: form.address,
          payment_method: paymentMethod,
        }),
      })
      const data = await res.json()
      if (data.success) {
        sessionStorage.setItem('last_order', JSON.stringify(data.data))
        router.push(`/confirmation?order=${data.data.order_number}`)
      } else {
        toast.error(data.error || 'Failed to place order')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-headline font-black text-4xl md:text-5xl text-on-surface tracking-tight">
              Complete Your Purchase
            </h1>
            <p className="text-on-surface-variant mt-2 text-lg">
              Secure your digital product in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Product + Form */}
            <div className="lg:col-span-7 space-y-8">
              {/* Product card */}
              <div className="bg-surface-container rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-tertiary/10 blur-[60px] rounded-full pointer-events-none" />
                <div className="relative z-10 flex gap-5">
                  <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-surface-container-highest">
                    <Image src={product.image_url} alt={product.name} width={96} height={96} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-headline font-bold text-lg text-on-surface leading-tight truncate">{product.name}</h2>
                    <p className="text-on-surface-variant text-sm font-body mt-1 line-clamp-2">{product.short_description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="font-label font-black text-xl text-primary">${product.price.toFixed(2)}</span>
                      {product.original_price && (
                        <span className="font-label text-on-surface-variant text-sm line-through">${product.original_price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  {/* Quantity */}
                  <div className="flex items-center bg-surface-container-lowest rounded-full border border-outline-variant/15 p-1 self-center">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="px-3 font-label text-sm font-bold text-on-surface">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>

                {/* Perks */}
                <div className="relative z-10 flex flex-wrap gap-4 mt-5 pt-5 border-t border-outline-variant/10">
                  {[
                    { icon: 'verified', text: 'Lifetime Access', color: 'text-primary-dim' },
                    { icon: 'auto_awesome', text: 'Project Files Included', color: 'text-secondary' },
                  ].map(({ icon, text, color }) => (
                    <div key={icon} className={`flex items-center gap-2 ${color}`}>
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                      <span className="text-sm font-label font-semibold">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust badge */}
              <div className="bg-surface-container-low rounded-2xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-sm text-on-surface">Encrypted & Secure</p>
                  <p className="font-body text-xs text-on-surface-variant">256-bit encryption · Your data is never shared</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Delivery */}
                <section className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-xs font-black font-label">1</span>
                    <h3 className="font-headline text-lg font-bold text-on-surface">Delivery Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Amine Benali"
                        className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface placeholder:text-outline-variant/50 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+213 5XX XXX XXX"
                        className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface placeholder:text-outline-variant/50 text-sm"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Email Address <span className="normal-case font-normal">(optional, for download link)</span></label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="amine@example.com"
                        className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface placeholder:text-outline-variant/50 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">City / Wilaya *</label>
                      <select
                        required
                        value={form.city}
                        onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                        className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface appearance-none cursor-pointer text-sm"
                      >
                        <option value="" disabled>Select your wilaya</option>
                        {ALGERIEN_WILAYAS.map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Full Address *</label>
                      <input
                        type="text"
                        required
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                        placeholder="Street, Building, Apt..."
                        className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface placeholder:text-outline-variant/50 text-sm"
                      />
                    </div>
                  </div>
                </section>

                {/* Step 2: Payment */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-xs font-black font-label">2</span>
                    <h3 className="font-headline text-lg font-bold text-on-surface">Payment Method</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: 'cash', icon: 'account_balance_wallet', label: 'Cash on Delivery', sub: 'Pay when you receive' },
                      { value: 'digital', icon: 'contactless', label: 'Digital Payment', sub: 'Instant activation' },
                    ].map(m => (
                      <label
                        key={m.value}
                        className={`relative flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                          paymentMethod === m.value
                            ? 'border-primary bg-primary/5'
                            : 'border-transparent bg-surface-container hover:border-outline-variant/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={m.value}
                          checked={paymentMethod === (m.value as 'cash' | 'digital')}
                          onChange={() => setPaymentMethod(m.value as 'cash' | 'digital')}
                          className="hidden"
                        />
                        <span className={`material-symbols-outlined ${paymentMethod === m.value ? 'text-primary' : 'text-on-surface-variant'}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}>
                          {m.icon}
                        </span>
                        <div>
                          <p className="font-headline font-bold text-sm text-on-surface">{m.label}</p>
                          <p className="text-on-surface-variant text-xs">{m.sub}</p>
                        </div>
                        {paymentMethod === m.value && (
                          <span className="absolute top-3 right-3 material-symbols-outlined text-primary text-xl"
                            style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        )}
                      </label>
                    ))}
                  </div>
                </section>

                {/* Order summary */}
                <section className="bg-surface-container-high rounded-3xl p-7 space-y-5">
                  <h3 className="font-headline font-bold text-base text-on-surface">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-on-surface-variant font-body">
                      <span>{product.name} × {quantity}</span>
                      <span className="font-label font-semibold">${(product.price * quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-on-surface-variant font-body">
                      <span>Delivery</span>
                      <span className="text-primary font-label font-bold">FREE</span>
                    </div>
                    <div className="h-px bg-outline-variant/10" />
                    <div className="flex justify-between items-center">
                      <span className="font-headline font-bold text-lg text-on-surface">Total</span>
                      <span className="font-label font-black text-3xl text-on-surface">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                        Place Order
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-on-surface-variant font-body">
                    By placing an order you agree to our{' '}
                    <a href="#" className="underline hover:text-primary">Terms of Service</a>.
                  </p>
                </section>
              </form>
            </div>

            {/* Right: sticky summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-5">
                <div className="bg-surface-container rounded-3xl p-6 space-y-5">
                  <h3 className="font-headline font-bold text-base text-on-surface">Your Order</h3>
                  <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-headline font-bold text-on-surface">{product.name}</p>
                    <p className="text-on-surface-variant text-sm mt-1">{product.short_description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                    <span className="font-label text-on-surface-variant text-sm">Total ({quantity} item{quantity > 1 ? 's' : ''})</span>
                    <span className="font-label font-black text-2xl text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* What happens next */}
                <div className="bg-surface-container rounded-3xl p-6">
                  <h3 className="font-headline font-bold text-sm text-on-surface mb-4">What happens after ordering?</h3>
                  <div className="space-y-4">
                    {[
                      { n: '1', t: 'Order received', d: 'We instantly receive your order details.' },
                      { n: '2', t: 'We contact you', d: 'Our team reaches out via WhatsApp or email.' },
                      { n: '3', t: 'Digital delivery', d: 'Your download link is sent securely.' },
                    ].map(step => (
                      <div key={step.n} className="flex gap-4">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-black font-label flex items-center justify-center flex-shrink-0 mt-0.5">
                          {step.n}
                        </div>
                        <div>
                          <p className="font-label font-bold text-sm text-on-surface">{step.t}</p>
                          <p className="text-on-surface-variant text-xs mt-0.5">{step.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
