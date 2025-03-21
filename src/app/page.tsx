import CryptoTable from '@/components/crypto-table'
import CurrencyConverter from '@/components/currency-converter'

import { getQueryClient } from '@/providers/react-query/get-query-client'
import { cryptoDataOptions } from '@/services/get-crypto-data'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

// export metadata
export const metadata = {
  title: 'Crypto Dashboard',
  description:
    'Real-time cryptocurrency market cap rankings, trading charts, and more.',
  openGraph: {
    title: 'Crypto Dashboard',
    description:
      'Real-time cryptocurrency market cap rankings, trading charts, and more.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        width: 800,
        height: 600,
      },
      {
        url: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=2097&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        width: 1800,
        height: 1600,
      },
    ],
  },
  twitter: {
    title: 'Crypto Dashboard',
    description:
      'Real-time cryptocurrency market cap rankings, trading charts, and more.',
    card: 'summary_large_image',
    images: [
      'https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Home() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(cryptoDataOptions)

  return (
    <main className="container mx-auto px-4 py-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <h1 className="mb-8 text-3xl font-bold">Cryptocurrency Dashboard</h1>
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CryptoTable />
          </div>
          <div>
            <CurrencyConverter />
          </div>
        </div>
      </HydrationBoundary>
    </main>
  )
}
