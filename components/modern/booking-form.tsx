"use client"

import { useState } from "react"
import { Calendar, Clock, Check, ArrowRight } from "lucide-react"

interface BookingFormProps {
  salespersonName: string
  buyerName: string
  buyerPhone?: string
  dealershipName: string
}

export function BookingForm({
  salespersonName,
  buyerName,
  buyerPhone,
  dealershipName,
}: BookingFormProps) {
  const [step, setStep] = useState<"date" | "time" | "confirm" | "success">("date")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const firstName = salespersonName.split(" ")[0]

  const dates = [...Array(7)].map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: date.getDate(),
      full: date.toISOString().split("T")[0],
    }
  })

  const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

  const handleConfirm = () => setStep("success")

  return (
    <section id="booking" className="bg-neutral-50 px-6 py-8">
      <h2 className="text-lg font-semibold text-neutral-900 mb-1">Schedule a visit</h2>
      <p className="text-sm text-neutral-500 mb-5">
        Meet with {firstName} at {dealershipName}.
      </p>

      {/* Success */}
      {step === "success" && (
        <div className="bg-white rounded-lg p-5 border border-neutral-200 text-center">
          <div className="h-10 w-10 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-3">
            <Check className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 mb-1">Confirmed</h3>
          <p className="text-sm text-neutral-500">
            {firstName} will reach out to confirm your visit on {selectedDate} at {selectedTime}.
          </p>
        </div>
      )}

      {/* Date */}
      {step === "date" && (
        <div className="bg-white rounded-lg p-5 border border-neutral-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-900">Select a date</span>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {dates.slice(0, 4).map((date) => (
              <button
                key={date.full}
                onClick={() => setSelectedDate(date.full)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  selectedDate === date.full
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
                }`}
              >
                <p className="text-xs opacity-60">{date.dayName}</p>
                <p className="text-lg font-semibold">{date.dayNum}</p>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {dates.slice(4).map((date) => (
              <button
                key={date.full}
                onClick={() => setSelectedDate(date.full)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  selectedDate === date.full
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
                }`}
              >
                <p className="text-xs opacity-60">{date.dayName}</p>
                <p className="text-lg font-semibold">{date.dayNum}</p>
              </button>
            ))}
          </div>
          {selectedDate && (
            <button
              onClick={() => setStep("time")}
              className="w-full mt-4 py-3 bg-neutral-900 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Time */}
      {step === "time" && (
        <div className="bg-white rounded-lg p-5 border border-neutral-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-900">Select a time</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  selectedTime === time
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          {selectedTime && (
            <button
              onClick={() => setStep("confirm")}
              className="w-full py-3 bg-neutral-900 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Confirm */}
      {step === "confirm" && (
        <div className="bg-white rounded-lg p-5 border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-900 mb-4">Confirm details</h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Name</span>
              <span className="font-medium text-neutral-900">{buyerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Date</span>
              <span className="font-medium text-neutral-900">{selectedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Time</span>
              <span className="font-medium text-neutral-900">{selectedTime}</span>
            </div>
            {buyerPhone && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Phone</span>
                <span className="font-medium text-neutral-900">{buyerPhone}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-neutral-900 text-white font-medium text-sm rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Confirm Appointment
          </button>
        </div>
      )}
    </section>
  )
}
