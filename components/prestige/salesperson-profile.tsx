import { Phone, Award, Clock, Shield } from "lucide-react"
import Image from "next/image"

interface PrestigeSalespersonProfileProps {
  name: string
  title: string
  bio: string
  photo: string
  phone?: string
}

export function PrestigeSalespersonProfile({
  name,
  title,
  bio,
  photo,
  phone,
}: PrestigeSalespersonProfileProps) {
  const firstName = name.split(" ")[0]

  return (
    <section className="bg-background text-foreground px-6 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
          Your Specialist
        </p>
        <h2 className="font-serif text-[32px] leading-tight">
          Meet {firstName}
        </h2>
      </div>

      {/* Profile Card */}
      <div className="text-center mb-10">
        <div className="relative h-24 w-24 mx-auto mb-4">
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-6">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          {bio}
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="text-center py-4 border-t border-border">
          <Award className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Rated</p>
        </div>
        <div className="text-center py-4 border-t border-border">
          <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">12+ Years</p>
        </div>
        <div className="text-center py-4 border-t border-border">
          <Shield className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Certified</p>
        </div>
      </div>

      {/* Contact Button */}
      {phone && (
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-2 py-4 border border-foreground text-foreground text-xs uppercase tracking-[0.15em] hover:bg-foreground hover:text-background transition-colors"
        >
          <Phone className="h-4 w-4" />
          Call {firstName} Directly
        </a>
      )}
    </section>
  )
}
