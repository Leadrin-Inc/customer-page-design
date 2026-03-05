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
    <section className="px-6 py-6 bg-white border-y border-neutral-100">
      {/* Primary CTA */}
      <button
        onClick={onBook}
        className="w-full py-3.5 px-6 bg-blue-600 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors mb-3"
      >
        Schedule with {salespersonFirstName}
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Secondary Actions */}
      <div className="flex gap-2">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
        )}
      </div>
    </section>
  )
}
