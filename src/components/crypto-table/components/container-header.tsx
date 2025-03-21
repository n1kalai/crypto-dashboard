'use client'

import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTimeFromMilliseconds } from '@/lib/utils'

import { RefreshCw } from 'lucide-react'

import { SwitchUSDToEUR } from './switch-usd-to-eur'

type Props = {
  dataUpdatedAt: number
  refetchCryptoData: () => void
  isFetching: boolean
}

export const CryptoContainerHeader = ({
  dataUpdatedAt,
  refetchCryptoData,
  isFetching,
}: Props) => (
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
      <div className="flex flex-col items-center gap-6 md:flex-row">
        <SwitchUSDToEUR />

        <button
          onClick={() => refetchCryptoData()}
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm"
          disabled={isFetching}
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>
    </div>
  </CardHeader>
)
