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
    <section className="px-5 py-8 border-t border-slate-100">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
          <Image src={photo} alt={name} fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{name}</h2>
          <p className="text-sm text-slate-500">{title}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-[15px] text-slate-600 leading-relaxed mb-5">
        {bio}
      </p>

      {/* Contact */}
      {phone && (
        <a
          href={`tel:${phone}`}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-slate-100 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <Phone className="h-4 w-4" />
          Call {firstName}
        </a>
      )}
    </section>
  )
}
