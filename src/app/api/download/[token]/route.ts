import { NextRequest, NextResponse } from 'next/server'
import { validateDownloadToken } from '@/lib/security'
import { getDb } from '@/lib/db'
import { Product } from '@/types'
import path from 'path'
import fs from 'fs'

export async function GET(_: NextRequest, { params }: { params: { token: string } }) {
  const { valid, reason, productId } = validateDownloadToken(params.token)

  if (!valid) {
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head><title>Download Error | Digital Bite</title></head>
        <body style="background:#0b0e14;color:#ecedf6;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
          <div style="text-align:center;max-width:400px;padding:40px;">
            <div style="font-size:48px;margin-bottom:20px;">⚠️</div>
            <h1 style="color:#ff716c;font-size:24px;margin-bottom:12px;">Download Unavailable</h1>
            <p style="color:#a9abb3;margin-bottom:24px;">${reason}</p>
            <a href="/" style="background:linear-gradient(135deg,#81ecff,#dd8bfb);color:#005762;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:700;">Return to Store</a>
          </div>
        </body>
      </html>
    `, { status: 403, headers: { 'Content-Type': 'text/html' } })
  }

  try {
    const db = getDb()
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId!) as Product | undefined

    if (!product || !product.file_path) {
      // Serve a placeholder if no file is configured (demo mode)
      return new NextResponse('Product file not configured. Contact support.', { status: 404 })
    }

    const filePath = path.join(process.cwd(), 'uploads', product.file_path)

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found. Please contact support.', { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filePath)
    const fileName = product.file_name || path.basename(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[Download]', err)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
