'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'glass-nav shadow-ambient' : 'bg-transparent'
    }`}>
      <div className="flex justify-between items-center px-6 md:px-10 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black gradient-text font-headline tracking-tight neon-text">
            Digital Bite
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-headline font-semibold text-sm">
          <Link href="/products" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
            Products
          </Link>
          <Link href="/products?category=courses" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
            Courses
          </Link>
          <Link href="/products?category=templates" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
            Templates
          </Link>
          <Link href="/products?category=ai-tools" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
            AI Tools
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="hidden md:inline-flex btn-ghost px-5 py-2.5 text-sm"
          >
            Browse All
          </Link>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-surface-container-high"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className={`block w-5 h-0.5 bg-on-surface transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-on-surface transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-on-surface transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-nav border-t border-outline-variant/10 px-6 py-6 space-y-4">
          {['Products', 'Courses', 'Templates', 'AI Tools'].map((item) => (
            <Link
              key={item}
              href={item === 'Products' ? '/products' : `/products?category=${item.toLowerCase().replace(' ', '-')}`}
              className="block text-on-surface-variant hover:text-primary font-headline font-semibold py-2 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
