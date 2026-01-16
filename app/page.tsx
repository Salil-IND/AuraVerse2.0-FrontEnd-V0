"use client"

import { useState } from "react"
import FileUploader from "@/components/file-uploader"
import ResultsDisplay from "@/components/results-display"
import ThemeToggle from "@/components/theme-toggle"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  const handleFileSubmit = async (file: File, fileType: "image" | "video") => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const endpoint = fileType === "image" ? "/detect-image" : "/detect-video"
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      setResults({ ...data, fileType, fileName: file.name })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="border-b border-border/20 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">D</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight">DeepfakeDetector</h1>
            </div>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Verify Media Authenticity</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced AI-powered detection system for identifying deepfakes and synthetic media with precision
              confidence scores.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* File Uploader */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <FileUploader onSubmit={handleFileSubmit} isLoading={isLoading} />
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-2">
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
                  <p className="text-destructive font-medium">Error</p>
                  <p className="text-destructive/80 text-sm mt-1">{error}</p>
                </div>
              )}

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Analyzing media...</p>
                </div>
              )}

              {results && !isLoading && <ResultsDisplay results={results} />}

              {!results && !isLoading && !error && (
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                  <div className="text-muted-foreground">
                    <p className="text-lg font-medium mb-2">Upload an image or video to get started</p>
                    <p className="text-sm">Results will appear here with detailed analysis</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/20 mt-16 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-muted-foreground text-sm">
              DeepfakeDetector uses advanced AI models to detect manipulated media. Always use as one part of media
              verification.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
