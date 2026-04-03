import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')
const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('x-admin-token')
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const productId = formData.get('product_id') as string | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'File too large (max 500MB)' }, { status: 400 })
    }

    // Sanitize file name
    const ext = path.extname(file.name).toLowerCase()
    const safeName = `${uuidv4()}${ext}`
    const filePath = path.join(UPLOADS_DIR, safeName)

    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, buffer)

    // Update product if ID provided
    if (productId) {
      const db = getDb()
      db.prepare(`UPDATE products SET file_path = ?, file_name = ?, updated_at = datetime('now') WHERE id = ?`)
        .run(safeName, file.name, productId)
    }

    return NextResponse.json({
      success: true,
      data: { file_path: safeName, file_name: file.name, size: file.size }
    })
  } catch (err) {
    console.error('[Upload]', err)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
