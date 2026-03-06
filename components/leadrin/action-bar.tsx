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
      {/* Primary CTA - Schedule Appointment */}
      <button
        onClick={onBook}
        className="flex items-center justify-center gap-2 h-12 w-full rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:brightness-95 active:scale-[0.99] animate-pulse-subtle"
      >
        <Calendar className="h-4 w-4" />
        Schedule with {salespersonFirstName}
      </button>

      {/* Secondary Buttons Row */}
      <div className="flex gap-3 mt-3">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg border border-foreground text-foreground font-semibold text-sm transition-colors hover:bg-secondary"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        )}
        <a
          href={`mailto:${email}`}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg border border-foreground text-foreground font-semibold text-sm transition-colors hover:bg-secondary"
        >
          <Mail className="h-4 w-4" />
          Email
        </a>
      </div>
    </section>
  )
}
