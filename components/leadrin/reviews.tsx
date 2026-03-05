"use client"

import { useRef } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type ReviewSource = "google" | "yelp" | "dealerrater" | "facebook" | "carscom"

interface Review {
  id: string
  reviewerName: string
  rating: number
  excerpt: string
  source: ReviewSource
  isSalespersonReview?: boolean
}

interface ReviewsProps {
  aggregateRating: number
  totalReviews: number
  reviews: Review[]
}

const sourceLabels: Record<ReviewSource, string> = {
  google: "Google",
  yelp: "Yelp",
  dealerrater: "DealerRater",
  facebook: "Facebook",
  carscom: "Cars.com",
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            star <= rating ? "fill-foreground text-foreground" : "fill-border text-border",
            size === "sm" ? "h-3 w-3" : "h-4 w-4"
          )}
        />
      ))}
    </div>
  )
}

export function Reviews({ aggregateRating, totalReviews, reviews }: ReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (reviews.length === 0) return null

  return (
    <section className="bg-background border-b border-border py-8">
      {/* Header - Airbnb style */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Star className="h-5 w-5 fill-foreground text-foreground" />
          <span className="text-[22px] font-semibold">{aggregateRating.toFixed(2)}</span>
          <span className="text-[22px] font-semibold">·</span>
          <span className="text-[22px] font-semibold underline">{totalReviews.toLocaleString()} reviews</span>
        </div>
      </div>

      {/* Reviews Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-6 pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex-shrink-0 w-[300px] p-5 border border-border rounded-xl bg-background"
          >
            {/* Reviewer Info */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-foreground">
                {review.reviewerName}
              </p>
              <p className="text-xs text-muted-foreground">
                {sourceLabels[review.source]}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={review.rating} />
            </div>

            {/* Review Text */}
            <p className="text-sm text-foreground leading-relaxed line-clamp-4">
              {review.excerpt}
            </p>

            {review.isSalespersonReview && (
              <span className="inline-block mt-4 text-xs font-medium text-primary">
                Mentions your host
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
