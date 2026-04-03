'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Product } from '@/types'

interface Props {
  product?: Partial<Product>
  mode: 'create' | 'edit'
}

const CATEGORIES = ['courses', 'templates', 'ai-tools', 'ebooks', 'software', 'marketing']

export default function ProductForm({ product, mode }: Props) {
  const router = useRouter()
  const adminToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-dev-token'
  const [loading, setLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    price: product?.price?.toString() || '',
    original_price: product?.original_price?.toString() || '',
    category: product?.category || 'courses',
    image_url: product?.image_url || '',
    tags: Array.isArray(product?.tags) ? (product.tags as string[]).join(', ') : '',
    file_path: product?.file_path || '',
    file_name: product?.file_name || '',
    max_downloads: product?.max_downloads?.toString() || '100',
    featured: product?.featured ? true : false,
    is_bestseller: product?.is_bestseller ? true : false,
    is_new: product?.is_new !== undefined ? Boolean(product.is_new) : true,
  })

  function set(key: string, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (product?.id) fd.append('product_id', product.id)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-token': adminToken },
        body: fd,
      })
      const data = await res.json()
      if (data.success) {
        set('file_path', data.data.file_path)
        set('file_name', data.data.file_name)
        toast.success('File uploaded successfully')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploadLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.price || !form.description || !form.image_url) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const body = {
        ...form,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        max_downloads: parseInt(form.max_downloads),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        preview_images: form.image_url ? [form.image_url] : [],
      }

      const url = mode === 'edit' ? `/api/products/${product?.id}` : '/api/products'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(mode === 'edit' ? 'Product updated!' : 'Product created!')
        router.push('/admin/products')
      } else {
        toast.error(data.error || 'Failed to save product')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic info */}
      <div className="bg-surface-container rounded-2xl p-7 space-y-5">
        <h2 className="font-headline font-bold text-base text-on-surface border-b border-outline-variant/10 pb-4">Basic Information</h2>

        <div className="space-y-2">
          <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Product Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} required
            className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface text-sm" placeholder="e.g. Next.js SaaS Starter Kit" />
        </div>

        <div className="space-y-2">
          <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Short Description *</label>
          <input value={form.short_description} onChange={e => set('short_description', e.target.value)} required
            className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface text-sm" placeholder="One line summary shown in cards" />
        </div>

        <div className="space-y-2">
          <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Full Description *</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={5}
            className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface text-sm resize-y" placeholder="Detailed product description..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface text-sm appearance-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Price (USD) *</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)} required
              className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface text-sm" placeholder="49.99" />
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Original Price</label>
            <input type="number" step="0.01" min="0" value={form.original_price} onChange={e => set('original_price', e.target.value)}
              className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface text-sm" placeholder="99.99 (optional)" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tags (comma separated)</label>
          <input value={form.tags} onChange={e => set('tags', e.target.value)}
            className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface text-sm" placeholder="nextjs, saas, typescript, boilerplate" />
        </div>
      </div>

      {/* Media */}
      <div className="bg-surface-container rounded-2xl p-7 space-y-5">
        <h2 className="font-headline font-bold text-base text-on-surface border-b border-outline-variant/10 pb-4">Media</h2>
        <div className="space-y-2">
          <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Product Image URL *</label>
          <input value={form.image_url} onChange={e => set('image_url', e.target.value)} required
            className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface text-sm" placeholder="https://images.unsplash.com/..." />
        </div>
        {form.image_url && (
          <div className="relative rounded-xl overflow-hidden w-48 h-32">
            <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Digital file */}
      <div className="bg-surface-container rounded-2xl p-7 space-y-5">
        <h2 className="font-headline font-bold text-base text-on-surface border-b border-outline-variant/10 pb-4">Digital File</h2>
        <div className="space-y-2">
          <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Upload Product File</label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploadLoading}
              className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface text-sm file:bg-surface-container-highest file:border-0 file:text-primary file:font-label file:font-bold file:text-xs file:px-3 file:py-1.5 file:rounded-lg file:mr-3 file:cursor-pointer cursor-pointer"
            />
            {uploadLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {form.file_name && (
            <div className="flex items-center gap-2 text-primary text-sm font-label">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              {form.file_name}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Max Downloads per Order</label>
          <input type="number" min="1" value={form.max_downloads} onChange={e => set('max_downloads', e.target.value)}
            className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface text-sm" />
        </div>
      </div>

      {/* Visibility */}
      <div className="bg-surface-container rounded-2xl p-7 space-y-4">
        <h2 className="font-headline font-bold text-base text-on-surface border-b border-outline-variant/10 pb-4">Visibility & Labels</h2>
        {[
          { key: 'featured', label: 'Featured', desc: 'Show on homepage featured section' },
          { key: 'is_bestseller', label: 'Best Seller', desc: 'Mark with bestseller badge' },
          { key: 'is_new', label: 'New', desc: 'Show NEW badge on product' },
        ].map(({ key, label, desc }) => (
          <label key={key} className="flex items-center justify-between cursor-pointer group">
            <div>
              <div className="font-label font-bold text-sm text-on-surface">{label}</div>
              <div className="text-on-surface-variant text-xs">{desc}</div>
            </div>
            <div
              onClick={() => set(key, !form[key as keyof typeof form])}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${form[key as keyof typeof form] ? 'bg-primary' : 'bg-surface-container-highest'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-on-primary transition-all duration-300 ${form[key as keyof typeof form] ? 'left-7' : 'left-1 bg-on-surface-variant'}`} />
            </div>
          </label>
        ))}
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary px-10 py-4 text-sm flex items-center gap-2 disabled:opacity-60">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />Saving...</>
          ) : (
            <><span className="material-symbols-outlined text-base">save</span>{mode === 'edit' ? 'Update Product' : 'Create Product'}</>
          )}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')} className="btn-ghost px-8 py-4 text-sm">
          Cancel
        </button>
      </div>
    </form>
  )
}
