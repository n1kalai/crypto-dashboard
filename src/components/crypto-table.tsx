'use client'

import { ArrowDown, ArrowUp, RefreshCw } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCryptoData } from '@/hooks/use-crypto-data'

import { formatMarketCap, formatPercent, formatPrice, getTimeFromMilliseconds } from '@/lib/utils'

import cs from 'classnames'


export default function CryptoTable() {
  const { data: cryptos, isLoading, error, dataUpdatedAt, refetchCryptoData } = useCryptoData()
  const cryptoData = Object.values(cryptos)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Top 10 Cryptocurrencies</CardTitle>
            <CardDescription>
              {dataUpdatedAt && (
                <span className="text-muted-foreground text-xs">
                  Last updated: {getTimeFromMilliseconds(dataUpdatedAt)}
                </span>
              )}
            </CardDescription>
          </div>
          <button
            onClick={() => refetchCryptoData()}
            className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-destructive py-4 text-center">{error.message}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Market Cap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cryptoData.map((crypto) => {
                  const isPositive = crypto.className === 'highlight-green' 
                  const isnotDefined = typeof crypto.className === 'undefined'
                  
                  const price = formatPrice(crypto.priceUsd)

                    return (
                      <TableRow key={crypto.id + "-" + price} className={crypto.className || ''}>
                        <TableCell className="font-medium">
                          {crypto.rank}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{crypto.name}</span>
                            <span className="text-muted-foreground text-xs">
                              {crypto.symbol}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                        <div
                            className={cs('flex items-center justify-end gap-1', {
                              'text-green-600': isPositive,
                              'text-red-600': !isnotDefined && !isPositive,
                              'text-black': isnotDefined
                            })
                          }
                          >
                            {price}

                            {typeof isPositive !== 'undefined' && isPositive ? (
                                <ArrowUp className="h-4 w-4" />
                              ) : (
                                <ArrowDown className="h-4 w-4" />
                              )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatMarketCap(crypto.marketCapUsd)}
                        </TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
