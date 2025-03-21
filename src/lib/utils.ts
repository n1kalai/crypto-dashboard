import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTablePrice = (
  price: string,
  showEUR: boolean,
  EUR_USD_RATE: number,
) => {
  const numPrice = Number.parseFloat(price)

  const convertedPrice = showEUR ? numPrice * EUR_USD_RATE : numPrice
  const currencySymbol = showEUR ? '€' : '$'

  if (convertedPrice > 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: showEUR ? 'EUR' : 'USD',
      currencyDisplay: 'symbol',
    }).format(convertedPrice)
  } else {
    return currencySymbol + convertedPrice.toFixed(6)
  }
}

export const formatMarketCap = (
  marketCap: string,
  showEUR: boolean,
  EUR_USD_RATE: number,
) => {
  const cap = Number.parseFloat(marketCap)
  // Convert to EUR if the toggle is on
  const convertedCap = showEUR ? cap * EUR_USD_RATE : cap
  const currencySymbol = showEUR ? '€' : '$'

  if (convertedCap >= 1e12) {
    return `${currencySymbol}${(convertedCap / 1e12).toFixed(2)}T`
  } else if (convertedCap >= 1e9) {
    return `${currencySymbol}${(convertedCap / 1e9).toFixed(2)}B`
  } else if (convertedCap >= 1e6) {
    return `${currencySymbol}${(convertedCap / 1e6).toFixed(2)}M`
  } else {
    return `${currencySymbol}${convertedCap.toFixed(2)}`
  }
}

export function getTimeFromMilliseconds(ms: number) {
  const date = new Date(ms)
  const hours = date.getHours().toString().padStart(2, '0') // Ensure two-digit format
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export const formatPriceForChart = (price: number | string | null): string => {
  if (price === null) return 'N/A'
  const numPrice = typeof price === 'string' ? Number.parseFloat(price) : price

  if (numPrice < 1) {
    return `$${numPrice.toFixed(4)}`
  } else if (numPrice < 1000) {
    return `$${numPrice.toFixed(2)}`
  } else {
    return `$${numPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  }
}
