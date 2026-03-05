"use client"

import { useState, forwardRef } from "react"
import { Calendar, Clock, Check, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingFormProps {
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  dealershipName: string
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
]

function getAvailableDates() {
  const dates = []
  const today = new Date()
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    if (date.getDay() !== 0) {
      dates.push(date)
    }
  }
  return dates.slice(0, 6)
}

export const BookingForm = forwardRef<HTMLElement, BookingFormProps>(function BookingForm(
  { buyerName, buyerEmail, buyerPhone, dealershipName },
  ref
) {
  const [step, setStep] = useState<"date" | "time" | "confirm" | "success">("date")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: buyerName,
    email: buyerEmail,
    phone: buyerPhone,
  })

  const availableDates = getAvailableDates()

  const handleSubmit = () => {
    setStep("success")
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <section ref={ref} className="bg-secondary px-6 py-8">
      <div className="mb-6">
        <h2 className="text-[22px] font-semibold text-foreground">
          Schedule a visit
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Book a time to see this vehicle in person
        </p>
      </div>

      {/* Success State */}
      {step === "success" && (
        <div className="bg-background rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            {"You're all set!"}
          </h3>
          <p className="text-sm text-muted-foreground mb-1">
            {selectedDate && formatDateFull(selectedDate)} at {selectedTime}
          </p>
          <p className="text-sm text-muted-foreground">
            {"We'll send a confirmation to"} {formData.email}
          </p>
        </div>
      )}

      {/* Date Selection */}
      {step === "date" && (
        <div className="bg-background rounded-xl p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>Select a date</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {availableDates.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => {
                  setSelectedDate(date)
                  setStep("time")
                }}
                className="p-3 bg-background border border-border text-center transition-all hover:border-foreground rounded-xl"
              >
                <p className="text-xs text-muted-foreground">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {date.getDate()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Time Selection */}
      {step === "time" && selectedDate && (
        <div className="bg-background rounded-xl p-6">
          <button
            onClick={() => setStep("date")}
            className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {formatDate(selectedDate)}
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4" />
            <span>Select a time</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => {
                  setSelectedTime(time)
                  setStep("confirm")
                }}
                className="py-3 px-2 bg-background border border-border text-sm font-medium transition-all hover:border-foreground text-foreground rounded-xl"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation */}
      {step === "confirm" && selectedDate && selectedTime && (
        <div className="bg-background rounded-xl p-6">
          <button
            onClick={() => setStep("time")}
            className="flex items-center gap-1 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {formatDate(selectedDate)} at {selectedTime}
          </button>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Name
              </label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-11 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-11 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-11 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:brightness-95"
          >
            Reserve
          </button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            {"You won't be charged yet"}
          </p>
        </div>
      )}
    </section>
  )
})
