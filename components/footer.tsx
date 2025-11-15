"use client"

import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { smoothScrollTo } from "@/lib/scroll-reveal"
import Link from "next/link"

export function Footer() {
  const quickLinks = [
    { label: "About Us", href: "about" },
    { label: "Programs", href: "programs" },
    { label: "Projects", href: "projects" },
    { label: "Blog", href: "blog" },
    { label: "Contact", href: "contact" },
    { label: "KSSV Portal", href: "/admin/login", isExternal: true },
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/karungusurvivors", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/karungusurvivors", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/karungusurvivors", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/karungusurvivors", label: "LinkedIn" },
  ]

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif text-xl font-bold">
                K
              </div>
              <div>
                <div className="font-serif text-lg font-bold">KSSV</div>
                <div className="text-xs text-background/70">Karungu Survivors</div>
              </div>
            </div>
            <p className="text-sm text-background/80 leading-relaxed">
              Empowering survivors through justice, healing, and economic resilience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  {link.isExternal ? (
                    <Link
                      href={link.href}
                      className="text-sm text-background/80 hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => smoothScrollTo(link.href)}
                      className="text-sm text-background/80 hover:text-background transition-colors"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-background/80">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Sori, Migori County, Kenya</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-background/80">
                <Phone size={16} className="flex-shrink-0" />
                <a href="tel:+254700000000" className="hover:text-background transition-colors">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-background/80">
                <Mail size={16} className="flex-shrink-0" />
                <a href="mailto:karungussvcbo@gmail.com" className="hover:text-background transition-colors">
                  info@kssv.org
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/70">
            <p>© 2025 – 2027 Karungu Survivors of Sexual Violence. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="hover:text-background transition-colors">Privacy Policy</button>
              <button className="hover:text-background transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
