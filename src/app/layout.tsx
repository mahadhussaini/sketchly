import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { ToasterClient } from '@/components/toaster-client'
import { HydrationSafeWrapper } from '@/components/hydration-safe-wrapper'
import { ErrorBoundaryWrapper } from '@/components/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sketchly - AI-Powered Sketch to Code',
  description: 'Transform your UI sketches into production-ready code with AI',
  keywords: ['AI', 'sketch to code', 'UI design', 'Next.js', 'Tailwind CSS'],
  authors: [{ name: 'Sketchly Team' }],
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'Sketchly - AI-Powered Sketch to Code',
    description: 'Transform your UI sketches into production-ready code with AI',
    type: 'website',
    images: [
      {
        url: '/logo.svg',
        width: 40,
        height: 40,
        alt: 'Sketchly Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sketchly - AI-Powered Sketch to Code',
    description: 'Transform your UI sketches into production-ready code with AI',
    images: ['/logo.svg'],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <ErrorBoundaryWrapper>
            <HydrationSafeWrapper>
              <div className="min-h-screen bg-background">
                {children}
              </div>
              <ToasterClient />
            </HydrationSafeWrapper>
          </ErrorBoundaryWrapper>
        </Providers>
      </body>
    </html>
  )
}
