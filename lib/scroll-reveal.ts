"use client"

import { useEffect } from "react"

export function useScrollReveal() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal")

    const revealOnScroll = () => {
      const windowHeight = window.innerHeight
      const elementVisible = 150

      reveals.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add("active")
        } else {
          // keep them visible once activated to prevent flicker
          if (!element.classList.contains("active")) {
            element.classList.remove("active")
          }
        }
      })
    }

    window.addEventListener("scroll", revealOnScroll)
    window.addEventListener("load", revealOnScroll) // ✅ ensures visible on page load
    revealOnScroll() // ✅ initial check (fix for already-in-view elements)

    return () => {
      window.removeEventListener("scroll", revealOnScroll)
      window.removeEventListener("load", revealOnScroll)
    }
  }, [])
}

export function smoothScrollTo(elementId: string) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}
