import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'

export default function NewProductPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="mb-8 pt-4 md:pt-0">
        <div className="flex items-center gap-3 text-sm text-on-surface-variant mb-4 font-label">
          <Link href="/admin/products" className="hover:text-primary transition-colors">Products</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-on-surface">New Product</span>
        </div>
        <h1 className="font-headline font-black text-3xl text-on-surface tracking-tight">Add New Product</h1>
        <p className="text-on-surface-variant mt-1">Fill in the details to add a product to your store.</p>
      </div>
      <ProductForm mode="create" />
    </div>
  )
}
