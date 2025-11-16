// [file name]: components/workplans/admin/WorkplanTable.tsx
// [file content begin]
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Trash2, Eye, MoreHorizontal, MapPin, Target, Calendar, DollarSign, Users } from 'lucide-react'
import type { Workplan } from '@/lib/types/workplan'

interface WorkplanTableProps {
  workplans: Workplan[]
  onDeleteWorkplan?: (workplanId: string) => void
  onEditWorkplan?: (workplan: Workplan) => void
  onViewWorkplan?: (workplan: Workplan) => void
  onBulkDelete?: (workplanIds: string[]) => void
}

export function WorkplanTable({ 
  workplans, 
  onDeleteWorkplan, 
  onEditWorkplan, 
  onViewWorkplan,
  onBulkDelete 
}: WorkplanTableProps) {
  const [selectedWorkplans, setSelectedWorkplans] = useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = useState(false)

  const getStatusVariant = (status: string | null) => {
    switch (status) {
      case 'completed': return 'default'
      case 'in-progress': return 'secondary'
      case 'planned': return 'outline'
      default: return 'outline'
    }
  }

  const getFocusAreaColor = (focusArea: string) => {
    switch (focusArea) {
      case 'Comprehensive GBV Management': return 'bg-red-100 text-red-800 border-red-200'
      case 'Survivors Livelihood Support Services': return 'bg-green-100 text-green-800 border-green-200'
      case 'Institutional Development and Growth': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Other Focus Area': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProgressColor = (progress: number | null) => {
    if (!progress) return 'bg-gray-500'
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  // Handle individual checkbox selection
  const handleWorkplanSelect = (workplanId: string, checked: boolean) => {
    const newSelected = new Set(selectedWorkplans)
    if (checked) {
      newSelected.add(workplanId)
    } else {
      newSelected.delete(workplanId)
    }
    setSelectedWorkplans(newSelected)
    setIsAllSelected(newSelected.size === workplans.length && workplans.length > 0)
  }

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedWorkplans(new Set(workplans.map(w => w.id)))
      setIsAllSelected(true)
    } else {
      setSelectedWorkplans(new Set())
      setIsAllSelected(false)
    }
  }

  // Check if a workplan is selected
  const isWorkplanSelected = (workplanId: string) => {
    return selectedWorkplans.has(workplanId)
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedWorkplans.size === 0) return
    
    const workplanNames = workplans
      .filter(w => selectedWorkplans.has(w.id))
      .map(w => w.activity_name)
      .join(', ')

    if (confirm(`Are you sure you want to delete ${selectedWorkplans.size} workplan(s)?\n\n${workplanNames}`)) {
      onBulkDelete?.(Array.from(selectedWorkplans))
      setSelectedWorkplans(new Set())
      setIsAllSelected(false)
    }
  }

  const handleView = (workplan: Workplan) => {
    alert(`Viewing: ${workplan.activity_name}\nFocus Area: ${workplan.focus_area}\nStatus: ${workplan.status}`)
  }

  const handleEdit = (workplan: Workplan) => {
    onEditWorkplan?.(workplan)
  }

  const handleDelete = (workplan: Workplan) => {
    if (confirm(`Are you sure you want to delete "${workplan.activity_name}"?`)) {
      onDeleteWorkplan?.(workplan.id)
    }
  }

  const truncateText = (text: string | null, maxLength: number = 50) => {
    if (!text) return 'N/A'
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedWorkplans.size > 0 && (
        <div className="bg-primary/10 border-b p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedWorkplans.size} workplan(s) selected
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedWorkplans(new Set())
              setIsAllSelected(false)
            }}
            className="h-8"
          >
            Clear Selection
          </Button>
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-4 font-medium w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all workplans"
              />
            </th>
            <th className="text-left p-4 font-medium">Activity Details</th>
            <th className="text-left p-4 font-medium">Focus Area</th>
            <th className="text-left p-4 font-medium">Timeline</th>
            <th className="text-left p-4 font-medium">Budget</th>
            <th className="text-left p-4 font-medium">Progress</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">MERL Data</th>
            <th className="text-left p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {workplans.map((workplan) => (
            <tr 
              key={workplan.id} 
              className={`border-b hover:bg-muted/30 transition-colors ${
                isWorkplanSelected(workplan.id) ? 'bg-primary/5' : ''
              }`}
            >
              <td className="p-4">
                <Checkbox
                  checked={isWorkplanSelected(workplan.id)}
                  onCheckedChange={(checked) => 
                    handleWorkplanSelect(workplan.id, checked as boolean)
                  }
                  aria-label={`Select ${workplan.activity_name}`}
                />
              </td>
              <td className="p-4">
                <div>
                  <div className="font-medium text-foreground mb-1">{workplan.activity_name}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {truncateText(workplan.tasks_description, 60)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Target className="w-3 h-3" />
                    <span>{truncateText(workplan.target, 30)}</span>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium ${getFocusAreaColor(workplan.focus_area)}`}
                >
                  {workplan.focus_area}
                </Badge>
                {workplan.quarter && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {workplan.quarter}
                  </div>
                )}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span>{workplan.timeline_text}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="space-y-1">
                  <div className="font-medium">KES {workplan.budget_allocated.toLocaleString()}</div>
                </div>
              </td>
              <td className="p-4">
                <div className="space-y-1">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${getProgressColor(workplan.progress)}`} 
                      style={{ width: `${workplan.progress || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{workplan.progress || 0}%</span>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <Badge variant={getStatusVariant(workplan.status)}>
                  {workplan.status || 'planned'}
                </Badge>
              </td>
              <td className="p-4">
                <div className="space-y-1 text-xs">
                  {workplan.output && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Output: {truncateText(workplan.output, 20)}</span>
                    </div>
                  )}
                  {workplan.outcome && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Outcome: {truncateText(workplan.outcome, 20)}</span>
                    </div>
                  )}
                  {workplan.kpi && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>KPI: {truncateText(workplan.kpi, 20)}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleView(workplan)}
                    className="h-8 w-8"
                    title="View Workplan"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(workplan)}
                    className="h-8 w-8"
                    title="Edit Workplan"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(workplan)}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete Workplan"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Empty state */}
      {workplans.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No workplans found</h3>
          <p className="text-muted-foreground">Create your first workplan to get started</p>
        </div>
      )}
    </div>
  )
}
// [file content end]