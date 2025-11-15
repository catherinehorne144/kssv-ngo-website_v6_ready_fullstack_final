// [file name]: components/programs/admin/ProgramWizard.tsx
// [file content begin - FIXED TASK CREATION]
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
import { Plus, Trash2, ArrowRight, ArrowLeft, Check, Building2, Target, ListTodo } from 'lucide-react'
import type { ProgramWithDetails, Activity, Task } from '@/lib/types/program'

interface ProgramWizardProps {
  onSuccess?: (program: ProgramWithDetails) => void
  onCancel?: () => void
}

type WizardStep = 'program' | 'activities' | 'tasks' | 'review'

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

interface ActivityFormData {
  name: string
  description: string
  outcome: string
  kpi: string
  timeline_start: string
  timeline_end: string
  budget_allocated: string
  status: string
  responsible_person: string
  progress: string
}

interface TaskFormData {
  name: string
  target: string
  task_timeline: string
  activity_timeline: string
  budget: string
  status: string
}

const focusAreas = [
  { id: 'gbv', name: 'GBV Management' },
  { id: 'empowerment', name: 'Survivor Empowerment' },
  { id: 'institutional', name: 'Institutional Development' },
  { id: 'srh', name: 'SRH Rights' },
  { id: 'other', name: 'Other' }
]

export function ProgramWizard({ onSuccess, onCancel }: ProgramWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('program')
  const [isLoading, setIsLoading] = useState(false)
  
  // Form data
  const [programData, setProgramData] = useState<ProgramFormData>({
    name: '',
    description: '',
    year: new Date().getFullYear().toString(),
    status: 'planned',
    budget_total: '',
    public_visible: true,
    focus_area: '',
    program_image: '',
    strategic_objective: '',
    location: 'Migori County'
  })

  const [activities, setActivities] = useState<ActivityFormData[]>([
    {
      name: '',
      description: '',
      outcome: '',
      kpi: '',
      timeline_start: '',
      timeline_end: '',
      budget_allocated: '',
      status: 'planned',
      responsible_person: '',
      progress: '0'
    }
  ])

  const [tasks, setTasks] = useState<{ [activityIndex: number]: TaskFormData[] }>({})

  // Step validation
  const isProgramStepValid = () => {
    return programData.name && programData.description && programData.year && 
           programData.status && programData.budget_total && programData.focus_area && programData.location
  }

  const isActivitiesStepValid = () => {
    return activities.every(activity => 
      activity.name && activity.description && activity.outcome && activity.kpi &&
      activity.timeline_start && activity.timeline_end && activity.budget_allocated
    )
  }

  // Activity management
  const addActivity = () => {
    setActivities(prev => [...prev, {
      name: '',
      description: '',
      outcome: '',
      kpi: '',
      timeline_start: '',
      timeline_end: '',
      budget_allocated: '',
      status: 'planned',
      responsible_person: '',
      progress: '0'
    }])
  }

  const removeActivity = (index: number) => {
    if (activities.length > 1) {
      setActivities(prev => prev.filter((_, i) => i !== index))
      
      // Remove tasks for this activity
      const newTasks = { ...tasks }
      delete newTasks[index]
      setTasks(newTasks)
    }
  }

  const updateActivity = (index: number, field: keyof ActivityFormData, value: string) => {
    setActivities(prev => prev.map((activity, i) => 
      i === index ? { ...activity, [field]: value } : activity
    ))
  }

  // Task management
  const addTask = (activityIndex: number) => {
    setTasks(prev => ({
      ...prev,
      [activityIndex]: [
        ...(prev[activityIndex] || []),
        {
          name: '',
          target: '',
          task_timeline: '',
          activity_timeline: activities[activityIndex].timeline_start || '',
          budget: '',
          status: '0'
        }
      ]
    }))
  }

  const removeTask = (activityIndex: number, taskIndex: number) => {
    setTasks(prev => ({
      ...prev,
      [activityIndex]: (prev[activityIndex] || []).filter((_, i) => i !== taskIndex)
    }))
  }

  const updateTask = (activityIndex: number, taskIndex: number, field: keyof TaskFormData, value: string) => {
    setTasks(prev => ({
      ...prev,
      [activityIndex]: (prev[activityIndex] || []).map((task, i) => 
        i === taskIndex ? { ...task, [field]: value } : task
      )
    }))
  }

  // Navigation
  const nextStep = () => {
    switch (currentStep) {
      case 'program':
        if (isProgramStepValid()) setCurrentStep('activities')
        break
      case 'activities':
        if (isActivitiesStepValid()) setCurrentStep('tasks')
        break
      case 'tasks':
        setCurrentStep('review')
        break
    }
  }

  const prevStep = () => {
    switch (currentStep) {
      case 'activities':
        setCurrentStep('program')
        break
      case 'tasks':
        setCurrentStep('activities')
        break
      case 'review':
        setCurrentStep('tasks')
        break
    }
  }

  // Final submission - FIXED: Proper task creation with error handling
  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      console.log("🚀 Starting program creation...")

      // 1. Create Program
      const programResponse = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(programData),
      })

      if (!programResponse.ok) {
        const errorData = await programResponse.json()
        throw new Error(errorData.error || 'Failed to create program')
      }

      const program = await programResponse.json()
      console.log("✅ Program created:", program.id)

      // 2. Create Activities
      for (const [activityIndex, activityData] of activities.entries()) {
        console.log(`📋 Creating activity ${activityIndex + 1}...`)
        
        const activityResponse = await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...activityData,
            program_id: program.id,
            budget_utilized: '0',
            progress: activityData.progress || '0'
          }),
        })

        if (!activityResponse.ok) {
          const errorData = await activityResponse.json()
          throw new Error(errorData.error || `Failed to create activity: ${activityData.name}`)
        }

        const activity = await activityResponse.json()
        console.log("✅ Activity created:", activity.id)

        // 3. Create Tasks for this activity
        const activityTasks = tasks[activityIndex] || []
        console.log(`📝 Creating ${activityTasks.length} tasks for activity...`)
        
        for (const [taskIndex, taskData] of activityTasks.entries()) {
          console.log(`🔄 Creating task ${taskIndex + 1}...`)
          
          const taskPayload = {
            activity_id: activity.id,
            name: taskData.name,
            target: taskData.target || null,
            task_timeline: taskData.task_timeline || null,
            activity_timeline: taskData.activity_timeline,
            budget: taskData.budget || 0,
            output: null,
            outcome: null,
            evaluation_criteria: null,
            risks: null,
            mitigation_measures: null,
            resource_person: null,
            status: taskData.status ? parseInt(taskData.status) : 0,
            learning_and_development: null,
            self_evaluation: null,
            notes: null
          }

          console.log("📦 Task payload:", taskPayload)

          const taskResponse = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskPayload),
          })

          if (!taskResponse.ok) {
            const errorData = await taskResponse.json()
            console.error("❌ Task creation failed:", errorData)
            throw new Error(errorData.error || `Failed to create task: ${taskData.name}`)
          }

          const taskResult = await taskResponse.json()
          console.log("✅ Task created:", taskResult.id)
        }
      }

      console.log("🎉 All tasks created successfully!")

      // Refresh to get the complete program with all relations
      const updatedProgramResponse = await fetch(`/api/programs/${program.id}`)
      if (!updatedProgramResponse.ok) {
        throw new Error('Failed to fetch updated program')
      }
      
      const updatedProgram = await updatedProgramResponse.json()
      console.log("📊 Updated program with relations:", updatedProgram)

      onSuccess?.(updatedProgram)

    } catch (error) {
      console.error('❌ Error creating program:', error)
      alert(error instanceof Error ? error.message : 'Failed to create program. Please check the console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  // ... (rest of the component remains the same - steps, progress, forms, etc.)
  // Step headers
  const steps = [
    { id: 'program', title: 'Program Details', icon: Building2 },
    { id: 'activities', title: 'Activities', icon: Target },
    { id: 'tasks', title: 'Tasks', icon: ListTodo },
    { id: 'review', title: 'Review', icon: Check }
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
            {currentStep === 'program' && 'Program Information'}
            {currentStep === 'activities' && 'Program Activities'}
            {currentStep === 'tasks' && 'Activity Tasks'}
            {currentStep === 'review' && 'Review & Create'}
          </CardTitle>
          <CardDescription>
            {currentStep === 'program' && 'Enter the basic information about your program'}
            {currentStep === 'activities' && 'Define the activities that make up this program'}
            {currentStep === 'tasks' && 'Add specific tasks for each activity'}
            {currentStep === 'review' && 'Review all information before creating the program'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Step 1: Program Details */}
          {currentStep === 'program' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Program Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Comprehensive GBV Management"
                    value={programData.name}
                    onChange={(e) => setProgramData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus_area">Focus Area *</Label>
                  <Select value={programData.focus_area} onValueChange={(value) => setProgramData(prev => ({ ...prev, focus_area: value }))} required>
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
                  <Label htmlFor="year">Program Year *</Label>
                  <Select value={programData.year} onValueChange={(value) => setProgramData(prev => ({ ...prev, year: value }))} required>
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

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={programData.status} onValueChange={(value) => setProgramData(prev => ({ ...prev, status: value }))} required>
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

                <div className="space-y-2">
                  <Label htmlFor="budget">Total Budget (KES) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 2500000"
                    value={programData.budget_total}
                    onChange={(e) => setProgramData(prev => ({ ...prev, budget_total: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select value={programData.location} onValueChange={(value) => setProgramData(prev => ({ ...prev, location: value }))} required>
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

              <div className="space-y-2">
                <Label htmlFor="program_image">Program Image URL</Label>
                <Input
                  id="program_image"
                  placeholder="e.g., /programs/program-name.jpg"
                  value={programData.program_image}
                  onChange={(e) => setProgramData(prev => ({ ...prev, program_image: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Program Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the program objectives, scope, and target beneficiaries..."
                  rows={4}
                  value={programData.description}
                  onChange={(e) => setProgramData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="strategic_objective">Strategic Objective</Label>
                <Textarea
                  id="strategic_objective"
                  placeholder="What is the main strategic goal of this program?"
                  rows={2}
                  value={programData.strategic_objective}
                  onChange={(e) => setProgramData(prev => ({ ...prev, strategic_objective: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="public-visible" 
                  checked={programData.public_visible}
                  onCheckedChange={(checked) => setProgramData(prev => ({ ...prev, public_visible: checked }))}
                />
                <Label htmlFor="public-visible">Make program visible to public</Label>
              </div>
            </div>
          )}

          {/* Step 2: Activities */}
          {currentStep === 'activities' && (
            <div className="space-y-6">
              {activities.map((activity, activityIndex) => (
                <div key={activityIndex} className="space-y-4">
                  <Card>
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Activity {activityIndex + 1}</CardTitle>
                        {activities.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeActivity(activityIndex)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Activity Name *</Label>
                          <Input
                            placeholder="e.g., Legal Aid Services"
                            value={activity.name}
                            onChange={(e) => updateActivity(activityIndex, 'name', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Status *</Label>
                          <Select value={activity.status} onValueChange={(value) => updateActivity(activityIndex, 'status', value)} required>
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
                          <Label>Start Date *</Label>
                          <Input
                            type="date"
                            value={activity.timeline_start}
                            onChange={(e) => updateActivity(activityIndex, 'timeline_start', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>End Date *</Label>
                          <Input
                            type="date"
                            value={activity.timeline_end}
                            onChange={(e) => updateActivity(activityIndex, 'timeline_end', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Budget Allocated (KES) *</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 500000"
                            value={activity.budget_allocated}
                            onChange={(e) => updateActivity(activityIndex, 'budget_allocated', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Progress (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            value={activity.progress}
                            onChange={(e) => updateActivity(activityIndex, 'progress', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Responsible Person</Label>
                          <Input
                            placeholder="e.g., John Doe"
                            value={activity.responsible_person}
                            onChange={(e) => updateActivity(activityIndex, 'responsible_person', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Activity Description *</Label>
                        <Textarea
                          placeholder="Describe what this activity involves..."
                          rows={3}
                          value={activity.description}
                          onChange={(e) => updateActivity(activityIndex, 'description', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Expected Outcome *</Label>
                        <Textarea
                          placeholder="What is the expected result of this activity?"
                          rows={2}
                          value={activity.outcome}
                          onChange={(e) => updateActivity(activityIndex, 'outcome', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Key Performance Indicator (KPI) *</Label>
                        <Textarea
                          placeholder="How will you measure success?"
                          rows={2}
                          value={activity.kpi}
                          onChange={(e) => updateActivity(activityIndex, 'kpi', e.target.value)}
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addActivity} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Activity
              </Button>
            </div>
          )}

          {/* Step 3: Tasks */}
          {currentStep === 'tasks' && (
            <div className="space-y-6">
              {activities.map((activity, activityIndex) => (
                <Card key={activityIndex}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {activity.name || `Activity ${activityIndex + 1}`}
                    </CardTitle>
                    <Badge variant="outline">{activity.status}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(tasks[activityIndex] || []).map((task, taskIndex) => (
                      <div key={taskIndex} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="text-base">Task {taskIndex + 1}</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTask(activityIndex, taskIndex)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Task Name *</Label>
                            <Input
                              placeholder="e.g., Schedule meetings"
                              value={task.name}
                              onChange={(e) => updateTask(activityIndex, taskIndex, 'name', e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Due Date *</Label>
                            <Input
                              type="date"
                              value={task.activity_timeline}
                              onChange={(e) => updateTask(activityIndex, taskIndex, 'activity_timeline', e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Target</Label>
                            <Input
                              type="number"
                              placeholder="e.g., 50"
                              value={task.target}
                              onChange={(e) => updateTask(activityIndex, taskIndex, 'target', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                              placeholder="e.g., 2 weeks"
                              value={task.task_timeline}
                              onChange={(e) => updateTask(activityIndex, taskIndex, 'task_timeline', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Budget (KES)</Label>
                            <Input
                              type="number"
                              placeholder="e.g., 10000"
                              value={task.budget}
                              onChange={(e) => updateTask(activityIndex, taskIndex, 'budget', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Status (0-10)</Label>
                            <Select value={task.status} onValueChange={(value) => updateTask(activityIndex, taskIndex, 'status', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select progress" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0 - Not Started</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5 - Halfway</SelectItem>
                                <SelectItem value="6">6</SelectItem>
                                <SelectItem value="7">7</SelectItem>
                                <SelectItem value="8">8</SelectItem>
                                <SelectItem value="9">9</SelectItem>
                                <SelectItem value="10">10 - Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => addTask(activityIndex)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task to {activity.name || `Activity ${activityIndex + 1}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              {/* Program Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Program Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Name</Label>
                      <p className="font-medium">{programData.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Focus Area</Label>
                      <p className="font-medium">{programData.focus_area}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Year</Label>
                      <p className="font-medium">{programData.year}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Status</Label>
                      <Badge>{programData.status}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Budget</Label>
                      <p className="font-medium">KES {parseInt(programData.budget_total).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Visibility</Label>
                      <Badge variant={programData.public_visible ? "default" : "outline"}>
                        {programData.public_visible ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Description</Label>
                    <p className="text-sm mt-1">{programData.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Activities Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Activities Summary</CardTitle>
                  <Badge variant="outline">{activities.length} activities</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{activity.name}</h4>
                        <Badge>{activity.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Budget:</span>
                          <p>KES {parseInt(activity.budget_allocated).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Progress:</span>
                          <p>{activity.progress}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timeline:</span>
                          <p>{activity.timeline_start} to {activity.timeline_end}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tasks:</span>
                          <p>{(tasks[index] || []).length} tasks</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Responsible:</span>
                          <p>{activity.responsible_person || 'Not assigned'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Tasks Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Tasks Summary</CardTitle>
                  <Badge variant="outline">
                    {Object.values(tasks).flat().length} total tasks
                  </Badge>
                </CardHeader>
                <CardContent>
                  {activities.map((activity, activityIndex) => {
                    const activityTasks = tasks[activityIndex] || []
                    return activityTasks.length > 0 ? (
                      <div key={activityIndex} className="mb-4 last:mb-0">
                        <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
                          {activity.name} ({activityTasks.length} tasks)
                        </h4>
                        <div className="space-y-2">
                          {activityTasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="flex justify-between items-center p-2 border rounded text-sm">
                              <div>
                                <span>{task.name}</span>
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                  <span>Progress: {task.status}/10</span>
                                  {task.budget && <span>Budget: KES {parseInt(task.budget).toLocaleString()}</span>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null
                  })}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <div>
              {currentStep !== 'program' && (
                <Button variant="outline" onClick={prevStep} disabled={isLoading}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              {onCancel && currentStep === 'program' && (
                <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                  Cancel
                </Button>
              )}

              {currentStep === 'review' ? (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? 'Creating Program...' : 'Create Program & Activities'}
                </Button>
              ) : (
                <Button onClick={nextStep} disabled={
                  (currentStep === 'program' && !isProgramStepValid()) ||
                  (currentStep === 'activities' && !isActivitiesStepValid()) ||
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