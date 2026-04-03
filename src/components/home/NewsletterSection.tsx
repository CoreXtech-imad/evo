'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('You\'re in! Welcome to Digital Bite 🎉')
        setEmail('')
      } else {
        toast.error(data.error || 'Something went wrong')
      }
    } catch {
      toast.error('Failed to subscribe. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-gap px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface-container to-secondary/10" />
          <div className="absolute inset-0 border border-primary/10 rounded-3xl" />

          {/* Ambient glows */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-surface-container-highest/60 rounded-full px-4 py-2 mb-6">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
              <span className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-widest">Newsletter</span>
            </div>

            <h2 className="font-headline font-black text-3xl md:text-5xl text-on-surface tracking-tight mb-4">
              Stay Ahead of the Curve
            </h2>
            <p className="text-on-surface-variant text-lg mb-10 max-w-lg mx-auto">
              Get exclusive deals, early access to new products, and digital creator tips — straight to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="glass-input flex-1 px-5 py-4 rounded-full text-on-surface text-sm placeholder:text-outline-variant/60 font-body"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-4 text-sm whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Subscribing...' : 'Subscribe Free'}
              </button>
            </form>

            <p className="text-on-surface-variant text-xs mt-4 font-label">
              No spam. Unsubscribe anytime. 🔒
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
