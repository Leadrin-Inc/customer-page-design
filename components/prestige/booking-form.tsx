"use client"

import { useState, forwardRef } from "react"
import { Check, ArrowRight } from "lucide-react"

interface PrestigeBookingFormProps {
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  dealershipName: string
}

const availableDates = [
  { day: "Mon", date: "Mar 10", slots: 3 },
  { day: "Tue", date: "Mar 11", slots: 5 },
  { day: "Wed", date: "Mar 12", slots: 2 },
  { day: "Thu", date: "Mar 13", slots: 4 },
  { day: "Fri", date: "Mar 14", slots: 6 },
]

const availableTimes = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
]

export const PrestigeBookingForm = forwardRef<HTMLElement, PrestigeBookingFormProps>(
  function PrestigeBookingForm({ buyerName, dealershipName }, ref) {
    const [step, setStep] = useState<"date" | "time" | "confirm" | "success">("date")
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)

    const handleDateSelect = (date: string) => {
      setSelectedDate(date)
      setStep("time")
    }

    const handleTimeSelect = (time: string) => {
      setSelectedTime(time)
      setStep("confirm")
    }

    const handleConfirm = () => {
      setStep("success")
    }

    const firstName = buyerName.split(" ")[0]

    return (
      <section ref={ref} className="bg-background text-foreground">
        {/* Header */}
        <div className="px-6 pt-16 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Private Viewing
          </p>
          <h2 className="font-serif text-[32px] leading-tight mb-3">
            Schedule Your Visit
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Reserve a time for an exclusive, personalized experience.
          </p>
        </div>

        {/* Date Selection */}
        {step === "date" && (
          <div className="px-6 pb-16">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4 text-center">
              Select a Date
            </p>
            <div className="space-y-3">
              {availableDates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => handleDateSelect(d.date)}
                  className="w-full flex items-center justify-between py-4 px-5 border border-border hover:border-foreground transition-colors text-left group"
                >
                  <div>
                    <p className="text-sm font-medium">{d.day}, {d.date}</p>
                    <p className="text-xs text-muted-foreground">{d.slots} times available</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time Selection */}
        {step === "time" && (
          <div className="px-6 pb-16">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4 text-center">
              {selectedDate} - Select a Time
            </p>
            <div className="grid grid-cols-2 gap-3">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className="py-4 border border-border text-sm font-medium hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  {time}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep("date")}
              className="mt-6 w-full py-3 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to dates
            </button>
          </div>
        )}

        {/* Confirmation */}
        {step === "confirm" && (
          <div className="px-6 pb-16 text-center">
            <div className="py-8 border border-border mb-6">
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Your Appointment
              </p>
              <p className="font-serif text-2xl mb-1">{selectedDate}</p>
              <p className="text-lg text-muted-foreground">{selectedTime}</p>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full py-4 bg-foreground text-background text-sm uppercase tracking-[0.15em] hover:bg-foreground/90 transition-colors mb-4"
            >
              Confirm Appointment
            </button>
            <button
              onClick={() => setStep("time")}
              className="w-full py-3 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Change time
            </button>
          </div>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="px-6 pb-16 text-center">
            <div className="py-10">
              <h3 className="font-serif text-2xl mb-3">
                {"You're confirmed, "}{firstName}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                We look forward to seeing you on {selectedDate} at {selectedTime}.
              </p>
              <p className="text-xs text-muted-foreground">
                A confirmation has been sent to your email. {dealershipName} will reach out with any final details.
              </p>
            </div>
          </div>
        )}
      </section>
    )
  }
)
