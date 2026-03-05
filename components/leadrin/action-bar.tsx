"use client"

import { Phone, Mail, Calendar } from "lucide-react"


interface ActionBarProps {
  salespersonFirstName: string
  phone?: string
  email: string
  onBook: () => void
}

export function ActionBar({ salespersonFirstName, phone, email, onBook }: ActionBarProps) {
  return (
    <section className="bg-background px-6 py-6 border-b border-border">
      {/* Primary CTA - Airbnb coral/pink style */}
      <a
        href={phone ? `tel:${phone}` : undefined}
        className="flex items-center justify-center gap-2 h-12 w-full rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:brightness-95 active:scale-[0.99]"
      >
        <Phone className="h-4 w-4" />
        Call {salespersonFirstName}
      </a>

      {/* Secondary Buttons Row */}
      <div className="flex gap-3 mt-3">
        <a
          href={`mailto:${email}`}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg border border-foreground text-foreground font-semibold text-sm transition-colors hover:bg-secondary"
        >
          <Mail className="h-4 w-4" />
          Message
        </a>
        <button
          onClick={onBook}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg border border-foreground text-foreground font-semibold text-sm transition-colors hover:bg-secondary"
        >
          <Calendar className="h-4 w-4" />
          Schedule
        </button>
      </div>
    </section>
  )
}
