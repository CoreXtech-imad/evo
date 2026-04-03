import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 })
    }
    const db = getDb()
    const existing = db.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?').get(email)
    if (existing) {
      return NextResponse.json({ success: false, error: 'You are already subscribed!' }, { status: 409 })
    }
    db.prepare('INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?)').run(uuidv4(), email)
    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch (err) {
    console.error('[Newsletter]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('x-admin-token')
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const db = getDb()
    const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC').all()
    return NextResponse.json({ success: true, data: subscribers, total: (subscribers as unknown[]).length })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
