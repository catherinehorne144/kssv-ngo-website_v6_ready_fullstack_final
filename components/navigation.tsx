"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { smoothScrollTo } from "@/lib/scroll-reveal"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

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

  const navLinks = [
    { label: "About", href: "about", type: "scroll" },
    { label: "Programs", href: "programs", type: "scroll" },
    { label: "Impact", href: "impact", type: "scroll" },
    { label: "Projects", href: "projects", type: "scroll" },
    { label: "Testimonials", href: "testimonials", type: "scroll" },
    { label: "Blog", href: "/blog", type: "link" },
    { label: "Get Involved", href: "get-involved", type: "scroll" },
    { label: "Contact", href: "contact", type: "scroll" },
  ]

  const handleNavClick = (href: string, type: string) => {
    if (type === "scroll") {
      smoothScrollTo(href)
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/95 backdrop-blur-md shadow-lg border-b" 
            : "bg-background/90 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center text-white font-serif text-xl font-bold group-hover:scale-110 transition-transform shadow-lg">
                K
              </div>
              <div className="hidden md:block">
                <div className="font-serif text-lg font-bold text-foreground leading-tight">KSSV</div>
                <div className="text-xs text-muted-foreground">Karungu Survivors</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) =>
                link.type === "link" ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href, link.type)}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                ),
              )}
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                onClick={() => (pathname === "/" ? smoothScrollTo("donate") : (window.location.href = "/#donate"))}
                className="font-accent font-semibold bg-gradient-to-r from-accent-coral to-accent-sunny hover:from-accent-coral/90 hover:to-accent-sunny/90 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Donate
              </Button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-background/95 backdrop-blur-md pt-20">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) =>
                  link.type === "link" ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xl font-medium text-foreground hover:text-primary transition-colors text-left"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href, link.type)}
                      className="text-xl font-medium text-foreground hover:text-primary transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}