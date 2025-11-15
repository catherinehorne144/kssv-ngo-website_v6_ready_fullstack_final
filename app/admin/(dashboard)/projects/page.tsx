// app/admin/projects/page.tsx
"use client"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/header"
import { DataTable } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { Project } from "@/lib/types/database"
import { Plus, Upload, X, Image as ImageIcon } from "lucide-react"
import { format } from "date-fns"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState<string>("")
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    full_description: "",
    category: "general",
    status: "active" as "active" | "completed" | "paused" | "planned",
    progress: 0,
    location: "",
    beneficiaries: 0,
    start_date: "",
    end_date: "",
    image_url: "",
    objectives: [] as string[],
    outcomes: [] as string[],
  })

  const [objectiveInput, setObjectiveInput] = useState("")
  const [outcomeInput, setOutcomeInput] = useState("")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setProjects(data)
    }
    setIsLoading(false)
  }

  const handleCreate = () => {
    setFormData({
      title: "",
      description: "",
      full_description: "",
      category: "general",
      status: "active",
      progress: 0,
      location: "",
      beneficiaries: 0,
      start_date: "",
      end_date: "",
      image_url: "",
      objectives: [],
      outcomes: [],
    })
    setImagePreview("")
    setObjectiveInput("")
    setOutcomeInput("")
    setIsCreating(true)
  }

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      full_description: project.full_description || "",
      category: project.category,
      status: project.status,
      progress: project.progress,
      location: project.location || "",
      beneficiaries: project.beneficiaries,
      start_date: project.start_date,
      end_date: project.end_date || "",
      image_url: project.image_url || "",
      objectives: project.objectives || [],
      outcomes: project.outcomes || [],
    })
    setImagePreview(project.image_url || "")
    setSelectedProject(project)
    setIsEditing(true)
  }

  // Handle local file upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, etc.)')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
    
    // For local development, we'll use the file name as the path
    // In production, you'd upload this to your server
    const fileName = `project-${Date.now()}-${file.name}`
    const publicPath = `/images/projects/${fileName}`
    
    setFormData(prev => ({ ...prev, image_url: publicPath }))
  }

  // Handle URL input
  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }))
    setImagePreview(url)
  }

  // Remove image
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: "" }))
    setImagePreview("")
  }

  const addObjective = () => {
    if (objectiveInput.trim()) {
      setFormData({
        ...formData,
        objectives: [...formData.objectives, objectiveInput.trim()]
      })
      setObjectiveInput("")
    }
  }

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index)
    })
  }

  const addOutcome = () => {
    if (outcomeInput.trim()) {
      setFormData({
        ...formData,
        outcomes: [...formData.outcomes, outcomeInput.trim()]
      })
      setOutcomeInput("")
    }
  }

  const removeOutcome = (index: number) => {
    setFormData({
      ...formData,
      outcomes: formData.outcomes.filter((_, i) => i !== index)
    })
  }

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      alert("Title and description are required")
      return
    }

    try {
      if (isCreating) {
        const { error } = await supabase.from("projects").insert({
          ...formData,
          date: new Date().toISOString(),
        })

        if (error) throw error
        fetchProjects()
        setIsCreating(false)
      } else if (isEditing && selectedProject) {
        const { error } = await supabase
          .from("projects")
          .update(formData)
          .eq("id", selectedProject.id)

        if (error) throw error
        fetchProjects()
        setIsEditing(false)
        setSelectedProject(null)
      }
    } catch (error) {
      console.error("Error saving project:", error)
      alert("Failed to save project")
    }
  }

  const handleDelete = async (project: Project) => {
    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id)

      if (!error) {
        fetchProjects()
      } else {
        alert("Failed to delete project")
      }
    }
  }

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={
          value === "active" ? "default" : 
          value === "completed" ? "secondary" : 
          "outline"
        }>
          {value}
        </Badge>
      ),
    },
    {
      key: "progress",
      label: "Progress",
      render: (value: number) => `${value}%`,
    },
    { key: "views", label: "Views" },
    {
      key: "created_at",
      label: "Created",
      render: (value: string) => format(new Date(value), "MMM d, yyyy"),
    },
  ]

  return (
    <>
      <AdminHeader 
        title="Projects" 
        description="Manage organization projects and initiatives" 
      />

      <div className="p-6">
        <div className="mb-6">
          <Button onClick={handleCreate} className="gap-2">
            <Plus size={18} />
            New Project
          </Button>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">
            Loading projects...
          </p>
        ) : (
          <DataTable
            data={projects}
            columns={columns}
            onView={(project) => setSelectedProject(project)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Search projects..."
          />
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={!!selectedProject && !isEditing} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {selectedProject?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedProject?.views} views • {selectedProject?.category}
            </DialogDescription>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={
                    selectedProject.status === "active" ? "default" : 
                    selectedProject.status === "completed" ? "secondary" : 
                    "outline"
                  }>
                    {selectedProject.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Progress</p>
                  <p className="text-base text-foreground">{selectedProject.progress}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Beneficiaries</p>
                  <p className="text-base text-foreground">{selectedProject.beneficiaries}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-base text-foreground">
                    {format(new Date(selectedProject.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              {selectedProject.image_url && (
                <img
                  src={selectedProject.image_url || "/placeholder.svg"}
                  alt={selectedProject.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-base text-foreground">{selectedProject.description}</p>
              </div>

              {selectedProject.full_description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Full Description</p>
                  <p className="text-base text-foreground">{selectedProject.full_description}</p>
                </div>
              )}

              {selectedProject.location && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Location</p>
                  <p className="text-base text-foreground">{selectedProject.location}</p>
                </div>
              )}

              {selectedProject.objectives && selectedProject.objectives.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Objectives</p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedProject.objectives.map((obj, index) => (
                      <li key={index} className="text-base text-foreground">{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  onClick={() => handleEdit(selectedProject)} 
                  className="flex-1"
                >
                  Edit Project
                </Button>
                <Button 
                  onClick={() => setSelectedProject(null)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreating || isEditing}
        onOpenChange={() => {
          setIsCreating(false)
          setIsEditing(false)
          setSelectedProject(null)
          setImagePreview("")
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {isCreating ? "Create New Project" : "Edit Project"}
            </DialogTitle>
            <DialogDescription>
              {isCreating ? "Add a new project to showcase" : "Update project information"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., education, healthcare"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "completed" | "paused" | "planned") => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="beneficiaries">Beneficiaries</Label>
                <Input
                  id="beneficiaries"
                  type="number"
                  min="0"
                  value={formData.beneficiaries}
                  onChange={(e) => setFormData({ ...formData, beneficiaries: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Project location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief project description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_description">Full Description</Label>
              <Textarea
                id="full_description"
                value={formData.full_description}
                onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                placeholder="Detailed project description"
                rows={4}
              />
            </div>

            {/* Enhanced Image Upload Section */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Project Image</Label>
              
              {/* Image Preview */}
              {(imagePreview || formData.image_url) && (
                <div className="relative border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Image Preview</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="h-8 px-2 text-destructive hover:text-destructive"
                    >
                      <X size={16} className="mr-1" />
                      Remove
                    </Button>
                  </div>
                  <img
                    src={imagePreview || formData.image_url}
                    alt="Project preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg"
                    }}
                  />
                </div>
              )}

              {/* Upload Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Local File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image-upload" className="flex items-center gap-2">
                    <Upload size={16} />
                    Upload from your device
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label 
                      htmlFor="image-upload" 
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <ImageIcon size={24} className="text-muted-foreground" />
                      <span className="text-sm font-medium">Click to upload</span>
                      <span className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 5MB
                      </span>
                    </Label>
                  </div>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="image_url" className="flex items-center gap-2">
                    <ImageIcon size={16} />
                    Or use image URL
                  </Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com/image.jpg or /images/projects/photo.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter full URL or path to image in public folder
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Objectives</Label>
              <div className="flex gap-2">
                <Input
                  value={objectiveInput}
                  onChange={(e) => setObjectiveInput(e.target.value)}
                  placeholder="Add an objective"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                />
                <Button type="button" onClick={addObjective}>
                  Add
                </Button>
              </div>
              <div className="space-y-1 mt-2">
                {formData.objectives.map((obj, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span>{obj}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeObjective(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Outcomes</Label>
              <div className="flex gap-2">
                <Input
                  value={outcomeInput}
                  onChange={(e) => setOutcomeInput(e.target.value)}
                  placeholder="Add an outcome"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOutcome())}
                />
                <Button type="button" onClick={addOutcome}>
                  Add
                </Button>
              </div>
              <div className="space-y-1 mt-2">
                {formData.outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span>{outcome}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOutcome(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSave} className="flex-1">
                {isCreating ? "Create Project" : "Save Changes"}
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false)
                  setIsEditing(false)
                  setSelectedProject(null)
                  setImagePreview("")
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}