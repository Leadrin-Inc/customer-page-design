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
  salespersonRating,
}: HeroProps) {
  const firstName = buyerName.split(" ")[0]

  return (
    <section className="px-5 pt-5 pb-4">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
          {dealershipName}
        </span>
        <span className="text-[11px] font-medium text-slate-500">
          {salespersonRating} stars
        </span>
      </div>
      
      {/* Main headline - asymmetric, editorial */}
      <h1 className="text-[28px] font-bold tracking-tight text-slate-900 leading-[1.1]">
        {firstName},
        <br />
        <span className="text-blue-600">this one{"'"}s for you.</span>
      </h1>
      
      {/* Vehicle as subtle tag */}
      <p className="mt-3 text-sm text-slate-500">
        {vehicleTitle}
      </p>
    </section>
  )
}
