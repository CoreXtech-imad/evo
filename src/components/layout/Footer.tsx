'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-background border-t border-outline-variant/10 w-full py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <span className="text-2xl font-black gradient-text font-headline tracking-tight">
              Digital Bite
            </span>
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
              Elevating the digital landscape through curated design assets, elite education, and cutting-edge AI tools.
            </p>
            <div className="flex items-center gap-3">
              {['WhatsApp', 'Instagram', 'Twitter'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-all duration-200 text-xs font-label font-bold"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Platform', links: [['Products', '/products'], ['Categories', '/products'], ['Best Sellers', '/products?sort=bestseller'], ['New Arrivals', '/products?sort=new']] },
            { title: 'Categories', links: [['Courses', '/products?category=courses'], ['Templates', '/products?category=templates'], ['AI Tools', '/products?category=ai-tools'], ['eBooks', '/products?category=ebooks']] },
            { title: 'Company', links: [['About Us', '#'], ['Contact', '#'], ['Privacy Policy', '#'], ['Terms of Service', '#']] },
          ].map(({ title, links }) => (
            <div key={title} className="space-y-4">
              <h4 className="font-label font-bold text-xs text-primary uppercase tracking-widest">{title}</h4>
              <ul className="space-y-3">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-on-surface-variant hover:text-secondary text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-on-surface-variant text-xs">
            © 2024 Digital Bite. The Digital Nebula Experience.
          </p>
          <div className="flex items-center gap-2 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-base text-primary">lock</span>
            Secure & Encrypted Transactions
          </div>
        </div>
      </div>
    </footer>
  )
}
