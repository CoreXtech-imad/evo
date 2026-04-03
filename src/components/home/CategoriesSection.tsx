import Link from 'next/link'

const categories = [
  { name: 'Online Courses', slug: 'courses', icon: 'school', count: '40+', from: '#81ecff', to: '#00d4ec', desc: 'Learn from industry experts' },
  { name: 'Design Templates', slug: 'templates', icon: 'dashboard_customize', count: '80+', from: '#dd8bfb', to: '#c6a2ff', desc: 'Figma, HTML & UI kits' },
  { name: 'AI Tools', slug: 'ai-tools', icon: 'psychology', count: '30+', from: '#c6a2ff', to: '#dd8bfb', desc: 'Prompts, bots & scripts' },
  { name: 'eBooks & Guides', slug: 'ebooks', icon: 'menu_book', count: '50+', from: '#81ecff', to: '#c6a2ff', desc: 'In-depth knowledge guides' },
  { name: 'Software & Scripts', slug: 'software', icon: 'code', count: '25+', from: '#00d4ec', to: '#81ecff', desc: 'Automation & SaaS tools' },
  { name: 'Marketing Kits', slug: 'marketing', icon: 'campaign', count: '35+', from: '#dd8bfb', to: '#81ecff', desc: 'Grow your brand fast' },
]

export default function CategoriesSection() {
  return (
    <section className="section-gap px-6 md:px-10 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <span className="text-xs font-label font-bold text-secondary uppercase tracking-widest">Browse Categories</span>
          <h2 className="font-headline font-black text-4xl md:text-5xl text-on-surface mt-3 tracking-tight">
            Find What You Need
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="group">
              <div className="bg-surface-container rounded-2xl p-5 flex flex-col gap-4 h-full transition-all duration-300 hover:bg-surface-bright hover:-translate-y-1 hover:shadow-card-hover relative overflow-hidden">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${cat.from}22, ${cat.to}22)` }}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ color: cat.from, fontVariationSettings: "'FILL' 1" }}
                  >
                    {cat.icon}
                  </span>
                </div>

                <div>
                  <div className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors leading-tight">
                    {cat.name}
                  </div>
                  <div className="text-on-surface-variant text-xs font-body mt-1 leading-relaxed hidden md:block">
                    {cat.desc}
                  </div>
                </div>

                {/* Count */}
                <div
                  className="font-label font-bold text-xs mt-auto"
                  style={{ color: cat.from }}
                >
                  {cat.count} products
                </div>

                {/* Hover glow */}
                <div
                  className="absolute -bottom-4 -right-4 w-20 h-20 blur-2xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ background: cat.from }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
