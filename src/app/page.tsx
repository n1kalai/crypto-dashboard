import CryptoTable from '@/components/crypto-table'

import { getQueryClient } from '@/providers/react-query/get-query-client'
import { cryptoDataOptions } from '@/services/get-crypto-data'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

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
        </div>
      </HydrationBoundary>
    </main>
  )
}
