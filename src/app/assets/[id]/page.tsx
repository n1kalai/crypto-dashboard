import { getQueryClient } from '@/providers/react-query/get-query-client'
import { getAssetById } from '@/services/get-asset-by-id'
import { cryptoDataOptions, fetchCryptoData } from '@/services/get-crypto-data'
import PriceChart from './components/price-chart'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export const dynamic = 'force-static'

type Params = Promise<{ id: string }>

export async function generateStaticParams() {
  const nav = await fetchCryptoData()

  return Object.keys(nav).map((id) => ({ id }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const nav = await fetchCryptoData()
  const { id } = await params
  const title = nav?.[id]?.name || ''
  return {
    title,
    description: title,
    openGraph: {
      title,
      description: title,
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
      title,
      description: title,
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
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function Page(props: { params: Params }) {
  const params = await props.params
  const { id } = params

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(cryptoDataOptions)

  const [oneDayData, sevenDayData, oneMonthData] = await Promise.all([
    getAssetById({
      id: id,
      interval: 'm5',
      start: Date.now() - 24 * 60 * 60 * 1000,
      timeFrame: '1d',
    }),
    getAssetById({
      id: id,
      interval: 'h2',
      start: Date.now() - 7 * 24 * 60 * 60 * 1000,
      timeFrame: '7d',
    }),
    getAssetById({
      id: id,
      interval: 'h12',
      start: Date.now() - 30 * 24 * 60 * 60 * 1000,
      timeFrame: '30d',
    }),
  ])

  return (
    <main className="container mx-auto px-4 py-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PriceChart
          oneDayData={oneDayData}
          sevenDayData={sevenDayData}
          oneMonthData={oneMonthData}
        />
      </HydrationBoundary>
    </main>
  )
}
