import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, Manrope } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-label',
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Digital Bite — Premium Digital Marketplace',
  description: 'Discover and download premium digital products: courses, templates, AI tools, software, and more. High-conversion digital downloads for creators and professionals.',
  keywords: 'digital products, online courses, templates, AI tools, software, downloads',
  openGraph: {
    title: 'Digital Bite — Premium Digital Marketplace',
    description: 'Premium digital products for creators and professionals.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${inter.variable} ${manrope.variable} bg-background text-on-background font-body antialiased selection:bg-primary selection:text-on-primary`}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161a21',
              color: '#ecedf6',
              border: '1px solid rgba(69,72,79,0.3)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#81ecff', secondary: '#005762' },
            },
            error: {
              iconTheme: { primary: '#ff716c', secondary: '#490006' },
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
