'use client'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-tertiary/3 blur-[150px] rounded-full pointer-events-none" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '200px',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 glass-card border border-primary/20 rounded-full px-5 py-2.5 mb-10 animate-fade-up">
          <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <span className="text-xs font-label font-bold text-on-surface-variant tracking-widest uppercase">Premium Digital Products</span>
        </div>

        {/* Headline */}
        <h1
          className="font-headline font-black text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-[-0.02em] mb-8 animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          The Future of{' '}
          <span className="gradient-text neon-text">
            Digital Products
          </span>
          <br />
          <span className="text-on-surface">Starts Here</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-on-surface-variant text-lg md:text-xl font-body leading-relaxed max-w-2xl mx-auto mb-12 animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          Discover premium courses, templates, AI tools, and software crafted for the next generation of creators and professionals.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          <Link href="/products" className="btn-primary px-10 py-4 text-base inline-flex items-center gap-2">
            Explore Products
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
          <Link href="/products?featured=true" className="btn-ghost px-10 py-4 text-base inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-base">play_circle</span>
            View Best Sellers
          </Link>
        </div>

        {/* Stats */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-16 animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          {[
            { value: '10K+', label: 'Happy Customers' },
            { value: '200+', label: 'Premium Products' },
            { value: '4.9★', label: 'Average Rating' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-headline font-black text-2xl gradient-text">{value}</div>
              <div className="text-on-surface-variant text-sm font-label mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
        <span className="text-on-surface-variant text-xs font-label tracking-widest uppercase">Scroll</span>
        <span className="material-symbols-outlined text-on-surface-variant">keyboard_arrow_down</span>
      </div>
    </section>
  )
}
