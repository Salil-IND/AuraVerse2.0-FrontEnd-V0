"use client"

import { AlertTriangle, CheckCircle, Clock } from "lucide-react"
import ConfidenceGauge from "./confidence-gauge"
import VideoTimeline from "./video-timeline"

interface ResultsDisplayProps {
  results: any
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const {
    fileType,
    fileName,
    prediction,
    confidence,
    timestamp,
    overall_prediction,
    overall_confidence,
    total_duration,
    fake_segments,
  } = results

  const isImage = fileType === "image"
  const isFake = isImage ? prediction === "fake" : overall_prediction === "fake"
  const conf = isImage ? confidence : overall_confidence

  return (
    <div className="space-y-6">
      {/* Result Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Analysis Results</p>
            <h3 className="text-xl font-bold break-all">{fileName}</h3>
          </div>
          {isFake ? (
            <AlertTriangle className="w-8 h-8 text-destructive flex-shrink-0" />
          ) : (
            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Prediction Card */}
          <div
            className={`rounded-lg p-4 border ${
              isFake ? "bg-destructive/5 border-destructive/30" : "bg-green-500/5 border-green-500/30"
            }`}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Prediction</p>
            <p
              className={`text-2xl font-bold mb-2 ${
                isFake ? "text-destructive" : "text-green-600 dark:text-green-400"
              }`}
            >
              {isFake ? "FAKE" : "AUTHENTIC"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isFake ? "This media shows signs of synthetic manipulation" : "This media appears to be authentic"}
            </p>
          </div>

          {/* Confidence Card */}
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Confidence</p>
            <div className="mb-4">
              <ConfidenceGauge confidence={conf} />
            </div>
            <p className="text-xs text-muted-foreground text-center">{(conf * 100).toFixed(2)}% confident</p>
          </div>
        </div>

        {/* Timestamp and Duration */}
        <div className="mt-6 pt-6 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{new Date(timestamp).toLocaleString()}</span>
          {!isImage && total_duration && <span className="ml-auto">Duration: {total_duration.toFixed(2)}s</span>}
        </div>
      </div>

      {/* Video Timeline */}
      {!isImage && fake_segments && fake_segments.length > 0 && (
        <VideoTimeline segments={fake_segments} totalDuration={total_duration} />
      )}

      {/* No Fake Segments for Video */}
      {!isImage && (!fake_segments || fake_segments.length === 0) && (
        <div className="bg-green-500/5 border border-green-500/30 rounded-lg p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
          <h4 className="font-semibold mb-2">No Fake Segments Detected</h4>
          <p className="text-sm text-muted-foreground">
            The entire video appears to be authentic with no synthetic manipulation detected.
          </p>
        </div>
      )}
    </div>
  )
}
