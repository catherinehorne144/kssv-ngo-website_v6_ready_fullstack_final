[file name]: WorkplanWizard.tsx
[file content begin]
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
  Plus,
  Sparkles,
  FileText,
  ClipboardList,
  Shield,
  HeartHandshake,
  Building2,
  Loader2
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
}

// Common Focus Areas
const commonFocusAreas = [
  { id: 'gbv', name: 'Comprehensive Gender-based Violence GBV Management', color: 'red', description: 'Gender-based violence prevention and response activities', icon: Shield },
  { id: 'survivor', name: 'Survivors Livelihood Support Services', color: 'green', description: 'Economic empowerment and support for survivors', icon: HeartHandshake },
  { id: 'institutional', name: 'Institutional Development and Growth', color: 'blue', description: 'Organizational capacity building and development', icon: Building2 }
]

// Activity Templates for Common Activities
const activityTemplates = {
  // GBV Activities
  'Referrals and linkages': 'Listen to case, Seek consent of client, Identify appropriate referral partner, Contact referral partner, give referral letter, accompany survivor where there is need, follow up and report',
  'Chief barazas': 'Consulting on available date, Coming up with the topics to discuss, settle on who is going to facilitate, mobilizing personnel plus resources, Documentation and reporting',
  'Psychological counselling': 'Schedule counselling sessions, Obtain consent from the survivor, Conduct assessment and sessions, Provide recommendations or referrals, Document session notes, Follow-up with the survivors',
  'Rapid response and rescue': 'Receive case, locate place, inform the police accompany, rescue done, follow up, details and contact of survivor, follow up for the next consecutive 3 months, refer depending on nature of problem',
  'Temporary shelter': 'Case, details and contact of survivor, Inform police, Inform children office, provide temporary shelter, consultation with other stakeholders for further interventions, Document the case and follow-up',
  
  // Livelihood Activities
  'Monthly group saving and GSL meeting': 'Meeting at the specified time, reading of the previous minutes, agendas of the day, table banking and merry go round where every member participates, documentation for reporting',
  'Training of support groups': 'mobilising of resources and survivors as we prepare agendas, training session, documentation for reporting',
  'Business development training': 'Identify training needs, Develop training curriculum, Schedule training sessions, Conduct training workshops, Provide follow-up support, Document outcomes',
  
  // Institutional Activities
  'Monthly member meetings': 'Meeting at the specified time, reading of the previous minutes, agendas of the day, table banking and merry go round where every member participates, documentation for reporting',
  'Resource mobilization training': 'Assess resource needs, Develop fundraising strategy, Train staff on proposal writing, Identify potential donors, Submit funding proposals, Follow up on applications'
}

// Suggested activities based on focus area
const suggestedActivities = {
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

const resourcePersons = ['Claris', 'Leah', 'Equator', 'Other Staff']

export function WorkplanWizard({ onSuccess, onCancel }: WorkplanWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('foundation')
  const [isLoading, setIsLoading] = useState(false)
  const [showTemplateSuggestions, setShowTemplateSuggestions] = useState(true)
  const [showActivitySuggestions, setShowActivitySuggestions] = useState(true)
  
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
    custom_focus_area: ''
  })

  // Computed values
  const isCustomFocusArea = formData.is_custom_focus_area
  const finalFocusArea = isCustomFocusArea ? formData.custom_focus_area : formData.focus_area

  // Get suggested activities for current focus area
  const currentSuggestedActivities = useMemo(() => {
    if (isCustomFocusArea || !formData.focus_area) return []
    return suggestedActivities[formData.focus_area as keyof typeof suggestedActivities] || []
  }, [formData.focus_area, isCustomFocusArea])

  // Step validation
  const isFoundationValid = () => {
    const hasFocusArea = isCustomFocusArea ? formData.custom_focus_area : formData.focus_area
    return hasFocusArea && formData.activity_name && formData.timeline_text && formData.tasks_description
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
      handleChange('activity_name', '')
      handleChange('tasks_description', '')
    } else {
      handleChange('is_custom_focus_area', false)
      handleChange('focus_area', value)
      handleChange('custom_focus_area', '')
      // Keep activity name but clear description to allow new template
      handleChange('tasks_description', '')
    }
  }

  // Handle activity name change with template suggestions
  const handleActivityNameChange = (value: string) => {
    handleChange('activity_name', value)
    
    // Apply template if available and suggestions are enabled
    if (showTemplateSuggestions && value && activityTemplates[value as keyof typeof activityTemplates]) {
      const template = activityTemplates[value as keyof typeof activityTemplates]
      handleChange('tasks_description', template)
    }
  }

  // Apply template manually
  const handleApplyTemplate = (activityName: string) => {
    const template = activityTemplates[activityName as keyof typeof activityTemplates]
    if (template) {
      handleChange('activity_name', activityName)
      handleChange('tasks_description', template)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Beautiful Progress Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Create New Workplan
                </h1>
                <p className="text-gray-600 mt-2">Step-by-step workplan creation wizard</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-2xl font-bold text-gray-900">{progressPercentage}%</div>
              </div>
            </div>
            
            <Progress value={progressPercentage} className="h-3 bg-gray-200 rounded-full" />
            
            {/* Step Indicators */}
            <div className="flex justify-between mt-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isCompleted = index < currentStepIndex
                const isCurrent = index === currentStepIndex
                const isUpcoming = index > currentStepIndex
                
                return (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-500 text-white shadow-lg shadow-green-200' 
                        : isCurrent
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500 text-white shadow-lg shadow-blue-200'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                    </div>
                    <span className={`text-sm font-medium mt-3 text-center ${
                      isCurrent ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Smart Features Toggle */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Label htmlFor="template-suggestions" className="text-base font-semibold text-gray-900">
                    Smart Template Suggestions
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Auto-fill common activities with pre-defined templates for faster creation
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
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8">
            <CardTitle className="flex items-center gap-3 text-2xl">
              {currentStep === 'foundation' && <Target className="h-7 w-7" />}
              {currentStep === 'planning' && <Calendar className="h-7 w-7" />}
              {currentStep === 'review' && <Check className="h-7 w-7" />}
              {steps.find(step => step.id === currentStep)?.title}
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              {steps.find(step => step.id === currentStep)?.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Step 1: Foundation */}
            {currentStep === 'foundation' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Focus Area Selection */}
                  <div className="space-y-4">
                    <Label htmlFor="focus_area" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      Focus Area *
                      {!finalFocusArea && <AlertCircle className="h-5 w-5 text-red-500" />}
                    </Label>
                    <Select 
                      value={isCustomFocusArea ? 'custom' : formData.focus_area} 
                      onValueChange={handleFocusAreaChange}
                      required
                    >
                      <SelectTrigger className={`h-14 rounded-xl border-2 text-lg ${!finalFocusArea ? 'border-red-300' : 'border-gray-200 focus:border-blue-300'}`}>
                        <SelectValue placeholder="Select focus area" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-0 shadow-xl">
                        <SelectGroup>
                          <SelectLabel className="text-lg font-semibold">Program Areas</SelectLabel>
                          {commonFocusAreas.map((area) => {
                            const AreaIcon = area.icon
                            return (
                              <SelectItem key={area.id} value={area.name} className="py-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    area.color === 'red' ? 'bg-red-500' :
                                    area.color === 'green' ? 'bg-green-500' :
                                    area.color === 'blue' ? 'bg-blue-500' :
                                    'bg-gray-500'
                                  }`} />
                                  <AreaIcon className="w-5 h-5 text-gray-600" />
                                  <div>
                                    <div className="font-semibold text-gray-900">{area.name}</div>
                                    <div className="text-sm text-gray-600">{area.description}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectGroup>
                        <SelectItem value="custom" className="py-4 rounded-lg border-t border-gray-100">
                          <div className="flex items-center gap-3">
                            <Plus className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-semibold text-gray-900">Add Custom Focus Area</div>
                              <div className="text-sm text-gray-600">Create a new program area</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Custom Focus Area Input */}
                    {isCustomFocusArea && (
                      <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                        <Input
                          placeholder="Enter new focus area name..."
                          value={formData.custom_focus_area}
                          onChange={(e) => handleChange('custom_focus_area', e.target.value)}
                          className="h-12 text-lg border-green-300 focus:border-green-500"
                        />
                        <p className="text-sm text-green-700 mt-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Creating new focus area: {formData.custom_focus_area}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quarter Selection */}
                  <div className="space-y-4">
                    <Label htmlFor="quarter" className="text-lg font-semibold text-gray-900">Quarter</Label>
                    <Select value={formData.quarter} onValueChange={(value) => handleChange('quarter', value)}>
                      <SelectTrigger className="h-14 rounded-xl border-2 border-gray-200 text-lg">
                        <SelectValue placeholder="Select quarter" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-0 shadow-xl">
                        <SelectItem value="Q1" className="py-4 rounded-lg">Q1 (January - March)</SelectItem>
                        <SelectItem value="Q2" className="py-4 rounded-lg">Q2 (April - June)</SelectItem>
                        <SelectItem value="Q3" className="py-4 rounded-lg">Q3 (July - September)</SelectItem>
                        <SelectItem value="Q4" className="py-4 rounded-lg">Q4 (October - December)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Activity Name Input */}
                <div className="space-y-4">
                  <Label htmlFor="activity_name" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    Activity Name *
                    {!formData.activity_name && <AlertCircle className="h-5 w-5 text-red-500" />}
                  </Label>
                  <Input
                    id="activity_name"
                    placeholder="Enter activity name (e.g., Monthly group saving, Psychological counselling, Chief barazas...)"
                    value={formData.activity_name}
                    onChange={(e) => handleActivityNameChange(e.target.value)}
                    className={`h-14 text-lg rounded-xl border-2 ${!formData.activity_name ? 'border-red-300' : 'border-gray-200 focus:border-blue-300'}`}
                    required
                  />

                  {/* Activity Suggestions */}
                  {showActivitySuggestions && currentSuggestedActivities.length > 0 && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Lightbulb className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-900">Common Activities for {formData.focus_area.split(' ')[0]}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowActivitySuggestions(false)}
                          className="ml-auto text-blue-600 hover:text-blue-700"
                        >
                          Hide
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentSuggestedActivities.map((activity) => (
                          <Button
                            key={activity}
                            variant="outline"
                            onClick={() => handleApplyTemplate(activity)}
                            className="justify-start h-auto py-3 px-4 rounded-lg border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-left"
                          >
                            <ClipboardList className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{activity}</div>
                              {showTemplateSuggestions && activityTemplates[activity] && (
                                <div className="text-xs text-blue-600 mt-1">Template available</div>
                              )}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline Text */}
                <div className="space-y-4">
                  <Label htmlFor="timeline_text" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    Timeline Text *
                    {!formData.timeline_text && <AlertCircle className="h-5 w-5 text-red-500" />}
                  </Label>
                  <Input
                    id="timeline_text"
                    placeholder="e.g., Monthly, Q1 2024, Case by case, Weekly meetings, Quarterly sessions"
                    value={formData.timeline_text}
                    onChange={(e) => handleChange('timeline_text', e.target.value)}
                    className={`h-14 text-lg rounded-xl border-2 ${!formData.timeline_text ? 'border-red-300' : 'border-gray-200 focus:border-blue-300'}`}
                    required
                  />
                </div>

                {/* Tasks Description */}
                <div className="space-y-4">
                  <Label htmlFor="tasks_description" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    Tasks Description *
                    {!formData.tasks_description && <AlertCircle className="h-5 w-5 text-red-500" />}
                  </Label>
                  <Textarea
                    id="tasks_description"
                    placeholder="Breakdown of activity into actionable steps... (Start typing or use template suggestions above)"
                    rows={6}
                    value={formData.tasks_description}
                    onChange={(e) => handleChange('tasks_description', e.target.value)}
                    className={`text-lg rounded-xl border-2 resize-none ${!formData.tasks_description ? 'border-red-300' : 'border-gray-200 focus:border-blue-300'}`}
                    required
                  />
                  {showTemplateSuggestions && formData.activity_name && activityTemplates[formData.activity_name] && (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-sm">Template applied! You can modify the tasks as needed.</span>
                    </div>
                  )}
                </div>

                {/* Target */}
                <div className="space-y-4">
                  <Label htmlFor="target" className="text-lg font-semibold text-gray-900">Target</Label>
                  <Input
                    id="target"
                    placeholder="e.g., 50 beneficiaries, 10 meetings, 5 training sessions, 100 survivors reached"
                    value={formData.target}
                    onChange={(e) => handleChange('target', e.target.value)}
                    className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-300"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Planning */}
            {currentStep === 'planning' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Budget Allocated */}
                  <div className="space-y-4">
                    <Label htmlFor="budget_allocated" className="text-lg font-semibold text-gray-900">Budget Allocated (KES)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                      <Input
                        id="budget_allocated"
                        type="number"
                        placeholder="e.g., 50000"
                        value={formData.budget_allocated}
                        onChange={(e) => handleChange('budget_allocated', e.target.value)}
                        className="h-14 text-lg pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-300"
                      />
                    </div>
                  </div>

                  {/* Resource Person */}
                  <div className="space-y-4">
                    <Label htmlFor="resource_person" className="text-lg font-semibold text-gray-900">Resource Person</Label>
                    <Select 
                      value={formData.resource_person} 
                      onValueChange={(value) => handleChange('resource_person', value)}
                    >
                      <SelectTrigger className="h-14 rounded-xl border-2 border-gray-200 text-lg">
                        <SelectValue placeholder="Select responsible person" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-0 shadow-xl">
                        {resourcePersons.map((person) => (
                          <SelectItem key={person} value={person} className="py-4 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Users className="h-5 w-5" />
                              {person}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div className="space-y-4">
                    <Label htmlFor="status" className="text-lg font-semibold text-gray-900">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="h-14 rounded-xl border-2 border-gray-200 text-lg">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-0 shadow-xl">
                        <SelectItem value="planned" className="py-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-gray-400 rounded-full" />
                            Planned
                          </div>
                        </SelectItem>
                        <SelectItem value="in-progress" className="py-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                            In Progress
                          </div>
                        </SelectItem>
                        <SelectItem value="completed" className="py-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-400 rounded-full" />
                            Completed
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Progress */}
                  <div className="space-y-4">
                    <Label htmlFor="progress" className="text-lg font-semibold text-gray-900">Progress (%)</Label>
                    <div className="space-y-3">
                      <Input
                        id="progress"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0-100"
                        value={formData.progress}
                        onChange={(e) => handleChange('progress', e.target.value)}
                        className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-300"
                      />
                      {formData.progress && (
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${formData.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visibility */}
                <div className="space-y-4">
                  <Label htmlFor="public_visible" className="text-lg font-semibold text-gray-900">
                    Visibility
                  </Label>
                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl">
                    <Switch
                      id="public_visible"
                      checked={formData.public_visible}
                      onCheckedChange={(checked) => handleChange('public_visible', checked)}
                    />
                    <Label htmlFor="public_visible" className="text-lg">
                      {formData.public_visible ? 'Public (Visible to all)' : 'Private (Admin only)'}
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 'review' && (
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900">Workplan Summary</CardTitle>
                    <CardDescription className="text-lg">
                      Review all information before creating the workplan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          Basic Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Focus Area:</span>
                            <span className="font-semibold">{finalFocusArea}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Activity Name:</span>
                            <span className="font-semibold">{formData.activity_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Timeline:</span>
                            <span className="font-semibold">{formData.timeline_text}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Quarter:</span>
                            <span className="font-semibold">{formData.quarter}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-green-600" />
                          Planning Details
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Budget:</span>
                            <span className="font-semibold">KES {parseInt(formData.budget_allocated)?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Resource Person:</span>
                            <span className="font-semibold">{formData.resource_person || 'Not assigned'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge 
                              variant="outline" 
                              className={
                                formData.status === 'completed' ? 'bg-green-100 text-green-800' :
                                formData.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }
                            >
                              {formData.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Progress:</span>
                            <span className="font-semibold">{formData.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tasks Description Preview */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        Tasks Description
                      </h3>
                      <div className="bg-white border border-gray-200 rounded-xl p-4 max-h-40 overflow-y-auto">
                        <p className="text-gray-700 whitespace-pre-wrap">{formData.tasks_description}</p>
                      </div>
                    </div>

                    {formData.target && (
                      <div className="flex justify-between items-center bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <span className="text-amber-800 font-medium">Target:</span>
                        <span className="text-amber-900 font-semibold">{formData.target}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <span className="text-blue-800 font-medium">Visibility:</span>
                      <Badge variant="outline" className={formData.public_visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {formData.public_visible ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200">
              <div>
                {currentStep !== 'foundation' && (
                  <Button 
                    variant="outline" 
                    onClick={prevStep} 
                    disabled={isLoading}
                    className="h-12 px-8 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-lg font-semibold"
                  >
                    <ArrowLeft className="w-5 h-5 mr-3" />
                    Back
                  </Button>
                )}
              </div>

              <div className="flex gap-4">
                {onCancel && (
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="h-12 px-8 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-lg font-semibold"
                  >
                    Cancel
                  </Button>
                )}

                {currentStep === 'review' ? (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="h-12 px-8 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-lg font-semibold shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Workplan...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5" />
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
                    className="h-12 px-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg font-semibold shadow-lg hover:shadow-xl"
                  >
                    Next
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
[file content end]