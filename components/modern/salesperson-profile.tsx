import { Phone } from "lucide-react"
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

  return (
    <section className="bg-white px-6 py-8 border-t border-neutral-100">
      <h2 className="text-lg font-semibold text-neutral-900 mb-5">Meet {firstName}</h2>

      {/* Profile */}
      <div className="flex items-start gap-4 mb-5">
        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0">
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-base font-semibold text-neutral-900">{name}</h3>
          <p className="text-sm text-neutral-500">{title}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-neutral-600 leading-relaxed mb-6">
        {bio}
      </p>

      {/* Contact Button */}
      {phone && (
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          <Phone className="h-4 w-4" />
          Contact {firstName}
        </a>
      )}
    </section>
  )
}
