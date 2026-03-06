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
    <section className="bg-background px-5 py-6">
      {/* Primary CTA */}
      <button
        onClick={onBook}
        className="w-full py-3.5 bg-foreground text-background text-xs font-medium uppercase tracking-[0.12em] flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors mb-3"
      >
        Schedule Private Viewing
        <ArrowRight className="h-3.5 w-3.5" />
      </button>

      {/* Secondary Actions */}
      <div className="flex gap-2">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex-1 py-2.5 border border-foreground text-foreground text-[10px] font-medium uppercase tracking-[0.12em] flex items-center justify-center gap-1.5 hover:bg-foreground hover:text-background transition-colors"
          >
            <Phone className="h-3 w-3" />
            Call
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex-1 py-2.5 border border-foreground text-foreground text-[10px] font-medium uppercase tracking-[0.12em] flex items-center justify-center gap-1.5 hover:bg-foreground hover:text-background transition-colors"
          >
            <Mail className="h-3 w-3" />
            Email
          </a>
        )}
      </div>
    </section>
  )
}
