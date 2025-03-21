import type { Crypto } from '@/types/crypto-type'
import { queryOptions } from '@tanstack/react-query'
import { CRYPTO_DATA } from './query-keys'

export const fetchCryptoData = async (): Promise<Record<string, Crypto>> => {
  try {
    const response = await fetch(`https://api.coincap.io/v2/assets?limit=10`, {
      next: { tags: [CRYPTO_DATA] },
    })

    if (!response.ok) {
      return {} // Return an empty object if the request fails, and if it is empty we know it has failed
    }

    const data = await response.json()

    return data.data.reduce((acc: Record<string, Crypto>, crypto: Crypto) => {
      acc[crypto.id] = {
        id: crypto.id,
        rank: crypto.rank,
        symbol: crypto.symbol,
        name: crypto.name,
        priceUsd: crypto.priceUsd,
        changePercent24Hr: crypto.changePercent24Hr,
        marketCapUsd: crypto.marketCapUsd,
        volumeUsd24Hr: crypto.volumeUsd24Hr,
      }
      return acc
    }, {})
  } catch (err) {
    console.log('Error', err)
    return {} //  Return an empty object if the request fails, and if it is empty we know it has failed
  }
}

export const cryptoDataOptions = queryOptions({
  queryKey: [CRYPTO_DATA],
  queryFn: fetchCryptoData,
})
