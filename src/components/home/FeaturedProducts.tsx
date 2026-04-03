import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'

interface Props {
  products: Product[]
  title?: string
  subtitle?: string
  badge?: string
  viewAllLink?: string
}

export default function FeaturedProducts({
  products,
  title = 'Featured Products',
  subtitle = 'Hand-picked premium digital products to accelerate your work.',
  badge = 'Featured',
  viewAllLink = '/products',
}: Props) {
  if (!products.length) return null

  return (
    <section className="section-gap px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-label font-bold text-secondary uppercase tracking-widest">{badge}</span>
            <h2 className="font-headline font-black text-4xl md:text-5xl text-on-surface mt-3 tracking-tight">
              {title}
            </h2>
            <p className="text-on-surface-variant mt-3 text-lg max-w-lg">
              {subtitle}
            </p>
          </div>
          <Link href={viewAllLink} className="btn-ghost px-6 py-3 text-sm inline-flex items-center gap-2 whitespace-nowrap self-start md:self-auto">
            View All
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} featured />
          ))}
        </div>
      </div>
    </section>
  )
}
