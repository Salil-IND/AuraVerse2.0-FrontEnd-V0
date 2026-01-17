// State Management
let currentTheme = localStorage.getItem("theme") || "dark"
let isLoading = false
let currentResults = null

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initTheme()
  initEventListeners()
})

function initTheme() {
  const htmlRoot = document.getElementById("html-root")
  if (currentTheme === "dark") {
    htmlRoot.classList.add("dark")
  } else {
    htmlRoot.classList.remove("dark")
  }
  updateThemeIcon()
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark"
  localStorage.setItem("theme", currentTheme)
  initTheme()
}

function updateThemeIcon() {
  const themeToggle = document.getElementById("theme-toggle")
  if (currentTheme === "dark") {
    themeToggle.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `
  } else {
    themeToggle.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `
  }
}

function initEventListeners() {
  const themeToggle = document.getElementById("theme-toggle")
  const fileUploader = document.getElementById("file-uploader")
  const fileInput = document.getElementById("file-input")

  themeToggle.addEventListener("click", toggleTheme)
  fileUploader.addEventListener("click", () => fileInput.click())
  fileInput.addEventListener("change", handleFileInputChange)
}

function handleFileInputChange(e) {
  if (e.target.files && e.target.files[0]) {
    handleFile(e.target.files[0])
  }
}

function handleDragEnter(e) {
  e.preventDefault()
  e.stopPropagation()
  document.getElementById("file-uploader").classList.add("drag-active")
}

function handleDragLeave(e) {
  e.preventDefault()
  e.stopPropagation()
  document.getElementById("file-uploader").classList.remove("drag-active")
}

function handleDragOver(e) {
  e.preventDefault()
  e.stopPropagation()
}

function handleDrop(e) {
  e.preventDefault()
  e.stopPropagation()
  document.getElementById("file-uploader").classList.remove("drag-active")

  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleFile(e.dataTransfer.files[0])
  }
}

async function handleFile(file) {
  const isImage = file.type.startsWith("image/")
  const isVideo = file.type.startsWith("video/")

  if (!isImage && !isVideo) {
    alert("Please upload an image or video file")
    return
  }

  const fileType = isImage ? "image" : "video"
  await submitFile(file, fileType)
}

async function submitFile(file, fileType) {
  isLoading = true
  setLoadingState(true)
  clearContainers()

  try {
    const formData = new FormData()
    formData.append("file", file)

    const baseUrl = "https://salil-ind-fake-buster.hf.space/api"
    const endpoint = fileType === "image" ? `${baseUrl}/detect-image` : `${baseUrl}/detect-video`

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    currentResults = { ...data, fileType, fileName: file.name }
    displayResults(currentResults)
  } catch (err) {
    displayError(err.message || "An error occurred")
  } finally {
    isLoading = false
    setLoadingState(false)
  }
}

function setLoadingState(loading) {
  const uploader = document.getElementById("file-uploader")
  if (loading) {
    uploader.classList.add("loading")
  } else {
    uploader.classList.remove("loading")
  }
}

function clearContainers() {
  document.getElementById("error-container").innerHTML = ""
  document.getElementById("loading-container").innerHTML = ""
  document.getElementById("results-container").innerHTML = ""
  document.getElementById("placeholder-container").classList.remove("hidden")
}

function displayError(errorMessage) {
  const container = document.getElementById("error-container")
  container.innerHTML = `
        <div class="error-alert">
            <p class="error-title">Error</p>
            <p class="error-message">${escapeHtml(errorMessage)}</p>
        </div>
    `
  document.getElementById("placeholder-container").classList.add("hidden")
}

function displayLoading() {
  const container = document.getElementById("loading-container")
  container.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p class="loading-text">Analyzing media...</p>
        </div>
    `
}

function displayResults(results) {
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

  let html = `
        <div class="results-card">
            <div class="results-header">
                <div class="results-title-section">
                    <p>Analysis Results</p>
                    <h3>${escapeHtml(fileName)}</h3>
                </div>
                ${
                  isFake
                    ? `<svg class="results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>`
                    : `<svg class="results-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M10 14.5l3 3 4-4" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>`
                }
            </div>

            <div class="results-grid">
                <div class="prediction-card ${isFake ? "fake" : "authentic"}">
                    <p class="card-label">Prediction</p>
                    <p class="prediction-text ${isFake ? "fake" : "authentic"}">${isFake ? "FAKE" : "AUTHENTIC"}</p>
                    <p class="prediction-description">${isFake ? "This media shows signs of synthetic manipulation" : "This media appears to be authentic"}</p>
                </div>

                <div class="confidence-card">
                    <p class="card-label">Confidence</p>
                    <div class="gauge-container">
                        <svg class="gauge-svg" viewBox="0 0 120 120">
                            <circle class="gauge-bg-circle" cx="60" cy="60" r="50"></circle>
                            <circle class="gauge-progress-circle" cx="60" cy="60" r="50" stroke="${getConfidenceColor(conf)}"></circle>
                        </svg>
                        <div class="gauge-text" style="color: ${getConfidenceColor(conf)}">${(conf * 100).toFixed(0)}%</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${conf * 100}%; background: ${getConfidenceColor(conf)};"></div>
                    </div>
                    <p class="confidence-text">${(conf * 100).toFixed(2)}% confident</p>
                </div>
            </div>

            <div class="timestamp-section">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>${new Date(timestamp).toLocaleString()}</span>
                ${!isImage && total_duration ? `<span class="duration">Duration: ${total_duration.toFixed(2)}s</span>` : ""}
            </div>
        </div>
    `

  // Add video timeline if applicable
  if (!isImage && fake_segments && fake_segments.length > 0) {
    html += generateTimelineHtml(fake_segments, total_duration)
  } else if (!isImage && (!fake_segments || fake_segments.length === 0)) {
    html += `
            <div class="no-segments">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h4>No Fake Segments Detected</h4>
                <p>The entire video appears to be authentic with no synthetic manipulation detected.</p>
            </div>
        `
  }

  document.getElementById("results-container").innerHTML = html
  document.getElementById("placeholder-container").classList.add("hidden")

  // Initialize gauge animation
  setTimeout(() => {
    updateGauge(conf)
  }, 100)
}

function updateGauge(confidence) {
  const circles = document.querySelectorAll(".gauge-progress-circle")
  circles.forEach((circle) => {
    const circumference = 2 * Math.PI * 50
    const offset = circumference - (confidence / 1) * circumference
    circle.style.strokeDasharray = `${circumference} ${circumference}`
    circle.style.strokeDashoffset = offset
  })
}

function getConfidenceColor(confidence) {
  const percentage = Math.min(100, Math.max(0, confidence * 100))
  if (percentage >= 80) return "#ef4444"
  if (percentage >= 60) return "#f97316"
  if (percentage >= 40) return "#eab308"
  return "#10b981"
}

function generateTimelineHtml(segments, totalDuration) {
  const segmentsHtml = segments
    .map((segment) => {
      const startPercent = (segment.start_time / totalDuration) * 100
      const endPercent = (segment.end_time / totalDuration) * 100
      const width = endPercent - startPercent
      const segmentConfidence = segment.confidence * 100

      return `
            <div class="timeline-segment" style="left: ${startPercent}%; width: ${width}%;" 
                 title="${segment.label}: ${segment.start_time.toFixed(2)}s - ${segment.end_time.toFixed(2)}s"></div>
        `
    })
    .join("")

  const segmentsListHtml = segments
    .map(
      (segment) => `
        <div class="segment-item">
            <div class="segment-item-header">
                <div>
                    <p class="segment-item-label">${escapeHtml(segment.label)}</p>
                    <p class="segment-timing">
                        ${segment.start_time.toFixed(2)}s - ${segment.end_time.toFixed(2)}s
                        <span> · </span>
                        Duration: ${(segment.end_time - segment.start_time).toFixed(2)}s
                    </p>
                </div>
                <div class="segment-confidence">${(segment.confidence * 100).toFixed(1)}%</div>
            </div>
        </div>
    `,
    )
    .join("")

  return `
        <div class="timeline-card">
            <div class="timeline-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h4>Fake Segments Detected</h4>
            </div>

            <div class="timeline-bar">
                ${segmentsHtml}
            </div>
            <div class="timeline-labels">
                <span>0s</span>
                <span>${(totalDuration / 2).toFixed(2)}s</span>
                <span>${totalDuration.toFixed(2)}s</span>
            </div>

            <div class="segments-list">
                ${segmentsListHtml}
            </div>
        </div>
    `
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
