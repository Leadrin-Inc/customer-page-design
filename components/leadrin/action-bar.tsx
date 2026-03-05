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
    <section className="bg-foreground text-primary-foreground px-6 pb-12">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 w-full">
          <a
            href={phone ? `tel:${phone}` : undefined}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full bg-primary-foreground text-foreground text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-90"
          >
            <Phone className="h-4 w-4" />
            Call {salespersonFirstName}
          </a>
          <button
            onClick={onBook}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full border border-primary-foreground/30 text-primary-foreground text-sm font-semibold tracking-wide uppercase transition-colors hover:bg-primary-foreground/10"
          >
            <Calendar className="h-4 w-4" />
            Book Visit
          </button>
        </div>
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors py-2"
        >
          <Mail className="h-3.5 w-3.5" />
          Send an email
        </a>
      </div>
    </section>
  )
}
