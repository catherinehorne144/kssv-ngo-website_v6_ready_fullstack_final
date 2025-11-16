// [file name]: components/workplans/admin/WorkplanForm.tsx
// [file content begin]
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Target, Calendar, DollarSign, Users, FileText, Shield, BookOpen } from 'lucide-react'
import type { Workplan, WorkplanFormData } from '@/lib/types/workplan'

interface WorkplanFormProps {
  workplan?: Workplan // For editing existing workplan
  onSuccess?: (workplan: Workplan) => void
  onCancel?: () => void
}

// Smart pre-filling data based on activity types
const activityTemplates = {
  // GBV Management Activities
  'Referrals & linkages': {
    tasks_description: 'Identify needs, Schedule appointments, Contact providers, Arrange transport, Record details, Follow-up',
    kpi: '# of survivors referred, % satisfaction rate, Average processing time',
    risks: 'Breach of confidentiality, Re-traumatization, Service provider unavailable',
    mitigation_measures: 'Safety planning, Data protection protocols, Backup provider network'
  },
  'Chief barazas': {
    tasks_description: 'Consult on available date, Prepare topics, Arrange facilitation, Mobilize participants, Document proceedings',
    kpi: '# participants, % knowledge increase, # community groups formed',
    risks: 'Low attendance, Sensitive topics mishandled, Security concerns',
    mitigation_measures: 'Community engagement, Trained facilitators, Safety protocols'
  },
  // Add more templates as needed...
}

const focusAreas = [
  { id: 'gbv', name: 'Comprehensive GBV Management' },
  { id: 'survivor', name: 'Survivors Livelihood Support Services' },
  { id: 'institutional', name: 'Institutional Development and Growth' },
  { id: 'other', name: 'Other Focus Area' }
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
    output: workplan?.output || '',
    outcome: workplan?.outcome || '',
    kpi: workplan?.kpi || '',
    means_of_verification: workplan?.means_of_verification || '',
    risks: workplan?.risks || '',
    mitigation_measures: workplan?.mitigation_measures || '',
    resource_person: workplan?.resource_person || '',
    status: workplan?.status || 'planned',
    progress: workplan?.progress?.toString() || '0',
    learning_development: workplan?.learning_development || '',
    self_evaluation: workplan?.self_evaluation || '',
    notes: workplan?.notes || '',
    public_visible: workplan?.public_visible !== undefined ? workplan.public_visible : true,
    program_image: workplan?.program_image || ''
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
        kpi: template.kpi,
        risks: template.risks,
        mitigation_measures: template.mitigation_measures
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validate required fields
    if (!formData.focus_area || !formData.activity_name || !formData.timeline_text || !formData.tasks_description) {
      alert('Please fill in all required fields (Focus Area, Activity Name, Timeline, and Tasks Description)')
      setIsLoading(false)
      return
    }

    try {
      const url = workplan ? `/api/workplans/${workplan.id}` : '/api/workplans'
      const method = workplan ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${workplan ? 'update' : 'create'} workplan`)
      }

      const result = await response.json()
      console.log(`✅ Workplan ${workplan ? 'updated' : 'created'} successfully:`, result)
      
      alert(`Workplan ${workplan ? 'updated' : 'created'} successfully!`)
      onSuccess?.(result)
      
    } catch (error) {
      console.error(`❌ Error ${workplan ? 'updating' : 'creating'} workplan:`, error)
      alert(error instanceof Error ? error.message : `Failed to ${workplan ? 'update' : 'create'} workplan`)
    } finally {
      setIsLoading(false)
    }
  }

  const currentActivities = selectedFocusArea ? activityTypes[selectedFocusArea as keyof typeof activityTypes] || [] : []

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Foundation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Foundation (Columns 1-2)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Focus Area */}
            <div className="space-y-2">
              <Label htmlFor="focus_area">Focus Area *</Label>
              <Select 
                value={formData.focus_area} 
                onValueChange={(value) => {
                  setSelectedFocusArea(value)
                  handleChange('focus_area', value)
                }}
                required
              >
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

            {/* Activity Name */}
            <div className="space-y-2">
              <Label htmlFor="activity_name">Activity Name *</Label>
              <Select 
                value={formData.activity_name} 
                onValueChange={handleActivityChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  {currentActivities.map((activity) => (
                    <SelectItem key={activity} value={activity}>
                      {activity}
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
                  <SelectItem value="Q1">Q1</SelectItem>
                  <SelectItem value="Q2">Q2</SelectItem>
                  <SelectItem value="Q3">Q3</SelectItem>
                  <SelectItem value="Q4">Q4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <Label htmlFor="timeline_text">Timeline Text *</Label>
              <Input
                id="timeline_text"
                placeholder="e.g., Monthly, Q1 2024, Case by case"
                value={formData.timeline_text}
                onChange={(e) => handleChange('timeline_text', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Tasks Description */}
          <div className="space-y-2">
            <Label htmlFor="tasks_description">Tasks Description *</Label>
            <Textarea
              id="tasks_description"
              placeholder="Breakdown of activity into actionable steps..."
              rows={3}
              value={formData.tasks_description}
              onChange={(e) => handleChange('tasks_description', e.target.value)}
              required
            />
          </div>

          {/* Target */}
          <div className="space-y-2">
            <Label htmlFor="target">Target</Label>
            <Input
              id="target"
              placeholder="e.g., 50 beneficiaries, 10 meetings"
              value={formData.target}
              onChange={(e) => handleChange('target', e.target.value)}
            />
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
              <Input
                id="budget_allocated"
                type="number"
                placeholder="e.g., 50000"
                value={formData.budget_allocated}
                onChange={(e) => handleChange('budget_allocated', e.target.value)}
              />
            </div>

            {/* Resource Person */}
            <div className="space-y-2">
              <Label htmlFor="resource_person">Resource Person</Label>
              <Input
                id="resource_person"
                placeholder="e.g., John Doe"
                value={formData.resource_person}
                onChange={(e) => handleChange('resource_person', e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
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
        </CardContent>
      </Card>

      {/* MERL Core Framework Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            MERL Core Framework (Columns 7-11)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Output */}
          <div className="space-y-2">
            <Label htmlFor="output">Output</Label>
            <Textarea
              id="output"
              placeholder="Immediate deliverables..."
              rows={2}
              value={formData.output}
              onChange={(e) => handleChange('output', e.target.value)}
            />
          </div>

          {/* Outcome */}
          <div className="space-y-2">
            <Label htmlFor="outcome">Outcome</Label>
            <Textarea
              id="outcome"
              placeholder="Short-term changes/effects..."
              rows={2}
              value={formData.outcome}
              onChange={(e) => handleChange('outcome', e.target.value)}
            />
          </div>

          {/* KPI */}
          <div className="space-y-2">
            <Label htmlFor="kpi">Key Performance Indicators (KPIs)</Label>
            <Textarea
              id="kpi"
              placeholder="How we measure success..."
              rows={2}
              value={formData.kpi}
              onChange={(e) => handleChange('kpi', e.target.value)}
            />
          </div>

          {/* Means of Verification */}
          <div className="space-y-2">
            <Label htmlFor="means_of_verification">Means of Verification</Label>
            <Textarea
              id="means_of_verification"
              placeholder="How we prove results..."
              rows={2}
              value={formData.means_of_verification}
              onChange={(e) => handleChange('means_of_verification', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Risk & Responsibility Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk & Responsibility (Columns 12-14)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Risks */}
          <div className="space-y-2">
            <Label htmlFor="risks">Risks</Label>
            <Textarea
              id="risks"
              placeholder="Potential challenges..."
              rows={2}
              value={formData.risks}
              onChange={(e) => handleChange('risks', e.target.value)}
            />
          </div>

          {/* Mitigation Measures */}
          <div className="space-y-2">
            <Label htmlFor="mitigation_measures">Mitigation Measures</Label>
            <Textarea
              id="mitigation_measures"
              placeholder="Risk prevention strategies..."
              rows={2}
              value={formData.mitigation_measures}
              onChange={(e) => handleChange('mitigation_measures', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Learning & Adaptation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learning & Adaptation (Columns 15-17)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Learning & Development */}
          <div className="space-y-2">
            <Label htmlFor="learning_development">Learning & Development</Label>
            <Textarea
              id="learning_development"
              placeholder="Skills/knowledge gained..."
              rows={2}
              value={formData.learning_development}
              onChange={(e) => handleChange('learning_development', e.target.value)}
            />
          </div>

          {/* Self Evaluation */}
          <div className="space-y-2">
            <Label htmlFor="self_evaluation">Self Evaluation</Label>
            <Textarea
              id="self_evaluation"
              placeholder="Team reflection..."
              rows={2}
              value={formData.self_evaluation}
              onChange={(e) => handleChange('self_evaluation', e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional observations..."
              rows={2}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
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
            <Label htmlFor="public-visible">Make workplan visible to public</Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading 
            ? (workplan ? 'Updating Workplan...' : 'Creating Workplan...') 
            : (workplan ? 'Update Workplan' : 'Create Workplan')
          }
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