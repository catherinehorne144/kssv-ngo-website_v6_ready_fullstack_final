// [file name]: components/workplans/admin/WorkplanForm.tsx
'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Target, Calendar, DollarSign, Users, Loader2 } from 'lucide-react'
import type { Workplan, WorkplanFormData } from '@/lib/types/workplan'

interface WorkplanFormProps {
  workplan?: Workplan // For editing existing workplan
  onSuccess?: (workplan: Workplan) => void
  onCancel?: () => void
}

// Enhanced activity templates with more comprehensive data
const activityTemplates = {
  // GBV Management Activities
  'Referrals & linkages': {
    tasks_description: 'Identify survivor needs, Schedule appointments with service providers, Contact referral partners, Arrange safe transport, Record case details, Conduct follow-up visits',
  },
  'Chief barazas': {
    tasks_description: 'Community consultation on available dates, Develop discussion topics, Arrange qualified facilitation, Mobilize community participants, Document proceedings and outcomes',
  },
  'Psychological counselling': {
    tasks_description: 'Schedule counselling sessions, Obtain informed consent from survivors, Conduct psychological assessments, Provide therapeutic recommendations, Document session notes, Conduct follow-up assessments',
  },
  'Monthly group saving and GSL meeting': {
    tasks_description: 'Schedule monthly meetings, Prepare previous minutes, Set meeting agendas, Facilitate table banking activities, Document financial transactions, Record member participation',
  }
}

const focusAreas = [
  { id: 'gbv', name: 'Comprehensive GBV Management', color: 'red' },
  { id: 'survivor', name: 'Survivors Livelihood Support Services', color: 'green' },
  { id: 'institutional', name: 'Institutional Development and Growth', color: 'blue' },
  { id: 'other', name: 'Other Focus Area', color: 'gray' }
]

const activityTypes = {
  gbv: [
    'Referrals & linkages',
    'Chief barazas',
    'Partnership meetings',
    'Psychological counselling',
    'Rapid response and rescue',
    'Temporary shelter',
    'Violence response meetings',
    'Dialogue forums',
    'Radio engagements',
    'GBV case managers training',
    'CUC meetings',
    'Technical working group meetings',
    'Legal aid clinic',
    'Case management database',
    'GBV Monitoring SOPs',
    '16 days of activism',
    'International women\'s day'
  ],
  survivor: [
    'Training of support groups',
    'Monthly group saving and GSL meeting',
    'Formation of support groups',
    'Business development training',
    'Planning for annual fund drive',
    'GSL group sharing out activity'
  ],
  institutional: [
    'Monthly member meetings',
    'Developing website',
    'Creating social media platforms',
    'Office Acquisition',
    'Corporate branding',
    'Establishing a board of advisory',
    'Developing a resource mobilization policy',
    'Developing a MERL framework',
    'Resource mobilization training',
    'Development of work plan',
    'Internal financial audit',
    'Annual performance review meetings',
    'Exchange programs'
  ],
  other: [
    'Custom Activity'
  ]
}

// Resource persons from your organization
const resourcePersons = [
  'Claris',
  'Leah', 
  'Equator',
  'Other Staff'
]

export function WorkplanForm({ workplan, onSuccess, onCancel }: WorkplanFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFocusArea, setSelectedFocusArea] = useState(workplan?.focus_area || '')
  
  const [formData, setFormData] = useState<WorkplanFormData>({
    focus_area: workplan?.focus_area || '',
    activity_name: workplan?.activity_name || '',
    timeline_text: workplan?.timeline_text || '',
    quarter: workplan?.quarter || 'Q1',
    tasks_description: workplan?.tasks_description || '',
    target: workplan?.target || '',
    budget_allocated: workplan?.budget_allocated?.toString() || '',
    resource_person: workplan?.resource_person || '',
    status: workplan?.status || 'planned',
    progress: workplan?.progress?.toString() || '0',
    public_visible: workplan?.public_visible !== undefined ? workplan.public_visible : true,
  })

  const handleChange = (field: keyof WorkplanFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Smart pre-filling based on activity selection
  const handleActivityChange = (activityName: string) => {
    handleChange('activity_name', activityName)
    
    // Apply template if available
    const template = activityTemplates[activityName as keyof typeof activityTemplates]
    if (template) {
      setFormData(prev => ({
        ...prev,
        tasks_description: template.tasks_description,
      }))
    }
  }

  // Auto-calculate progress based on status
  const handleStatusChange = (status: string) => {
    handleChange('status', status)
    
    if (status === 'completed' && !formData.progress) {
      handleChange('progress', '100')
    } else if (status === 'planned' && parseInt(formData.progress) > 0) {
      handleChange('progress', '0')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Enhanced validation
    const requiredFields = {
      'Focus Area': formData.focus_area,
      'Activity Name': formData.activity_name,
      'Timeline': formData.timeline_text,
      'Tasks Description': formData.tasks_description
    }
    
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field)
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields:\n${missingFields.join('\n')}`)
      setIsLoading(false)
      return
    }

    // Validate budget is a number
    if (formData.budget_allocated && isNaN(parseInt(formData.budget_allocated))) {
      alert('Please enter a valid budget amount')
      setIsLoading(false)
      return
    }

    try {
      const url = workplan ? `/api/workplans/${workplan.id}` : '/api/workplans'
      const method = workplan ? 'PUT' : 'POST'

      // Prepare data for API
      const submitData = {
        ...formData,
        budget_allocated: parseInt(formData.budget_allocated) || 0,
        progress: parseInt(formData.progress) || 0,
        // Ensure boolean value
        public_visible: Boolean(formData.public_visible)
      }

      console.log('📤 Submitting workplan data:', submitData)

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${workplan ? 'update' : 'create'} workplan`)
      }

      const result = await response.json()
      console.log(`✅ Workplan ${workplan ? 'updated' : 'created'} successfully:`, result)
      
      alert(`Workplan "${formData.activity_name}" ${workplan ? 'updated' : 'created'} successfully!`)
      onSuccess?.(result)
      
    } catch (error) {
      console.error(`❌ Error ${workplan ? 'updating' : 'creating'} workplan:`, error)
      alert(error instanceof Error ? error.message : `Failed to ${workplan ? 'update' : 'create'} workplan`)
    } finally {
      setIsLoading(false)
    }
  }

  const currentActivities = selectedFocusArea ? activityTypes[selectedFocusArea as keyof typeof activityTypes] || [] : []

  const selectedFocusAreaColor = focusAreas.find(area => area.name === formData.focus_area)?.color || 'gray'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Foundation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Foundation (Columns 1-2)
            {formData.focus_area && (
              <Badge variant="outline" className={`ml-2 bg-${selectedFocusAreaColor}-100 text-${selectedFocusAreaColor}-800`}>
                {formData.focus_area}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Focus Area */}
            <div className="space-y-2">
              <Label htmlFor="focus_area" className="flex items-center gap-2">
                Focus Area *
                {!formData.focus_area && <AlertCircle className="h-4 w-4 text-red-500" />}
              </Label>
              <Select 
                value={formData.focus_area} 
                onValueChange={(value) => {
                  setSelectedFocusArea(value)
                  handleChange('focus_area', value)
                  // Clear activity when focus area changes
                  if (formData.activity_name && !activityTypes[value as keyof typeof activityTypes]?.includes(formData.activity_name)) {
                    handleChange('activity_name', '')
                  }
                }}
                required
              >
                <SelectTrigger className={!formData.focus_area ? 'border-red-300' : ''}>
                  <SelectValue placeholder="Select focus area" />
                </SelectTrigger>
                <SelectContent>
                  {focusAreas.map((area) => (
                    <SelectItem key={area.id} value={area.name}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-${area.color}-500`} />
                        {area.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Activity Name */}
            <div className="space-y-2">
              <Label htmlFor="activity_name" className="flex items-center gap-2">
                Activity Name *
                {!formData.activity_name && <AlertCircle className="h-4 w-4 text-red-500" />}
              </Label>
              <Select 
                value={formData.activity_name} 
                onValueChange={handleActivityChange}
                required
              >
                <SelectTrigger className={!formData.activity_name ? 'border-red-300' : ''}>
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  {currentActivities.map((activity) => (
                    <SelectItem key={activity} value={activity}>
                      <div className="flex items-center justify-between">
                        <span>{activity}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Or type a custom activity name
              </p>
              <Input
                placeholder="Custom activity name..."
                value={formData.activity_name}
                onChange={(e) => handleChange('activity_name', e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Quarter */}
            <div className="space-y-2">
              <Label htmlFor="quarter">Quarter</Label>
              <Select value={formData.quarter} onValueChange={(value) => handleChange('quarter', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1">Q1 (Jan-Mar)</SelectItem>
                  <SelectItem value="Q2">Q2 (Apr-Jun)</SelectItem>
                  <SelectItem value="Q3">Q3 (Jul-Sep)</SelectItem>
                  <SelectItem value="Q4">Q4 (Oct-Dec)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <Label htmlFor="timeline_text" className="flex items-center gap-2">
                Timeline Text *
                {!formData.timeline_text && <AlertCircle className="h-4 w-4 text-red-500" />}
              </Label>
              <Input
                id="timeline_text"
                placeholder="e.g., Monthly, Q1 2024, Case by case, Weekly meetings"
                value={formData.timeline_text}
                onChange={(e) => handleChange('timeline_text', e.target.value)}
                className={!formData.timeline_text ? 'border-red-300' : ''}
                required
              />
            </div>
          </div>

          {/* Tasks Description */}
          <div className="space-y-2">
            <Label htmlFor="tasks_description" className="flex items-center gap-2">
              Tasks Description *
              {!formData.tasks_description && <AlertCircle className="h-4 w-4 text-red-500" />}
            </Label>
            <Textarea
              id="tasks_description"
              placeholder="Breakdown of activity into actionable steps..."
              rows={4}
              value={formData.tasks_description}
              onChange={(e) => handleChange('tasks_description', e.target.value)}
              className={!formData.tasks_description ? 'border-red-300' : ''}
              required
            />
            <p className="text-xs text-muted-foreground">
              Describe the specific tasks and steps required to complete this activity
            </p>
          </div>

          {/* Target */}
          <div className="space-y-2">
            <Label htmlFor="target">Target</Label>
            <Input
              id="target"
              placeholder="e.g., 50 beneficiaries, 10 meetings, 5 training sessions"
              value={formData.target}
              onChange={(e) => handleChange('target', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Specific, measurable targets for this activity
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Planning & Resources Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Planning & Resources (Columns 3-6)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget_allocated">Budget Allocated (KES)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budget_allocated"
                  type="number"
                  placeholder="e.g., 50000"
                  value={formData.budget_allocated}
                  onChange={(e) => handleChange('budget_allocated', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Resource Person */}
            <div className="space-y-2">
              <Label htmlFor="resource_person">Resource Person</Label>
              <Select 
                value={formData.resource_person} 
                onValueChange={(value) => handleChange('resource_person', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select responsible person" />
                </SelectTrigger>
                <SelectContent>
                  {resourcePersons.map((person) => (
                    <SelectItem key={person} value={person}>
                      {person}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      Planned
                    </div>
                  </SelectItem>
                  <SelectItem value="in-progress">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      In Progress
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      Completed
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <div className="space-y-2">
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  value={formData.progress}
                  onChange={(e) => handleChange('progress', e.target.value)}
                />
                {formData.progress && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${formData.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visibility Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Switch 
              id="public-visible" 
              checked={formData.public_visible}
              onCheckedChange={(checked) => handleChange('public_visible', checked)}
            />
            <Label htmlFor="public-visible" className="text-base">
              Make workplan visible to public
            </Label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {formData.public_visible 
              ? 'This workplan will be visible on public reports and dashboards' 
              : 'This workplan will only be visible to admin users'
            }
          </p>
        </CardContent>
      </Card>

      {/* Form Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Form Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Focus Area:</strong> {formData.focus_area || 'Not set'}
            </div>
            <div>
              <strong>Activity:</strong> {formData.activity_name || 'Not set'}
            </div>
            <div>
              <strong>Timeline:</strong> {formData.timeline_text || 'Not set'}
            </div>
            <div>
              <strong>Status:</strong> {formData.status || 'Not set'}
            </div>
            <div>
              <strong>Budget:</strong> KES {parseInt(formData.budget_allocated)?.toLocaleString() || '0'}
            </div>
            <div>
              <strong>Progress:</strong> {formData.progress}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4 sticky bottom-0 bg-background pb-4 border-t pt-4">
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {workplan ? 'Updating Workplan...' : 'Creating Workplan...'}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {workplan ? 'Update Workplan' : 'Create Workplan'}
            </div>
          )}
        </Button>
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            className="flex-1"
            size="lg"
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}