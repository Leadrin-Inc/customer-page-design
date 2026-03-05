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

interface ReviewsProps {
  reviews: Review[]
  aggregateRating: number
  totalReviews: number
  salespersonName: string
}

export function Reviews({
  reviews,
  aggregateRating,
  totalReviews,
  salespersonName,
}: ReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const firstName = salespersonName.split(" ")[0]

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
    <section className="bg-white py-8 border-t border-border">
      {/* Section Header */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
          <h2 className="text-xl font-semibold text-foreground">What customers say</h2>
        </div>

        {/* Aggregate Rating - Stripe style stat */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              {aggregateRating}
            </span>
            <div className="flex flex-col">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(aggregateRating)
                        ? "text-violet-500 fill-violet-500"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{totalReviews.toLocaleString()} reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Controls */}
      <div className="flex justify-end gap-2 px-6 mb-4">
        <button
          onClick={() => scroll("left")}
          className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Previous reviews"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Next reviews"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Review Cards - Horizontal Scroll */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex-shrink-0 w-[280px] p-5 rounded-xl border border-border bg-white hover:border-violet-200 transition-colors"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? "text-violet-500 fill-violet-500" : "text-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Review Text */}
            <p className="text-sm text-foreground leading-relaxed line-clamp-4 mb-4">
              &ldquo;{review.excerpt}&rdquo;
            </p>

            {/* Reviewer */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{review.reviewerName}</p>
              {review.isSalespersonReview && (
                <span className="text-xs text-violet-600 font-medium">About {firstName}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
