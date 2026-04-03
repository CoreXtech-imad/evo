'use client'
import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'

const CATEGORIES = [
  { value: '', label: 'All Products', icon: 'apps' },
  { value: 'courses', label: 'Courses', icon: 'school' },
  { value: 'templates', label: 'Templates', icon: 'dashboard_customize' },
  { value: 'ai-tools', label: 'AI Tools', icon: 'psychology' },
  { value: 'ebooks', label: 'eBooks', icon: 'menu_book' },
  { value: 'software', label: 'Software', icon: 'code' },
  { value: 'marketing', label: 'Marketing', icon: 'campaign' },
]

const SORTS = [
  { value: '', label: 'Recommended' },
  { value: 'new', label: 'Newest' },
  { value: 'bestseller', label: 'Best Sellers' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

interface Props {
  initialProducts: Product[]
  initialCategory: string
  initialSort: string
  initialQuery: string
}

export default function ProductsClient({ initialProducts, initialCategory, initialSort, initialQuery }: Props) {
  const router = useRouter()
  const [category, setCategory] = useState(initialCategory)
  const [sort, setSort] = useState(initialSort)
  const [query, setQuery] = useState(initialQuery)

  function updateURL(cat: string, s: string, q: string) {
    const params = new URLSearchParams()
    if (cat) params.set('category', cat)
    if (s) params.set('sort', s)
    if (q) params.set('q', q)
    router.push(`/products${params.toString() ? '?' + params.toString() : ''}`, { scroll: false })
  }

  function handleCategory(val: string) {
    setCategory(val)
    updateURL(val, sort, query)
  }

  function handleSort(val: string) {
    setSort(val)
    updateURL(category, val, query)
  }

  // Client-side search filter on top of server-fetched products
  const filtered = useMemo(() => {
    if (!query) return initialProducts
    const q = query.toLowerCase()
    return initialProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.short_description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }, [initialProducts, query])

  const activeCategoryLabel = CATEGORIES.find(c => c.value === category)?.label || 'All Products'

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-headline font-black text-4xl md:text-5xl text-on-surface tracking-tight">
          {activeCategoryLabel}
        </h1>
        <p className="text-on-surface-variant mt-2 text-lg">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products..."
            className="glass-input w-full pl-12 pr-5 py-3.5 rounded-xl text-on-surface text-sm"
          />
        </div>
        <select
          value={sort}
          onChange={e => handleSort(e.target.value)}
          className="glass-input px-5 py-3.5 rounded-xl text-on-surface text-sm appearance-none cursor-pointer min-w-[180px]"
        >
          {SORTS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => handleCategory(cat.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-label font-bold text-sm transition-all duration-200 ${
              category === cat.value
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: `'FILL' ${category === cat.value ? 1 : 0}` }}>
              {cat.icon}
            </span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-3xl bg-surface-container mx-auto flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">search_off</span>
          </div>
          <h3 className="font-headline font-bold text-xl text-on-surface mb-2">No products found</h3>
          <p className="text-on-surface-variant mb-6">Try adjusting your search or filters.</p>
          <button
            onClick={() => { setQuery(''); setCategory(''); setSort(''); updateURL('', '', '') }}
            className="btn-ghost px-6 py-3 text-sm"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
