// [file name]: components/programs/admin/ProgramForm.tsx - UPDATED
// [file content begin - UPDATED VERSION]
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface ProgramFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

interface ProgramFormData {
  name: string
  description: string
  year: string
  status: string
  budget_total: string
  public_visible: boolean
  focus_area: string
  program_image: string
  strategic_objective: string
  location: string
}

const focusAreas = [
  { id: 'gbv', name: 'GBV Management' },
  { id: 'empowerment', name: 'Survivor Empowerment' },
  { id: 'institutional', name: 'Institutional Development' },
  { id: 'srh', name: 'SRH Rights' },
  { id: 'other', name: 'Other' }
]

export function ProgramForm({ onSuccess, onCancel }: ProgramFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProgramFormData>({
    name: '',
    description: '',
    year: '',
    status: '',
    budget_total: '',
    public_visible: true,
    focus_area: '',
    program_image: '',
    strategic_objective: '',
    location: 'Migori County'
  })

  const handleChange = (field: keyof ProgramFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validate form
    if (!formData.name || !formData.description || !formData.year || !formData.status || 
        !formData.budget_total || !formData.focus_area || !formData.location) {
      alert('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    try {
      // REAL API CALL
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create program')
      }

      const result = await response.json()
      console.log('✅ Program created successfully:', result)
      
      alert('Program created successfully!')
      onSuccess?.()
      
    } catch (error) {
      console.error('❌ Error creating program:', error)
      alert(error instanceof Error ? error.message : 'Failed to create program')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Program Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Program Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Comprehensive GBV Management"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        {/* Focus Area */}
        <div className="space-y-2">
          <Label htmlFor="focus_area">Focus Area *</Label>
          <Select value={formData.focus_area} onValueChange={(value) => handleChange('focus_area', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select focus area" />
            </SelectTrigger>
            <SelectContent>
              {focusAreas.map((area) => (
                <SelectItem key={area.id} value={area.name}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Program Year */}
        <div className="space-y-2">
          <Label htmlFor="year">Program Year *</Label>
          <Select value={formData.year} onValueChange={(value) => handleChange('year', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange('status', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <Label htmlFor="budget">Total Budget (KES) *</Label>
          <Input
            id="budget"
            type="number"
            placeholder="e.g., 2500000"
            value={formData.budget_total}
            onChange={(e) => handleChange('budget_total', e.target.value)}
            required
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Select value={formData.location} onValueChange={(value) => handleChange('location', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Migori County">Migori County</SelectItem>
              <SelectItem value="Multiple Counties">Multiple Counties</SelectItem>
              <SelectItem value="National">National</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Program Image */}
      <div className="space-y-2">
        <Label htmlFor="program_image">Program Image URL</Label>
        <Input
          id="program_image"
          placeholder="e.g., /programs/program-name.jpg"
          value={formData.program_image}
          onChange={(e) => handleChange('program_image', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Add a program cover image to make it more engaging
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Program Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe the program objectives, scope, and target beneficiaries..."
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
        />
      </div>

      {/* Strategic Objective */}
      <div className="space-y-2">
        <Label htmlFor="strategic_objective">Strategic Objective</Label>
        <Textarea
          id="strategic_objective"
          placeholder="What is the main strategic goal of this program? e.g., Reduce GBV cases by 40% by 2026"
          rows={2}
          value={formData.strategic_objective}
          onChange={(e) => handleChange('strategic_objective', e.target.value)}
        />
      </div>

      {/* Public Visibility */}
      <div className="flex items-center space-x-2">
        <Switch 
          id="public-visible" 
          checked={formData.public_visible}
          onCheckedChange={(checked) => handleChange('public_visible', checked)}
        />
        <Label htmlFor="public-visible">Make program visible to public</Label>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Creating Program...' : 'Create Program'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
// [file content end]