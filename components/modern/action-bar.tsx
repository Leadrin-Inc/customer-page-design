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
    <section className="px-5 py-6">
      {/* Primary CTA - Bold pill */}
      <button
        onClick={onBook}
        className="w-full h-14 bg-blue-600 text-white font-semibold text-[15px] rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
      >
        Schedule a Test Drive
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Secondary - understated */}
      <div className="flex gap-3 mt-3">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full bg-slate-100 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full bg-slate-100 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
        )}
      </div>
    </section>
  )
}
