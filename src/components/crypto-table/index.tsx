'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody } from '@/components/ui/table'
import { useCryptoData } from '@/hooks/use-crypto-data'

import { CryptoContainerHeader } from './components/container-header'
import { CryptoTableHeader } from './components/table-header'
import { CryptoTableRow } from './components/crypt-table-row'
import { useMemo } from 'react'

export default function CryptoTable() {
  const {
    data: cryptos,
    isFetching,
    error,
    dataUpdatedAt,
    refetchCryptoData,
  } = useCryptoData()

  const cryptoData = useMemo(() => Object.values(cryptos) || [], [cryptos])

  return (
    <Card>
      <CryptoContainerHeader
        dataUpdatedAt={dataUpdatedAt}
        refetchCryptoData={refetchCryptoData}
        isFetching={isFetching}
      />

      <CardContent>
        {error ? (
          <div className="text-destructive py-4 text-center">
            {error.message}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <CryptoTableHeader />

              <TableBody>
                {cryptoData.map((crypto) => {
                  const isPositive = crypto.className === 'highlight-green'
                  const isnotDefined = typeof crypto.className === 'undefined'

                  return (
                    <CryptoTableRow
                      key={crypto.id}
                      crypto={crypto}
                      price={crypto.priceUsd}
                      isPositive={isPositive}
                      isnotDefined={isnotDefined}
                    />
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
