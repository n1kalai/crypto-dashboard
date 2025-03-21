'use client'

import { Switch } from '@/components/ui/switch'
import { useRouter, useSearchParams } from 'next/navigation'

export const SwitchUSDToEUR = () => {
  const urlParams = useSearchParams()
  const { push } = useRouter()

  const exchange = urlParams.get('ex')
  const showEUR = typeof exchange === 'string' && exchange === 'eur'

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="currency-toggle"
        checked={showEUR}
        onCheckedChange={(e) => {
          if (showEUR) {
            push('/?ex=usd')
          } else {
            push('/?ex=eur')
          }
        }}
      />

      <label htmlFor="currency-toggle" className="text-sm">
        {showEUR ? 'USD' : 'EUR'}
      </label>
    </div>
  )
}
