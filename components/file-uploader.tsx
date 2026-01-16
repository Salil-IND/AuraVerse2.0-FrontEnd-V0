"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  onSubmit: (file: File, fileType: "image" | "video") => void
  isLoading: boolean
}

export default function FileUploader({ onSubmit, isLoading }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFile = (file: File) => {
    const isImage = file.type.startsWith("image/")
    const isVideo = file.type.startsWith("video/")

    if (!isImage && !isVideo) {
      alert("Please upload an image or video file")
      return
    }

    const fileType = isImage ? "image" : "video"
    onSubmit(file, fileType)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
        dragActive ? "border-accent bg-accent/10 scale-105" : "border-border hover:border-accent/50"
      } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleChange}
        disabled={isLoading}
        className="hidden"
      />

      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
          <Upload className="w-6 h-6 text-accent" />
        </div>
      </div>

      <h3 className="font-semibold mb-2">Upload Media</h3>
      <p className="text-sm text-muted-foreground mb-4">Drag and drop your image or video here, or click to browse</p>
      <p className="text-xs text-muted-foreground">Supported: JPG, PNG, MP4, MOV, etc.</p>
    </div>
  )
}
