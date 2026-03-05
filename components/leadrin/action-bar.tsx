"use client"

import { Phone, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ActionBarProps {
  salespersonFirstName: string
  phone?: string
  email: string
  onBook: () => void
}

export function ActionBar({ salespersonFirstName, phone, email, onBook }: ActionBarProps) {
  return (
    <section className="px-5 py-6 bg-card border-b border-border">
      {/* Primary CTA */}
      <Button
        asChild
        className="w-full h-14 text-base font-semibold mb-3"
        disabled={!phone}
      >
        <a href={phone ? `tel:${phone}` : undefined}>
          <Phone className="h-5 w-5 mr-2" />
          Call {salespersonFirstName}
        </a>
      </Button>

      {/* Secondary CTAs */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          asChild
          className="flex-1 h-12"
        >
          <a href={`mailto:${email}`}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </a>
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-12"
          onClick={onBook}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book a Visit
        </Button>
      </div>
    </section>
  )
}
