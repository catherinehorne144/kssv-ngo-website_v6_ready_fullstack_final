[file name]: WorkplanTable.tsx
[file content begin]
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
  FileText,
  Sparkles,
  BarChart3,
  Shield,
  HeartHandshake,
  Building2
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

  const getFocusAreaIcon = (focusArea: string) => {
    switch (focusArea) {
      case 'Comprehensive Gender-based Violence GBV Management': return Shield
      case 'Survivors Livelihood Support Services': return HeartHandshake
      case 'Institutional Development and Growth': return Building2
      default: return Target
    }
  }

  const getFocusAreaColor = (focusArea: string) => {
    switch (focusArea) {
      case 'Comprehensive Gender-based Violence GBV Management': 
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
      case 'Survivors Livelihood Support Services': 
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
      case 'Institutional Development and Growth': 
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
      default: 
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
    }
  }

  const getProgressColor = (progress: number | null) => {
    if (!progress) return 'bg-gradient-to-r from-gray-400 to-gray-500'
    if (progress >= 80) return 'bg-gradient-to-r from-green-400 to-green-500'
    if (progress >= 50) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
    return 'bg-gradient-to-r from-red-400 to-red-500'
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200 shadow-sm'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200 shadow-sm'
      case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200 shadow-sm'
      default: return 'bg-gray-100 text-gray-800 border-gray-200 shadow-sm'
    }
  }

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'completed': return '✅'
      case 'in-progress': return '🟡'
      case 'planned': return '🔵'
      default: return '⚪'
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
      className="text-left p-4 font-semibold cursor-pointer hover:bg-blue-50/50 transition-colors group rounded-lg"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <div className="flex flex-col">
          <ChevronUp className={`h-3 w-3 transition-all ${
            sortField === field && sortDirection === 'asc' 
              ? 'text-blue-600' 
              : 'text-gray-400 group-hover:text-gray-600'
          }`} />
          <ChevronDown className={`h-3 w-3 -mt-1 transition-all ${
            sortField === field && sortDirection === 'desc' 
              ? 'text-blue-600' 
              : 'text-gray-400 group-hover:text-gray-600'
          }`} />
        </div>
      </div>
    </th>
  )

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg bg-white/80 backdrop-blur-sm">
      {/* Bulk Actions Bar */}
      {selectedWorkplans.size > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold">
              {selectedWorkplans.size} workplan(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBulkExport}
                className="h-8 bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Export Selected
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBulkDelete}
                className="h-8 bg-red-500/20 hover:bg-red-500/30 text-white border-red-300/30"
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
            className="h-8 text-white/90 hover:text-white hover:bg-white/20"
          >
            Clear Selection
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gradient-to-r from-gray-50 to-blue-50/30">
              <th className="text-left p-4 font-semibold w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all workplans"
                  className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
              </th>
              <SortableHeader field="activity_name">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Activity Details
                </div>
              </SortableHeader>
              <SortableHeader field="focus_area">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  Focus Area
                </div>
              </SortableHeader>
              <SortableHeader field="quarter">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Quarter
                </div>
              </SortableHeader>
              <SortableHeader field="timeline_text">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  Timeline
                </div>
              </SortableHeader>
              <SortableHeader field="budget_allocated">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  Budget
                </div>
              </SortableHeader>
              <SortableHeader field="progress">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-600" />
                  Progress
                </div>
              </SortableHeader>
              <SortableHeader field="status">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-red-600" />
                  Status
                </div>
              </SortableHeader>
              <th className="text-left p-4 font-semibold w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedWorkplans.map((workplan) => {
              const FocusAreaIcon = getFocusAreaIcon(workplan.focus_area)
              const isSelected = isWorkplanSelected(workplan.id)
              const isExpanded = expandedWorkplan === workplan.id
              
              return (
                <>
                  <tr 
                    key={workplan.id} 
                    className={`border-b transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-inner' 
                        : 'hover:bg-gray-50/80'
                    } ${
                      isExpanded ? 'bg-blue-25 shadow-sm' : ''
                    }`}
                    onClick={() => toggleExpand(workplan.id)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => 
                          handleWorkplanSelect(workplan.id, checked as boolean)
                        }
                        aria-label={`Select ${workplan.activity_name}`}
                        className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          {workplan.activity_name}
                          {isExpanded ? 
                            <ChevronUp className="h-3 w-3 text-blue-600" /> : 
                            <ChevronDown className="h-3 w-3 text-gray-500" />
                          }
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          {truncateText(workplan.tasks_description, 60)}
                        </div>
                        {workplan.target && (
                          <div className="flex items-center gap-2 text-xs text-amber-600 mt-1">
                            <Target className="w-3 h-3" />
                            <span className="font-medium">{truncateText(workplan.target, 30)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div 
                        className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
                        onClick={(e) => {
                          e.stopPropagation()
                          onFocusAreaSelect?.(workplan.focus_area)
                        }}
                      >
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-medium flex items-center gap-2 px-3 py-1.5 rounded-full ${getFocusAreaColor(workplan.focus_area)}`}
                        >
                          <FocusAreaIcon className="w-3 h-3" />
                          {workplan.focus_area.split(' ')[0]}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
                        {workplan.quarter || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-3 h-3 text-orange-500" />
                        <span className="font-medium">{workplan.timeline_text}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="font-semibold flex items-center gap-1 text-gray-900">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                          KES {workplan.budget_allocated?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                          <div 
                            className={`h-2.5 rounded-full transition-all duration-1000 shadow-sm ${getProgressColor(workplan.progress)}`} 
                            style={{ width: `${workplan.progress || 0}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 font-medium">
                          <span>Progress</span>
                          <span>{workplan.progress || 0}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <Badge 
                          className={`px-3 py-1.5 rounded-full font-semibold border-2 ${getStatusColor(workplan.status)}`}
                        >
                          {getStatusIcon(workplan.status)} {workplan.status || 'planned'}
                        </Badge>
                        {onStatusChange && (
                          <div className="flex gap-1 mt-1">
                            {['planned', 'in-progress', 'completed'].map((status) => (
                              <button
                                key={status}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleQuickStatusChange(workplan, status as Workplan['status'])
                                }}
                                className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                                  workplan.status === status 
                                    ? getStatusColor(status) + ' font-bold'
                                    : 'text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(workplan)}
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-all"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(workplan)}
                          className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 transition-all"
                          title="Edit Workplan"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenMERL(workplan)}
                          className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-600 transition-all"
                          title="Open MERL Framework"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(workplan)}
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-all"
                          title="Delete Workplan"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded row for additional details */}
                  {isExpanded && (
                    <tr className="bg-gradient-to-r from-blue-25 to-purple-25">
                      <td colSpan={9} className="p-4 border-b">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              Activity Details
                            </h4>
                            <div className="bg-white/80 rounded-xl p-4 border border-gray-200">
                              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {workplan.tasks_description}
                              </p>
                              {workplan.target && (
                                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                  <span className="font-semibold text-amber-800">Target: </span>
                                  <span className="text-amber-900">{workplan.target}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <Users className="w-4 h-4 text-green-600" />
                              Resource Information
                            </h4>
                            <div className="bg-white/80 rounded-xl p-4 border border-gray-200 space-y-3">
                              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="font-medium text-gray-700">Quarter:</span>
                                <Badge variant="outline" className="bg-blue-100 text-blue-700 font-semibold">
                                  {workplan.quarter || 'Not set'}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="font-medium text-gray-700">Resource Person:</span>
                                <span className="text-gray-900 font-medium">{workplan.resource_person || 'Not assigned'}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="font-medium text-gray-700">Visibility:</span>
                                <Badge variant="outline" className={workplan.public_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                  {workplan.public_visible ? 'Public' : 'Private'}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <span className="font-medium text-gray-700">Progress:</span>
                                <div className="flex items-center gap-3">
                                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(workplan.progress)}`}
                                      style={{ width: `${workplan.progress || 0}%` }}
                                    />
                                  </div>
                                  <span className="text-gray-900 font-semibold min-w-8">{workplan.progress || 0}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {sortedWorkplans.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No workplans found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create your first workplan to start organizing your programs and activities.
          </p>
        </div>
      )}
    </div>
  )
}
[file content end]