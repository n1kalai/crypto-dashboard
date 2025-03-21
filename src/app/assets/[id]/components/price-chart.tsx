'use client'

import { useState } from 'react'
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

type TimeFrame = '1d' | '7d' | '30d'

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
  oneDayData: AssetType[]
  sevenDayData: AssetType[]
  oneMonthData: AssetType[]
}

export default function PriceChart({
  oneDayData,
  sevenDayData,
  oneMonthData,
}: Props) {
  const { data } = useSuspenseQuery(cryptoDataOptions)
  const { push } = useRouter()
  const { id: assetId } = useParams()

  const selectedCrypto = assetId as string
  const cryptoList = Object.values(data || {})
  const currentPrice = data?.[selectedCrypto]?.priceUsd ?? 0

  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1d')
  const [priceData, setPriceData] = useState<AssetType[]>(oneDayData)

  const oneMonthError = timeFrame === '30d' && oneMonthData.length === 0
  const oneDayError = timeFrame === '1d' && oneDayData.length === 0
  const sevenDayError = timeFrame === '7d' && sevenDayData.length === 0

  const error =
    oneMonthError || oneDayError || sevenDayError ? 'No data available' : null

  // Get current crypto name and symbol
  const getCurrentCryptoInfo = () => {
    const crypto = data[selectedCrypto]
    return crypto ? `${crypto.name} (${crypto.symbol})` : selectedCrypto
  }

  return (
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
              value={selectedCrypto}
              onValueChange={(v) => push('/assets/' + v)}
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
                  setTimeFrame('1d')
                  setPriceData(oneDayData)
                  localStorage.setItem('timeframe', '1d')
                }}
              >
                24H
              </Button>
              <Button
                variant={timeFrame === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTimeFrame('7d')
                  setPriceData(sevenDayData)
                  localStorage.setItem('timeframe', '7d')
                }}
              >
                7D
              </Button>
              <Button
                variant={timeFrame === '30d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTimeFrame('30d')
                  setPriceData(oneMonthData)
                  localStorage.setItem('timeframe', '30d')
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
          <div className="text-destructive flex h-[400px] items-center justify-center">
            <p>{error}</p>
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={priceData}
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
  )
}
