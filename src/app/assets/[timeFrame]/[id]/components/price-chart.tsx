'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { AssetType } from '@/types/asset-type'
import { cryptoDataOptions } from '@/services/get-crypto-data'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { formatPriceForChart } from '@/lib/utils'
import Script from 'next/script'
import { timeFrames } from '@/lib/constants'

type TooltipProps = {
  active?: boolean
  payload?: Array<{ payload: { price: string; fullDate: string } }>
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background rounded border p-2 shadow-md">
        <p className="text-sm font-medium">{format(data.fullDate, 'PPpp')}</p>
        <p className="text-primary text-sm font-bold">
          {formatPriceForChart(data.price)}
        </p>
      </div>
    )
  }
  return null
}

type Props = {
  chartData: AssetType[]
}

export default function PriceChart({ chartData }: Props) {
  const { data } = useSuspenseQuery(cryptoDataOptions)
  const { push } = useRouter()
  const { id: assetId, timeFrame } = useParams<{
    id: string
    timeFrame: keyof typeof timeFrames
  }>()

  const cryptoList = Object.values(data || {})
  const crypto = data[assetId]
  const currentPrice = crypto?.priceUsd ?? 0

  if (!timeFrames[timeFrame] || !crypto) {
    return null
  }

  const error = chartData.length === 0 ? 'No data available' : null

  // Get current crypto name and symbol
  const getCurrentCryptoInfo = () => {
    return crypto ? `${crypto.name} (${crypto.symbol})` : assetId
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: crypto.name,
    identifier: crypto.symbol,
    offers: {
      '@type': 'Offer',
      price: currentPrice,
      priceCurrency: 'USD',
    },
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <CardTitle>{getCurrentCryptoInfo()} Price Chart</CardTitle>
              <CardDescription>
                Historical price data from CoinCap
              </CardDescription>
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <Select
                value={assetId}
                onValueChange={(v) => push(`/assets/${timeFrame}/${v}`)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {cryptoList.map((crypto) => (
                    <SelectItem key={crypto.id} value={crypto.id}>
                      {crypto.name} ({crypto.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Button
                  variant={timeFrame === '1d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    localStorage.setItem('timeFrame', '1d')
                    push(`/assets/1d/${assetId}`)
                  }}
                >
                  24H
                </Button>
                <Button
                  variant={timeFrame === '7d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    localStorage.setItem('timeFrame', '7d')
                    push(`/assets/7d/${assetId}`)
                  }}
                >
                  7D
                </Button>
                <Button
                  variant={timeFrame === '30d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    localStorage.setItem('timeFrame', '30d')
                    push(`/assets/30d/${assetId}`)
                  }}
                >
                  30D
                </Button>
              </div>
            </div>
          </div>
          {currentPrice && (
            <div className="mt-2">
              <p className="text-2xl font-bold">
                {formatPriceForChart(currentPrice)}
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-destructive flex h-[200px] items-center justify-center md:h-[400px]">
              <p>{error}</p>
            </div>
          ) : (
            <div className="h-[200px] w-full md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--muted))"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    tickFormatter={(value) => formatPriceForChart(value)}
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    width={80}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      <Script
        id={crypto.name}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
