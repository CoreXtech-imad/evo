'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
  { href: '/admin/products', label: 'Products', icon: 'inventory_2' },
  { href: '/admin/products/new', label: 'Add Product', icon: 'add_box' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-outline-variant/10">
        <Link href="/" className="gradient-text font-headline font-black text-xl neon-text">
          Digital Bite
        </Link>
        <div className="text-on-surface-variant text-xs font-label mt-1">Admin Panel</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label font-semibold text-sm transition-all duration-200 ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: `'FILL' ${active ? 1 : 0}` }}>
                {icon}
              </span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-outline-variant/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:text-primary text-sm font-label font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-xl">storefront</span>
          View Store
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant/10 flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="material-symbols-outlined text-on-surface">
          {mobileOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-surface-container-low border-r border-outline-variant/10 h-full">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  )
}
