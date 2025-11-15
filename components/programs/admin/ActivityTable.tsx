// [file name]: components/programs/admin/ActivityTable.tsx
// [file content begin - UPDATED WITH BULK OPERATIONS]
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Trash2, Eye, Plus, Calendar, DollarSign, Target, User, List, CheckCircle } from 'lucide-react'
import type { Activity, ProgramWithDetails } from '@/lib/types/program'

interface ActivityTableProps {
  program: ProgramWithDetails
  activities: Activity[]
  onAddActivity?: () => void
  onEditActivity?: (activity: Activity) => void
  onDeleteActivity?: (activityId: string) => void
  onViewActivity?: (activity: Activity) => void
  onViewTasks?: (activity: Activity) => void
  onBulkDelete?: (activityIds: string[]) => void
}

export function ActivityTable({ 
  program, 
  activities, 
  onAddActivity, 
  onEditActivity, 
  onDeleteActivity, 
  onViewActivity,
  onViewTasks,
  onBulkDelete 
}: ActivityTableProps) {
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = useState(false)

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'in-progress': return 'secondary'
      case 'planned': return 'outline'
      case 'on-hold': return 'outline'
      case 'cancelled': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'planned': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getBudgetUtilization = (activity: Activity) => {
    if (!activity.budget_allocated || activity.budget_allocated === 0) return 0
    return Math.round((activity.budget_utilized / activity.budget_allocated) * 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Handle individual checkbox selection
  const handleActivitySelect = (activityId: string, checked: boolean) => {
    const newSelected = new Set(selectedActivities)
    if (checked) {
      newSelected.add(activityId)
    } else {
      newSelected.delete(activityId)
    }
    setSelectedActivities(newSelected)
    setIsAllSelected(newSelected.size === activities.length && activities.length > 0)
  }

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedActivities(new Set(activities.map(a => a.id)))
      setIsAllSelected(true)
    } else {
      setSelectedActivities(new Set())
      setIsAllSelected(false)
    }
  }

  // Check if an activity is selected
  const isActivitySelected = (activityId: string) => {
    return selectedActivities.has(activityId)
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedActivities.size === 0) return
    
    const activityNames = activities
      .filter(a => selectedActivities.has(a.id))
      .map(a => a.name)
      .join(', ')

    if (confirm(`Are you sure you want to delete ${selectedActivities.size} activity(s)?\n\n${activityNames}\n\nThis will also delete all associated tasks.`)) {
      onBulkDelete?.(Array.from(selectedActivities))
      setSelectedActivities(new Set())
      setIsAllSelected(false)
    }
  }

  const handleView = (activity: Activity) => {
    onViewActivity?.(activity)
  }

  const handleEdit = (activity: Activity) => {
    onEditActivity?.(activity)
  }

  const handleDelete = (activity: Activity) => {
    if (confirm(`Are you sure you want to delete "${activity.name}"? This will also delete all associated tasks.`)) {
      onDeleteActivity?.(activity.id)
    }
  }

  const handleViewTasks = (activity: Activity) => {
    onViewTasks?.(activity)
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const today = new Date()
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getTaskStats = (activity: Activity) => {
    const totalTasks = activity.tasks?.length || 0
    const completedTasks = activity.tasks?.filter(task => task.status === 10).length || 0
    const inProgressTasks = activity.tasks?.filter(task => task.status && task.status > 0 && task.status < 10).length || 0
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Activities</h3>
          <p className="text-sm text-muted-foreground">
            Manage activities for {program.name}
          </p>
        </div>
        <Button onClick={onAddActivity} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {/* Bulk Actions Bar */}
      {selectedActivities.size > 0 && (
        <div className="bg-primary/10 border rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedActivities.size} activity(s) selected
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
                setSelectedActivities(new Set())
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
      {activities.length > 0 && (
        <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/30">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Select all activities"
          />
          <span className="text-sm font-medium">
            Select all {activities.length} activities
          </span>
        </div>
      )}

      {/* Activities Grid */}
      <div className="grid gap-4">
        {activities.map((activity) => {
          const budgetUtilization = getBudgetUtilization(activity)
          const daysRemaining = getDaysRemaining(activity.timeline_end)
          const isOverdue = daysRemaining < 0 && activity.status !== 'completed'
          const taskStats = getTaskStats(activity)
          const isSelected = isActivitySelected(activity.id)

          return (
            <div 
              key={activity.id} 
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow bg-white relative ${
                isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-4 left-4">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => 
                    handleActivitySelect(activity.id, checked as boolean)
                  }
                  aria-label={`Select ${activity.name}`}
                />
              </div>

              {/* Activity Header */}
              <div className="flex justify-between items-start mb-3 ml-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">{activity.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(activity.status)}`}
                    >
                      {activity.status.replace('-', ' ')}
                    </Badge>
                    {isOverdue && (
                      <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200">
                        Overdue
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {activity.description}
                  </p>
                </div>
                <div className="flex gap-1 ml-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleViewTasks(activity)}
                    className="h-8 w-8"
                    title="View Tasks"
                  >
                    <List className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleView(activity)}
                    className="h-8 w-8"
                    title="View Activity"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(activity)}
                    className="h-8 w-8"
                    title="Edit Activity"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(activity)}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete Activity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Activity Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 ml-6">
                {/* Timeline */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{formatDate(activity.timeline_start)} - {formatDate(activity.timeline_end)}</div>
                    <div className="text-xs text-muted-foreground">
                      {daysRemaining > 0 ? `${daysRemaining} days left` : 
                       daysRemaining === 0 ? 'Due today' : 
                       `${Math.abs(daysRemaining)} days overdue`}
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">KES {activity.budget_allocated.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {budgetUtilization}% utilized
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{activity.progress}%</div>
                    <div className="text-xs text-muted-foreground">Progress</div>
                  </div>
                </div>

                {/* Task Stats */}
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{taskStats.completedTasks}/{taskStats.totalTasks}</div>
                    <div className="text-xs text-muted-foreground">
                      {taskStats.totalTasks > 0 ? `${taskStats.completionRate}% complete` : 'No tasks'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2 mb-3 ml-6">
                {/* Budget Utilization */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Budget Utilization</span>
                    <span>{budgetUtilization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        budgetUtilization > 100 ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Activity Progress */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Activity Progress</span>
                    <span>{activity.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${activity.progress}%` }}
                    />
                  </div>
                </div>

                {/* Task Completion */}
                {taskStats.totalTasks > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Task Completion</span>
                      <span>{taskStats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${taskStats.completionRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Task Summary */}
              {taskStats.totalTasks > 0 && (
                <div className="flex items-center gap-4 text-xs mb-3 ml-6">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => handleViewTasks(activity)}
                  >
                    <List className="w-3 h-3 mr-1" />
                    {taskStats.totalTasks} tasks
                  </Badge>
                  {taskStats.completedTasks > 0 && (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {taskStats.completedTasks} completed
                    </span>
                  )}
                  {taskStats.inProgressTasks > 0 && (
                    <span className="text-blue-600 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {taskStats.inProgressTasks} in progress
                    </span>
                  )}
                </div>
              )}

              {/* KPI & Outcome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs ml-6">
                <div>
                  <span className="font-medium text-foreground">Outcome:</span>
                  <p className="text-muted-foreground mt-1 line-clamp-2">{activity.outcome}</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">KPI:</span>
                  <p className="text-muted-foreground mt-1 line-clamp-2">{activity.kpi}</p>
                </div>
              </div>

              {/* Challenges & Next Steps */}
              {(activity.challenges || activity.next_steps) && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs ml-6">
                  {activity.challenges && (
                    <div>
                      <span className="font-medium text-foreground">Challenges:</span>
                      <p className="text-muted-foreground mt-1 line-clamp-2">{activity.challenges}</p>
                    </div>
                  )}
                  {activity.next_steps && (
                    <div>
                      <span className="font-medium text-foreground">Next Steps:</span>
                      <p className="text-muted-foreground mt-1 line-clamp-2">{activity.next_steps}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Responsible Person */}
              {activity.responsible_person && (
                <div className="mt-3 flex items-center gap-2 text-xs ml-6">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">Responsible:</span>
                  <span className="text-muted-foreground">{activity.responsible_person}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {activities.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-foreground mb-2">No activities yet</h4>
          <p className="text-muted-foreground mb-4">Start by adding your first activity to this program</p>
          <Button onClick={onAddActivity}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Activity
          </Button>
        </div>
      )}
    </div>
  )
}
// [file content end]