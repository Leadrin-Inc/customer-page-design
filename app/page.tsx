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
    name: "Prestige Motors",
    logo: undefined,
    rating: {
      stars: 4.8,
      count: 2847,
    },
  },
  vehicle: {
    year: 2024,
    make: "BMW",
    model: "X5",
    trim: "xDrive40i",
    price: 68995,
    mileage: 1247,
    fuelType: "Gasoline",
    transmission: "Automatic",
    photos: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
    ],
    carfaxUrl: "https://www.carfax.com",
    features: [
      {
        id: "1",
        name: "Panoramic Moonroof",
        description: "Full glass roof that opens to let the sky in. Includes power sunshade for UV protection.",
        category: "Comfort",
        position: { x: 50, y: 20 },
        closeUpImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80",
      },
      {
        id: "2",
        name: "Vernasca Leather",
        description: "Premium perforated leather seats with heating and cooling. 20-way power adjustment.",
        category: "Interior",
        position: { x: 35, y: 55 },
        closeUpImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80",
      },
      {
        id: "3",
        name: "M Sport Brakes",
        description: "High-performance braking system with blue calipers. Enhanced stopping power.",
        category: "Performance",
        position: { x: 15, y: 75 },
      },
      {
        id: "4",
        name: "Harman Kardon Sound",
        description: "16-speaker surround sound system with 600 watts of power for immersive audio.",
        category: "Technology",
        position: { x: 70, y: 50 },
      },
    ],
    walkaroundVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  salesperson: {
    name: "Michael Chen",
    title: "Senior Sales Consultant",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    bio: "With over 8 years at Prestige Motors, I specialize in helping customers find their perfect vehicle. I believe car buying should be enjoyable, not stressful. Let me make your experience exceptional.",
    phone: "(555) 987-6543",
    email: "michael.chen@prestigemotors.com",
    introVideo: undefined,
  },
  reviews: [
    {
      id: "1",
      reviewerName: "Jennifer M.",
      rating: 5,
      excerpt: "Michael went above and beyond to help us find exactly what we were looking for. No pressure, just great service. We'll definitely be back!",
      source: "google" as const,
      isSalespersonReview: true,
    },
    {
      id: "2",
      reviewerName: "Robert K.",
      rating: 5,
      excerpt: "Best car buying experience I've ever had. The team was professional and the entire process was smooth from start to finish.",
      source: "dealerrater" as const,
    },
    {
      id: "3",
      reviewerName: "Amanda L.",
      rating: 4,
      excerpt: "Great selection of vehicles and fair pricing. The staff really knows their inventory and helped me compare different options.",
      source: "yelp" as const,
    },
    {
      id: "4",
      reviewerName: "David S.",
      rating: 5,
      excerpt: "Michael made the whole process painless. He answered all my questions and never made me feel rushed. Highly recommend!",
      source: "facebook" as const,
      isSalespersonReview: true,
    },
    {
      id: "5",
      reviewerName: "Lisa W.",
      rating: 5,
      excerpt: "Drove away in my dream car the same day. Financing was easy and everyone was so helpful. Thank you Prestige Motors!",
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
        email={salesperson.email}
        onBook={scrollToBooking}
      />
    </main>
  )
}
