import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, ArrowLeft, Eye, Target, Award } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: {
    id: string
  }
}

export default async function ProjectDetail({ params }: PageProps) {
  const supabase = createClient()
  
  // Fetch the specific project
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !project) {
    notFound()
  }

  // Update view count
  await supabase
    .from("projects")
    .update({ views: (project.views || 0) + 1 })
    .eq("id", params.id)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/#projects" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 md:h-96">
            <img
              src={project.image_url || "/images/projects/project-1.jpg"}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-4 left-6">
              <Badge className={`${getStatusColor(project.status)} text-white text-sm`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-1 text-white bg-black/50 rounded-full px-3 py-1 text-sm">
              <Eye size={16} />
              <span>{(project.views || 0) + 1} views</span>
            </div>
          </div>

          {/* Project Content */}
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge variant="outline" className="text-sm">
                {project.category}
              </Badge>
              <span className="text-sm text-gray-500">
                Created {formatDate(project.created_at)}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              {project.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {project.description}
            </p>

            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {project.progress}%
                </div>
                <div className="text-sm text-gray-600 font-medium">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {project.beneficiaries?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">Beneficiaries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2 capitalize">
                  {project.status}
                </div>
                <div className="text-sm text-gray-600 font-medium">Status</div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {project.full_description && (
                  <div>
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">About This Project</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {project.full_description}
                    </p>
                  </div>
                )}

                {/* Objectives */}
                {project.objectives && project.objectives.length > 0 && (
                  <div>
                    <h2 className="flex items-center gap-2 text-2xl font-serif font-semibold text-gray-900 mb-4">
                      <Target className="w-6 h-6 text-green-600" />
                      Project Objectives
                    </h2>
                    <ul className="space-y-3">
                      {project.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-lg leading-relaxed">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Outcomes */}
                {project.outcomes && project.outcomes.length > 0 && (
                  <div>
                    <h2 className="flex items-center gap-2 text-2xl font-serif font-semibold text-gray-900 mb-4">
                      <Award className="w-6 h-6 text-blue-600" />
                      Expected Outcomes
                    </h2>
                    <ul className="space-y-3">
                      {project.outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-lg leading-relaxed">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Project Details Card */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg">Project Details</h3>
                  
                  {project.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="text-gray-900 font-medium">{project.location}</p>
                      </div>
                    </div>
                  )}

                  {project.start_date && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Timeline</p>
                        <p className="text-gray-900 font-medium">
                          {formatDate(project.start_date)}
                          {project.end_date && ` - ${formatDate(project.end_date)}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.beneficiaries > 0 && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Direct Impact</p>
                        <p className="text-gray-900 font-medium">
                          {project.beneficiaries.toLocaleString()} people
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Call to Action */}
                <div className="bg-green-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-green-900 text-lg">Support This Project</h3>
                  <p className="text-green-700 text-sm">
                    Help us continue this important work and make an even greater impact in our community.
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      Donate to This Project
                    </Button>
                    <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                      Volunteer
                    </Button>
                    <Button variant="ghost" className="w-full text-green-600 hover:bg-green-100">
                      Share Project
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}