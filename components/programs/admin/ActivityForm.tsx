// [file name]: components/programs/admin/ActivityForm.tsx - UPDATED
// [file content begin - UPDATED WITH REAL API]
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Activity } from '@/lib/types/program'

interface ActivityFormProps {
  programId: string
  programName: string
  activity?: Activity // For editing existing activity
  onSuccess?: (activity: Activity) => void
  onCancel?: () => void
}

interface ActivityFormData {
  name: string
  description: string
  outcome: string
  kpi: string
  timeline_start: string
  timeline_end: string
  budget_allocated: string
  budget_utilized: string
  status: string
  responsible_person: string
  progress: string
  challenges: string
  next_steps: string
}

export function ActivityForm({ programId, programName, activity, onSuccess, onCancel }: ActivityFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState<ActivityFormData>({
    name: activity?.name || '',
    description: activity?.description || '',
    outcome: activity?.outcome || '',
    kpi: activity?.kpi || '',
    timeline_start: activity?.timeline_start || '',
    timeline_end: activity?.timeline_end || '',
    budget_allocated: activity?.budget_allocated?.toString() || '',
    budget_utilized: activity?.budget_utilized?.toString() || '0',
    status: activity?.status || 'planned',
    responsible_person: activity?.responsible_person || '',
    progress: activity?.progress?.toString() || '0',
    challenges: activity?.challenges || '',
    next_steps: activity?.next_steps || ''
  })

  const handleChange = (field: keyof ActivityFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validate form
    if (!formData.name || !formData.description || !formData.outcome || !formData.kpi || 
        !formData.timeline_start || !formData.timeline_end || !formData.budget_allocated) {
      alert('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    try {
      const activityData = {
        program_id: programId,
        name: formData.name,
        description: formData.description,
        outcome: formData.outcome,
        kpi: formData.kpi,
        timeline_start: formData.timeline_start,
        timeline_end: formData.timeline_end,
        budget_allocated: formData.budget_allocated,
        budget_utilized: formData.budget_utilized,
        status: formData.status,
        responsible_person: formData.responsible_person,
        progress: formData.progress,
        challenges: formData.challenges,
        next_steps: formData.next_steps
      }

      const url = activity ? `/api/activities/${activity.id}` : '/api/activities'
      const method = activity ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${activity ? 'update' : 'create'} activity`)
      }

      const result = await response.json()
      console.log(`✅ Activity ${activity ? 'updated' : 'created'} successfully:`, result)
      
      alert(`Activity ${activity ? 'updated' : 'created'} successfully!`)
      onSuccess?.(result)
      
    } catch (error) {
      console.error(`❌ Error ${activity ? 'updating' : 'creating'} activity:`, error)
      alert(error instanceof Error ? error.message : `Failed to ${activity ? 'update' : 'create'} activity`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Program Header */}
      <div className="p-4 bg-muted/30 rounded-lg">
        <h3 className="font-semibold text-foreground">Program: {programName}</h3>
        <p className="text-sm text-muted-foreground">Adding activity to program</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activity Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Activity Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Legal Aid Services"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeline Start */}
          <div className="space-y-2">
            <Label htmlFor="timeline_start">Start Date *</Label>
            <Input
              id="timeline_start"
              type="date"
              value={formData.timeline_start}
              onChange={(e) => handleChange('timeline_start', e.target.value)}
              required
            />
          </div>

          {/* Timeline End */}
          <div className="space-y-2">
            <Label htmlFor="timeline_end">End Date *</Label>
            <Input
              id="timeline_end"
              type="date"
              value={formData.timeline_end}
              onChange={(e) => handleChange('timeline_end', e.target.value)}
              required
            />
          </div>

          {/* Budget Allocated */}
          <div className="space-y-2">
            <Label htmlFor="budget_allocated">Budget Allocated (KES) *</Label>
            <Input
              id="budget_allocated"
              type="number"
              placeholder="e.g., 500000"
              value={formData.budget_allocated}
              onChange={(e) => handleChange('budget_allocated', e.target.value)}
              required
            />
          </div>

          {/* Budget Utilized */}
          <div className="space-y-2">
            <Label htmlFor="budget_utilized">Budget Utilized (KES)</Label>
            <Input
              id="budget_utilized"
              type="number"
              placeholder="e.g., 250000"
              value={formData.budget_utilized}
              onChange={(e) => handleChange('budget_utilized', e.target.value)}
            />
          </div>

          {/* Responsible Person */}
          <div className="space-y-2">
            <Label htmlFor="responsible_person">Responsible Person</Label>
            <Input
              id="responsible_person"
              placeholder="e.g., John Doe"
              value={formData.responsible_person}
              onChange={(e) => handleChange('responsible_person', e.target.value)}
            />
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Label htmlFor="progress">Progress (%)</Label>
            <Input
              id="progress"
              type="number"
              min="0"
              max="100"
              placeholder="0-100"
              value={formData.progress}
              onChange={(e) => handleChange('progress', e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Activity Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe what this activity involves..."
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
          />
        </div>

        {/* Outcome */}
        <div className="space-y-2">
          <Label htmlFor="outcome">Expected Outcome *</Label>
          <Textarea
            id="outcome"
            placeholder="What is the expected result of this activity?"
            rows={2}
            value={formData.outcome}
            onChange={(e) => handleChange('outcome', e.target.value)}
            required
          />
        </div>

        {/* KPI */}
        <div className="space-y-2">
          <Label htmlFor="kpi">Key Performance Indicator (KPI) *</Label>
          <Textarea
            id="kpi"
            placeholder="How will you measure success? e.g., 50 beneficiaries trained, 80% satisfaction rate"
            rows={2}
            value={formData.kpi}
            onChange={(e) => handleChange('kpi', e.target.value)}
            required
          />
        </div>

        {/* Challenges */}
        <div className="space-y-2">
          <Label htmlFor="challenges">Challenges & Risks</Label>
          <Textarea
            id="challenges"
            placeholder="Any anticipated challenges or risks?"
            rows={2}
            value={formData.challenges}
            onChange={(e) => handleChange('challenges', e.target.value)}
          />
        </div>

        {/* Next Steps */}
        <div className="space-y-2">
          <Label htmlFor="next_steps">Next Steps</Label>
          <Textarea
            id="next_steps"
            placeholder="What are the immediate next steps?"
            rows={2}
            value={formData.next_steps}
            onChange={(e) => handleChange('next_steps', e.target.value)}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading 
              ? (activity ? 'Updating Activity...' : 'Creating Activity...') 
              : (activity ? 'Update Activity' : 'Create Activity')
            }
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
// [file content end]