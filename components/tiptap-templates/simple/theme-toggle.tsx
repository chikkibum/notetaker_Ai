"use client"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"

// --- Icons ---
import { MoonStar, Sun } from "lucide-react"
import { useEffect, useState } from "react"

const getInitialDarkMode = () => {
  if (typeof window !== "undefined") {
    return (
      !!document.querySelector('meta[name="color-scheme"][content="dark"]') ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
  }
  return false
}

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialDarkMode())

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => setIsDarkMode(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const toggleDarkMode = () => setIsDarkMode((isDark) => !isDark)

  return (
    <Button
      onClick={toggleDarkMode}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      data-style="ghost"
    >
      {isDarkMode ? (
        <MoonStar className="tiptap-button-icon" />
      ) : (
        <Sun className="tiptap-button-icon" />
      )}
    </Button>
  )
}
