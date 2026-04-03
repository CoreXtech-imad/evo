'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Product } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const adminToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-dev-token'

  useEffect(() => {
    fetch('/api/products', { headers: { 'x-admin-token': adminToken } })
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.data) })
      .finally(() => setLoading(false))
  }, [adminToken])

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': adminToken },
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Product deleted')
        setProducts(prev => prev.filter(p => p.id !== id))
      }
    } catch {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl">
      <div className="mb-8 pt-4 md:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-black text-3xl text-on-surface tracking-tight">Products</h1>
          <p className="text-on-surface-variant mt-1">{products.length} products in store</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2">
          <span className="material-symbols-outlined text-base">add</span>
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
          {products.map(product => (
            <div key={product.id} className="bg-surface-container rounded-2xl overflow-hidden group">
              <div className="relative" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 flex gap-2">
                  {product.featured ? (
                    <span className="bg-primary/90 text-on-primary text-xs font-label font-bold px-2 py-1 rounded-lg">Featured</span>
                  ) : null}
                  {product.is_bestseller ? (
                    <span className="bg-secondary/90 text-on-secondary text-xs font-label font-bold px-2 py-1 rounded-lg">Bestseller</span>
                  ) : null}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-headline font-bold text-sm text-on-surface leading-tight truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-on-surface-variant text-xs font-label capitalize">{product.category}</span>
                      <span className="text-on-surface-variant text-xs">·</span>
                      <span className="text-primary font-label font-bold text-sm">${Number(product.price).toFixed(2)}</span>
                      {product.original_price && (
                        <span className="text-on-surface-variant text-xs line-through">${Number(product.original_price).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex-1 btn-ghost py-2 text-xs text-center inline-flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit
                  </Link>
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    className="px-3 py-2 bg-surface-container-high rounded-full text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id, product.name)}
                    className="px-3 py-2 bg-error/10 rounded-full text-error hover:bg-error/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
