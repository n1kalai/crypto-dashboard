'use client'

import { useReducer, useMemo } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { CRYPTO_DATA } from '@/services/query-keys'

interface Crypto {
  id: string
  symbol: string
  name: string
  priceUsd: string
}

interface State {
  fromCurrency: string
  toCurrency: string
  amount: string
  convertedAmount: string | null
  error: string | null
}

type Action =
  | { type: 'SET_FROM_CURRENCY'; payload: string }
  | { type: 'SET_TO_CURRENCY'; payload: string }
  | { type: 'SET_AMOUNT'; payload: string }
  | { type: 'SET_CONVERTED_AMOUNT'; payload: string | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SWAP_CURRENCIES' }

const initialState: State = {
  fromCurrency: '',
  toCurrency: '',
  amount: '1',
  convertedAmount: null,
  error: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FROM_CURRENCY':
      return { ...state, fromCurrency: action.payload, convertedAmount: null }
    case 'SET_TO_CURRENCY':
      return { ...state, toCurrency: action.payload, convertedAmount: null }
    case 'SET_AMOUNT':
      return { ...state, amount: action.payload, convertedAmount: null }
    case 'SET_CONVERTED_AMOUNT':
      return { ...state, convertedAmount: action.payload, error: null }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SWAP_CURRENCIES':
      return {
        ...state,
        fromCurrency: state.toCurrency,
        toCurrency: state.fromCurrency,
        convertedAmount: null,
      }
    default:
      return state
  }
}

export default function CurrencyConverter() {
  const queryClient = useQueryClient()
  const cryptoData: Record<string, Crypto> = queryClient.getQueryData([
    CRYPTO_DATA,
  ])!

  const cryptos: Crypto[] = useMemo(
    () => Object.values(cryptoData || {}),
    [cryptoData],
  )

  const [state, dispatch] = useReducer(reducer, initialState)

  const handleConvert = () => {
    if (!state.fromCurrency || !state.toCurrency || !state.amount) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Please select currencies and enter an amount',
      })
      return
    }

    try {
      const fromCrypto = cryptoData[state.fromCurrency]
      const toCrypto = cryptoData[state.toCurrency]

      if (!fromCrypto || !toCrypto) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Could not find price data for selected currencies',
        })
        return
      }

      const fromValueInUsd =
        Number.parseFloat(state.amount) * Number.parseFloat(fromCrypto.priceUsd)
      const convertedValue =
        fromValueInUsd / Number.parseFloat(toCrypto.priceUsd)

      dispatch({
        type: 'SET_CONVERTED_AMOUNT',
        payload: convertedValue.toFixed(8),
      })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Error performing conversion' })
      console.error(err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert between cryptocurrencies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Input
            type="number"
            value={state.amount}
            onChange={(e) =>
              dispatch({ type: 'SET_AMOUNT', payload: e.target.value })
            }
            placeholder="Enter amount"
            min="0"
            step="any"
          />

          <Select
            value={state.fromCurrency}
            onValueChange={(value) =>
              dispatch({ type: 'SET_FROM_CURRENCY', payload: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {cryptos.map((crypto) => (
                <SelectItem key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => dispatch({ type: 'SWAP_CURRENCIES' })}
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <Select
            value={state.toCurrency}
            onValueChange={(value) =>
              dispatch({ type: 'SET_TO_CURRENCY', payload: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {cryptos.map((crypto) => (
                <SelectItem key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleConvert}>Convert</Button>

          {state.error && (
            <div className="text-destructive mt-2 text-sm">{state.error}</div>
          )}
          {state.convertedAmount && (
            <div className="bg-muted mt-4 rounded-md p-4">
              <div className="text-muted-foreground text-sm">Result:</div>
              <div className="mt-1 text-xl font-bold">
                {state.amount} {cryptoData[state.fromCurrency]?.symbol} =
              </div>
              <div className="text-primary text-2xl font-bold">
                {state.convertedAmount} {cryptoData[state.toCurrency]?.symbol}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
