"use client"

import { Phone, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
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
        "bg-card border-t border-border",
        "px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        "transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center gap-2 max-w-lg mx-auto">
        {/* Primary Call Button */}
        <Button
          asChild
          className="flex-1 h-11"
          disabled={!phone}
        >
          <a href={phone ? `tel:${phone}` : undefined}>
            <Phone className="h-4 w-4 mr-2" />
            Call {salespersonFirstName}
          </a>
        </Button>

        {/* Email Button */}
        <Button
          variant="outline"
          size="icon"
          asChild
          className="h-11 w-11"
        >
          <a href={`mailto:${email}`}>
            <Mail className="h-4 w-4" />
            <span className="sr-only">Email {salespersonFirstName}</span>
          </a>
        </Button>

        {/* Book Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11"
          onClick={onBook}
        >
          <Calendar className="h-4 w-4" />
          <span className="sr-only">Book a visit</span>
        </Button>
      </div>
    </div>
  )
}
