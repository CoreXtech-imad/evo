'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'

interface Props {
  product: Product
  featured?: boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`material-symbols-outlined text-sm ${star <= Math.round(rating) ? 'text-primary' : 'text-outline-variant'}`}
          style={{ fontVariationSettings: `'FILL' ${star <= Math.round(rating) ? 1 : 0}` }}>
          star
        </span>
      ))}
      <span className="text-on-surface-variant text-xs font-label ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function ProductCard({ product, featured = false }: Props) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="product-card h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-3xl" style={{ height: featured ? '240px' : '200px' }}>
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-60" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <span className="lume-badge bg-error-dim text-white text-xs font-label font-bold px-3 py-1 rounded-full">
                NEW
              </span>
            )}
            {product.is_bestseller && (
              <span className="bg-gradient-to-r from-primary to-secondary text-on-primary text-xs font-label font-bold px-3 py-1 rounded-full">
                BEST SELLER
              </span>
            )}
          </div>

          {discount && (
            <div className="absolute top-3 right-3 bg-error-dim/90 text-white text-xs font-label font-bold px-2 py-1 rounded-lg">
              -{discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 gap-3">
          {/* Category chip */}
          <span className="text-xs font-label font-bold text-secondary uppercase tracking-wider">
            {product.category.replace('-', ' ')}
          </span>

          {/* Title */}
          <h3 className={`font-headline font-bold text-on-surface group-hover:text-primary transition-colors duration-200 leading-tight ${featured ? 'text-xl' : 'text-base'}`}>
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-on-surface-variant text-sm font-body leading-relaxed line-clamp-2 flex-1">
            {product.short_description}
          </p>

          {/* Rating */}
          <StarRating rating={product.rating} />

          {/* Price row */}
          <div className="flex items-center justify-between mt-2 pt-4 border-t border-outline-variant/10">
            <div className="flex items-baseline gap-2">
              <span className="font-label font-black text-primary text-xl">${product.price.toFixed(2)}</span>
              {product.original_price && (
                <span className="font-label text-on-surface-variant text-sm line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-on-surface-variant group-hover:text-primary transition-all duration-200 flex items-center gap-1 text-sm font-label font-semibold">
              Buy
              <span className="material-symbols-outlined text-base transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
            </span>
          </div>
        </div>

        {/* Light-leak hover effect */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-container/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </Link>
  )
}
