export const EUR_PRICE = 0.92

export const timeFrames = {
  '1d': {
    interval: 'm5' as const,
    timeFrame: '1d' as const,
    start: Date.now() - 24 * 60 * 60 * 1000,
  },
  '7d': {
    interval: 'h2' as const,
    timeFrame: '7d' as const,
    start: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  '30d': {
    interval: 'h12' as const,
    timeFrame: '30d' as const,
    start: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
}
