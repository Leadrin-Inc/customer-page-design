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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-3 w-3",
            star <= rating
              ? "fill-current text-accent"
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
    <section className="bg-foreground text-primary-foreground py-16">
      {/* Header */}
      <div className="px-6 text-center mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary-foreground/30 mb-6">
          Customer Reviews
        </p>
        <div className="font-serif text-5xl mb-3">
          {aggregateRating.toFixed(1)}
        </div>
        <div className="flex justify-center mb-2.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-4 w-4",
                  star <= Math.round(aggregateRating)
                    ? "fill-primary-foreground text-primary-foreground"
                    : "fill-primary-foreground/15 text-primary-foreground/15"
                )}
              />
            ))}
          </div>
        </div>
        <p className="text-[11px] text-primary-foreground/35">
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
              "flex-shrink-0 w-[280px] p-6 border rounded-sm",
              review.isSalespersonReview
                ? "border-primary-foreground/20 bg-primary-foreground/5"
                : "border-primary-foreground/8"
            )}
          >
            <Quote className="h-5 w-5 text-primary-foreground/15 mb-4" />

            {/* Review Text */}
            <p className="text-[14px] text-primary-foreground/70 leading-relaxed line-clamp-4 mb-6 italic">
              {review.excerpt}
            </p>

            {/* Reviewer */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-foreground">
                  {review.reviewerName}
                </p>
                <p className="text-[10px] uppercase tracking-[0.1em] text-primary-foreground/35 mt-0.5">
                  {sourceLabels[review.source]}
                </p>
              </div>
              <StarRating rating={review.rating} />
            </div>

            {review.isSalespersonReview && (
              <span className="inline-block mt-5 text-[10px] font-semibold uppercase tracking-[0.1em] text-accent border-t border-primary-foreground/8 pt-4 w-full">
                Mentions your consultant
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
