"use client"

import { Moon, Sun } from "lucide-react"

interface ThemeToggleProps {
  theme: "dark" | "light"
  setTheme: (theme: "dark" | "light") => void
}

export default function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-primary" />}
    </button>
  )
}
