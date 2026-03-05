"use client"

interface HeroProps {
  buyerName: string
  dealershipName: string
  dealershipLogo?: string
  vehicleTitle: string
  salespersonName: string
  salespersonRating: number
}

export function Hero({
  buyerName,
  dealershipName,
  vehicleTitle,
}: HeroProps) {
  const firstName = buyerName.split(" ")[0]

  return (
    <section className="bg-white px-6 pt-4 pb-3 border-b border-neutral-100">
      {/* Dealership */}
      <p className="text-xs text-neutral-400 mb-1">{dealershipName}</p>
      
      {/* Personalized Title */}
      <h1 className="text-lg font-semibold text-neutral-900">
        {firstName}, meet your {vehicleTitle}
      </h1>
    </section>
  )
}
