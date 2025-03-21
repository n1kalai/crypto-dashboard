'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody } from '@/components/ui/table'
import { useCryptoData } from '@/hooks/use-crypto-data'

import { CryptoContainerHeader } from './components/container-header'
import { CryptoTableHeader } from './components/table-header'
import { CryptoTableRow } from './components/crypt-table-row'
import { useMemo, useState } from 'react'
import { NotFoundCell } from './components/not-found-cell'

export default function CryptoTable() {
  const {
    data: cryptos,
    isFetching,
    error,
    dataUpdatedAt,
    refetchCryptoData,
  } = useCryptoData()

  const [searchString, setSearchString] = useState('')

  const cryptoData = useMemo(() => {
    const data = Object.values(cryptos)

    if (searchString) {
      return data.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchString) ||
          crypto.symbol.toLowerCase().includes(searchString) ||
          crypto.rank.includes(searchString),
      )
    } else {
      return data
    }
  }, [searchString])

  return (
    <Card>
      <CryptoContainerHeader
        dataUpdatedAt={dataUpdatedAt}
        refetchCryptoData={refetchCryptoData}
        isFetching={isFetching}
        searchString={searchString}
        onSearchChange={(e) => setSearchString(e.target.value)}
      />

      <CardContent>
        {error ? (
          <div className="text-destructive py-4 text-center" data-testid="crypto-table-error">
            {error.message}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <CryptoTableHeader />

              <TableBody>
                {searchString && cryptoData.length === 0 ? (
                  <NotFoundCell searchString={searchString} />
                ) : (
                  cryptoData.map((crypto) => {
                    const priceIncreased =
                      crypto.className === 'highlight-green'
                    const priceNotUpdated =
                      typeof crypto.className === 'undefined'

                    return (
                      <CryptoTableRow
                        key={crypto.id}
                        crypto={crypto}
                        price={crypto.priceUsd}
                        priceIncreased={priceIncreased}
                        priceNotUpdated={priceNotUpdated}
                      />
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
