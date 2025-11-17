// [file name]: components/workplans/admin/WorkplanTable.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Edit, 
  Trash2, 
  Eye, 
  Target, 
  Calendar, 
  DollarSign, 
  Users,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  FileText
} from 'lucide-react'
import type { Workplan } from '@/lib/types/workplan'

interface WorkplanTableProps {
  workplans: Workplan[]
  onDeleteWorkplan?: (workplanId: string) => void
  onEditWorkplan?: (workplan: Workplan) => void
  onViewWorkplan?: (workplan: Workplan) => void
  onBulkDelete?: (workplanIds: string[]) => void
  onBulkExport?: (workplanIds: string[]) => void
  onStatusChange?: (workplanId: string, status: Workplan['status']) => void
  onOpenMERL?: (workplan: Workplan) => void
  onFocusAreaSelect?: (focusArea: string) => void
}

type SortField = 'activity_name' | 'focus_area' | 'quarter' | 'budget_allocated' | 'progress' | 'status' | 'timeline_text'
type SortDirection = 'asc' | 'desc'

export function WorkplanTable({ 
  workplans, 
  onDeleteWorkplan, 
  onEditWorkplan, 
  onViewWorkplan,
  onBulkDelete,
  onBulkExport,
  onStatusChange,
  onOpenMERL,
  onFocusAreaSelect
}: WorkplanTableProps) {
  const [selectedWorkplans, setSelectedWorkplans] = useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [sortField, setSortField] = useState<SortField>('activity_name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [expandedWorkplan, setExpandedWorkplan] = useState<string | null>(null)

  // Sort workplans
  const sortedWorkplans = [...workplans].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    // Handle different data types for sorting
    if (sortField === 'budget_allocated' || sortField === 'progress') {
      aValue = aValue || 0
      bValue = bValue || 0
    } else {
      aValue = String(aValue || '').toLowerCase()
      bValue = String(bValue || '').toLowerCase()
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

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
      case 'Comprehensive Gender-based Violence GBV Management': return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
      case 'Survivors Livelihood Support Services': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
      case 'Institutional Development and Growth': return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
      case 'Other Focus Area': return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
    }
  }

  const getProgressColor = (progress: number | null) => {
    if (!progress) return 'bg-gray-500'
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'in-progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'planned': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
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

  // Handle bulk export
  const handleBulkExport = () => {
    if (selectedWorkplans.size === 0) return
    onBulkExport?.(Array.from(selectedWorkplans))
  }

  const handleView = (workplan: Workplan) => {
    onViewWorkplan?.(workplan)
  }

  const handleEdit = (workplan: Workplan) => {
    onEditWorkplan?.(workplan)
  }

  const handleDelete = (workplan: Workplan) => {
    if (confirm(`Are you sure you want to delete "${workplan.activity_name}"?`)) {
      onDeleteWorkplan?.(workplan.id)
    }
  }

  // Handle MERL button click
  const handleOpenMERL = (workplan: Workplan) => {
    onOpenMERL?.(workplan)
  }

  const handleQuickStatusChange = (workplan: Workplan, newStatus: Workplan['status']) => {
    if (onStatusChange) {
      onStatusChange(workplan.id, newStatus)
    }
  }

  const toggleExpand = (workplanId: string) => {
    setExpandedWorkplan(expandedWorkplan === workplanId ? null : workplanId)
  }

  const truncateText = (text: string | null, maxLength: number = 50) => {
    if (!text) return 'N/A'
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      className="text-left p-4 font-medium cursor-pointer hover:bg-muted/30 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
        )}
      </div>
    </th>
  )

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm min-w-[1200px]">
      {/* Bulk Actions Bar */}
      {selectedWorkplans.size > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-blue-800">
              {selectedWorkplans.size} workplan(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleBulkExport}
                className="h-8 bg-green-600 hover:bg-green-700"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Export Selected
              </Button>
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
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedWorkplans(new Set())
              setIsAllSelected(false)
            }}
            className="h-8 text-blue-800 hover:text-blue-900 hover:bg-blue-100"
          >
            Clear Selection
          </Button>
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="text-left p-4 font-medium w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all workplans"
              />
            </th>
            <SortableHeader field="activity_name">
              Activity Details
            </SortableHeader>
            <SortableHeader field="focus_area">
              Focus Area
            </SortableHeader>
            <SortableHeader field="quarter">
              Quarter
            </SortableHeader>
            <SortableHeader field="timeline_text">
              Timeline
            </SortableHeader>
            <SortableHeader field="budget_allocated">
              Budget
            </SortableHeader>
            <SortableHeader field="progress">
              Progress
            </SortableHeader>
            <SortableHeader field="status">
              Status
            </SortableHeader>
            <th className="text-left p-4 font-medium w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedWorkplans.map((workplan) => (
            <>
              <tr 
                key={workplan.id} 
                className={`border-b hover:bg-muted/20 transition-colors cursor-pointer ${
                  isWorkplanSelected(workplan.id) ? 'bg-blue-50' : ''
                } ${expandedWorkplan === workplan.id ? 'bg-muted/30' : ''}`}
                onClick={() => toggleExpand(workplan.id)}
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
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
                    <div className="font-medium text-foreground mb-1 flex items-center gap-2">
                      {workplan.activity_name}
                      {expandedWorkplan === workplan.id ? 
                        <ChevronUp className="h-3 w-3 text-muted-foreground" /> : 
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {truncateText(workplan.tasks_description, 60)}
                    </div>
                    {workplan.target && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Target className="w-3 h-3" />
                        <span>{truncateText(workplan.target, 30)}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium ${getFocusAreaColor(workplan.focus_area)} cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onFocusAreaSelect?.(workplan.focus_area)
                    }}
                  >
                    {workplan.focus_area}
                  </Badge>
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium">{workplan.quarter || 'N/A'}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span>{workplan.timeline_text}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      KES {workplan.budget_allocated?.toLocaleString() || '0'}
                    </div>
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
                  <div className="space-y-1">
                    <Badge 
                      variant={getStatusVariant(workplan.status)} 
                      className={getStatusColor(workplan.status)}
                    >
                      {workplan.status || 'planned'}
                    </Badge>
                    {onStatusChange && (
                      <div className="flex gap-1 mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuickStatusChange(workplan, 'planned')
                          }}
                          className={`text-xs px-1 rounded ${
                            workplan.status === 'planned' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'text-blue-500 hover:bg-blue-50'
                          }`}
                        >
                          Plan
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuickStatusChange(workplan, 'in-progress')
                          }}
                          className={`text-xs px-1 rounded ${
                            workplan.status === 'in-progress'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'text-yellow-500 hover:bg-yellow-50'
                          }`}
                        >
                          Start
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuickStatusChange(workplan, 'completed')
                          }}
                          className={`text-xs px-1 rounded ${
                            workplan.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'text-green-500 hover:bg-green-50'
                          }`}
                        >
                          Complete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(workplan)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(workplan)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenMERL(workplan)}
                      className="h-8 w-8 p-0"
                      title="Open MERL Card"
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(workplan)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
              
              {/* Expanded row for additional details */}
              {expandedWorkplan === workplan.id && (
                <tr className="bg-muted/20">
                  <td colSpan={9} className="p-4 border-b">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Activity Details</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {workplan.tasks_description}
                        </p>
                        {workplan.target && (
                          <div className="mt-2">
                            <span className="font-medium">Target: </span>
                            <span>{workplan.target}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Resource Information</h4>
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium">Resource Person: </span>
                            <span>{workplan.resource_person || 'Not assigned'}</span>
                          </div>
                          <div>
                            <span className="font-medium">Quarter: </span>
                            <span>{workplan.quarter || 'Not set'}</span>
                          </div>
                          <div>
                            <span className="font-medium">Visibility: </span>
                            <span>{workplan.public_visible ? 'Public' : 'Private'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}