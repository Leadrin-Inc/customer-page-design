"use client"

import { ArrowRight, Phone, Mail } from "lucide-react"

interface PrestigeActionBarProps {
  salespersonFirstName: string
  phone?: string
  email?: string
  onBook: () => void
}

export function PrestigeActionBar({
  salespersonFirstName,
  phone,
  email,
  onBook,
}: PrestigeActionBarProps) {
  return (
    <section className="bg-background px-6 py-10">
      {/* Primary CTA */}
      <button
        onClick={onBook}
        className="w-full py-4 bg-foreground text-background text-sm font-medium uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors mb-4"
      >
        Schedule Private Viewing
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Secondary Actions */}
      <div className="flex gap-3">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex-1 py-3 border border-foreground text-foreground text-xs font-medium uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            Call {salespersonFirstName}
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex-1 py-3 border border-foreground text-foreground text-xs font-medium uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </a>
        )}
      </div>
    </section>
  )
}
