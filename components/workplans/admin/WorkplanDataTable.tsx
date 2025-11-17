// [file name]: components/workplans/admin/WorkplanDataTable.tsx
"use client"

import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, FileText, Target, Calendar, DollarSign, Users } from 'lucide-react'
import type { Workplan } from '@/lib/types/workplan'

interface WorkplanDataTableProps {
  workplans: Workplan[]
  onEdit: (workplan: Workplan) => void
  onDelete: (workplan: Workplan) => void
  onView?: (workplan: Workplan) => void
  onOpenMERL?: (workplan: Workplan) => void
  onFocusAreaSelect?: (focusArea: string) => void
  selectedRows?: string[]
  onSelectedRowsChange?: (rows: string[]) => void
  onCreate?: () => void
}

export function WorkplanDataTable({
  workplans,
  onEdit,
  onDelete,
  onView,
  onOpenMERL,
  onFocusAreaSelect,
  selectedRows = [],
  onSelectedRowsChange,
  onCreate
}: WorkplanDataTableProps) {
  // Define columns for workplans
  const columns = [
    {
      key: "activity_name",
      label: "Activity",
      render: (value: string, row: Workplan) => (
        <div className="max-w-[200px]">
          <div className="font-medium text-foreground truncate">{value}</div>
          <div className="text-xs text-muted-foreground truncate">
            {row.tasks_description?.substring(0, 60)}...
          </div>
          {row.target && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Target className="w-3 h-3" />
              <span className="truncate">{row.target}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: "focus_area",
      label: "Focus Area",
      render: (value: string) => {
        const getFocusAreaColor = (focusArea: string) => {
          switch (focusArea) {
            case 'Comprehensive Gender-based Violence GBV Management': 
              return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 cursor-pointer'
            case 'Survivors Livelihood Support Services': 
              return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 cursor-pointer'
            case 'Institutional Development and Growth': 
              return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 cursor-pointer'
            case 'Other Focus Area': 
              return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 cursor-pointer'
            default: 
              return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 cursor-pointer'
          }
        }
        
        return (
          <span 
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${getFocusAreaColor(value)}`}
            onClick={() => onFocusAreaSelect?.(value)}
          >
            {value}
          </span>
        )
      }
    },
    {
      key: "quarter",
      label: "Quarter",
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          <span className="font-medium">{value || 'N/A'}</span>
        </div>
      )
    },
    {
      key: "timeline_text",
      label: "Timeline",
      render: (value: string) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: "budget_allocated",
      label: "Budget",
      render: (value: number) => (
        <div className="flex items-center gap-1 font-medium">
          <DollarSign className="h-3 w-3 text-green-600" />
          KES {value?.toLocaleString() || '0'}
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (value: string, row: Workplan) => {
        const getStatusVariant = (status: string) => {
          switch (status) {
            case 'completed': return 'default'
            case 'in-progress': return 'secondary'
            case 'planned': return 'outline'
            default: return 'outline'
          }
        }

        const getStatusColor = (status: string) => {
          switch (status) {
            case 'completed': return 'text-green-600 bg-green-50 border-green-200'
            case 'in-progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
            case 'planned': return 'text-blue-600 bg-blue-50 border-blue-200'
            default: return 'text-gray-600 bg-gray-50 border-gray-200'
          }
        }
        
        return (
          <div className="space-y-1">
            <Badge 
              variant={getStatusVariant(value)} 
              className={getStatusColor(value)}
            >
              {value || 'planned'}
            </Badge>
            {row.progress !== undefined && (
              <div className="w-full bg-secondary rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${
                    row.progress >= 80 ? 'bg-green-500' :
                    row.progress >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${row.progress}%` }}
                />
              </div>
            )}
          </div>
        )
      }
    },
    {
      key: "progress",
      label: "Progress",
      render: (value: number) => (
        <span className="font-medium">{value || 0}%</span>
      )
    },
    {
      key: "resource_person",
      label: "Responsible",
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm">
          <Users className="w-3 h-3 text-muted-foreground" />
          <span className="truncate max-w-[120px]">{value || 'Not assigned'}</span>
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (value: any, row: Workplan) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView?.(row)}
            className="h-8 w-8 p-0"
            title="View"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row)}
            className="h-8 w-8 p-0"
            title="Edit"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenMERL?.(row)}
            className="h-8 w-8 p-0"
            title="Open MERL"
          >
            <FileText className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <DataTable
      columns={columns}
      data={workplans}
      selectedRows={selectedRows}
      onSelectedRowsChange={onSelectedRowsChange}
      searchableColumns={[
        {
          key: "activity_name",
          label: "Activity Name"
        },
        {
          key: "focus_area", 
          label: "Focus Area"
        },
        {
          key: "tasks_description",
          label: "Description"
        },
        {
          key: "resource_person",
          label: "Responsible Person"
        }
      ]}
      filterableColumns={[
        {
          key: "status",
          label: "Status",
          options: [
            { label: "Planned", value: "planned" },
            { label: "In Progress", value: "in-progress" },
            { label: "Completed", value: "completed" }
          ]
        },
        {
          key: "focus_area",
          label: "Focus Area",
          options: [
            ...new Set(workplans.map(w => w.focus_area).filter(Boolean))
          ].map(area => ({ label: area, value: area }))
        },
        {
          key: "quarter", 
          label: "Quarter",
          options: [
            ...new Set(workplans.map(w => w.quarter).filter(Boolean))
          ].map(quarter => ({ label: quarter, value: quarter }))
        }
      ]}
      bulkActions={[
        {
          label: "Delete Selected",
          action: (selectedIds) => {
            if (confirm(`Are you sure you want to delete ${selectedIds.length} workplan(s)?`)) {
              selectedIds.forEach(id => {
                const workplan = workplans.find(w => w.id === id)
                if (workplan) {
                  onDelete(workplan)
                }
              })
            }
          },
          variant: "destructive" as const
        }
      ]}
      onCreate={onCreate}
      emptyState={
        <div className="text-center py-12">
          <div className="text-muted-foreground">No workplans found.</div>
          {onCreate && (
            <Button onClick={onCreate} className="mt-4">
              Create Workplan
            </Button>
          )}
        </div>
      }
    />
  )
}