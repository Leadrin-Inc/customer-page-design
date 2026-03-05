"use client"

import { useRef } from "react"
import { Star, Quote } from "lucide-react"
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

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const iconSize = size === "lg" ? "h-4 w-4" : "h-3 w-3"
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            iconSize,
            star <= rating
              ? "fill-current text-foreground"
              : "fill-current text-border"
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
    <section className="bg-foreground text-primary-foreground py-14">
      {/* Header */}
      <div className="px-6 text-center mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary-foreground/40 mb-6">
          Customer Reviews
        </p>
        <div className="font-serif text-5xl mb-3">
          {aggregateRating.toFixed(1)}
        </div>
        <div className="flex justify-center mb-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-4 w-4",
                  star <= Math.round(aggregateRating)
                    ? "fill-primary-foreground text-primary-foreground"
                    : "fill-primary-foreground/20 text-primary-foreground/20"
                )}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-primary-foreground/40">
          Based on {totalReviews.toLocaleString()} reviews
        </p>
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
            className={cn(
              "flex-shrink-0 w-[280px] p-5 border",
              review.isSalespersonReview
                ? "border-primary-foreground/20 bg-primary-foreground/5"
                : "border-primary-foreground/10"
            )}
          >
            <Quote className="h-5 w-5 text-primary-foreground/20 mb-4" />

            {/* Review Text */}
            <p className="text-sm text-primary-foreground/80 leading-relaxed line-clamp-4 mb-5 italic">
              {review.excerpt}
            </p>

            {/* Reviewer */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-foreground">
                  {review.reviewerName}
                </p>
                <p className="text-[10px] uppercase tracking-[0.1em] text-primary-foreground/40 mt-0.5">
                  {sourceLabels[review.source]}
                </p>
              </div>
              <StarRating rating={review.rating} />
            </div>

            {review.isSalespersonReview && (
              <span className="inline-block mt-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-primary-foreground/50 border-t border-primary-foreground/10 pt-3 w-full">
                Mentions your consultant
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
