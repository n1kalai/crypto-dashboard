'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HomeIcon, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Crypto } from '@/types/crypto-type'

import cs from 'classnames'
import { useParams } from 'next/navigation'

export default function ResponsiveHeader({ nav }: { nav: Crypto[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const params = useParams()

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold">
            <HomeIcon />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.id}
              href={`/assets/${item.id}`}
              className={cs(
                'hover:bg-accent hover:text-accent-foreground block rounded-md px-4 py-2 text-sm font-medium transition-colors',
                {
                  'bg-accent': item.id === params.id,
                },
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTitle className="hidden">Menu</SheetTitle>
          <SheetDescription className="hidden">Menu</SheetDescription>

          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <div className="mt-8 flex flex-col gap-4 pl-4">
              {nav.map((item) => (
                <Link
                  key={item.id}
                  href={`/assets/${item.id}`}
                  className="hover:text-primary text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
