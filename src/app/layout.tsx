import type { Metadata } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'
import Providers from '@/providers/react-query'

import './globals.css'
import Header from '@/components/header'
import { fetchCryptoData } from '@/services/get-crypto-data'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Crypto Dashboard',
  description: 'Crypto Dashboard',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const nav = await fetchCryptoData()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header nav={Object.values(nav)} />
          {children}
        </Providers>
      </body>
    </html>
  )
}
