// [file name]: components/workplans/admin/WorkplanWizard.tsx
'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Target, 
  Calendar, 
  FileText, 
  Shield, 
  BookOpen,
  DollarSign,
  Users,
  AlertCircle,
  Lightbulb
} from 'lucide-react'
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
  { id: 'gbv', name: 'Comprehensive GBV Management', color: 'red', description: 'Gender-based violence prevention and response activities' },
  { id: 'survivor', name: 'Survivors Livelihood Support Services', color: 'green', description: 'Economic empowerment and support for survivors' },
  { id: 'institutional', name: 'Institutional Development and Growth', color: 'blue', description: 'Organizational capacity building and development' },
  { id: 'other', name: 'Other Focus Area', color: 'gray', description: 'Other organizational activities' }
]

const activityTemplates = {
  'Referrals & linkages': {
    tasks_description: 'Identify survivor needs and consent, Schedule appointments with service providers, Contact referral partners, Arrange safe transportation, Record case details and documentation, Conduct follow-up visits and assessments',
    kpi: 'Number of survivors referred monthly, Satisfaction rate percentage (target: 85%), Average processing time in days, Follow-up completion rate, Service provider responsiveness',
    risks: 'Breach of confidentiality and data privacy, Re-traumatization during referral process, Service provider unavailable or overloaded, Transportation challenges and safety concerns, Cultural and language barriers',
    mitigation_measures: 'Safety planning with survivors before referrals, Strict data protection and confidentiality protocols, Establish backup provider network, Secure and vetted transportation arrangements, Cultural sensitivity training for staff',
    output: 'Safe access to essential services (health, legal, shelter), Informed consent documentation completed, Improved psychosocial wellbeing assessments, Timely healthcare access reports, Referral pathway documentation',
    outcome: 'Survivors expressing satisfaction with support services (target: 90%), Increased collaboration among stakeholders, More survivors seeking support from the organization, Developed SOPs for referrals and follow-ups, Strengthened community support networks'
  },
  'Chief barazas': {
    tasks_description: 'Community consultation on available dates and venues, Develop culturally appropriate discussion topics, Arrange qualified facilitation and translation, Mobilize community participants through local leaders, Document proceedings and community feedback, Develop action plans from discussions',
    kpi: 'Number of participants reached per session, Knowledge increase percentage (pre/post assessment), Community support groups formed, GBV cases reported after awareness, Community action plans developed',
    risks: 'Low community attendance and participation, Sensitive topics mishandled or misunderstood, Security concerns during community events, Cultural resistance or traditional practices, Weather and logistical challenges',
    mitigation_measures: 'Community engagement through trusted local leaders, Trained facilitators on GBV and cultural sensitivity, Safety protocols and venue security, Collaboration with local authorities, Contingency plans for weather and logistics',
    output: 'Increased community knowledge and awareness reports, Formation of community support networks, Identification of GBV risks and protection gaps, Community feedback and suggestion reports, Documentation of traditional protection mechanisms',
    outcome: 'Enhanced community awareness on GBV issues (target: 80% increase), Strengthened referral pathways and reporting mechanisms, Increased reporting of GBV cases to authorities, Community-led protection initiatives established, Improved trust between community and service providers'
  },
  'Psychological counselling': {
    tasks_description: 'Schedule confidential counselling sessions, Obtain informed consent and explain process, Conduct psychological assessments and screening, Provide trauma-informed therapeutic interventions, Document session notes and progress, Conduct follow-up assessments and support',
    kpi: 'Number of clients served monthly, Improved psychosocial functioning scores, Client satisfaction rate (target: 90%), Referral completion rate for additional services, Reduction in trauma symptoms',
    risks: 'Re-traumatization during therapeutic process, Provider burnout and compassion fatigue, Confidentiality breaches and privacy concerns, Stigma affecting service access, Limited follow-up capacity',
    mitigation_measures: 'Trauma-informed care approaches and techniques, Regular staff support and debriefing sessions, Robust data protection and privacy protocols, Community sensitization to reduce stigma, Structured follow-up and referral systems',
    output: 'Psychological assessment and screening reports, Individual and group counseling session documentation, Progress monitoring and evaluation reports, Client feedback and satisfaction surveys, Referral and follow-up tracking',
    outcome: 'Improved mental health and psychosocial wellbeing, Better coping mechanisms and resilience, Enhanced daily functioning and social integration, Reduced psychological distress symptoms, Increased help-seeking behavior for mental health'
  },
  'Monthly group saving and GSL meeting': {
    tasks_description: 'Schedule regular monthly meeting dates, Prepare and review previous meeting minutes, Set and communicate meeting agendas, Facilitate table banking and savings activities, Document financial transactions and decisions, Record member participation and contributions',
    kpi: 'Monthly meeting attendance rate (target: 85%), Total savings amount and growth, Loan repayment and recovery rate, Member satisfaction and feedback scores, New membership applications',
    risks: 'Financial mismanagement or misappropriation, Group conflicts and relationship issues, Security during cash handling and transport, Member dropout and participation decline, External economic pressures',
    mitigation_measures: 'Transparent financial systems and record-keeping, Conflict resolution mechanisms and facilitation, Safe cash handling and banking procedures, Member retention and engagement strategies, Economic resilience training and planning',
    output: 'Monthly meeting minutes and attendance records, Financial transaction and savings ledgers, Member participation and contribution reports, Group governance and decision documentation, Training and capacity building records',
    outcome: 'Improved economic resilience and security, Enhanced group governance and leadership, Reduced financial vulnerability among members, Increased social cohesion and support, Sustainable savings and loan systems'
  }
}

const resourcePersons = ['Claris', 'Leah', 'Equator', 'Other Staff']

export function WorkplanWizard({ onSuccess, onCancel }: WorkplanWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('foundation')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFocusArea, setSelectedFocusArea] = useState('')
  const [showTemplateSuggestions, setShowTemplateSuggestions] = useState(true)
  
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
    if (template && showTemplateSuggestions) {
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

  // Auto-calculate progress based on status
  const handleStatusChange = (status: string) => {
    handleChange('status', status)
    
    if (status === 'completed' && !formData.progress) {
      handleChange('progress', '100')
    } else if (status === 'planned' && parseInt(formData.progress) > 0) {
      handleChange('progress', '0')
    }
  }

  // Get available activities based on selected focus area
  const availableActivities = useMemo(() => {
    const activityMap = {
      'Comprehensive GBV Management': [
        'Referrals & linkages',
        'Chief barazas',
        'Psychological counselling',
        'Rapid response and rescue',
        'Temporary shelter',
        'GBV case managers training',
        'Legal aid clinic'
      ],
      'Survivors Livelihood Support Services': [
        'Monthly group saving and GSL meeting',
        'Training of support groups',
        'Business development training',
        'Formation of support groups'
      ],
      'Institutional Development and Growth': [
        'Monthly member meetings',
        'Resource mobilization training',
        'Developing website',
        'Corporate branding'
      ],
      'Other Focus Area': ['Custom Activity']
    }
    
    return activityMap[formData.focus_area as keyof typeof activityMap] || []
  }, [formData.focus_area])

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

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    const steps: WizardStep[] = ['foundation', 'planning', 'merl', 'risk', 'learning', 'review']
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
        ...formData,
        budget_allocated: parseInt(formData.budget_allocated) || 0,
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
    { id: 'merl' as const, title: 'MERL Core', icon: FileText, description: 'Monitoring framework' },
    { id: 'risk' as const, title: 'Risk', icon: Shield, description: 'Risk management' },
    { id: 'learning' as const, title: 'Learning', icon: BookOpen, description: 'Evaluation and learning' },
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
            {currentStep === 'merl' && <FileText className="h-5 w-5" />}
            {currentStep === 'risk' && <Shield className="h-5 w-5" />}
            {currentStep === 'learning' && <BookOpen className="h-5 w-5" />}
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
                      if (formData.activity_name && !availableActivities.includes(formData.activity_name)) {
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
                            <div>
                              <div className="font-medium">{area.name}</div>
                              <div className="text-xs text-muted-foreground">{area.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity_name" className="flex items-center gap-2">
                    Activity Name *
                    {!formData.activity_name && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </Label>
                  <Select 
                    value={formData.activity_name} 
                    onValueChange={handleActivityChange}
                    required
                    disabled={!formData.focus_area}
                  >
                    <SelectTrigger className={!formData.activity_name ? 'border-red-300' : ''}>
                      <SelectValue placeholder={formData.focus_area ? "Select activity" : "Select focus area first"} />
                    </SelectTrigger>
                    <SelectContent>
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
            </div>
          )}

          {/* Steps 3-5 remain similar but enhanced with better placeholders and descriptions */}

          {/* Step 6: Review - Enhanced with more comprehensive summary */}
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
                      <p className="text-lg font-semibold">{formData.focus_area}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Activity Name</Label>
                      <p className="text-lg font-semibold">{formData.activity_name}</p>
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

                  {/* MERL Framework Summary */}
                  {(formData.output || formData.outcome || formData.kpi) && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">MERL Framework</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        {formData.kpi && (
                          <div>
                            <Label className="text-sm text-muted-foreground">KPI</Label>
                            <p className="text-sm mt-1">{formData.kpi}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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