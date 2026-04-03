'use client'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'

export default function BuyButton({ product }: { product: Product }) {
  const router = useRouter()

  function handleBuy() {
    // Store product in sessionStorage before redirecting to checkout
    sessionStorage.setItem('checkout_product', JSON.stringify(product))
    router.push(`/checkout?product=${product.id}`)
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleBuy}
        className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3"
      >
        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
        Buy Now — ${product.price.toFixed(2)}
      </button>
      <p className="text-center text-xs text-on-surface-variant font-label">
        🔒 Secure order · Instant digital delivery
      </p>
    </div>
  )
}
