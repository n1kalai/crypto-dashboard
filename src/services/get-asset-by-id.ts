import { AssetType } from '@/types/asset-type'
import { TimeFrame } from '@/types/time-frame'
import { format } from 'date-fns'

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
  console.log('interval', interval)
  console.log('timeFrame', timeFrame)
  try {
    const res = await fetch(
      `https://api.coincap.io/v2/assets/${id}/history?interval=${interval}&start=${start}&end=${Date.now()}`,
      { next: { tags: ['asset', id], revalidate: 60 * 60 } },
    )

    if (!res.ok) {
      return [] // Return an empty array if the request fails, and if it is empty we know it has failed
    }

    const data = await res.json()

    return data.data.map((item: AssetType) => ({
      date: formatDateByTimeFrame(new Date(item.time), timeFrame),
      price: Number.parseFloat(item.priceUsd),
      fullDate: new Date(item.time),
    }))
  } catch (error) {
    console.error('Error fetching asset data:', error)
    return [] // Return an empty array if the request fails, and if it is empty we know it has failed
  }
}
