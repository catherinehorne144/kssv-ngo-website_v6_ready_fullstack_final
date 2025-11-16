// [file name]: components/workplans/admin/WorkplanWizard.tsx
// [file content begin]
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowLeft, Check, Target, Calendar, FileText, Shield, BookOpen } from 'lucide-react'
import type { Workplan } from '@/lib/types/workplan'

interface WorkplanWizardProps {
  onSuccess?: (workplan: Workplan) => void
  onCancel?: () => void
}

type WizardStep = 'foundation' | 'planning' | 'merl' | 'risk' | 'learning' | 'review'

interface WorkplanFormData {
  focus_area: string
  activity_name: string
  timeline_text: string
  quarter: string
  tasks_description: string
  target: string
  budget_allocated: string
  output: string
  outcome: string
  kpi: string
  means_of_verification: string
  risks: string
  mitigation_measures: string
  resource_person: string
  status: string
  progress: string
  learning_development: string
  self_evaluation: string
  notes: string
  public_visible: boolean
}

const focusAreas = [
  { id: 'gbv', name: 'Comprehensive GBV Management' },
  { id: 'survivor', name: 'Survivors Livelihood Support Services' },
  { id: 'institutional', name: 'Institutional Development and Growth' },
  { id: 'other', name: 'Other Focus Area' }
]

const activityTemplates = {
  'Referrals & linkages': {
    tasks_description: 'Identify needs, Schedule appointments, Contact providers, Arrange transport, Record details, Follow-up',
    kpi: '# of survivors referred, % satisfaction rate, Average processing time',
    risks: 'Breach of confidentiality, Re-traumatization, Service provider unavailable',
    mitigation_measures: 'Safety planning, Data protection protocols, Backup provider network',
    output: 'Safe access to essential services, Informed consent, Improved psychosocial wellbeing',
    outcome: 'Survivors expressing satisfaction with support, Increased collaboration among stakeholders'
  },
  'Chief barazas': {
    tasks_description: 'Consulting on available date, Coming up with topics, Arrange facilitation, Mobilizing personnel, Documentation',
    kpi: '# participants, % knowledge increase, # community groups formed',
    risks: 'Low attendance, Sensitive topics mishandled, Security concerns',
    mitigation_measures: 'Community engagement, Trained facilitators, Safety protocols',
    output: 'Increased knowledge and awareness, Formation of community groups, Reported cases',
    outcome: 'Enhanced community awareness, Strengthened referral pathways'
  },
  'Psychological counselling': {
    tasks_description: 'Schedule sessions, Obtain consent, Conduct assessment, Provide recommendations, Document notes, Follow-up',
    kpi: '# clients served, % improved functioning, Client satisfaction rate',
    risks: 'Re-traumatization, Burnout for providers, Confidentiality breaches',
    mitigation_measures: 'Trauma-informed care, Staff support systems, Data protection protocols',
    output: 'Psychological assessments, Counseling sessions, Progress reports',
    outcome: 'Improved mental health, Better coping mechanisms, Enhanced wellbeing'
  }
}

export function WorkplanWizard({ onSuccess, onCancel }: WorkplanWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('foundation')
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState<WorkplanFormData>({
    focus_area: '',
    activity_name: '',
    timeline_text: '',
    quarter: 'Q1',
    tasks_description: '',
    target: '',
    budget_allocated: '',
    output: '',
    outcome: '',
    kpi: '',
    means_of_verification: '',
    risks: '',
    mitigation_measures: '',
    resource_person: '',
    status: 'planned',
    progress: '0',
    learning_development: '',
    self_evaluation: '',
    notes: '',
    public_visible: true
  })

  // Step validation
  const isFoundationValid = () => {
    return formData.focus_area && formData.activity_name && formData.timeline_text && formData.tasks_description
  }

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
        mitigation_measures: template.mitigation_measures,
        output: template.output,
        outcome: template.outcome
      }))
    }
  }

  // Navigation
  const nextStep = () => {
    const steps: WizardStep[] = ['foundation', 'planning', 'merl', 'risk', 'learning', 'review']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const steps: WizardStep[] = ['foundation', 'planning', 'merl', 'risk', 'learning', 'review']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  // Final submission
  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/workplans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create workplan')
      }

      const result = await response.json()
      onSuccess?.(result)

    } catch (error) {
      console.error('Error creating workplan:', error)
      alert(error instanceof Error ? error.message : 'Failed to create workplan')
    } finally {
      setIsLoading(false)
    }
  }

  // Step headers
  const steps = [
    { id: 'foundation' as const, title: 'Foundation', icon: Target },
    { id: 'planning' as const, title: 'Planning', icon: Calendar },
    { id: 'merl' as const, title: 'MERL Core', icon: FileText },
    { id: 'risk' as const, title: 'Risk', icon: Shield },
    { id: 'learning' as const, title: 'Learning', icon: BookOpen },
    { id: 'review' as const, title: 'Review', icon: Check }
  ]

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isCompleted = steps.findIndex(s => s.id === currentStep) > index
          const isCurrent = step.id === currentStep
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isCompleted 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : isCurrent
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/30 text-muted-foreground'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </div>
                <span className={`text-sm mt-2 ${isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 'foundation' && 'Foundation - Focus Area & Activity'}
            {currentStep === 'planning' && 'Planning & Resources'}
            {currentStep === 'merl' && 'MERL Core Framework'}
            {currentStep === 'risk' && 'Risk & Responsibility'}
            {currentStep === 'learning' && 'Learning & Adaptation'}
            {currentStep === 'review' && 'Review & Create'}
          </CardTitle>
          <CardDescription>
            {currentStep === 'foundation' && 'Define the core activity and focus area'}
            {currentStep === 'planning' && 'Set timelines, budget, and resources'}
            {currentStep === 'merl' && 'Establish monitoring and evaluation framework'}
            {currentStep === 'risk' && 'Identify risks and mitigation strategies'}
            {currentStep === 'learning' && 'Capture learning and evaluation aspects'}
            {currentStep === 'review' && 'Review all information before creating'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Step 1: Foundation */}
          {currentStep === 'foundation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="focus_area">Focus Area *</Label>
                  <Select 
                    value={formData.focus_area} 
                    onValueChange={(value) => handleChange('focus_area', value)}
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
                      {Object.keys(activityTemplates).map((activity) => (
                        <SelectItem key={activity} value={activity}>
                          {activity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Or type custom activity name"
                    value={formData.activity_name}
                    onChange={(e) => handleChange('activity_name', e.target.value)}
                    className="mt-1"
                  />
                </div>

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

              <div className="space-y-2">
                <Label htmlFor="tasks_description">Tasks Description *</Label>
                <Textarea
                  id="tasks_description"
                  placeholder="Breakdown of activity into actionable steps..."
                  rows={4}
                  value={formData.tasks_description}
                  onChange={(e) => handleChange('tasks_description', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Target</Label>
                <Input
                  id="target"
                  placeholder="e.g., 50 beneficiaries, 10 meetings"
                  value={formData.target}
                  onChange={(e) => handleChange('target', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Planning */}
          {currentStep === 'planning' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="space-y-2">
                  <Label htmlFor="resource_person">Resource Person</Label>
                  <Input
                    id="resource_person"
                    placeholder="e.g., John Doe"
                    value={formData.resource_person}
                    onChange={(e) => handleChange('resource_person', e.target.value)}
                  />
                </div>

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
            </div>
          )}

          {/* Step 3: MERL Core */}
          {currentStep === 'merl' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="output">Output</Label>
                <Textarea
                  id="output"
                  placeholder="Immediate deliverables..."
                  rows={3}
                  value={formData.output}
                  onChange={(e) => handleChange('output', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outcome">Outcome</Label>
                <Textarea
                  id="outcome"
                  placeholder="Short-term changes/effects..."
                  rows={3}
                  value={formData.outcome}
                  onChange={(e) => handleChange('outcome', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kpi">Key Performance Indicators (KPIs)</Label>
                <Textarea
                  id="kpi"
                  placeholder="How we measure success..."
                  rows={3}
                  value={formData.kpi}
                  onChange={(e) => handleChange('kpi', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="means_of_verification">Means of Verification</Label>
                <Textarea
                  id="means_of_verification"
                  placeholder="How we prove results..."
                  rows={3}
                  value={formData.means_of_verification}
                  onChange={(e) => handleChange('means_of_verification', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 4: Risk */}
          {currentStep === 'risk' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="risks">Risks</Label>
                <Textarea
                  id="risks"
                  placeholder="Potential challenges..."
                  rows={4}
                  value={formData.risks}
                  onChange={(e) => handleChange('risks', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mitigation_measures">Mitigation Measures</Label>
                <Textarea
                  id="mitigation_measures"
                  placeholder="Risk prevention strategies..."
                  rows={4}
                  value={formData.mitigation_measures}
                  onChange={(e) => handleChange('mitigation_measures', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 5: Learning */}
          {currentStep === 'learning' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="learning_development">Learning & Development</Label>
                <Textarea
                  id="learning_development"
                  placeholder="Skills/knowledge gained..."
                  rows={3}
                  value={formData.learning_development}
                  onChange={(e) => handleChange('learning_development', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="self_evaluation">Self Evaluation</Label>
                <Textarea
                  id="self_evaluation"
                  placeholder="Team reflection..."
                  rows={3}
                  value={formData.self_evaluation}
                  onChange={(e) => handleChange('self_evaluation', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional observations..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="public-visible" 
                  checked={formData.public_visible}
                  onCheckedChange={(checked) => handleChange('public_visible', checked)}
                />
                <Label htmlFor="public-visible">Make workplan visible to public</Label>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workplan Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Focus Area</Label>
                      <p className="font-medium">{formData.focus_area}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Activity</Label>
                      <p className="font-medium">{formData.activity_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Timeline</Label>
                      <p className="font-medium">{formData.timeline_text}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Quarter</Label>
                      <p className="font-medium">{formData.quarter}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Budget</Label>
                      <p className="font-medium">KES {parseInt(formData.budget_allocated || '0').toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Status</Label>
                      <Badge>{formData.status}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Tasks Description</Label>
                      <p className="text-sm mt-1">{formData.tasks_description}</p>
                    </div>
                    {formData.output && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Output</Label>
                        <p className="text-sm mt-1">{formData.output}</p>
                      </div>
                    )}
                    {formData.outcome && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Outcome</Label>
                        <p className="text-sm mt-1">{formData.outcome}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <div>
              {currentStep !== 'foundation' && (
                <Button variant="outline" onClick={prevStep} disabled={isLoading}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              {onCancel && currentStep === 'foundation' && (
                <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                  Cancel
                </Button>
              )}

              {currentStep === 'review' ? (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? 'Creating Workplan...' : 'Create Workplan'}
                </Button>
              ) : (
                <Button onClick={nextStep} disabled={
                  (currentStep === 'foundation' && !isFoundationValid()) ||
                  isLoading
                }>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
// [file content end]