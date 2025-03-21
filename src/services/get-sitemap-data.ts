import type { Crypto } from '@/types/crypto-type'
import { queryOptions } from '@tanstack/react-query'
import { CRYPTO_DATA } from './query-keys'
import { fetchCryptoData } from './get-crypto-data'

export const getSitemapData = async (): Promise<Record<string, Crypto>> => {
  try {
    const response = await fetch(`https://api.coincap.io/v2/assets?limit=10`, {
      next: { tags: [CRYPTO_DATA] },
    })

    if (!response.ok) {
      return {} // Return an empty object if the request fails, and if it is empty we know it has failed
    }

    const data = await response.json()

    return data.data
  } catch (err) {
    console.log('Error', err)
    return {} //  Return an empty object if the request fails, and if it is empty we know it has failed
  }
}

export const cryptoDataOptions = queryOptions({
  queryKey: [CRYPTO_DATA],
  queryFn: fetchCryptoData,
})
