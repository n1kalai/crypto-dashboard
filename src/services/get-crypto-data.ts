import type { Crypto } from "@/types/crypto-type"
import { queryOptions } from '@tanstack/react-query'
import { CRYPTO_DATA } from "./query-keys"


const fetchCryptoData = async (): Promise<Record<string, Crypto>> => {
  try {
    const response = await fetch(`https://api.coincap.io/v2/assets?limit=10`)

    if (!response.ok) {
      throw new Error('Failed to fetch cryptocurrency data')
    }

    const data = await response.json()

    return data.data.reduce((acc: Record<string, Crypto>, crypto: any) => {
      acc[crypto.id] = {
        id: crypto.id,
        rank: crypto.rank,
        symbol: crypto.symbol,
        name: crypto.name,
        priceUsd: crypto.priceUsd,
        changePercent24Hr: crypto.changePercent24Hr,
        marketCapUsd: crypto.marketCapUsd,
        volumeUsd24Hr: crypto.volumeUsd24Hr
      };
      return acc;
    }, {});

  } catch (err) {
    throw new Error('Failed to fetch cryptocurrency data')
  }
}


export const cryptoDataOptions = queryOptions({
  queryKey: [CRYPTO_DATA],
  queryFn: fetchCryptoData,
})

