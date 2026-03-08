"use client"

import { useState, useRef, useEffect } from "react"
import { Hero } from "@/components/leadrin/hero"
import { ActionBar } from "@/components/leadrin/action-bar"
import { VehicleMedia } from "@/components/leadrin/vehicle-media"
import { VehicleDetails } from "@/components/leadrin/vehicle-details"
import { SalespersonVideo } from "@/components/leadrin/salesperson-video"
import { SalespersonProfile } from "@/components/leadrin/salesperson-profile"
import { Reviews } from "@/components/leadrin/reviews"
import { BookingForm } from "@/components/leadrin/booking-form"
import { StickyBottomBar } from "@/components/leadrin/sticky-bottom-bar"
import { Footer } from "@/components/leadrin/footer"
import { ClassicVirtualTour } from "@/components/leadrin/virtual-tour"
import { sampleData } from "@/lib/sample-data"
import "./theme.css"

export default function ClassicPage() {
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

  const { buyer, dealership, vehicle, salesperson, reviews } = sampleData

  return (
    <main className="theme-classic min-h-screen bg-background max-w-lg mx-auto">
      {/* Virtual Tour */}
      <ClassicVirtualTour
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

      <Hero
        buyerName={buyer.name}
        dealershipName={dealership.name}
        dealershipLogo={dealership.logo}
        vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        rating={dealership.rating}
      />

      <VehicleMedia
        vehicleImage={vehicle.photos[0]}
        features={vehicle.features}
        walkaroundVideo={vehicle.walkaroundVideo}
        vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      />

      <div ref={actionBarRef}>
        <ActionBar
          salespersonFirstName={salesperson.name.split(" ")[0]}
          phone={salesperson.phone}
          email={salesperson.email}
          onBook={scrollToBooking}
        />
      </div>

      <VehicleDetails
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
        <SalespersonVideo
          salespersonName={salesperson.name}
          salespersonPhoto={salesperson.photo}
          videoUrl={salesperson.introVideo}
        />
      )}

      <SalespersonProfile
        name={salesperson.name}
        title={salesperson.title}
        bio={salesperson.bio}
        photo={salesperson.photo}
        phone={salesperson.phone}
      />

      <Reviews
        aggregateRating={dealership.rating.stars}
        totalReviews={dealership.rating.count}
        reviews={reviews}
      />

      <BookingForm
        ref={bookingRef}
        buyerName={buyer.name}
        buyerEmail={buyer.email}
        buyerPhone={buyer.phone}
        dealershipName={dealership.name}
      />

      <Footer />

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
