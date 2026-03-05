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
    <section className="bg-white py-8 border-t border-neutral-100">
      {/* Header */}
      <div className="px-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Reviews</h2>
          <div className="flex gap-1">
            <button
              onClick={() => scroll("left")}
              className="h-8 w-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="h-4 w-4 text-neutral-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="h-8 w-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
              aria-label="Next reviews"
            >
              <ChevronRight className="h-4 w-4 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-neutral-900">{aggregateRating}</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(aggregateRating)
                    ? "text-neutral-900 fill-neutral-900"
                    : "text-neutral-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-neutral-500">{totalReviews.toLocaleString()} reviews</span>
        </div>
      </div>

      {/* Review Cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-6 pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex-shrink-0 w-[260px] p-4 rounded-lg border border-neutral-200 bg-white"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < review.rating ? "text-neutral-900 fill-neutral-900" : "text-neutral-200"
                  }`}
                />
              ))}
            </div>

            {/* Text */}
            <p className="text-sm text-neutral-700 leading-relaxed line-clamp-4 mb-3">
              {review.excerpt}
            </p>

            {/* Reviewer */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-900">{review.reviewerName}</p>
              {review.isSalespersonReview && (
                <span className="text-xs text-neutral-500">Re: {firstName}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
