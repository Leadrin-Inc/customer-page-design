"use client"

import { useEffect, useRef, useState } from "react"
import { sampleDataModern } from "@/lib/sample-data"
import { Hero } from "@/components/modern/hero"
import { ActionBar } from "@/components/modern/action-bar"
import { VehicleMedia } from "@/components/modern/vehicle-media"
import { VehicleDetails } from "@/components/modern/vehicle-details"
import { SalespersonVideo } from "@/components/modern/salesperson-video"
import { SalespersonProfile } from "@/components/modern/salesperson-profile"
import { Reviews } from "@/components/modern/reviews"
import { BookingForm } from "@/components/modern/booking-form"
import { StickyBottomBar } from "@/components/modern/sticky-bottom-bar"
import { Footer } from "@/components/modern/footer"
import { ModernVirtualTour } from "@/components/modern/virtual-tour"
import "./theme.css"

export default function ModernPage() {
  const [showStickyBar, setShowStickyBar] = useState(false)
  const actionBarRef = useRef<HTMLDivElement>(null)
  const bookingRef = useRef<HTMLDivElement>(null)

  const { buyer, dealership, vehicle, salesperson, reviews } = sampleDataModern

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

  return (
    <main className="theme-modern min-h-screen bg-background max-w-lg mx-auto">
      {/* Virtual Tour */}
      <ModernVirtualTour
        buyerName={buyer.name}
        vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`}
        vehicleImage={vehicle.photos[0]}
        price={vehicle.price}
        salespersonName={salesperson.name}
        salespersonInitial={salesperson.name.charAt(0)}
        dealershipName={dealership.name}
        onBook={scrollToBooking}
        onCall={() => window.open(`tel:${salesperson.phone}`)}
      />

      {/* Hero - Compact */}
      <Hero
        buyerName={buyer.name}
        dealershipName={dealership.name}
        dealershipLogo={dealership.logo}
        vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        salespersonName={salesperson.name}
        salespersonRating={dealership.rating.stars}
      />

      {/* Vehicle Media - Features & Video - Front and Center */}
      <VehicleMedia
        vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        heroImage={vehicle.photos[0]}
        features={vehicle.features}
        walkaroundVideo={vehicle.walkaroundVideo}
      />

      {/* Action Bar - CTA after features */}
      <div ref={actionBarRef}>
        <ActionBar
          salespersonFirstName={salesperson.name.split(" ")[0]}
          phone={salesperson.phone}
          email={salesperson.email}
          onBook={scrollToBooking}
        />
      </div>

      {/* Vehicle Details - Photos */}
      <VehicleDetails
        photos={vehicle.photos}
        price={vehicle.price}
        mileage={vehicle.mileage}
        fuelType={vehicle.fuelType}
        transmission={vehicle.transmission}
        vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        carfaxUrl={vehicle.carfaxUrl}
      />

      {/* Salesperson Video Intro */}
      {salesperson.introVideo && (
        <SalespersonVideo
          salespersonName={salesperson.name}
          salespersonPhoto={salesperson.photo}
          videoUrl={salesperson.introVideo}
        />
      )}

      {/* Salesperson Profile */}
      <SalespersonProfile
        name={salesperson.name}
        title={salesperson.title}
        bio={salesperson.bio}
        photo={salesperson.photo}
        phone={salesperson.phone}
      />

      {/* Reviews */}
      <Reviews
        reviews={reviews}
        aggregateRating={dealership.rating.stars}
        totalReviews={dealership.rating.count}
        salespersonName={salesperson.name}
      />

      {/* Booking Form */}
      <div ref={bookingRef}>
        <BookingForm
          salespersonName={salesperson.name}
          buyerName={buyer.name}
          buyerPhone={buyer.phone}
          dealershipName={dealership.name}
        />
      </div>

      {/* Footer */}
      <Footer />

      {/* Sticky Bottom Bar */}
      <StickyBottomBar
        isVisible={showStickyBar}
        salespersonFirstName={salesperson.name.split(" ")[0]}
        phone={salesperson.phone}
        price={vehicle.price}
        onBook={scrollToBooking}
      />
    </main>
  )
}
