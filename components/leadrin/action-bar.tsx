"use client"

import { Phone, Mail, Calendar, ArrowRight } from "lucide-react"

interface ActionBarProps {
  salespersonFirstName: string
  phone?: string
  email: string
  onBook: () => void
}

export function ActionBar({ salespersonFirstName, phone, email, onBook }: ActionBarProps) {
  return (
    <section className="bg-foreground text-primary-foreground px-6 pb-10">
      {/* Divider line */}
      <div className="h-px bg-primary-foreground/10 mb-8" />

      <p className="text-center font-serif text-xl mb-5">
        {"Let's get in touch"}
      </p>

      {/* Primary CTA */}
      <a
        href={phone ? `tel:${phone}` : undefined}
        className="flex items-center justify-center gap-2.5 h-[52px] w-full rounded-full bg-primary-foreground text-foreground text-[13px] font-semibold uppercase tracking-[0.12em] mb-4 transition-opacity hover:opacity-90"
      >
        <Phone className="h-4 w-4" />
        Call {salespersonFirstName}
        <ArrowRight className="h-3.5 w-3.5 ml-1" />
      </a>

      {/* Secondary Buttons Row */}
      <div className="flex gap-3">
        <a
          href={`mailto:${email}`}
          className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-full border border-primary-foreground/25 text-primary-foreground text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-primary-foreground/8"
        >
          <Mail className="h-3.5 w-3.5" />
          Email
        </a>
        <button
          onClick={onBook}
          className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-full border border-primary-foreground/25 text-primary-foreground text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-primary-foreground/8"
        >
          <Calendar className="h-3.5 w-3.5" />
          Book a Visit
        </button>
      </div>
    </section>
  )
}
