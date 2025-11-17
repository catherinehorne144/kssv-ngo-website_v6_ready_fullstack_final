"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Plus, FileText, Eye, Edit, Users, Target, BarChart3 } from 'lucide-react'
import type { Workplan, MerlEntry } from '@/lib/types/workplan'
import { MERLButton } from './MERLButton'

interface MERLDashboardProps {
  workplans: Workplan[]
  onOpenMERL: (workplan: Workplan) => void
  onCreateWorkplan?: () => void
}

interface WorkplanWithMERL extends Workplan {
  merl_entry?: MerlEntry
}

export function MERLDashboard({ workplans, onOpenMERL, onCreateWorkplan }: MERLDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [focusAreaFilter, setFocusAreaFilter] = useState<string>('all')
  const [merlStatusFilter, setMerlStatusFilter] = useState<string>('all')
  const [workplansWithMERL, setWorkplansWithMERL] = useState<WorkplanWithMERL[]>([])

  // Load MERL data for all workplans
  useEffect(() => {
    const loadMERLData = async () => {
      const workplansWithData = await Promise.all(
        workplans.map(async (workplan) => {
          try {
            const response = await fetch(`/api/merl?workplan_id=${workplan.id}`)
            if (response.ok) {
              const merlData = await response.json()
              return {
                ...workplan,
                merl_entry: merlData.length > 0 ? merlData[0] : undefined
              }
            }
          } catch (error) {
            console.error('Error loading MERL data:', error)
          }
          return { ...workplan, merl_entry: undefined }
        })
      )
      setWorkplansWithMERL(workplansWithData)
    }

    if (workplans.length > 0) {
      loadMERLData()
    }
  }, [workplans])

  // Filter workplans based on search and filters
  const filteredWorkplans = workplansWithMERL.filter(workplan => {
    const matchesSearch = !searchTerm || 
      workplan.activity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workplan.focus_area?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFocusArea = focusAreaFilter === 'all' || workplan.focus_area === focusAreaFilter
    
    const matchesMERLStatus = merlStatusFilter === 'all' || 
      (merlStatusFilter === 'no-merl' && !workplan.merl_entry) ||
      (merlStatusFilter === 'has-merl' && workplan.merl_entry) ||
      (workplan.merl_entry?.merl_status === merlStatusFilter)

    return matchesSearch && matchesFocusArea && matchesMERLStatus
  })

  // Calculate dashboard statistics
  const stats = {
    totalActivities: workplans.length,
    activitiesWithMERL: workplansWithMERL.filter(w => w.merl_entry).length,
    draftMERL: workplansWithMERL.filter(w => w.merl_entry?.merl_status === 'draft').length,
    inReviewMERL: workplansWithMERL.filter(w => w.merl_entry?.merl_status === 'in-review').length,
    approvedMERL: workplansWithMERL.filter(w => w.merl_entry?.merl_status === 'approved').length,
  }

  const completionRate = stats.totalActivities > 0 
    ? Math.round((stats.activitiesWithMERL / stats.totalActivities) * 100) 
    : 0

  // Get unique focus areas for filter
  const availableFocusAreas = [...new Set(workplans.map(w => w.focus_area).filter(Boolean))] as string[]

  // Group workplans by focus area
  const workplansByFocusArea = filteredWorkplans.reduce((acc, workplan) => {
    const focusArea = workplan.focus_area
    if (!acc[focusArea]) {
      acc[focusArea] = []
    }
    acc[focusArea].push(workplan)
    return acc
  }, {} as Record<string, WorkplanWithMERL[]>)

  const getFocusAreaIcon = (focusArea: string) => {
    switch (focusArea) {
      case 'Comprehensive Gender-based Violence GBV Management':
        return <Users className="h-4 w-4" />
      case 'Survivors Livelihood Support Services':
        return <BarChart3 className="h-4 w-4" />
      case 'Institutional Development and Growth':
        return <Target className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getFocusAreaColor = (focusArea: string) => {
    switch (focusArea) {
      case 'Comprehensive Gender-based Violence GBV Management': return 'bg-red-100 text-red-800 border-red-200'
      case 'Survivors Livelihood Support Services': return 'bg-green-100 text-green-800 border-green-200'
      case 'Institutional Development and Growth': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getMERLStatusBadge = (merlEntry?: MerlEntry) => {
    if (!merlEntry) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">No MERL</Badge>
    }

    const statusColors = {
      draft: 'bg-blue-100 text-blue-800',
      'in-review': 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800'
    }

    const statusText = {
      draft: 'Draft',
      'in-review': 'In Review',
      approved: 'Approved'
    }

    return (
      <Badge variant="outline" className={statusColors[merlEntry.merl_status]}>
        {statusText[merlEntry.merl_status]}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">MERL Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage MERL frameworks across all activities
          </p>
        </div>
        {onCreateWorkplan && (
          <Button onClick={onCreateWorkplan}>
            <Plus className="h-4 w-4 mr-2" />
            New Workplan
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">With MERL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activitiesWithMERL}</div>
            <p className="text-xs text-muted-foreground">{completionRate}% complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.draftMERL}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inReviewMERL}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedMERL}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">No MERL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.totalActivities - stats.activitiesWithMERL}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={focusAreaFilter} onValueChange={setFocusAreaFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Focus Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Focus Areas</SelectItem>
                {availableFocusAreas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={merlStatusFilter} onValueChange={setMerlStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="MERL Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="no-merl">No MERL</SelectItem>
                <SelectItem value="has-merl">Has MERL</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activities by Focus Area */}
      <div className="space-y-6">
        {Object.entries(workplansByFocusArea).map(([focusArea, areaWorkplans]) => (
          <Card key={focusArea}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getFocusAreaIcon(focusArea)}
                <span>{focusArea}</span>
                <Badge variant="secondary" className="ml-2">
                  {areaWorkplans.length} activities
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {areaWorkplans.map((workplan) => (
                  <Card key={workplan.id} className="relative">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-sm leading-tight">
                            {workplan.activity_name}
                          </h3>
                          {getMERLStatusBadge(workplan.merl_entry)}
                        </div>
                        
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <span>Quarter:</span>
                            <span className="font-medium">{workplan.quarter || 'Not set'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Status:</span>
                            <span className="font-medium capitalize">{workplan.status}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Progress:</span>
                            <span className="font-medium">{workplan.progress}%</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <MERLButton
                            workplanId={workplan.id}
                            hasExistingMERL={!!workplan.merl_entry}
                            merlStatus={workplan.merl_entry?.merl_status}
                            onOpenMERL={() => onOpenMERL(workplan)}
                            variant="default"
                            size="sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenMERL(workplan)}
                            className="flex-1"
                          >
                            {workplan.merl_entry ? <Edit className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredWorkplans.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No activities found</h3>
              <p className="text-muted-foreground mb-4">
                {workplans.length === 0 
                  ? 'No workplans available. Create your first workplan to get started.'
                  : 'No activities match your current filters.'
                }
              </p>
              {workplans.length === 0 && onCreateWorkplan && (
                <Button onClick={onCreateWorkplan}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workplan
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}