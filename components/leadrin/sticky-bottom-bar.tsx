"use client"

import { Phone } from "lucide-react"
import { cn } from "@/lib/utils"

interface StickyBottomBarProps {
  isVisible: boolean
  salespersonFirstName: string
  phone?: string
  price: number
  onBook: () => void
}

export function StickyBottomBar({
  isVisible,
  salespersonFirstName,
  phone,
  price,
  onBook,
}: StickyBottomBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background border-t border-border",
        "px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
        "transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Price */}
        <div>
          <p className="text-lg font-semibold text-foreground">
            ${price.toLocaleString()}
          </p>
        </div>

        {/* Reserve Button - Airbnb coral */}
        <button
          onClick={onBook}
          className="px-6 h-12 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:brightness-95"
        >
          Reserve
        </button>
      </div>
    </div>
  )
}
