"use client"

import { Phone, ArrowRight } from "lucide-react"

interface PrestigeStickyBottomBarProps {
  isVisible: boolean
  salespersonFirstName: string
  phone?: string
  price: number
  onBook: () => void
}

export function PrestigeStickyBottomBar({
  isVisible,
  salespersonFirstName,
  phone,
  price,
  onBook,
}: PrestigeStickyBottomBarProps) {
  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border animate-in slide-in-from-bottom-2">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
        {/* Price */}
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">From</p>
          <p className="text-lg font-semibold">${price.toLocaleString()}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="h-11 w-11 border border-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              aria-label={`Call ${salespersonFirstName}`}
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={onBook}
            className="h-11 px-5 bg-foreground text-background text-xs uppercase tracking-[0.1em] flex items-center gap-2 hover:bg-foreground/90 transition-colors"
          >
            Reserve
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
