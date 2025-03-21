'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { formatMarketCap, formatTablePrice } from '@/lib/utils'
import { Crypto } from '@/types/crypto-type'
import { ArrowDown, ArrowUp } from 'lucide-react'
import cs from 'classnames'
import { useSearchParams } from 'next/navigation'
import { EUR_PRICE } from '@/lib/constants'

type Props = {
  crypto: Crypto
  price: string
  priceIncreased?: boolean
  priceNotUpdated?: boolean
}

export const CryptoTableRow = ({
  crypto,
  price,
  priceIncreased,
  priceNotUpdated,
}: Props) => {
  const urlParams = useSearchParams()

  const exchange = urlParams.get('ex')
  const showEUR = typeof exchange === 'string' && exchange === 'eur'

  return (
    <TableRow key={crypto.id + '-' + price} className={crypto.className || ''}>
      <TableCell className="font-medium">{crypto.rank}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-medium">{crypto.name}</span>
          <span className="text-muted-foreground text-xs">{crypto.symbol}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div
          className={cs('flex items-center justify-end gap-1', {
            'text-green-600': priceIncreased,
            'text-red-600': !priceNotUpdated && !priceIncreased,
            'text-black': priceNotUpdated,
          })}
        >
          {formatTablePrice(price, showEUR, EUR_PRICE)}

          {typeof priceIncreased !== 'undefined' && priceIncreased ? (
            <ArrowUp className="h-4 w-4"  data-testid="arrow-up-icon"/>
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </div>
      </TableCell>
      <TableCell className="hidden text-right md:table-cell">
        {formatMarketCap(crypto.marketCapUsd, showEUR, EUR_PRICE)}
      </TableCell>
    </TableRow>
  )
}
