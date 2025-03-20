import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: string) => {
  const numPrice = Number.parseFloat(price)
  if (numPrice > 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(numPrice)
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
    }).format(numPrice)
  }
}

export const formatMarketCap = (marketCap: string) => {
  const cap = Number.parseFloat(marketCap)
  if (cap >= 1e12) {
    return `$${(cap / 1e12).toFixed(2)}T`
  } else if (cap >= 1e9) {
    return `$${(cap / 1e9).toFixed(2)}B`
  } else if (cap >= 1e6) {
    return `$${(cap / 1e6).toFixed(2)}M`
  } else {
    return `$${cap.toFixed(2)}`
  }
}

export const formatPercent = (percent: string) => {
  return Number.parseFloat(percent).toFixed(2) + '%'
}

export function getTimeFromMilliseconds(ms: number) {
  const date = new Date(ms)
  const hours = date.getHours().toString().padStart(2, '0') // Ensure two-digit format
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
