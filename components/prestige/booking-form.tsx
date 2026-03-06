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
        <div className="px-5 pt-8 pb-5 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Private Viewing
          </p>
          <h2 className="font-serif text-[26px] leading-tight mb-2">
            Schedule Your Visit
          </h2>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Reserve a time for an exclusive experience.
          </p>
        </div>

        {/* Date Selection */}
        {step === "date" && (
          <div className="px-5 pb-10">
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-3 text-center">
              Select a Date
            </p>
            <div className="space-y-2">
              {availableDates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => handleDateSelect(d.date)}
                  className="w-full flex items-center justify-between py-3 px-4 border border-border hover:border-foreground transition-colors text-left group"
                >
                  <div>
                    <p className="text-xs font-medium">{d.day}, {d.date}</p>
                    <p className="text-[10px] text-muted-foreground">{d.slots} times available</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time Selection */}
        {step === "time" && (
          <div className="px-5 pb-10">
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-3 text-center">
              {selectedDate} - Select a Time
            </p>
            <div className="grid grid-cols-2 gap-2">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className="py-3 border border-border text-xs font-medium hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  {time}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep("date")}
              className="mt-4 w-full py-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to dates
            </button>
          </div>
        )}

        {/* Confirmation */}
        {step === "confirm" && (
          <div className="px-5 pb-10 text-center">
            <div className="py-5 border border-border mb-4">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
                Your Appointment
              </p>
              <p className="font-serif text-xl mb-0.5">{selectedDate}</p>
              <p className="text-base text-muted-foreground">{selectedTime}</p>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full py-3 bg-foreground text-background text-xs uppercase tracking-[0.12em] hover:bg-foreground/90 transition-colors mb-3"
            >
              Confirm Appointment
            </button>
            <button
              onClick={() => setStep("time")}
              className="w-full py-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Change time
            </button>
          </div>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="px-5 pb-10 text-center">
            <div className="py-6">
              <h3 className="font-serif text-xl mb-2">
                {"You're confirmed, "}{firstName}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                We look forward to seeing you on {selectedDate} at {selectedTime}.
              </p>
              <p className="text-[10px] text-muted-foreground">
                A confirmation has been sent to your email.
              </p>
            </div>
          </div>
        )}
      </section>
    )
  }
)
