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
      <div className="px-5 pt-8 pb-5 text-center">
        <h2 className="font-serif text-[26px] leading-tight mb-4">
          What Our Clients Say
        </h2>
        
        {/* Aggregate Rating */}
        <div className="flex items-center justify-center gap-3">
          <span className="font-serif text-4xl">{aggregateRating}</span>
          <div className="text-left">
            <div className="flex gap-0.5 mb-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    star <= Math.round(aggregateRating)
                      ? "fill-background text-background"
                      : "text-background/30"
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-background/60 uppercase tracking-wider">
              {totalReviews.toLocaleString()} Reviews
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Controls */}
      <div className="flex justify-center gap-2 pb-4">
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
        className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-10 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex-shrink-0 w-[240px] p-4 bg-background text-foreground snap-start"
          >
            {/* Rating */}
            <div className="flex gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= review.rating
                      ? "fill-foreground text-foreground"
                      : "text-border"
                  }`}
                />
              ))}
            </div>

            {/* Excerpt */}
            <p className="text-xs leading-relaxed mb-4 line-clamp-4">
              &ldquo;{review.excerpt}&rdquo;
            </p>

            {/* Reviewer */}
            <p className="text-[11px] font-semibold">{review.reviewerName}</p>
            <p className="text-[10px] text-muted-foreground capitalize">
              via {review.source === "carscom" ? "Cars.com" : review.source}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
