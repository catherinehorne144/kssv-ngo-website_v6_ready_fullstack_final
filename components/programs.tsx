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
import type { ProgramWithDetails } from "@/lib/types/program"

const focusAreas = [
  { id: "all", name: "All Programs" },
  { id: "gbv", name: "GBV Management" },
  { id: "empowerment", name: "Survivor Empowerment" },
  { id: "srh", name: "SRH Rights" },
  { id: "institutional", name: "Institutional Development" }
]

export function Programs() {
  const [selectedProgram, setSelectedProgram] = useState<ProgramWithDetails | null>(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [programs, setPrograms] = useState<ProgramWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load programs from API
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/programs')
        
        if (!response.ok) {
          throw new Error(`Failed to load programs: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received')
        }
        
        const publicPrograms = data.filter((program: ProgramWithDetails) => 
          program.public_visible !== false
        )
        
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

  const getProgramIcon = (focusArea: string) => {
    switch (focusArea) {
      case 'GBV Management': return Scale
      case 'Survivor Empowerment': return Heart
      case 'Institutional Development': return Building2
      case 'SRH Rights': return Shield
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
      case 'GBV Management': return 'border-red-200 bg-red-50 text-red-700'
      case 'Survivor Empowerment': return 'border-green-200 bg-green-50 text-green-700'
      case 'Institutional Development': return 'border-blue-200 bg-blue-50 text-blue-700'
      case 'SRH Rights': return 'border-purple-200 bg-purple-50 text-purple-700'
      default: return 'border-gray-200 bg-gray-50 text-gray-700'
    }
  }

  const getImageSrc = (program: ProgramWithDetails) => {
    if (!program.image) return null;
    
    // Handle different image path formats
    if (program.image.startsWith('http')) {
      return program.image;
    } else if (program.image.startsWith('/programs/')) {
      // Already in the correct format from wizard
      return program.image;
    } else if (program.image.startsWith('/')) {
      // Other root paths
      return program.image;
    } else {
      // Just filename, prepend /programs/
      return `/programs/${program.image}`;
    }
  }

  const filteredPrograms = activeFilter === "all" 
    ? programs 
    : programs.filter(program => program.focus_area === focusAreas.find(f => f.id === activeFilter)?.name)

  // Safe impact stats calculation
  const impactStats = {
    totalBeneficiaries: programs.reduce((sum, program) => 
      sum + (program.impact_metrics?.beneficiaries_reached || 0), 0),
    totalActivities: programs.reduce((sum, program) => 
      sum + (program.activities?.length || 0), 0),
    averageSuccess: programs.length > 0 ? 
      Math.round(programs.reduce((sum, program) => 
        sum + (program.impact_metrics?.success_rate || 0), 0) / programs.length) : 0,
    totalBudget: programs.reduce((sum, program) => 
      sum + (program.budget_total || 0), 0),
    focusAreasCount: [...new Set(programs.map(p => p.focus_area).filter(Boolean))].length
  }

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
              We deliver integrated support across {impactStats.focusAreasCount || 'multiple'} strategic focus areas, 
              providing holistic services from immediate crisis response to sustainable empowerment 
              for survivors, youth, and community members.
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {impactStats.totalBeneficiaries > 0 ? `${impactStats.totalBeneficiaries}+` : '0'}
                </div>
                <div className="text-sm text-muted-foreground">Lives Impacted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {impactStats.totalActivities}
                </div>
                <div className="text-sm text-muted-foreground">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {impactStats.averageSuccess}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {impactStats.totalBudget > 0 ? `KES ${(impactStats.totalBudget / 1000000).toFixed(1)}M` : 'KES 0'}
                </div>
                <div className="text-sm text-muted-foreground">Investment</div>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 transition-opacity duration-700 opacity-100 animate-fadeIn">
            {focusAreas.map((category) => {
              const programCount = programs.filter(p => 
                category.id === "all" ? true : p.focus_area === category.name
              ).length
              
              return (
                <Button
                  key={category.id}
                  variant={activeFilter === category.id ? "default" : "outline"}
                  onClick={() => setActiveFilter(category.id)}
                  className="rounded-full px-6 py-2"
                  disabled={programCount === 0 && category.id !== "all"}
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                    {programCount}
                  </Badge>
                </Button>
              )
            })}
          </div>

          {/* Program Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredPrograms.map((program, index) => {
              const ProgramIcon = getProgramIcon(program.focus_area)
              const imageSrc = getImageSrc(program)
              
              return (
                <Card
                  key={program.id}
                  className="p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedProgram(program)}
                >
                  {/* Program Image */}
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={program.name}
                        width={400}
                        height={200}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <ProgramIcon className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                    {/* Fallback icon in case image fails */}
                    {imageSrc && (
                      <div className="hidden w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <ProgramIcon className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                      <ProgramIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(program.status)}`}>
                      {program.status}
                    </span>
                  </div>

                  <Badge variant="outline" className={`w-fit mb-3 text-xs ${getFocusAreaColor(program.focus_area)}`}>
                    {program.focus_area}
                  </Badge>
                  
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3 line-clamp-2">
                    {program.name}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {program.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>Reached</span>
                      </div>
                      <span className="font-semibold">
                        {(program.impact_metrics?.beneficiaries_reached || 0)}+
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span>Success</span>
                      </div>
                      <span className="font-semibold">
                        {program.impact_metrics?.success_rate || 0}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-muted-foreground">Click to explore</span>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Empty state */}
          {filteredPrograms.length === 0 && !loading && (
            <div className="text-center py-12 transition-opacity duration-700 opacity-100 animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No programs found</h3>
              <p className="text-muted-foreground mb-6">
                {programs.length === 0 
                  ? "No programs are currently available." 
                  : "Try selecting a different focus area"}
              </p>
              {programs.length > 0 && (
                <Button onClick={() => setActiveFilter("all")} variant="outline">
                  Show All Programs
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Program Detail Modal */}
      <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProgram && (
            <>
              {/* Modal Image */}
              <div className="w-full h-64 rounded-xl overflow-hidden mb-6 bg-gray-100 dark:bg-gray-800">
                {getImageSrc(selectedProgram) ? (
                  <Image
                    src={getImageSrc(selectedProgram)!}
                    alt={selectedProgram.name}
                    width={800}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    {(() => {
                      const IconComponent = getProgramIcon(selectedProgram.focus_area)
                      return <IconComponent className="w-16 h-16 text-primary/40" />
                    })()}
                  </div>
                )}
              </div>

              <DialogHeader>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const IconComponent = getProgramIcon(selectedProgram.focus_area)
                      return <IconComponent className="w-8 h-8 text-white" />
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(selectedProgram.status)}`}>
                        {selectedProgram.status}
                      </span>
                      <Badge variant="outline" className={getFocusAreaColor(selectedProgram.focus_area)}>
                        {selectedProgram.focus_area}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedProgram.location}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {selectedProgram.year}
                      </Badge>
                    </div>
                    <DialogTitle className="font-serif text-2xl lg:text-3xl font-bold text-foreground">
                      {selectedProgram.name}
                    </DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-base text-muted-foreground">
                  {selectedProgram.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* Impact Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-primary/5 rounded-xl border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {(selectedProgram.impact_metrics?.beneficiaries_reached || 0)}+
                    </div>
                    <div className="text-sm text-muted-foreground">Beneficiaries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedProgram.impact_metrics?.success_rate || 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedProgram.activities?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Activities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      KES {(selectedProgram.budget_total || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Budget</div>
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <h4 className="font-serif text-xl font-bold text-foreground mb-4">Key Activities</h4>
                  <div className="space-y-4">
                    {(selectedProgram.activities || []).map((activity: any) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 bg-muted/20 rounded-xl border">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-foreground">{activity.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {activity.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="font-medium text-foreground">Outcome:</span>
                              <p className="text-muted-foreground mt-1">{activity.outcome}</p>
                            </div>
                            <div>
                              <span className="font-medium text-foreground">Key Performance:</span>
                              <p className="text-muted-foreground mt-1">{activity.kpi}</p>
                            </div>
                          </div>
                          {activity.timeline_start && activity.timeline_end && (
                            <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(activity.timeline_start).toLocaleDateString()} -{" "}
                                {new Date(activity.timeline_end).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={() => setSelectedProgram(null)} className="w-full" size="lg">
                  Close Program Details
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}