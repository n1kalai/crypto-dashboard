import { AssetType } from '@/types/asset-type'
import { format } from 'date-fns'

type TimeFrame = '1d' | '7d' | '30d'

const formatDateByTimeFrame = (date: Date, timeFrame: TimeFrame): string => {
  if (timeFrame === '1d') {
    return format(date, 'HH:mm')
  } else if (timeFrame === '7d') {
    return format(date, 'MMM dd HH:mm')
  } else {
    return format(date, 'MMM dd')
  }
}

export const getAssetById = async ({
  id,
  interval,
  start,
  timeFrame,
}: {
  id: string
  interval: string
  start: number
  timeFrame: TimeFrame
}): Promise<AssetType[]> => {
  const res = await fetch(
    `https://api.coincap.io/v2/assets/${id}/history?interval=${interval}&start=${start}&end=${Date.now()}`,
    { next: { tags: ['asset', id] } },
  )

  if (!res.ok) {
    return []
  }

  const data = await res.json()

  const formattedData = data.data.map((item: AssetType) => {
    const date = new Date(item.time)
    return {
      date: formatDateByTimeFrame(date, timeFrame),
      price: Number.parseFloat(item.priceUsd),
      fullDate: date,
    }
  })

  return formattedData
}
