"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Users, Scale, GraduationCap, TrendingUp } from "lucide-react"
import { useScrollReveal } from "@/lib/scroll-reveal"

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}

function Counter({ end, duration = 2000, suffix = "", prefix = "" }: CounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const increment = end / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end, duration, isVisible])

  return (
    <div ref={ref} className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
      {prefix}
      {count}
      {suffix}
    </div>
  )
}

export function Impact() {
  useScrollReveal()

  const metrics = [
    {
      icon: Users,
      value: 500,
      suffix: "+",
      label: "Survivors Supported",
      description: "Comprehensive support provided since 2021",
      color: "primary",
    },
    {
      icon: Scale,
      value: 15,
      label: "Legal Convictions",
      description: "Justice achieved through our legal aid program",
      color: "secondary",
    },
    {
      icon: GraduationCap,
      value: 50,
      suffix: "+",
      label: "Training Sessions",
      description: "Capacity building and skills development",
      color: "primary",
    },
    {
      icon: TrendingUp,
      value: 20,
      suffix: "+",
      label: "VSLA Members",
      description: "Women empowered through savings groups",
      color: "secondary",
    },
  ]

  return (
    <section id="impact" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <span className="text-primary font-accent text-sm font-semibold tracking-wider uppercase">Our Impact</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            Making a Real Difference
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Since our founding in 2021, we've been committed to transforming lives and building a safer, more just
            community for all.
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <Card
              key={metric.label}
              className="p-8 text-center hover:shadow-xl transition-all reveal"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-16 h-16 rounded-full bg-${metric.color}/10 flex items-center justify-center mx-auto mb-6`}
              >
                <metric.icon className={`w-8 h-8 text-${metric.color}`} />
              </div>
              <Counter end={metric.value} suffix={metric.suffix} />
              <h3 className="font-accent text-lg font-semibold text-foreground mt-4 mb-2">{metric.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{metric.description}</p>
            </Card>
          ))}
        </div>

        {/* Impact Story */}
        <div className="reveal">
          <Card className="p-8 lg:p-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Transforming Lives Through Community Action
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Every number represents a life touched, a survivor empowered, and a step toward justice. Our
                    holistic approach combines immediate crisis response with long-term empowerment strategies.
                  </p>
                  <p>
                    Through our Village Savings and Loan Associations (VSLAs), survivors gain financial independence and
                    peer support. Our legal aid program has helped secure 15 convictions, sending a powerful message
                    that sexual violence will not be tolerated.
                  </p>
                  <p>
                    We're not just providing services—we're building a movement for change, one survivor, one family,
                    one community at a time.
                  </p>
                </div>
              </div>
              <div>
                <img
                  src="/african-women-community-empowerment-group.jpg"
                  alt="Community empowerment"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
