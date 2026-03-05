"use client"

import { useState, useRef, useEffect } from "react"
import { Hero } from "@/components/leadrin/hero"
import { ActionBar } from "@/components/leadrin/action-bar"
import { VehicleMedia } from "@/components/leadrin/vehicle-media"
import { VehicleDetails } from "@/components/leadrin/vehicle-details"
import { SalespersonProfile } from "@/components/leadrin/salesperson-profile"
import { Reviews } from "@/components/leadrin/reviews"
import { BookingForm } from "@/components/leadrin/booking-form"
import { StickyBottomBar } from "@/components/leadrin/sticky-bottom-bar"
import { Footer } from "@/components/leadrin/footer"

// Sample data - In production, this would come from your API
const sampleData = {
  buyer: {
    name: "Sarah",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
  },
  dealership: {
    name: "Heritage Honda",
    logo: undefined,
    rating: {
      stars: 4.7,
      count: 3124,
    },
  },
  vehicle: {
    year: 2025,
    make: "Honda",
    model: "CR-V",
    trim: "Sport Touring Hybrid",
    price: 39845,
    mileage: 12,
    fuelType: "Hybrid",
    transmission: "CVT",
    photos: [
      "https://images.unsplash.com/photo-1568844293986-8d0400f3a7ca?w=800&q=80",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&q=80",
      "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&q=80",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80",
    ],
    carfaxUrl: "https://www.carfax.com",
    features: [
      {
        id: "1",
        name: "Panoramic Moonroof",
        description: "Expansive glass roof that floods the cabin with natural light. One-touch open and tilt controls.",
        category: "Comfort",
        position: { x: 50, y: 20 },
        closeUpImage: "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=400&q=80",
      },
      {
        id: "2",
        name: "Leather-Trimmed Seats",
        description: "Heated and ventilated front seats with 12-way power adjustment and memory settings.",
        category: "Interior",
        position: { x: 35, y: 55 },
        closeUpImage: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&q=80",
      },
      {
        id: "3",
        name: "Honda Sensing 360",
        description: "Complete suite of advanced safety and driver-assist features including blind spot info and front cross traffic monitor.",
        category: "Safety",
        position: { x: 15, y: 75 },
      },
      {
        id: "4",
        name: "Bose Premium Audio",
        description: "12-speaker Bose premium sound system with centerpoint surround technology.",
        category: "Technology",
        position: { x: 70, y: 50 },
      },
    ],
    walkaroundVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  salesperson: {
    name: "David Nakamura",
    title: "Honda Brand Specialist",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    bio: "With over 10 years at Heritage Honda, I love helping families find the right Honda for their lifestyle. Whether it is your first Honda or your fifth, I am here to make the process easy and enjoyable.",
    phone: "(555) 987-6543",
    email: "david.nakamura@heritagehonda.com",
    introVideo: undefined,
  },
  reviews: [
    {
      id: "1",
      reviewerName: "Jennifer M.",
      rating: 5,
      excerpt: "David went above and beyond to help us find exactly what we were looking for. No pressure, just great service. Our third Honda from Heritage!",
      source: "google" as const,
      isSalespersonReview: true,
    },
    {
      id: "2",
      reviewerName: "Robert K.",
      rating: 5,
      excerpt: "Best car buying experience I have ever had. The team was professional and the entire process was smooth from start to finish.",
      source: "dealerrater" as const,
    },
    {
      id: "3",
      reviewerName: "Amanda L.",
      rating: 4,
      excerpt: "Great selection of Hondas and fair pricing. The staff really knows their inventory and helped me compare the CR-V trims side by side.",
      source: "yelp" as const,
    },
    {
      id: "4",
      reviewerName: "Marcus T.",
      rating: 5,
      excerpt: "David made the whole process painless. He answered all my questions and never made me feel rushed. Highly recommend Heritage Honda!",
      source: "facebook" as const,
      isSalespersonReview: true,
    },
    {
      id: "5",
      reviewerName: "Lisa W.",
      rating: 5,
      excerpt: "Drove away in our new CR-V the same day. Financing was easy and everyone was so helpful. Thank you Heritage Honda!",
      source: "carscom" as const,
    },
  ],
}

export default function CustomerPage() {
  const [showStickyBar, setShowStickyBar] = useState(false)
  const actionBarRef = useRef<HTMLDivElement>(null)
  const bookingRef = useRef<HTMLElement>(null)

  // Observe when action bar scrolls out of view
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
    <main className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Hero Section */}
      <Hero
        buyerName={buyer.name}
        dealershipName={dealership.name}
        dealershipLogo={dealership.logo}
        vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        salesperson={{
          name: salesperson.name,
          title: salesperson.title,
          photo: salesperson.photo,
        }}
        rating={dealership.rating}
      />

      {/* Action Bar */}
      <div ref={actionBarRef}>
        <ActionBar
          salespersonFirstName={salesperson.name.split(" ")[0]}
          phone={salesperson.phone}
          email={salesperson.email}
          onBook={scrollToBooking}
        />
      </div>

      {/* Vehicle Media Experience */}
      <VehicleMedia
        vehicleImage={vehicle.photos[0]}
        features={vehicle.features}
        walkaroundVideo={vehicle.walkaroundVideo}
        vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      />

      {/* Vehicle Details */}
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

      {/* Salesperson Profile */}
      <SalespersonProfile
        name={salesperson.name}
        title={salesperson.title}
        bio={salesperson.bio}
        photo={salesperson.photo}
        introVideo={salesperson.introVideo}
        phone={salesperson.phone}
      />

      {/* Reviews */}
      <Reviews
        aggregateRating={dealership.rating.stars}
        totalReviews={dealership.rating.count}
        reviews={reviews}
      />

      {/* Booking Form */}
      <BookingForm
        ref={bookingRef}
        buyerName={buyer.name}
        buyerEmail={buyer.email}
        buyerPhone={buyer.phone}
        dealershipName={dealership.name}
      />

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
