'use client'

import { useEffect, useState } from 'react'
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

interface Crypto {
  id: string
  symbol: string
  name: string
  priceUsd: string
}

export default function CurrencyConverter() {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [loading, setLoading] = useState(true)
  const [fromCurrency, setFromCurrency] = useState('')
  const [toCurrency, setToCurrency] = useState('')
  const [amount, setAmount] = useState<string>('1')
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          'https://api.coincap.io/v2/assets?limit=10',
        )

        if (!response.ok) {
          throw new Error('Failed to fetch cryptocurrency data')
        }

        const data = await response.json()
        setCryptos(data.data)

        // Set default values
        if (data.data.length >= 2) {
          setFromCurrency(data.data[0].id)
          setToCurrency(data.data[1].id)
        }
      } catch (err) {
        setError('Error fetching cryptocurrency data. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCryptos()
  }, [])

  const handleConvert = () => {
    if (!fromCurrency || !toCurrency || !amount) {
      setError('Please select currencies and enter an amount')
      return
    }

    try {
      const fromCryptoPrice = cryptos.find(
        (c) => c.id === fromCurrency,
      )?.priceUsd
      const toCryptoPrice = cryptos.find((c) => c.id === toCurrency)?.priceUsd

      if (!fromCryptoPrice || !toCryptoPrice) {
        setError('Could not find price data for selected currencies')
        return
      }

      const fromValueInUsd =
        Number.parseFloat(amount) * Number.parseFloat(fromCryptoPrice)
      const convertedValue = fromValueInUsd / Number.parseFloat(toCryptoPrice)

      setConvertedAmount(convertedValue.toFixed(8))
      setError(null)
    } catch (err) {
      setError('Error performing conversion')
      console.error(err)
    }
  }

  const handleSwap = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
    setConvertedAmount(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert between cryptocurrencies</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-4 text-center">Loading currencies...</div>
        ) : (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  setConvertedAmount(null)
                }}
                placeholder="Enter amount"
                min="0"
                step="any"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="from-currency" className="text-sm font-medium">
                From
              </label>
              <Select
                value={fromCurrency}
                onValueChange={(value) => {
                  setFromCurrency(value)
                  setConvertedAmount(null)
                }}
              >
                <SelectTrigger id="from-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {cryptos.map((crypto) => (
                    <SelectItem key={`from-${crypto.id}`} value={crypto.id}>
                      {crypto.name} ({crypto.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="my-2 flex justify-center">
              <Button variant="outline" size="icon" onClick={handleSwap}>
                <ArrowRightLeft className="h-4 w-4" />
                <span className="sr-only">Swap currencies</span>
              </Button>
            </div>

            <div className="grid gap-2">
              <label htmlFor="to-currency" className="text-sm font-medium">
                To
              </label>
              <Select
                value={toCurrency}
                onValueChange={(value) => {
                  setToCurrency(value)
                  setConvertedAmount(null)
                }}
              >
                <SelectTrigger id="to-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {cryptos.map((crypto) => (
                    <SelectItem key={`to-${crypto.id}`} value={crypto.id}>
                      {crypto.name} ({crypto.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleConvert} className="mt-2">
              Convert
            </Button>

            {error && (
              <div className="text-destructive mt-2 text-sm">{error}</div>
            )}

            {convertedAmount && (
              <div className="bg-muted mt-4 rounded-md p-4">
                <div className="text-muted-foreground text-sm">Result:</div>
                <div className="mt-1 text-xl font-bold">
                  {amount} {cryptos.find((c) => c.id === fromCurrency)?.symbol}{' '}
                  =
                </div>
                <div className="text-primary text-2xl font-bold">
                  {convertedAmount}{' '}
                  {cryptos.find((c) => c.id === toCurrency)?.symbol}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
