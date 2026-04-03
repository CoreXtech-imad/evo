export interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  price: number
  original_price?: number
  category: string
  tags: string[]
  image_url: string
  preview_images: string[]
  file_path?: string
  file_name?: string
  download_count: number
  max_downloads: number
  featured: boolean
  is_bestseller: boolean
  is_new: boolean
  rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  total_price: number
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_city: string
  customer_address: string
  payment_method: string
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  download_token?: string
  download_expires_at?: string
  download_count: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface DownloadLink {
  id: string
  order_id: string
  product_id: string
  token: string
  expires_at: string
  download_count: number
  max_downloads: number
  is_active: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  product_count: number
  color_from: string
  color_to: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar_url?: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  created_at: string
}

export interface CheckoutFormData {
  name: string
  phone: string
  email?: string
  city: string
  address: string
  payment_method: string
}

export interface OrderSummary {
  product: Product
  quantity: number
  total: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}
