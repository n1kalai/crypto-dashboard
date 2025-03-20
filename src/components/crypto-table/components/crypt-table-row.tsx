import { TableCell, TableRow } from '@/components/ui/table'
import { formatMarketCap } from '@/lib/utils'
import { Crypto } from '@/types/crypto-type'
import { ArrowDown, ArrowUp } from 'lucide-react'
import cs from 'classnames'

type Props = {
  crypto: Crypto
  price: string
  isPositive?: boolean
  isnotDefined?: boolean
}

export const CryptoTableRow = ({
  crypto,
  price,
  isPositive,
  isnotDefined,
}: Props) => (
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
          'text-green-600': isPositive,
          'text-red-600': !isnotDefined && !isPositive,
          'text-black': isnotDefined,
        })}
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
