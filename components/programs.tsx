// [file name]: components/programs.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Scale, Heart, Building2, Shield, ArrowRight, Users,
  Target, Calendar, MapPin, TrendingUp, Clock, Search, Loader2
} from "lucide-react"

// Define the interface for workplan data
interface WorkplanProgram {
  id: string
  name: string
  description: string
  focus_area: string
  status: string
  location: string
  year: number
  image: string | null
  budget_total: number
  activities: Array<{
    id: string
    name: string
    description: string
    status: string
    outcome: string
    kpi: string
    timeline_start: string
    timeline_end: string
  }>
  impact_metrics: {
    beneficiaries_reached: number
    success_rate: number
    activities_count: number
  }
  public_visible: boolean
}

const focusAreas = [
  { id: "all", name: "All Programs" },
  { id: "gbv", name: "Comprehensive Gender-based Violence GBV Management" },
  { id: "empowerment", name: "Survivors Livelihood Support Services" },
  { id: "institutional", name: "Institutional Development and Growth" }
]

export function Programs() {
  const [selectedProgram, setSelectedProgram] = useState<WorkplanProgram | null>(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [programs, setPrograms] = useState<WorkplanProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Calculate impact stats from programs data
  const calculateImpactStats = (programsData: WorkplanProgram[]) => {
    // 1. Total Individuals Served - sum of all target beneficiaries
    const totalIndividuals = programsData.reduce((sum, program) => 
      sum + (program.impact_metrics.beneficiaries_reached || 0), 0)

    // 2. Total Groups Supported - count of all programs/activities
    const totalGroups = programsData.length

    // 3. Total Community Events - count activities with recurrence logic
    const totalEvents = programsData.reduce((sum, program) => {
      const activity = program.activities[0] // Use first activity for recurrence logic
      if (activity?.timeline_start && activity.timeline_end) {
        // If it's a monthly activity, count 12 events per year
        if (program.name.toLowerCase().includes('monthly')) {
          return sum + 12
        }
        // If it's a quarterly activity, count 4 events per year  
        else if (program.name.toLowerCase().includes('quarterly') || program.activities.some(a => a.name.toLowerCase().includes('quarter'))) {
          return sum + 4
        }
        // One-time events count as 1
        else {
          return sum + 1
        }
      }
      return sum + 1 // Default to 1 if no timeline
    }, 0)

    // 4. Total Investment - sum of all budgets
    const totalInvestment = programsData.reduce((sum, program) => 
      sum + (program.budget_total || 0), 0)

    return {
      totalIndividuals,
      totalGroups,
      totalEvents,
      totalInvestment
    }
  }

  // Load programs from workplans API
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Load from workplans API instead of programs
        const response = await fetch('/api/workplans?public=true')
        
        if (!response.ok) {
          throw new Error(`Failed to load programs: ${response.status}`)
        }
        
        const workplans = await response.json()
        
        if (!Array.isArray(workplans)) {
          throw new Error('Invalid data format received')
        }
        
        // Transform workplans to programs format for public display
        const publicPrograms = workplans
          .filter(workplan => workplan.public_visible !== false)
          .map(workplan => transformWorkplanToProgram(workplan))
        
        setPrograms(publicPrograms)
        
      } catch (error) {
        console.error('Error loading programs:', error)
        setError('Unable to load programs at this time. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadPrograms()
  }, [])

  // Helper function to transform workplan to program format
  function transformWorkplanToProgram(workplan: any): WorkplanProgram {
    // Parse target as number for beneficiary count
    const beneficiaries = parseInt(workplan.target) || 0
    
    // Create activities from tasks_description (public-safe version)
    const activities = workplan.tasks_description ? 
      workplan.tasks_description.split(', ').map((task: string, index: number) => ({
        id: `${workplan.id}-${index}`,
        name: task,
        description: `Implementation activity for ${workplan.activity_name}`,
        status: getActivityStatus(workplan),
        outcome: workplan.outcome || 'Ongoing community impact',
        kpi: workplan.kpi || 'Measuring program effectiveness',
        timeline_start: workplan.timeline_text || '2025-01-01',
        timeline_end: workplan.timeline_text || '2025-12-31'
      })) : []

    return {
      id: workplan.id,
      name: workplan.activity_name,
      description: workplan.description || `Community program focused on ${workplan.focus_area}`,
      focus_area: workplan.focus_area,
      status: getProgramStatus(workplan),
      location: 'Migori County', // Default location from your CSV data
      year: new Date().getFullYear(), // Current year as default
      image: workplan.program_image,
      budget_total: workplan.budget_allocated || 0,
      activities: activities,
      impact_metrics: {
        beneficiaries_reached: beneficiaries,
        success_rate: calculateSuccessRate(workplan),
        activities_count: activities.length
      },
      public_visible: workplan.public_visible
    }
  }

  // Helper to determine program status
  function getProgramStatus(workplan: any): string {
    const status = workplan.status?.toLowerCase()
    if (status === 'completed') return 'completed'
    if (status === 'in-progress') return 'active'
    if (status === 'planned') return 'planned'
    return 'active' // default
  }

  function getActivityStatus(workplan: any): string {
    const status = getProgramStatus(workplan)
    return status === 'completed' ? 'completed' : 'in-progress'
  }

  // Calculate success rate based on available data
  function calculateSuccessRate(workplan: any): number {
    // Use progress field if available
    if (workplan.progress) {
      return Math.min(100, Math.max(0, workplan.progress))
    }
    
    // Default based on status
    const status = getProgramStatus(workplan)
    if (status === 'completed') return 85
    if (status === 'active') return 65
    return 0
  }

  const getProgramIcon = (focusArea: string) => {
    switch (focusArea) {
      case 'Comprehensive Gender-based Violence GBV Management': return Scale
      case 'Survivors Livelihood Support Services': return Heart
      case 'Institutional Development and Growth': return Building2
      default: return Building2
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'planned': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getFocusAreaColor = (focusArea: string) => {
    switch (focusArea) {
      case 'Comprehensive Gender-based Violence GBV Management': return 'border-red-200 bg-red-50 text-red-700'
      case 'Survivors Livelihood Support Services': return 'border-green-200 bg-green-50 text-green-700'
      case 'Institutional Development and Growth': return 'border-blue-200 bg-blue-50 text-blue-700'
      default: return 'border-gray-200 bg-gray-50 text-gray-700'
    }
  }

  const getImageSrc = (program: WorkplanProgram) => {
    if (!program.image) return null;
    
    // Handle different image path formats
    if (program.image.startsWith('http')) {
      return program.image;
    } else if (program.image.startsWith('/')) {
      return program.image;
    } else {
      // Just filename, prepend /programs/
      return `/programs/${program.image}`;
    }
  }

  const filteredPrograms = activeFilter === "all" 
    ? programs 
    : programs.filter(program => program.focus_area === focusAreas.find(f => f.id === activeFilter)?.name)

  // Calculate actual impact stats from workplan data
  const impactStats = calculateImpactStats(programs)

  if (loading) {
    return (
      <section id="programs" className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p className="text-muted-foreground">Loading our programs...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="programs" className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Load Programs</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="programs" className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="max-w-4xl mx-auto text-center mb-16 transition-opacity duration-700 opacity-100 animate-fadeIn">
            <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm font-semibold">
              <TrendingUp className="w-4 h-4 mr-2" />
              Transforming Lives in Migori County
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              Transformative Programs Making Impact
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              We deliver integrated support across {impactStats.totalGroups > 0 ? impactStats.totalGroups : 'multiple'} strategic programs, 
              providing holistic services from immediate crisis response to sustainable empowerment 
              for survivors, youth, and community members.
            </p>

            {/* Impact Stats - USING ACTUAL CALCULATED TOTALS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {impactStats.totalIndividuals}
                </div>
                <div className="text-sm text-muted-foreground">Individuals Served</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {impactStats.totalGroups}
                </div>
                <div className="text-sm text-muted-foreground">Groups Supported</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {impactStats.totalEvents}
                </div>
                <div className="text-sm text-muted-foreground">Community Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {impactStats.totalInvestment > 0 ? `KES ${(impactStats.totalInvestment).toLocaleString()}` : 'KES 0'}
                </div>
                <div className="text-sm text-muted-foreground">Total Investment</div>
              </div>
            </div>
          </div>

          {/* Rest of the component remains the same */}
          {/* ... (filters, program cards, modal, etc.) ... */}
        </div>
      </section>

      {/* Rest of the component (filters, program cards, modal) remains exactly the same */}
    </>
  )
}