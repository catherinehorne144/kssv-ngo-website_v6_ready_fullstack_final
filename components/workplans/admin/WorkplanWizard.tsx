// [file name]: components/workplans/admin/WorkplanWizard.tsx
'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Target, 
  Calendar,
  DollarSign,
  Users,
  AlertCircle,
  Lightbulb,
  Plus
} from 'lucide-react'
import type { Workplan } from '@/lib/types/workplan'

interface WorkplanWizardProps {
  onSuccess?: (workplan: Workplan) => void
  onCancel?: () => void
}

type WizardStep = 'foundation' | 'planning' | 'review'

interface WorkplanFormData {
  focus_area: string
  activity_name: string
  timeline_text: string
  quarter: string
  tasks_description: string
  target: string
  budget_allocated: string
  resource_person: string
  status: string
  progress: string
  public_visible: boolean
  is_custom_focus_area: boolean
  custom_focus_area: string
  is_custom_activity: boolean
}

// Common Focus Areas
const commonFocusAreas = [
  { id: 'gbv', name: 'Comprehensive Gender-based Violence GBV Management', color: 'red', description: 'Gender-based violence prevention and response activities' },
  { id: 'survivor', name: 'Survivors Livelihood Support Services', color: 'green', description: 'Economic empowerment and support for survivors' },
  { id: 'institutional', name: 'Institutional Development and Growth', color: 'blue', description: 'Organizational capacity building and development' }
]

// Common Activities by Focus Area
const commonActivities = {
  'Comprehensive Gender-based Violence GBV Management': [
    'Referrals and linkages',
    'Chief barazas',
    'Psychological counselling',
    'Rapid response and rescue',
    'Temporary shelter',
    'Partnership meetings',
    'Violence response and prevention partners meeting'
  ],
  'Survivors Livelihood Support Services': [
    'Monthly group saving and GSL meeting',
    'Training of support groups',
    'Business development training',
    'Formation of support groups',
    'Vocational skills training',
    'Startup capital support'
  ],
  'Institutional Development and Growth': [
    'Monthly member meetings',
    'Resource mobilization training',
    'Strategic planning sessions',
    'Capacity building workshops',
    'Staff development training',
    'Organizational systems development'
  ]
}

const activityTemplates = {
  'Referrals and linkages': {
    tasks_description: 'Listen to case, Seek consent of client, Identify appropriate referral partner, Contact referral partner, give referral letter, accompany survivor where there is need, follow up and report',
  },
  'Chief barazas': {
    tasks_description: 'Consulting on available date, Coming up with the topics to discuss, settle on who is going to facilitate, mobilizing personnel plus resources, Documentation and reporting',
  },
  'Psychological counselling': {
    tasks_description: 'Schedule counselling sessions, Obtain consent from the survivor, Conduct assessment and sessions, Provide recommendations or referrals, Document session notes, Follow-up with the survivors',
  },
  'Monthly group saving and GSL meeting': {
    tasks_description: 'Meeting at the specified time, reading of the previous minutes, agendas of the day, table banking and merry go round where every member participates, documentation for reporting',
  },
  'Training of support groups': {
    tasks_description: 'mobilising of resources and survivors as we prepare agendas, training session, documentation for reporting',
  },
  'Monthly member meetings': {
    tasks_description: 'Meeting at the specified time, reading of the previous minutes, agendas of the day, table banking and merry go round where every member participates, documentation for reporting',
  },
  'Partnership meetings': {
    tasks_description: 'Confirmed dates, Generate reports and challenges on survivors for the month, Action plans and recommendation',
  }
}

const resourcePersons = ['Claris', 'Leah', 'Equator', 'Other Staff']

export function WorkplanWizard({ onSuccess, onCancel }: WorkplanWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('foundation')
  const [isLoading, setIsLoading] = useState(false)
  const [showTemplateSuggestions, setShowTemplateSuggestions] = useState(true)
  
  const [formData, setFormData] = useState<WorkplanFormData>({
    focus_area: '',
    activity_name: '',
    timeline_text: '',
    quarter: 'Q1',
    tasks_description: '',
    target: '',
    budget_allocated: '',
    resource_person: '',
    status: 'planned',
    progress: '0',
    public_visible: true,
    is_custom_focus_area: false,
    custom_focus_area: '',
    is_custom_activity: false
  })

  // Computed values
  const isCustomFocusArea = formData.is_custom_focus_area
  const isCustomActivity = formData.is_custom_activity
  const finalFocusArea = isCustomFocusArea ? formData.custom_focus_area : formData.focus_area

  // Get available activities based on selected focus area
  const availableActivities = useMemo(() => {
    if (isCustomFocusArea) {
      return ['Custom Activity'] // For custom focus areas, only show custom activity option
    }
    return commonActivities[formData.focus_area as keyof typeof commonActivities] || []
  }, [formData.focus_area, isCustomFocusArea])

  // Step validation
  const isFoundationValid = () => {
    const hasFocusArea = isCustomFocusArea ? formData.custom_focus_area : formData.focus_area
    const hasActivity = isCustomActivity ? formData.activity_name : formData.activity_name
    
    return hasFocusArea && hasActivity && formData.timeline_text && formData.tasks_description
  }

  const handleChange = (field: keyof WorkplanFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle focus area change
  const handleFocusAreaChange = (value: string) => {
    if (value === 'custom') {
      handleChange('is_custom_focus_area', true)
      handleChange('focus_area', '')
      handleChange('activity_name', '') // Reset activity when focus area changes
      handleChange('is_custom_activity', false)
    } else {
      handleChange('is_custom_focus_area', false)
      handleChange('focus_area', value)
      handleChange('custom_focus_area', '')
      handleChange('activity_name', '') // Reset activity when focus area changes
      handleChange('is_custom_activity', false)
    }
  }

  // Handle activity change
  const handleActivityChange = (value: string) => {
    if (value === 'custom') {
      handleChange('is_custom_activity', true)
      handleChange('activity_name', '')
      if (showTemplateSuggestions) {
        handleChange('tasks_description', '')
      }
    } else {
      handleChange('is_custom_activity', false)
      handleChange('activity_name', value)
      
      // Apply template if available
      const template = activityTemplates[value as keyof typeof activityTemplates]
      if (template && showTemplateSuggestions) {
        setFormData(prev => ({
          ...prev,
          tasks_description: template.tasks_description,
        }))
      }
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

  // Navigation
  const nextStep = () => {
    const steps: WizardStep[] = ['foundation', 'planning', 'review']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const steps: WizardStep[] = ['foundation', 'planning', 'review']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    const steps: WizardStep[] = ['foundation', 'planning', 'review']
    const currentIndex = steps.indexOf(currentStep)
    return Math.round((currentIndex / (steps.length - 1)) * 100)
  }, [currentStep])

  // Final submission
  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Validate required fields
      if (!isFoundationValid()) {
        alert('Please complete all required fields in the Foundation step')
        setCurrentStep('foundation')
        setIsLoading(false)
        return
      }

      const submitData = {
        focus_area: finalFocusArea,
        activity_name: formData.activity_name,
        timeline_text: formData.timeline_text,
        quarter: formData.quarter,
        tasks_description: formData.tasks_description,
        target: formData.target,
        budget_allocated: parseInt(formData.budget_allocated) || 0,
        resource_person: formData.resource_person,
        status: formData.status,
        progress: parseInt(formData.progress) || 0,
        public_visible: Boolean(formData.public_visible)
      }

      const response = await fetch('/api/workplans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
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
    { id: 'foundation' as const, title: 'Foundation', icon: Target, description: 'Basic activity information' },
    { id: 'planning' as const, title: 'Planning', icon: Calendar, description: 'Resources and timeline' },
    { id: 'review' as const, title: 'Review', icon: Check, description: 'Final review' }
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Create New Workplan</h1>
            <p className="text-muted-foreground">Step-by-step workplan creation wizard</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="text-2xl font-bold">{progressPercentage}%</div>
          </div>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
        
        {/* Step Indicators */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex
            const isUpcoming = index > currentStepIndex
            
            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isCurrent
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                </div>
                <span className={`text-xs mt-2 text-center ${
                  isCurrent ? 'font-semibold text-blue-600' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Template Suggestions Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <div>
                <Label htmlFor="template-suggestions" className="text-base font-medium">
                  Smart Template Suggestions
                </Label>
                <p className="text-sm text-muted-foreground">
                  Auto-fill common activities with pre-defined templates
                </p>
              </div>
            </div>
            <Switch 
              id="template-suggestions" 
              checked={showTemplateSuggestions}
              onCheckedChange={setShowTemplateSuggestions}
            />
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 'foundation' && <Target className="h-5 w-5" />}
            {currentStep === 'planning' && <Calendar className="h-5 w-5" />}
            {currentStep === 'review' && <Check className="h-5 w-5" />}
            {steps.find(step => step.id === currentStep)?.title}
          </CardTitle>
          <CardDescription>
            {steps.find(step => step.id === currentStep)?.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Step 1: Foundation */}
          {currentStep === 'foundation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Focus Area Selection */}
                <div className="space-y-2">
                  <Label htmlFor="focus_area" className="flex items-center gap-2">
                    Focus Area *
                    {!finalFocusArea && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </Label>
                  <Select 
                    value={isCustomFocusArea ? 'custom' : formData.focus_area} 
                    onValueChange={handleFocusAreaChange}
                    required
                  >
                    <SelectTrigger className={!finalFocusArea ? 'border-red-300' : ''}>
                      <SelectValue placeholder="Select focus area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Common Focus Areas</SelectLabel>
                        {commonFocusAreas.map((area) => (
                          <SelectItem key={area.id} value={area.name}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${
                                area.color === 'red' ? 'bg-red-500' :
                                area.color === 'green' ? 'bg-green-500' :
                                area.color === 'blue' ? 'bg-blue-500' :
                                'bg-gray-500'
                              }`} />
                              <div>
                                <div className="font-medium">{area.name}</div>
                                <div className="text-xs text-muted-foreground">{area.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectItem value="custom">
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="font-medium">Add Custom Focus Area</div>
                            <div className="text-xs text-muted-foreground">Create a new focus area</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Custom Focus Area Input */}
                  {isCustomFocusArea && (
                    <div className="mt-2">
                      <Input
                        placeholder="Enter new focus area name..."
                        value={formData.custom_focus_area}
                        onChange={(e) => handleChange('custom_focus_area', e.target.value)}
                        className="border-green-300 focus:border-green-500"
                      />
                      <p className="text-xs text-green-600 mt-1">
                        Creating new focus area: {formData.custom_focus_area}
                      </p>
                    </div>
                  )}
                </div>

                {/* Activity Selection */}
                <div className="space-y-2">
                  <Label htmlFor="activity_name" className="flex items-center gap-2">
                    Activity Name *
                    {!formData.activity_name && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </Label>
                  <Select 
                    value={isCustomActivity ? 'custom' : formData.activity_name} 
                    onValueChange={handleActivityChange}
                    required
                    disabled={!finalFocusArea}
                  >
                    <SelectTrigger className={!formData.activity_name ? 'border-red-300' : ''}>
                      <SelectValue placeholder={
                        finalFocusArea 
                          ? "Select activity" 
                          : "← First select a focus area"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {availableActivities.length > 0 ? (
                        <>
                          <SelectGroup>
                            <SelectLabel>Common Activities</SelectLabel>
                            {availableActivities.map((activity) => (
                              <SelectItem key={activity} value={activity}>
                                <div className="flex items-center justify-between">
                                  <span>{activity}</span>
                                  {activityTemplates.hasOwnProperty(activity) && showTemplateSuggestions && (
                                    <Lightbulb className="h-3 w-3 text-yellow-500" />
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectItem value="custom">
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4 text-green-600" />
                              <span>Custom Activity</span>
                            </div>
                          </SelectItem>
                        </>
                      ) : (
                        <SelectItem value="custom">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4 text-green-600" />
                            <span>Custom Activity</span>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {/* Custom Activity Input */}
                  {(isCustomActivity || isCustomFocusArea) && (
                    <div className="mt-2">
                      <Input
                        placeholder="Enter activity name..."
                        value={formData.activity_name}
                        onChange={(e) => handleChange('activity_name', e.target.value)}
                        className="border-green-300 focus:border-green-500"
                      />
                      {isCustomActivity && (
                        <p className="text-xs text-green-600 mt-1">
                          Creating custom activity
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quarter">Quarter</Label>
                  <Select value={formData.quarter} onValueChange={(value) => handleChange('quarter', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1">Q1 (January - March)</SelectItem>
                      <SelectItem value="Q2">Q2 (April - June)</SelectItem>
                      <SelectItem value="Q3">Q3 (July - September)</SelectItem>
                      <SelectItem value="Q4">Q4 (October - December)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                {showTemplateSuggestions && !isCustomActivity && formData.activity_name && activityTemplates[formData.activity_name as keyof typeof activityTemplates] && (
                  <p className="text-xs text-yellow-600 mt-1">
                    💡 Template applied. You can modify the tasks as needed.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Target</Label>
                <Input
                  id="target"
                  placeholder="e.g., 50 beneficiaries, 10 meetings, 5 training sessions"
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
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {person}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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

              <div className="space-y-2">
                <Label htmlFor="public_visible" className="flex items-center gap-2">
                  Visibility
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public_visible"
                    checked={formData.public_visible}
                    onCheckedChange={(checked) => handleChange('public_visible', checked)}
                  />
                  <Label htmlFor="public_visible">
                    {formData.public_visible ? 'Public (Visible to all)' : 'Private (Admin only)'}
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workplan Summary</CardTitle>
                  <CardDescription>
                    Review all information before creating the workplan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Focus Area</Label>
                      <p className="text-lg font-semibold">{finalFocusArea}</p>
                      {isCustomFocusArea && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          New Focus Area
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Activity Name</Label>
                      <p className="text-lg font-semibold">{formData.activity_name}</p>
                      {isCustomActivity && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Custom Activity
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Timeline</Label>
                      <p className="text-lg font-semibold">{formData.timeline_text}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Quarter</Label>
                      <Badge variant="outline" className="text-lg">{formData.quarter}</Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Budget</Label>
                      <p className="text-lg font-semibold text-green-600">
                        KES {parseInt(formData.budget_allocated || '0').toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={
                        formData.status === 'completed' ? 'bg-green-100 text-green-800' :
                        formData.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {formData.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Activity Details</h4>
                      <div>
                        <Label className="text-sm text-muted-foreground">Tasks Description</Label>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{formData.tasks_description}</p>
                      </div>
                      {formData.target && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Target</Label>
                          <p className="text-sm mt-1">{formData.target}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Resource Information</h4>
                      <div>
                        <Label className="text-sm text-muted-foreground">Resource Person</Label>
                        <p className="text-sm mt-1">{formData.resource_person || 'Not assigned'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Progress</Label>
                        <p className="text-sm mt-1">{formData.progress}%</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Visibility</Label>
                        <p className="text-sm mt-1">
                          {formData.public_visible ? 'Public' : 'Private'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <div>
              {currentStep !== 'foundation' && (
                <Button variant="outline" onClick={prevStep} disabled={isLoading}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              {onCancel && (
                <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                  Cancel
                </Button>
              )}

              {currentStep === 'review' ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Workplan...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Create Workplan
                    </div>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={nextStep} 
                  disabled={
                    (currentStep === 'foundation' && !isFoundationValid()) ||
                    isLoading
                  }
                >
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