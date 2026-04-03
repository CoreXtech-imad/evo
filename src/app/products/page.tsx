import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductsClient from './ProductsClient'
import { Product } from '@/types'

async function getAllProducts(category?: string, sort?: string, featured?: string): Promise<Product[]> {
  try {
    const { getDb } = await import('@/lib/db')
    const db = getDb()

    let query = 'SELECT * FROM products WHERE 1=1'
    const params: (string | number)[] = []

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }
    if (featured === 'true') {
      query += ' AND featured = 1'
    }

    if (sort === 'bestseller') query += ' AND is_bestseller = 1 ORDER BY rating DESC'
    else if (sort === 'new') query += ' ORDER BY created_at DESC'
    else if (sort === 'price_asc') query += ' ORDER BY price ASC'
    else if (sort === 'price_desc') query += ' ORDER BY price DESC'
    else query += ' ORDER BY featured DESC, created_at DESC'

    const products = db.prepare(query).all(...params) as Product[]
    return products.map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
      preview_images: typeof p.preview_images === 'string' ? JSON.parse(p.preview_images) : p.preview_images,
    }))
  } catch (e) {
    console.error(e)
    return []
  }
}

interface PageProps {
  searchParams: { category?: string; sort?: string; featured?: string; q?: string }
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const products = await getAllProducts(searchParams.category, searchParams.sort, searchParams.featured)

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24">
        <ProductsClient
          initialProducts={products}
          initialCategory={searchParams.category || ''}
          initialSort={searchParams.sort || ''}
          initialQuery={searchParams.q || ''}
        />
      </main>
      <Footer />
    </>
  )
}
