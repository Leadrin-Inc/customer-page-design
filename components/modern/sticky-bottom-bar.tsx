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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-5 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        {/* Price */}
        <div>
          <p className="text-lg font-bold text-slate-900">${price.toLocaleString()}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <Phone className="h-4 w-4 text-slate-700" />
            </a>
          )}
          <button
            onClick={onBook}
            className="h-10 px-5 bg-blue-600 text-white font-semibold text-sm rounded-full hover:bg-blue-700 transition-colors"
          >
            Book with {salespersonFirstName}
          </button>
        </div>
      </div>
    </div>
  )
}
