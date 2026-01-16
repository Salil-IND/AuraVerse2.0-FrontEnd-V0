"use client"

import { AlertTriangle } from "lucide-react"

interface Segment {
  start_time: number
  end_time: number
  confidence: number
  label: string
}

interface VideoTimelineProps {
  segments: Segment[]
  totalDuration: number
}

export default function VideoTimeline({ segments, totalDuration }: VideoTimelineProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <h4 className="font-semibold">Fake Segments Detected</h4>
      </div>

      {/* Timeline Visualization */}
      <div className="mb-6">
        <div className="relative h-12 bg-muted/20 rounded-lg overflow-hidden border border-border/50 mb-4">
          {segments.map((segment, index) => {
            const startPercent = (segment.start_time / totalDuration) * 100
            const endPercent = (segment.end_time / totalDuration) * 100
            const width = endPercent - startPercent

            return (
              <div
                key={index}
                className="absolute h-full bg-destructive/70 hover:bg-destructive/90 transition-colors group"
                style={{
                  left: `${startPercent}%`,
                  width: `${width}%`,
                }}
                title={`${segment.label}: ${segment.start_time.toFixed(2)}s - ${segment.end_time.toFixed(2)}s`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-destructive/50 via-destructive/70 to-destructive/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>0s</span>
          <span>{(totalDuration / 2).toFixed(2)}s</span>
          <span>{totalDuration.toFixed(2)}s</span>
        </div>
      </div>

      {/* Segments List */}
      <div className="space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="font-medium text-sm">{segment.label}</p>
                <p className="text-xs text-muted-foreground">
                  {segment.start_time.toFixed(2)}s - {segment.end_time.toFixed(2)}s
                  <span className="mx-2 opacity-50">·</span>
                  Duration: {(segment.end_time - segment.start_time).toFixed(2)}s
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-destructive text-sm">{(segment.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
