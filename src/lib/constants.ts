export const EUR_PRICE = 0.92

export const timeFrames = {
  '1d': {
    interval: 'm5' as const,
    timeFrame: '1d' as const,
  },
  '7d': {
    interval: 'h2' as const,
    timeFrame: '7d' as const,
  },
  '30d': {
    interval: 'h12' as const,
    timeFrame: '30d' as const,
  },
}
