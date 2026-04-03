const testimonials = [
  { name: 'Yasmine K.', role: 'UI/UX Designer', company: 'Freelancer', rating: 5, content: 'The Figma Design System Pro is an absolute game-changer. I cut my project setup time in half. The components are incredibly well-structured and the documentation is top notch.' },
  { name: 'Karim B.', role: 'Full-Stack Developer', company: 'StartupDZ', rating: 5, content: 'The Next.js SaaS Starter Kit saved me weeks of work. Authentication, billing, dashboard — it\'s all there and production-ready. Worth every cent.' },
  { name: 'Sarah M.', role: 'Marketing Manager', company: 'TechCorp', rating: 5, content: 'The AI Prompt Engineering Bible is pure gold. I\'ve been using it for 3 months and my content quality has skyrocketed. My team loves it.' },
  { name: 'Amine T.', role: 'Entrepreneur', company: 'Self-employed', rating: 4, content: 'Digital Bite has the best selection of practical digital products I\'ve found. Fast delivery, great support, and everything works exactly as described.' },
  { name: 'Lina R.', role: 'Product Designer', company: 'Agency Pro', rating: 5, content: 'I\'ve purchased 4 products from Digital Bite now. Every single one exceeded my expectations. The UI/UX course alone changed how I approach design problems.' },
  { name: 'Omar S.', role: 'Python Developer', company: 'DataLab', rating: 5, content: 'The Python Automation Masterclass is phenomenal. Real-world examples, clean code, and the instructor clearly knows what they\'re talking about. Highly recommended.' },
]

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: `'FILL' ${s <= count ? 1 : 0}` }}>star</span>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="section-gap px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="text-xs font-label font-bold text-secondary uppercase tracking-widest">Customer Stories</span>
          <h2 className="font-headline font-black text-4xl md:text-5xl text-on-surface mt-3 tracking-tight">
            Loved by Creators Worldwide
          </h2>
          <p className="text-on-surface-variant mt-4 text-lg max-w-xl mx-auto">
            Join thousands of professionals who've leveled up with Digital Bite.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-surface-container rounded-3xl p-7 flex flex-col gap-5 relative overflow-hidden group hover:bg-surface-container-high transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="absolute top-5 right-6 font-headline text-6xl text-primary/10 font-black leading-none select-none">"</div>

              <StarRow count={t.rating} />

              <p className="text-on-surface-variant font-body text-sm leading-relaxed relative z-10">
                "{t.content}"
              </p>

              <div className="flex items-center gap-3 mt-auto pt-5 border-t border-outline-variant/10">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center font-headline font-bold text-primary text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-headline font-bold text-sm text-on-surface">{t.name}</div>
                  <div className="text-on-surface-variant text-xs font-label">{t.role} · {t.company}</div>
                </div>
              </div>

              {/* Glow on hover */}
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
