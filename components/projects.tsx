"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Project } from "@/lib/types/database"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Users, MapPin, Calendar } from "lucide-react"
import Link from "next/link" // Add this import

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(6)

    if (!error && data) {
      setProjects(data)
    }
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "completed": return "bg-blue-500"
      case "paused": return "bg-yellow-500"
      case "planned": return "bg-purple-500"
      default: return "bg-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Simple progress bar component
  const Progress = ({ value = 0 }: { value?: number }) => (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full bg-green-500 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  )

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Our Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Loading our impactful initiatives...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Our Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the impactful initiatives we're working on to create positive change in communities around the world.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Projects</h3>
              <p className="text-gray-500">Check back soon for updates on our upcoming initiatives!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Project Image */}
                  <div className="relative overflow-hidden flex-shrink-0">
                    <img
                      src={project.image_url || "/images/projects/project-1.jpg"}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getStatusColor(project.status)} text-white`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-white bg-black/50 rounded-full px-2 py-1 text-sm">
                      <Eye size={14} />
                      <span>{project.views || 0}</span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(project.created_at)}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                      {project.description}
                    </p>

                    {/* Project Stats */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{project.beneficiaries?.toLocaleString() || 0}</span>
                      </div>
                      {project.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span className="truncate">{project.location}</span>
                        </div>
                      )}
                    </div>

                    {project.start_date && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                        <Calendar size={14} />
                        <span>{formatDate(project.start_date)}</span>
                        {project.end_date && (
                          <>
                            <span> - </span>
                            <span>{formatDate(project.end_date)}</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Updated Learn More Button with Link */}
                    <Button asChild className="w-full mt-auto" variant="outline">
                      <Link href={`/projects/${project.id}`}>
                        Learn More
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link href="/projects">
              View All Projects
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}