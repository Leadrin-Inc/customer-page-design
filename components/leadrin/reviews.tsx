"use client"

import { useRef } from "react"
import { Star } from "lucide-react"
import Image from "next/image"
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

const sourceLogos: Record<ReviewSource, { name: string; color: string }> = {
  google: { name: "Google", color: "#4285F4" },
  yelp: { name: "Yelp", color: "#D32323" },
  dealerrater: { name: "DealerRater", color: "#2B5BBE" },
  facebook: { name: "Facebook", color: "#1877F2" },
  carscom: { name: "Cars.com", color: "#5D3FD3" },
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const iconSize = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5"
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            iconSize,
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
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
    <section className="py-8 bg-card">
      {/* Header */}
      <div className="px-5 mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Customer Reviews
        </p>
        <div className="flex items-center gap-3">
          <span className="font-serif text-4xl font-medium text-foreground">
            {aggregateRating.toFixed(1)}
          </span>
          <div>
            <StarRating rating={Math.round(aggregateRating)} size="lg" />
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalReviews.toLocaleString()} reviews
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-5 pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className={cn(
              "flex-shrink-0 w-[280px] p-4 rounded-xl border",
              review.isSalespersonReview
                ? "bg-primary/5 border-primary/20"
                : "bg-card border-border"
            )}
          >
            {/* Reviewer Info */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm text-foreground">
                {review.reviewerName}
              </span>
              <div
                className="px-2 py-0.5 rounded text-[10px] font-semibold text-primary-foreground"
                style={{ backgroundColor: sourceLogos[review.source].color }}
              >
                {sourceLogos[review.source].name}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-2">
              <StarRating rating={review.rating} />
            </div>

            {/* Review Text */}
            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4">
              {review.excerpt}
            </p>

            {/* Salesperson Review Badge */}
            {review.isSalespersonReview && (
              <span className="inline-block mt-3 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Your consultant mentioned
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
