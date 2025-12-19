"use client"

import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "KSSV Portal", href: "/admin/login", external: true },
  ]

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com/share/19dKj3hVN6/",
      label: "Facebook",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/ssvcbo",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/karungu-ssv-cbo-71143437b",
      label: "LinkedIn",
    },
  ]

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-bold">KSSV</h3>
            <p className="text-sm mt-2 text-background/80">
              Karungu Survivors of Sexual Violence — empowering survivors through justice,
              healing, and economic resilience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/80 hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-background/80">
              <li className="flex gap-2">
                <MapPin size={16} /> Karungu, Migori County, Kenya
              </li>
              <li className="flex gap-2">
                <Phone size={16} />
                <a href="tel:+254700000000">+254 700 000 000</a>
              </li>
              <li className="flex gap-2">
                <Mail size={16} />
                <a href="mailto:karungussvcbo@gmail.com">karungussvcbo@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-serif font-bold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-background/10 hover:bg-primary"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/20 text-sm text-background/70 text-center">
          © 2025 Karungu Survivors of Sexual Violence (KSSV). All rights reserved.
        </div>
      </div>
    </footer>
  )
}
