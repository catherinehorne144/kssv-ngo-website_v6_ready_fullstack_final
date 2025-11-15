"use client"

import { Button } from "@/components/ui/button"
import { smoothScrollTo } from "@/lib/scroll-reveal"
import { ArrowDown, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const heroImages = [
  "/images/hero/14540.jpg",
  "/images/hero/africancommunity.jpg", 
  "/images/hero/collegestudents.jpg",
  "/images/hero/mentalhealth.jpg",
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${image}')`,
            }}
          />
        ))}
        {/* Reduced opacity for clearer images */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent-purple/30 to-accent-coral/40" />
      </div>

      <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-accent-sunny/20 rounded-full blur-3xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-40 h-40 bg-accent-sky/20 rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl"
          animate={{
            x: [0, 15, 0],
            y: [0, -15, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            className="inline-block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-white font-accent text-sm md:text-base font-semibold tracking-wider uppercase px-4 py-2 bg-accent-sunny/30 backdrop-blur-sm rounded-full flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4" />
              Karungu Survivors of Sexual Violence
              <Sparkles className="w-4 h-4" />
            </span>
          </motion.div>

          <motion.h1
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight text-balance"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Break the Silence,
            <br />
            <span className="text-accent-sunny">End the Violence</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed text-pretty"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Empowering survivors through justice, healing, and economic resilience
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              onClick={() => smoothScrollTo("about")}
              className="font-accent font-semibold text-base px-8 py-6 bg-accent-coral hover:bg-accent-coral/90 text-white w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
            >
              Learn More
            </Button>
            <Button
              size="lg"
              onClick={() => smoothScrollTo("get-involved")}
              variant="outline"
              className="font-accent font-semibold text-base px-8 py-6 bg-white/95 backdrop-blur-sm border-white text-accent-purple hover:bg-white hover:text-accent-purple w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
            >
              Get Involved
            </Button>
          </motion.div>

          <motion.div
            className="pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: 0.8 },
              y: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
          >
            <button
              onClick={() => smoothScrollTo("about")}
              className="text-white/90 hover:text-white transition-colors"
              aria-label="Scroll to about section"
            >
              <ArrowDown size={32} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  )
}