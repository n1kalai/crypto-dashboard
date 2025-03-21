'use client'

import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTimeFromMilliseconds } from '@/lib/utils'

import { RefreshCw, Search } from 'lucide-react'

import { SwitchUSDToEUR } from './switch-usd-to-eur'
import { Input } from '@/components/ui/input'
import { ChangeEvent } from 'react'

type Props = {
  dataUpdatedAt: number
  refetchCryptoData: () => void
  isFetching: boolean
  searchString: string
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const CryptoContainerHeader = ({
  dataUpdatedAt,
  refetchCryptoData,
  isFetching,
  searchString,
  onSearchChange,
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
    <div className="relative mt-2">
      <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
      <Input
        type="search"
        placeholder="Search by name, symbol or rank..."
        value={searchString}
        onChange={onSearchChange}
        className="pl-8"
      />
    </div>
  </CardHeader>
)
