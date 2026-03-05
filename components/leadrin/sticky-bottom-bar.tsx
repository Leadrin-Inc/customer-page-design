"use client"

import { Phone, Mail, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface StickyBottomBarProps {
  isVisible: boolean
  salespersonFirstName: string
  phone?: string
  email: string
  onBook: () => void
}

export function StickyBottomBar({
  isVisible,
  salespersonFirstName,
  phone,
  email,
  onBook,
}: StickyBottomBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-foreground",
        "px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        "transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center gap-2 max-w-lg mx-auto">
        {/* Primary Call Button */}
        <a
          href={phone ? `tel:${phone}` : undefined}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-full bg-primary-foreground text-foreground text-xs font-semibold uppercase tracking-[0.1em]"
        >
          <Phone className="h-3.5 w-3.5" />
          Call {salespersonFirstName}
        </a>

        {/* Email Button */}
        <a
          href={`mailto:${email}`}
          className="h-11 w-11 rounded-full border border-primary-foreground/30 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
          aria-label={`Email ${salespersonFirstName}`}
        >
          <Mail className="h-4 w-4" />
        </a>

        {/* Book Button */}
        <button
          onClick={onBook}
          className="h-11 w-11 rounded-full border border-primary-foreground/30 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
          aria-label="Book a visit"
        >
          <Calendar className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
