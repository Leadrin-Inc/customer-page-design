"use client"

import { Phone } from "lucide-react"

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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-3 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        {/* Price */}
        <p className="text-lg font-semibold text-neutral-900">
          ${price.toLocaleString()}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="h-10 w-10 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
              aria-label={`Call ${salespersonFirstName}`}
            >
              <Phone className="h-4 w-4 text-neutral-600" />
            </a>
          )}
          <button
            onClick={onBook}
            className="h-10 px-5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Visit
          </button>
        </div>
      </div>
    </div>
  )
}
