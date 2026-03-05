import { Phone, Award, Clock, Shield } from "lucide-react"
import Image from "next/image"

interface SalespersonProfileProps {
  name: string
  title: string
  bio: string
  photo: string
  phone?: string
}

export function SalespersonProfile({
  name,
  title,
  bio,
  photo,
  phone,
}: SalespersonProfileProps) {
  const firstName = name.split(" ")[0]

  const highlights = [
    { icon: Award, text: "Top-rated specialist" },
    { icon: Clock, text: "Quick responses" },
    { icon: Shield, text: "Trusted advisor" },
  ]

  return (
    <section className="bg-white px-6 py-8 border-t border-border">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
        <h2 className="text-xl font-semibold text-foreground">Meet {firstName}</h2>
      </div>

      {/* Profile Card */}
      <div className="flex items-start gap-4 mb-6">
        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-secondary flex-shrink-0 ring-2 ring-violet-100">
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
        {bio}
      </p>

      {/* Highlights - Stripe style */}
      <div className="space-y-3 mb-6">
        {highlights.map((highlight) => (
          <div key={highlight.text} className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <highlight.icon className="h-4 w-4 text-violet-600" />
            </div>
            <span className="text-sm text-foreground">{highlight.text}</span>
          </div>
        ))}
      </div>

      {/* Contact Button */}
      {phone && (
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
        >
          <Phone className="h-4 w-4" />
          Contact {firstName}
        </a>
      )}
    </section>
  )
}
