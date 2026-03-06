"use client"

import { useState, useRef, useEffect } from "react"
import { PrestigeHero } from "@/components/prestige/hero"
import { PrestigeActionBar } from "@/components/prestige/action-bar"
import { PrestigeVehicleMedia } from "@/components/prestige/vehicle-media"
import { PrestigeVehicleDetails } from "@/components/prestige/vehicle-details"
import { PrestigeSalespersonVideo } from "@/components/prestige/salesperson-video"
import { PrestigeSalespersonProfile } from "@/components/prestige/salesperson-profile"
import { PrestigeReviews } from "@/components/prestige/reviews"
import { PrestigeBookingForm } from "@/components/prestige/booking-form"
import { PrestigeStickyBottomBar } from "@/components/prestige/sticky-bottom-bar"
import { PrestigeFooter } from "@/components/prestige/footer"
import { prestigeData } from "@/lib/sample-data"
import "./theme.css"

export default function PrestigePage() {
  const [showStickyBar, setShowStickyBar] = useState(false)
  const actionBarRef = useRef<HTMLDivElement>(null)
  const bookingRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    if (actionBarRef.current) {
      observer.observe(actionBarRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const { buyer, dealership, vehicle, salesperson, reviews } = prestigeData

  return (
    <main className="theme-prestige min-h-screen bg-background max-w-lg mx-auto font-sans">
      <PrestigeHero
        buyerName={buyer.name}
        vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        rating={dealership.rating}
      />

      <PrestigeVehicleMedia
        vehicleImage={vehicle.photos[0]}
        features={vehicle.features}
        walkaroundVideo={vehicle.walkaroundVideo}
        vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      />

      <div ref={actionBarRef}>
        <PrestigeActionBar
          salespersonFirstName={salesperson.name.split(" ")[0]}
          phone={salesperson.phone}
          email={salesperson.email}
          onBook={scrollToBooking}
        />
      </div>

      <PrestigeVehicleDetails
        photos={vehicle.photos}
        year={vehicle.year}
        make={vehicle.make}
        model={vehicle.model}
        trim={vehicle.trim}
        price={vehicle.price}
        mileage={vehicle.mileage}
        fuelType={vehicle.fuelType}
        transmission={vehicle.transmission}
        carfaxUrl={vehicle.carfaxUrl}
      />

      {salesperson.introVideo && (
        <PrestigeSalespersonVideo
          salespersonName={salesperson.name}
          salespersonPhoto={salesperson.photo}
          videoUrl={salesperson.introVideo}
        />
      )}

      <PrestigeSalespersonProfile
        name={salesperson.name}
        title={salesperson.title}
        bio={salesperson.bio}
        photo={salesperson.photo}
        phone={salesperson.phone}
      />

      <PrestigeReviews
        aggregateRating={dealership.rating.stars}
        totalReviews={dealership.rating.count}
        reviews={reviews}
      />

      <PrestigeBookingForm
        ref={bookingRef}
        buyerName={buyer.name}
        buyerEmail={buyer.email}
        buyerPhone={buyer.phone}
        dealershipName={dealership.name}
      />

      <PrestigeFooter />

      <PrestigeStickyBottomBar
        isVisible={showStickyBar}
        salespersonFirstName={salesperson.name.split(" ")[0]}
        phone={salesperson.phone}
        price={vehicle.price}
        onBook={scrollToBooking}
      />
    </main>
  )
}
