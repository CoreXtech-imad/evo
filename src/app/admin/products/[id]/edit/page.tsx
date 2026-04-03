import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Product } from '@/types'

async function getProduct(id: string): Promise<Product | null> {
  try {
    const { getDb } = await import('@/lib/db')
    const db = getDb()
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | undefined
    if (!product) return null
    return {
      ...product,
      tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags,
      preview_images: typeof product.preview_images === 'string' ? JSON.parse(product.preview_images) : product.preview_images,
    }
  } catch { return null }
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8 pt-4 md:pt-0">
        <div className="flex items-center gap-3 text-sm text-on-surface-variant mb-4 font-label">
          <Link href="/admin/products" className="hover:text-primary transition-colors">Products</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-on-surface truncate max-w-xs">{product.name}</span>
        </div>
        <h1 className="font-headline font-black text-3xl text-on-surface tracking-tight">Edit Product</h1>
        <p className="text-on-surface-variant mt-1">Update the details for this product.</p>
      </div>
      <ProductForm product={product} mode="edit" />
    </div>
  )
}
