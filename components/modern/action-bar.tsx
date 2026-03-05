"use client"

import { Phone, Mail, ArrowRight } from "lucide-react"

interface ActionBarProps {
  salespersonFirstName: string
  phone?: string
  email?: string
  onBook?: () => void
}

export function ActionBar({
  salespersonFirstName,
  phone,
  email,
  onBook,
}: ActionBarProps) {
  return (
    <section className="px-6 py-6 bg-white border-b border-border">
      {/* Primary CTA - Gradient Button */}
      <button
        onClick={onBook}
        className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-[15px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-4"
      >
        Schedule with {salespersonFirstName}
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Secondary Actions */}
      <div className="flex gap-3">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
        )}
      </div>
    </section>
  )
}
