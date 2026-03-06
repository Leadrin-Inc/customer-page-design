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
    <section className="bg-background text-foreground px-5 py-10">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Your Specialist
        </p>
        <h2 className="font-serif text-[26px] leading-tight">
          Meet {firstName}
        </h2>
      </div>

      {/* Profile Card */}
      <div className="text-center mb-6">
        <div className="relative h-20 w-20 mx-auto mb-3">
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <h3 className="text-base font-semibold mb-0.5">{name}</h3>
        <p className="text-xs text-muted-foreground mb-4">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
          {bio}
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center py-3 border-t border-border">
          <Award className="h-4 w-4 mx-auto mb-1.5 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Top Rated</p>
        </div>
        <div className="text-center py-3 border-t border-border">
          <Clock className="h-4 w-4 mx-auto mb-1.5 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">12+ Years</p>
        </div>
        <div className="text-center py-3 border-t border-border">
          <Shield className="h-4 w-4 mx-auto mb-1.5 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Certified</p>
        </div>
      </div>

      {/* Contact Button */}
      {phone && (
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-2 py-3 border border-foreground text-foreground text-[10px] uppercase tracking-[0.12em] hover:bg-foreground hover:text-background transition-colors"
        >
          <Phone className="h-3.5 w-3.5" />
          Call {firstName} Directly
        </a>
      )}
    </section>
  )
}
