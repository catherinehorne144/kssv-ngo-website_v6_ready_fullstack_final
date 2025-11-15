// [file name]: components/programs/admin/TaskTable.tsx
// [file content begin - UPDATED WITH BULK OPERATIONS]
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Trash2, Eye, Plus, Calendar, DollarSign, Target, User, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import type { Task, Activity, ProgramWithDetails } from '@/lib/types/program'

interface TaskTableProps {
  program: ProgramWithDetails
  activity: Activity
  tasks: Task[]
  onAddTask?: () => void
  onEditTask?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
  onViewTask?: (task: Task) => void
  onBulkDelete?: (taskIds: string[]) => void
}

export function TaskTable({ 
  program, 
  activity, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onViewTask,
  onBulkDelete 
}: TaskTableProps) {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = useState(false)

  const getStatusVariant = (status: number | null) => {
    if (status === null) return 'outline'
    if (status === 10) return 'default'
    if (status >= 7) return 'secondary'
    if (status >= 4) return 'outline'
    return 'outline'
  }

  const getStatusColor = (status: number | null) => {
    if (status === null) return 'bg-gray-100 text-gray-800 border-gray-200'
    if (status === 10) return 'bg-green-100 text-green-800 border-green-200'
    if (status >= 7) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (status >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-orange-100 text-orange-800 border-orange-200'
  }

  const getStatusIcon = (status: number | null) => {
    if (status === 10) return <CheckCircle className="w-3 h-3" />
    if (status && status >= 7) return <CheckCircle className="w-3 h-3" />
    if (status && status >= 4) return <Clock className="w-3 h-3" />
    return <AlertCircle className="w-3 h-3" />
  }

  const getStatusText = (status: number | null) => {
    if (status === null) return 'Not Started'
    if (status === 0) return 'Not Started'
    if (status === 10) return 'Completed'
    return `${status}/10`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysRemaining = (activityTimeline: string) => {
    const timeline = new Date(activityTimeline)
    const today = new Date()
    const diffTime = timeline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Handle individual checkbox selection
  const handleTaskSelect = (taskId: string, checked: boolean) => {
    const newSelected = new Set(selectedTasks)
    if (checked) {
      newSelected.add(taskId)
    } else {
      newSelected.delete(taskId)
    }
    setSelectedTasks(newSelected)
    setIsAllSelected(newSelected.size === tasks.length && tasks.length > 0)
  }

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(new Set(tasks.map(t => t.id)))
      setIsAllSelected(true)
    } else {
      setSelectedTasks(new Set())
      setIsAllSelected(false)
    }
  }

  // Check if a task is selected
  const isTaskSelected = (taskId: string) => {
    return selectedTasks.has(taskId)
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedTasks.size === 0) return
    
    const taskNames = tasks
      .filter(t => selectedTasks.has(t.id))
      .map(t => t.name)
      .join(', ')

    if (confirm(`Are you sure you want to delete ${selectedTasks.size} task(s)?\n\n${taskNames}`)) {
      onBulkDelete?.(Array.from(selectedTasks))
      setSelectedTasks(new Set())
      setIsAllSelected(false)
    }
  }

  const handleView = (task: Task) => {
    onViewTask?.(task)
  }

  const handleEdit = (task: Task) => {
    onEditTask?.(task)
  }

  const handleDelete = (task: Task) => {
    if (confirm(`Are you sure you want to delete "${task.name}"?`)) {
      onDeleteTask?.(task.id)
    }
  }

  const isTaskOverdue = (task: Task) => {
    if (!task.activity_timeline) return false
    const daysRemaining = getDaysRemaining(task.activity_timeline)
    return daysRemaining < 0 && task.status !== 10
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Tasks</h3>
          <p className="text-sm text-muted-foreground">
            Manage tasks for {activity.name} in {program.name}
          </p>
        </div>
        <Button onClick={onAddTask} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Bulk Actions Bar */}
      {selectedTasks.size > 0 && (
        <div className="bg-primary/10 border rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedTasks.size} task(s) selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="h-8"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete Selected
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedTasks(new Set())
                setIsAllSelected(false)
              }}
              className="h-8"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Select All Checkbox */}
      {tasks.length > 0 && (
        <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/30">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Select all tasks"
          />
          <span className="text-sm font-medium">
            Select all {tasks.length} tasks
          </span>
        </div>
      )}

      {/* Tasks Grid */}
      <div className="grid gap-3">
        {tasks.map((task) => {
          const daysRemaining = task.activity_timeline ? getDaysRemaining(task.activity_timeline) : null
          const isOverdue = isTaskOverdue(task)
          const isSelected = isTaskSelected(task.id)

          return (
            <div 
              key={task.id} 
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow bg-white relative ${
                isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-4 left-4">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => 
                    handleTaskSelect(task.id, checked as boolean)
                  }
                  aria-label={`Select ${task.name}`}
                />
              </div>

              {/* Task Header */}
              <div className="flex justify-between items-start mb-3 ml-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">{task.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs flex items-center gap-1 ${getStatusColor(task.status)}`}
                    >
                      {getStatusIcon(task.status)}
                      {getStatusText(task.status)}
                    </Badge>
                    {isOverdue && (
                      <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200">
                        Overdue
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 ml-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleView(task)}
                    className="h-8 w-8"
                    title="View Task"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(task)}
                    className="h-8 w-8"
                    title="Edit Task"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(task)}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete Task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Task Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 ml-6">
                {/* Timeline */}
                {task.activity_timeline && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{formatDate(task.activity_timeline)}</div>
                      <div className="text-xs text-muted-foreground">
                        {daysRemaining && daysRemaining > 0 ? `${daysRemaining} days left` : 
                         daysRemaining === 0 ? 'Due today' : 
                         daysRemaining && `${Math.abs(daysRemaining)} days overdue`}
                      </div>
                    </div>
                  </div>
                )}

                {/* Task Timeline */}
                {task.task_timeline && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{task.task_timeline}</div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                  </div>
                )}

                {/* Budget */}
                {task.budget && task.budget > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">KES {task.budget.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Budget</div>
                    </div>
                  </div>
                )}

                {/* Resource Person */}
                {task.resource_person && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{task.resource_person}</div>
                      <div className="text-xs text-muted-foreground">Responsible</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Target */}
              {task.target && (
                <div className="flex items-center gap-2 text-sm mb-3 ml-6">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Target:</span>
                    <span className="text-muted-foreground ml-1">{task.target}</span>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {task.status !== null && (
                <div className="mb-3 ml-6">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{task.status}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(task.status / 10) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Task Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ml-6">
                {/* Output & Outcome */}
                {(task.output || task.outcome) && (
                  <div className="space-y-2">
                    {task.output && (
                      <div>
                        <span className="font-medium text-foreground">Output:</span>
                        <p className="text-muted-foreground mt-1 text-xs">{task.output}</p>
                      </div>
                    )}
                    {task.outcome && (
                      <div>
                        <span className="font-medium text-foreground">Outcome:</span>
                        <p className="text-muted-foreground mt-1 text-xs">{task.outcome}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Evaluation Criteria */}
                {task.evaluation_criteria && (
                  <div>
                    <span className="font-medium text-foreground">Evaluation Criteria:</span>
                    <p className="text-muted-foreground mt-1 text-xs">{task.evaluation_criteria}</p>
                  </div>
                )}
              </div>

              {/* Risks & Mitigation */}
              {(task.risks || task.mitigation_measures) && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ml-6">
                  {task.risks && (
                    <div className="p-2 bg-red-50 rounded border border-red-200">
                      <span className="font-medium text-red-800">Risks:</span>
                      <p className="text-red-700 mt-1 text-xs">{task.risks}</p>
                    </div>
                  )}
                  {task.mitigation_measures && (
                    <div className="p-2 bg-green-50 rounded border border-green-200">
                      <span className="font-medium text-green-800">Mitigation:</span>
                      <p className="text-green-700 mt-1 text-xs">{task.mitigation_measures}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Learning & Self Evaluation */}
              {(task.learning_and_development || task.self_evaluation) && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ml-6">
                  {task.learning_and_development && (
                    <div>
                      <span className="font-medium text-foreground">Learning & Development:</span>
                      <p className="text-muted-foreground mt-1 text-xs">{task.learning_and_development}</p>
                    </div>
                  )}
                  {task.self_evaluation && (
                    <div>
                      <span className="font-medium text-foreground">Self Evaluation:</span>
                      <p className="text-muted-foreground mt-1 text-xs">{task.self_evaluation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {task.notes && (
                <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200 ml-6">
                  <span className="font-medium text-blue-800 text-sm">Notes:</span>
                  <p className="text-blue-700 mt-1 text-xs">{task.notes}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-foreground mb-2">No tasks yet</h4>
          <p className="text-muted-foreground mb-4">Start by adding your first task to this activity</p>
          <Button onClick={onAddTask}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Task
          </Button>
        </div>
      )}
    </div>
  )
}
// [file content end]