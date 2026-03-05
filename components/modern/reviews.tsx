"use client"

import { useRef } from "react"
import { Star } from "lucide-react"

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
}: ReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-8 border-t border-slate-100">
      {/* Header */}
      <div className="px-5 mb-5">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-slate-900">{aggregateRating}</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(aggregateRating) ? "text-amber-400 fill-amber-400" : "text-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-1">{totalReviews.toLocaleString()} reviews</p>
      </div>

      {/* Review Cards - Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-2"
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex-shrink-0 w-[280px] p-5 rounded-2xl bg-slate-50"
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                  }`}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-sm text-slate-700 leading-relaxed line-clamp-4 mb-4">
              &ldquo;{review.excerpt}&rdquo;
            </p>

            {/* Author */}
            <p className="text-xs font-semibold text-slate-900">{review.reviewerName}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
