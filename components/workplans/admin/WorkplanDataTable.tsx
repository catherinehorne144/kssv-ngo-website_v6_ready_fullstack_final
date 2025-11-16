"use client"

import { DataTable } from "@/components/ui/data-table"
import type { Workplan } from '@/lib/types/workplan'

interface WorkplanDataTableProps {
  workplans: Workplan[]
  onEdit: (workplan: Workplan) => void
  onDelete: (workplan: Workplan) => void
  onView?: (workplan: Workplan) => void
  selectedRows?: string[]
  onSelectedRowsChange?: (rows: string[]) => void
  onCreate?: () => void
}

export function WorkplanDataTable({
  workplans,
  onEdit,
  onDelete,
  onView,
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
        </div>
      )
    },
    {
      key: "focus_area",
      label: "Focus Area",
      render: (value: string) => {
        const getFocusAreaColor = (focusArea: string) => {
          switch (focusArea) {
            case 'Comprehensive GBV Management': return 'bg-red-100 text-red-800 border-red-200'
            case 'Survivors Livelihood Support Services': return 'bg-green-100 text-green-800 border-green-200'
            case 'Institutional Development and Growth': return 'bg-blue-100 text-blue-800 border-blue-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
          }
        }
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getFocusAreaColor(value)}`}>
            {value}
          </span>
        )
      }
    },
    {
      key: "quarter",
      label: "Quarter",
      render: (value: string) => (
        <span className="text-sm font-medium">{value || 'N/A'}</span>
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
        <span className="font-medium">KES {value?.toLocaleString() || '0'}</span>
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
        
        return (
          <div className="space-y-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusVariant(value)}`}>
              {value || 'planned'}
            </span>
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
        <span