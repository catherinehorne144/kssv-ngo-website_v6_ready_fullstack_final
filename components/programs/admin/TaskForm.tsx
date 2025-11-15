// [file name]: components/programs/admin/TaskForm.tsx - UPDATED
// [file content begin - UPDATED WITH REAL API]
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Task } from '@/lib/types/program'

interface TaskFormProps {
  activityId: string
  activityName: string
  programName: string
  task?: Task // For editing existing task
  onSuccess?: (task: Task) => void
  onCancel?: () => void
}

interface TaskFormData {
  name: string
  target: string
  task_timeline: string
  activity_timeline: string
  budget: string
  output: string
  outcome: string
  evaluation_criteria: string
  risks: string
  mitigation_measures: string
  resource_person: string
  status: string
  learning_and_development: string
  self_evaluation: string
  notes: string
}

export function TaskForm({ 
  activityId, 
  activityName, 
  programName, 
  task, 
  onSuccess, 
  onCancel 
}: TaskFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState<TaskFormData>({
    name: task?.name || '',
    target: task?.target?.toString() || '',
    task_timeline: task?.task_timeline || '',
    activity_timeline: task?.activity_timeline || '',
    budget: task?.budget?.toString() || '0',
    output: task?.output || '',
    outcome: task?.outcome || '',
    evaluation_criteria: task?.evaluation_criteria || '',
    risks: task?.risks || '',
    mitigation_measures: task?.mitigation_measures || '',
    resource_person: task?.resource_person || '',
    status: task?.status?.toString() || '0',
    learning_and_development: task?.learning_and_development || '',
    self_evaluation: task?.self_evaluation || '',
    notes: task?.notes || ''
  })

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validate form
    if (!formData.name || !formData.activity_timeline) {
      alert('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    try {
      const taskData = {
        activity_id: activityId,
        name: formData.name,
        target: formData.target,
        task_timeline: formData.task_timeline,
        activity_timeline: formData.activity_timeline,
        budget: formData.budget,
        output: formData.output,
        outcome: formData.outcome,
        evaluation_criteria: formData.evaluation_criteria,
        risks: formData.risks,
        mitigation_measures: formData.mitigation_measures,
        resource_person: formData.resource_person,
        status: formData.status,
        learning_and_development: formData.learning_and_development,
        self_evaluation: formData.self_evaluation,
        notes: formData.notes
      }

      const url = task ? `/api/tasks/${task.id}` : '/api/tasks'
      const method = task ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${task ? 'update' : 'create'} task`)
      }

      const result = await response.json()
      console.log(`✅ Task ${task ? 'updated' : 'created'} successfully:`, result)
      
      alert(`Task ${task ? 'updated' : 'created'} successfully!`)
      onSuccess?.(result)
      
    } catch (error) {
      console.error(`❌ Error ${task ? 'updating' : 'creating'} task:`, error)
      alert(error instanceof Error ? error.message : `Failed to ${task ? 'update' : 'create'} task`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Context Header */}
      <div className="p-4 bg-muted/30 rounded-lg">
        <h3 className="font-semibold text-foreground">Program: {programName}</h3>
        <p className="text-sm text-muted-foreground">Activity: {activityName}</p>
        <p className="text-xs text-muted-foreground mt-1">Adding task to activity</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Task Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Time scheduling, Purchase materials"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          {/* Activity Timeline */}
          <div className="space-y-2">
            <Label htmlFor="activity_timeline">Activity Timeline Date *</Label>
            <Input
              id="activity_timeline"
              type="date"
              value={formData.activity_timeline}
              onChange={(e) => handleChange('activity_timeline', e.target.value)}
              required
            />
          </div>

          {/* Target */}
          <div className="space-y-2">
            <Label htmlFor="target">Target</Label>
            <Input
              id="target"
              type="number"
              placeholder="e.g., 9"
              value={formData.target}
              onChange={(e) => handleChange('target', e.target.value)}
            />
          </div>

          {/* Task Timeline */}
          <div className="space-y-2">
            <Label htmlFor="task_timeline">Task Timeline (Duration)</Label>
            <Input
              id="task_timeline"
              placeholder="e.g., 1 day, 2 weeks"
              value={formData.task_timeline}
              onChange={(e) => handleChange('task_timeline', e.target.value)}
            />
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (KES)</Label>
            <Input
              id="budget"
              type="number"
              placeholder="e.g., 1000"
              value={formData.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
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
            <Label htmlFor="status">Status (0-10)</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
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

        {/* Output */}
        <div className="space-y-2">
          <Label htmlFor="output">Output</Label>
          <Textarea
            id="output"
            placeholder="What is the expected output of this task?"
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
            placeholder="What is the expected outcome of this task?"
            rows={2}
            value={formData.outcome}
            onChange={(e) => handleChange('outcome', e.target.value)}
          />
        </div>

        {/* Evaluation Criteria */}
        <div className="space-y-2">
          <Label htmlFor="evaluation_criteria">Evaluation Criteria</Label>
          <Textarea
            id="evaluation_criteria"
            placeholder="How will you evaluate success?"
            rows={2}
            value={formData.evaluation_criteria}
            onChange={(e) => handleChange('evaluation_criteria', e.target.value)}
          />
        </div>

        {/* Risks */}
        <div className="space-y-2">
          <Label htmlFor="risks">Risks</Label>
          <Textarea
            id="risks"
            placeholder="What are the potential risks?"
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
            placeholder="How will you mitigate the risks?"
            rows={2}
            value={formData.mitigation_measures}
            onChange={(e) => handleChange('mitigation_measures', e.target.value)}
          />
        </div>

        {/* Learning & Development */}
        <div className="space-y-2">
          <Label htmlFor="learning_and_development">Learning & Development</Label>
          <Textarea
            id="learning_and_development"
            placeholder="What learning or development occurred?"
            rows={2}
            value={formData.learning_and_development}
            onChange={(e) => handleChange('learning_and_development', e.target.value)}
          />
        </div>

        {/* Self Evaluation */}
        <div className="space-y-2">
          <Label htmlFor="self_evaluation">Self Evaluation</Label>
          <Textarea
            id="self_evaluation"
            placeholder="How do you evaluate your performance?"
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
            placeholder="Any additional notes or comments..."
            rows={2}
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading 
              ? (task ? 'Updating Task...' : 'Creating Task...') 
              : (task ? 'Update Task' : 'Create Task')
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