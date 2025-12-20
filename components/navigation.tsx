"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { smoothScrollTo } from "@/lib/scroll-reveal"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside or on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { label: "About", href: "about", type: "scroll", isHomeOnly: true },
    { label: "Programs", href: "programs", type: "scroll", isHomeOnly: true },
    { label: "Impact", href: "impact", type: "scroll", isHomeOnly: true },
    { label: "Projects", href: "projects", type: "scroll", isHomeOnly: true },
    { label: "Testimonials", href: "testimonials", type: "scroll", isHomeOnly: true },
    { label: "Blog", href: "/blog", type: "link", isHomeOnly: false },
    { label: "Get Involved", href: "get-involved", type: "scroll", isHomeOnly: true },
    { label: "Contact", href: "contact", type: "scroll", isHomeOnly: true },
  ]

  const handleNavClick = (href: string, type: string, isHomeOnly: boolean) => {
    setIsMobileMenuOpen(false)
    
    if (type === "scroll") {
      if (pathname === "/") {
        // On homepage, scroll to section
        smoothScrollTo(href)
      } else if (isHomeOnly) {
        // On other pages, redirect to homepage with hash
        window.location.href = `/#${href}`
      }
    }
    // For link type, Next.js Link will handle navigation
  }

  const isActive = (href: string, type: string) => {
    if (type === "link") {
      return pathname === href || pathname.startsWith(href + "/")
    }
    return false
  }

  const isHomePage = pathname === "/"

  return (
    <>
      {/* NAV BAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg border-b"
            : "bg-background/90 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link 
              href="/" 
              className="flex items-center gap-3 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {/* LOGO — ANDROID SAFE */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-background shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src="/brand/kssv-icon.svg"
                  alt="KSSV Logo"
                  width={48}
                  height={48}
                  priority
                  className="object-contain"
                />
              </div>

              <div className="hidden md:block">
                <div className="font-serif text-lg font-bold text-foreground leading-tight">
                  KSSV
                </div>
                <div className="text-xs text-muted-foreground">
                  Karungu Survivors
                </div>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const active = isActive(link.href, link.type)
                
                return link.type === "link" ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      active
                        ? "text-primary font-semibold"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href, link.type, link.isHomeOnly)}
                    className={`text-sm font-medium transition-colors ${
                      !isHomePage && link.isHomeOnly 
                        ? "text-muted-foreground hover:text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />

              <Button
                onClick={() => {
                  if (pathname === "/") {
                    smoothScrollTo("donate")
                  } else {
                    window.location.href = "/#donate"
                  }
                }}
                className="font-accent font-semibold bg-gradient-to-r from-accent-coral to-accent-sunny text-white shadow-lg hover:opacity-90 transition-opacity"
              >
                Donate
              </Button>

              {/* MOBILE TOGGLE */}
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="lg:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY — ANDROID SAFE */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[9999] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
          
          {/* Menu Panel */}
          <div 
            className="absolute top-0 left-0 right-0 bg-background/95 backdrop-blur-md pt-20 border-b shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const active = isActive(link.href, link.type)
                  
                  return link.type === "link" ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                        active
                          ? "text-primary bg-primary/10 font-semibold"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href, link.type, link.isHomeOnly)}
                      className={`py-3 px-4 rounded-lg text-base font-medium text-left transition-colors ${
                        !isHomePage && link.isHomeOnly 
                          ? "text-muted-foreground hover:text-primary hover:bg-muted"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </button>
                  )
                })}
                
                {/* Mobile Donate Button */}
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    if (pathname === "/") {
                      smoothScrollTo("donate")
                    } else {
                      window.location.href = "/#donate"
                    }
                  }}
                  className="mt-4 font-accent font-semibold bg-gradient-to-r from-accent-coral to-accent-sunny text-white shadow-lg hover:opacity-90 transition-opacity"
                >
                  Donate Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
