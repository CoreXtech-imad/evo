import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import FAQSection from '@/components/home/FAQSection'
import NewsletterSection from '@/components/home/NewsletterSection'
import { Product } from '@/types'

async function getProducts(): Promise<{ featured: Product[]; bestsellers: Product[] }> {
  try {
    // Use direct DB call (server component)
    const { getDb } = await import('@/lib/db')
    const db = getDb()

    const featured = db.prepare(`
      SELECT * FROM products WHERE featured = 1 ORDER BY created_at DESC LIMIT 6
    `).all() as Product[]

    const bestsellers = db.prepare(`
      SELECT * FROM products WHERE is_bestseller = 1 ORDER BY rating DESC LIMIT 6
    `).all() as Product[]

    // Parse JSON fields
    const parse = (p: Product) => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
      preview_images: typeof p.preview_images === 'string' ? JSON.parse(p.preview_images) : p.preview_images,
    })

    return {
      featured: featured.map(parse),
      bestsellers: bestsellers.map(parse),
    }
  } catch (e) {
    console.error('Failed to load products:', e)
    return { featured: [], bestsellers: [] }
  }
}

export default async function HomePage() {
  const { featured, bestsellers } = await getProducts()

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts
          products={featured}
          title="Featured Products"
          subtitle="Hand-picked premium digital products to accelerate your work and career."
          badge="Editor's Choice"
          viewAllLink="/products?featured=true"
        />
        <FeaturedProducts
          products={bestsellers}
          title="Best Sellers"
          subtitle="The most popular products loved by thousands of customers worldwide."
          badge="Top Rated"
          viewAllLink="/products?sort=bestseller"
        />
        <TestimonialsSection />
        <FAQSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
