"use client"

import { useMemo } from "react"

interface ConfidenceGaugeProps {
  confidence: number
}

export default function ConfidenceGauge({ confidence }: ConfidenceGaugeProps) {
  const percentage = Math.min(100, Math.max(0, confidence * 100))

  const getColor = useMemo(() => {
    if (percentage >= 80) return "#ef4444"
    if (percentage >= 60) return "#f97316"
    if (percentage >= 40) return "#eab308"
    return "#10b981"
  }, [percentage])

  return (
    <div className="space-y-2">
      {/* Circular Gauge */}
      <div className="flex items-center justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120" className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted opacity-20"
          />

          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={getColor}
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * (2 * Math.PI * 50)} ${2 * Math.PI * 50}`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>

        {/* Center text */}
        <div className="absolute text-center">
          <div className="text-2xl font-bold" style={{ color: getColor }}>
            {percentage.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-4">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: getColor,
          }}
        />
      </div>
    </div>
  )
}
