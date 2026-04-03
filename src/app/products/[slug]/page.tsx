import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import BuyButton from './BuyButton'
import { Product } from '@/types'

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { getDb } = await import('@/lib/db')
    const db = getDb()
    const product = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug) as Product | undefined
    if (!product) return null
    return {
      ...product,
      tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags,
      preview_images: typeof product.preview_images === 'string' ? JSON.parse(product.preview_images) : product.preview_images,
    }
  } catch { return null }
}

async function getRelated(category: string, excludeId: string): Promise<Product[]> {
  try {
    const { getDb } = await import('@/lib/db')
    const db = getDb()
    const products = db.prepare('SELECT * FROM products WHERE category = ? AND id != ? LIMIT 3').all(category, excludeId) as Product[]
    return products.map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
      preview_images: typeof p.preview_images === 'string' ? JSON.parse(p.preview_images) : p.preview_images,
    }))
  } catch { return [] }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const related = await getRelated(product.category, product.id)
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-10 font-label">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-colors capitalize">
              {product.category.replace('-', ' ')}
            </Link>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-on-surface truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
            {/* Left: Images */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-surface-container" style={{ aspectRatio: '4/3' }}>
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.is_new && (
                  <div className="absolute top-4 left-4">
                    <span className="lume-badge bg-error-dim text-white text-xs font-label font-bold px-3 py-1.5 rounded-full">NEW</span>
                  </div>
                )}
                {discount && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-primary to-secondary text-on-primary text-xs font-label font-bold px-3 py-1.5 rounded-full">
                      SAVE {discount}%
                    </span>
                  </div>
                )}
              </div>

              {/* Preview images */}
              {product.preview_images && product.preview_images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {product.preview_images.slice(0, 3).map((img, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden bg-surface-container" style={{ aspectRatio: '4/3' }}>
                      <Image src={img} alt={`Preview ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-6 space-y-8">
              {/* Category + badges */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-label font-bold text-secondary uppercase tracking-widest capitalize">
                  {product.category.replace('-', ' ')}
                </span>
                {product.is_bestseller && (
                  <span className="bg-secondary-container/50 text-on-secondary-container text-xs font-label font-bold px-3 py-1 rounded-full">
                    ⭐ Best Seller
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-headline font-black text-3xl md:text-4xl text-on-surface leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="material-symbols-outlined text-sm text-primary"
                      style={{ fontVariationSettings: `'FILL' ${s <= Math.round(product.rating) ? 1 : 0}` }}>
                      star
                    </span>
                  ))}
                </div>
                <span className="font-label font-bold text-on-surface text-sm">{product.rating.toFixed(1)}</span>
                <span className="text-on-surface-variant text-sm">({product.review_count.toLocaleString()} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="font-label font-black text-4xl text-primary">${product.price.toFixed(2)}</span>
                {product.original_price && (
                  <span className="font-label text-on-surface-variant text-xl line-through">${product.original_price.toFixed(2)}</span>
                )}
                {discount && (
                  <span className="font-label font-bold text-sm text-error">Save {discount}%</span>
                )}
              </div>

              {/* Short desc */}
              <p className="text-on-surface-variant text-base font-body leading-relaxed">
                {product.short_description}
              </p>

              {/* Feature bullets */}
              <div className="space-y-3">
                {['Instant Digital Delivery', 'Lifetime Access & Updates', 'Secure Download Link', '7-Day Satisfaction Guarantee'].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                    <span className="text-on-surface-variant text-sm font-body">{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <BuyButton product={product} />

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                {[
                  { icon: 'lock', label: 'Secure Order' },
                  { icon: 'bolt', label: 'Instant Access' },
                  { icon: 'support_agent', label: 'WhatsApp Support' },
                ].map(({ icon, label }) => (
                  <div key={label} className="bg-surface-container rounded-xl p-3 flex flex-col items-center gap-2 text-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                    <span className="text-on-surface-variant text-xs font-label font-semibold">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full description */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="font-headline font-black text-2xl text-on-surface mb-6">About This Product</h2>
              <div className="text-on-surface-variant font-body leading-relaxed space-y-4 whitespace-pre-line">
                {product.description}
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8">
                  {product.tags.map((tag: string) => (
                    <span key={tag} className="bg-surface-container text-on-surface-variant text-xs font-label font-semibold px-3 py-1.5 rounded-full capitalize">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="bg-surface-container rounded-2xl p-6 space-y-4 sticky top-28">
                <h3 className="font-headline font-bold text-base text-on-surface mb-4">Product Details</h3>
                {[
                  { label: 'Category', value: product.category.replace('-', ' ') },
                  { label: 'Format', value: 'Digital Download' },
                  { label: 'Language', value: 'English' },
                  { label: 'Access', value: 'Lifetime' },
                  { label: 'Support', value: 'WhatsApp + Email' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                    <span className="text-on-surface-variant text-sm font-label">{label}</span>
                    <span className="text-on-surface text-sm font-label font-semibold capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-headline font-black text-2xl text-on-surface mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
