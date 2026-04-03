import crypto from 'crypto'
import { getDb } from './db'
import { v4 as uuidv4 } from 'uuid'
import { addHours } from 'date-fns'

export function generateDownloadToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `DB-${timestamp}-${random}`
}

export function createDownloadLink(orderId: string, productId: string, maxDownloads = 5): string {
  const db = getDb()
  const token = generateDownloadToken()
  const expiresAt = addHours(new Date(), 48).toISOString()

  db.prepare(`
    INSERT INTO download_links (id, order_id, product_id, token, expires_at, max_downloads)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(uuidv4(), orderId, productId, token, expiresAt, maxDownloads)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/api/download/${token}`
}

export function validateDownloadToken(token: string): {
  valid: boolean
  reason?: string
  productId?: string
  orderId?: string
} {
  const db = getDb()

  const link = db.prepare(`
    SELECT * FROM download_links WHERE token = ?
  `).get(token) as {
    id: string
    order_id: string
    product_id: string
    expires_at: string
    download_count: number
    max_downloads: number
    is_active: number
  } | undefined

  if (!link) return { valid: false, reason: 'Invalid download link' }
  if (!link.is_active) return { valid: false, reason: 'This download link has been deactivated' }
  if (new Date() > new Date(link.expires_at)) return { valid: false, reason: 'This download link has expired' }
  if (link.download_count >= link.max_downloads) return { valid: false, reason: 'Download limit exceeded' }

  // Increment download count
  db.prepare(`
    UPDATE download_links SET download_count = download_count + 1 WHERE token = ?
  `).run(token)

  return { valid: true, productId: link.product_id, orderId: link.order_id }
}

export function hashAdminPassword(password: string): string {
  return crypto.createHash('sha256').update(password + (process.env.ADMIN_SALT || 'digitalbite_salt')).digest('hex')
}

export function generateAdminToken(): string {
  return crypto.randomBytes(48).toString('hex')
}

export function validateAdminToken(token: string): boolean {
  const db = getDb()
  const session = db.prepare(`
    SELECT * FROM admin_sessions WHERE token = ? AND expires_at > datetime('now')
  `).get(token)
  return !!session
}
