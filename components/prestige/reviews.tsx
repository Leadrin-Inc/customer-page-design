"use client"

import { useRef } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

interface Review {
  id: string
  reviewerName: string
  rating: number
  excerpt: string
  source: "google" | "yelp" | "facebook" | "dealerrater" | "carscom"
  isSalespersonReview?: boolean
}

interface PrestigeReviewsProps {
  aggregateRating: number
  totalReviews: number
  reviews: Review[]
}

export function PrestigeReviews({
  aggregateRating,
  totalReviews,
  reviews,
}: PrestigeReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="bg-foreground text-background">
      {/* Header */}
      <div className="px-6 pt-16 pb-10 text-center">
        <h2 className="font-serif text-[32px] leading-tight mb-6">
          What Our Clients Say
        </h2>
        
        {/* Aggregate Rating */}
        <div className="flex items-center justify-center gap-4">
          <span className="font-serif text-5xl">{aggregateRating}</span>
          <div className="text-left">
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(aggregateRating)
                      ? "fill-background text-background"
                      : "text-background/30"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-background/60 uppercase tracking-wider">
              {totalReviews.toLocaleString()} Reviews
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Controls */}
      <div className="flex justify-center gap-2 pb-6">
        <button
          onClick={() => scroll("left")}
          className="h-10 w-10 border border-background/40 flex items-center justify-center hover:border-background transition-colors"
          aria-label="Previous reviews"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="h-10 w-10 border border-background/40 flex items-center justify-center hover:border-background transition-colors"
          aria-label="Next reviews"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Reviews Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-16 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex-shrink-0 w-[280px] p-6 bg-background text-foreground snap-start"
          >
            {/* Rating */}
            <div className="flex gap-0.5 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    star <= review.rating
                      ? "fill-foreground text-foreground"
                      : "text-border"
                  }`}
                />
              ))}
            </div>

            {/* Excerpt */}
            <p className="text-sm leading-relaxed mb-6 line-clamp-4">
              &ldquo;{review.excerpt}&rdquo;
            </p>

            {/* Reviewer */}
            <p className="text-xs font-semibold">{review.reviewerName}</p>
            <p className="text-xs text-muted-foreground capitalize">
              via {review.source === "carscom" ? "Cars.com" : review.source}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
