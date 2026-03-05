"use client"

import { Phone, ArrowRight } from "lucide-react"

interface StickyBottomBarProps {
  isVisible: boolean
  salespersonFirstName: string
  phone?: string
  price: number
  onBook?: () => void
}

export function StickyBottomBar({
  isVisible,
  salespersonFirstName,
  phone,
  price,
  onBook,
}: StickyBottomBarProps) {
  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-3 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        {/* Price */}
        <div>
          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
            ${price.toLocaleString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label={`Call ${salespersonFirstName}`}
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={onBook}
            className="h-10 px-5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            Book
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
