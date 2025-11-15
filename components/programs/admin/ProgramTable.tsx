// [file name]: components/programs/admin/ProgramTable.tsx
// [file content begin - UPDATED WITH BULK OPERATIONS]
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Trash2, Eye, MoreHorizontal, MapPin, Target, List } from 'lucide-react'
import type { ProgramWithDetails } from '@/lib/types/program'

interface ProgramTableProps {
  programs: ProgramWithDetails[]
  onDeleteProgram?: (programId: string) => void
  onUpdateProgram?: (program: ProgramWithDetails) => void
  onViewActivities?: (program: ProgramWithDetails) => void
  onBulkDelete?: (programIds: string[]) => void
}

export function ProgramTable({ 
  programs, 
  onDeleteProgram, 
  onUpdateProgram, 
  onViewActivities,
  onBulkDelete 
}: ProgramTableProps) {
  const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = useState(false)

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'completed': return 'secondary'
      case 'planned': return 'outline'
      default: return 'outline'
    }
  }

  const getFocusAreaColor = (focusArea: string) => {
    switch (focusArea) {
      case 'GBV Management': return 'bg-red-100 text-red-800 border-red-200'
      case 'Survivor Empowerment': return 'bg-green-100 text-green-800 border-green-200'
      case 'Institutional Development': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SRH Rights': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getVisibilityBadge = (isPublic: boolean) => {
    return isPublic ? 
      <Badge variant="default" className="bg-green-500">Public</Badge> :
      <Badge variant="outline">Private</Badge>
  }

  const getBudgetUtilization = (program: ProgramWithDetails) => {
    return Math.round((program.impact_metrics.budget_utilized / program.budget_total) * 100)
  }

  // Handle individual checkbox selection
  const handleProgramSelect = (programId: string, checked: boolean) => {
    const newSelected = new Set(selectedPrograms)
    if (checked) {
      newSelected.add(programId)
    } else {
      newSelected.delete(programId)
    }
    setSelectedPrograms(newSelected)
    setIsAllSelected(newSelected.size === programs.length && programs.length > 0)
  }

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPrograms(new Set(programs.map(p => p.id)))
      setIsAllSelected(true)
    } else {
      setSelectedPrograms(new Set())
      setIsAllSelected(false)
    }
  }

  // Check if a program is selected
  const isProgramSelected = (programId: string) => {
    return selectedPrograms.has(programId)
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedPrograms.size === 0) return
    
    const programNames = programs
      .filter(p => selectedPrograms.has(p.id))
      .map(p => p.name)
      .join(', ')

    if (confirm(`Are you sure you want to delete ${selectedPrograms.size} program(s)?\n\n${programNames}\n\nThis will also delete all associated activities and tasks.`)) {
      onBulkDelete?.(Array.from(selectedPrograms))
      setSelectedPrograms(new Set())
      setIsAllSelected(false)
    }
  }

  const handleView = (program: ProgramWithDetails) => {
    alert(`Viewing: ${program.name}\nFocus Area: ${program.focus_area}\nLocation: ${program.location}`)
  }

  const handleEdit = (program: ProgramWithDetails) => {
    alert(`Editing: ${program.name}`)
    onUpdateProgram?.(program)
  }

  const handleDelete = (program: ProgramWithDetails) => {
    if (confirm(`Are you sure you want to delete "${program.name}"? This will also delete all associated activities and tasks.`)) {
      onDeleteProgram?.(program.id)
    }
  }

  const handleViewActivities = (program: ProgramWithDetails) => {
    onViewActivities?.(program)
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedPrograms.size > 0 && (
        <div className="bg-primary/10 border-b p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedPrograms.size} program(s) selected
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
              setSelectedPrograms(new Set())
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
                aria-label="Select all programs"
              />
            </th>
            <th className="text-left p-4 font-medium">Program Details</th>
            <th className="text-left p-4 font-medium">Focus Area</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Visibility</th>
            <th className="text-left p-4 font-medium">Budget</th>
            <th className="text-left p-4 font-medium">Progress</th>
            <th className="text-left p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program) => (
            <tr 
              key={program.id} 
              className={`border-b hover:bg-muted/30 transition-colors ${
                isProgramSelected(program.id) ? 'bg-primary/5' : ''
              }`}
            >
              <td className="p-4">
                <Checkbox
                  checked={isProgramSelected(program.id)}
                  onCheckedChange={(checked) => 
                    handleProgramSelect(program.id, checked as boolean)
                  }
                  aria-label={`Select ${program.name}`}
                />
              </td>
              <td className="p-4">
                <div>
                  <div className="font-medium text-foreground mb-1">{program.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{program.location}</span>
                    <span>•</span>
                    <span>{program.year}</span>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {program.description}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => handleViewActivities(program)}
                      title="View Activities"
                    >
                      <List className="w-3 h-3 mr-1" />
                      {program.activities.length} activities
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {program.impact_metrics.beneficiaries_reached} beneficiaries
                    </Badge>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium ${getFocusAreaColor(program.focus_area)}`}
                >
                  {program.focus_area}
                </Badge>
              </td>
              <td className="p-4">
                <Badge variant={getStatusVariant(program.status)}>
                  {program.status}
                </Badge>
              </td>
              <td className="p-4">
                {getVisibilityBadge(program.public_visible)}
              </td>
              <td className="p-4">
                <div className="space-y-1">
                  <div className="font-medium">KES {program.budget_total.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {getBudgetUtilization(program)}% utilized
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full transition-all" 
                      style={{ width: `${getBudgetUtilization(program)}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="space-y-1">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${program.impact_metrics.success_rate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Success</span>
                    <span>{program.impact_metrics.success_rate}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Activities</span>
                    <span>{program.impact_metrics.activities_completed}/{program.activities.length}</span>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleViewActivities(program)}
                    className="h-8 w-8"
                    title="View Activities"
                  >
                    <List className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleView(program)}
                    className="h-8 w-8"
                    title="View Program"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(program)}
                    className="h-8 w-8"
                    title="Edit Program"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(program)}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete Program"
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
      {programs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No programs found</h3>
          <p className="text-muted-foreground">Create your first program to get started</p>
        </div>
      )}
    </div>
  )
}
// [file content end]