import { Footer } from '@/components/layout/Footer/index'
import { Header } from '@/components/layout/Header'
import LeftSidebar from '@/components/layout/Sidebar/LeftSidebar'
import RightSidebar from '@/components/layout/Sidebar/RightSidebar'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'A modern Next.js application with TypeScript and Tailwind CSS',
  keywords: ['nextjs', 'react', 'typescript', 'tailwindcss'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'My App',
    title: 'My App',
    description: 'A modern Next.js application with TypeScript and Tailwind CSS',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App',
    description: 'A modern Next.js application with TypeScript and Tailwind CSS',
    images: ['/og-image.jpg'],
    creator: '@yourusername',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-gray-100 min-h-screen`}
      >
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          <AuthProvider>
            <Header />
            <div className="flex min-h-[calc(100vh-4rem)]">
              <LeftSidebar />
              <div className="flex-1 flex flex-col pt-16 pl-64 pr-64">
                <main className="flex-1">
                  <div className="mx-auto max-w-7xl">
                    {children}
                  </div>
                </main>
                <Footer />
              </div>
              <RightSidebar />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
