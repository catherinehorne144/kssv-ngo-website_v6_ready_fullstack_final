"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Sheet, BarChart3 } from "lucide-react"
import type { Workplan } from '@/lib/types/workplan'

interface ExportManagerProps {
  workplans: Workplan[]
  selectedWorkplanId?: string
}

export function ExportManager({ workplans, selectedWorkplanId }: ExportManagerProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv')
  const [exportScope, setExportScope] = useState<'all' | 'selected'>('all')

  const exportData = exportScope === 'selected' && selectedWorkplanId 
    ? workplans.filter(w => w.id === selectedWorkplanId)
    : workplans

  const handleExport = () => {
    switch (exportFormat) {
      case 'csv':
        exportToCSV()
        break
      case 'json':
        exportToJSON()
        break
      case 'pdf':
        exportToPDF()
        break
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Focus Area',
      'Activity Name',
      'Timeline',
      'Quarter',
      'Tasks Description',
      'Target',
      'Budget Allocated',
      'Status',
      'Progress',
      'Resource Person',
      'Visibility',
      'Created At',
      'Updated At'
    ]

    const csvContent = [
      headers.join(','),
      ...exportData.map(workplan => [
        `"${workplan.focus_area}"`,
        `"${workplan.activity_name}"`,
        `"${workplan.timeline_text}"`,
        `"${workplan.quarter || ''}"`,
        `"${workplan.tasks_description}"`,
        `"${workplan.target || ''}"`,
        workplan.budget_allocated,
        `"${workplan.status}"`,
        workplan.progress,
        `"${workplan.resource_person || ''}"`,
        `"${workplan.public_visible ? 'Public' : 'Private'}"`,
        `"${workplan.created_at}"`,
        `"${workplan.updated_at}"`
      ].join(','))
    ].join('\n')

    downloadFile(csvContent, 'workplans.csv', 'text/csv')
  }

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(exportData, null, 2)
    downloadFile(jsonContent, 'workplans.json', 'application/json')
  }

  const exportToPDF = () => {
    alert('PDF export would open print dialog. For full PDF generation, implement a PDF library.')
    window.print()
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select value={exportFormat} onValueChange={(value: 'csv' | 'json' | 'pdf') => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <Sheet className="h-4 w-4" />
                      CSV Format
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      JSON Format
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      PDF Report
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Export Scope</label>
              <Select value={exportScope} onValueChange={(value: 'all' | 'selected') => setExportScope(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workplans ({workplans.length})</SelectItem>
                  <SelectItem 
                    value="selected" 
                    disabled={!selectedWorkplanId}
                  >
                    Selected Workplan
                  </SelectItem>
                </SelectContent>
              </Select>
              {!selectedWorkplanId && exportScope === 'selected' && (
                <p className="text-sm text-muted-foreground">No workplan selected</p>
              )}
            </div>

            <Button 
              onClick={handleExport} 
              className="w-full"
              disabled={exportScope === 'selected' && !selectedWorkplanId}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Workplans
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Records:</span>
                <span className="text-sm font-medium">{exportData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Format:</span>
                <span className="text-sm font-medium capitalize">{exportFormat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Scope:</span>
                <span className="text-sm font-medium capitalize">{exportScope}</span>
              </div>
              
              {exportData.length > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Sample Data:</h4>
                  <div className="text-xs space-y-1">
                    <p><strong>Activity:</strong> {exportData[0].activity_name}</p>
                    <p><strong>Focus Area:</strong> {exportData[0].focus_area}</p>
                    <p><strong>Status:</strong> {exportData[0].status}</p>
                    <p><strong>Progress:</strong> {exportData[0].progress}%</p>
                    <p><strong>Budget:</strong> KES {exportData[0].budget_allocated.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => { setExportFormat('csv'); handleExport() }}>
              <Sheet className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline" onClick={() => { setExportFormat('json'); handleExport() }}>
              <FileText className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>
            <Button variant="outline" onClick={() => { setExportFormat('pdf'); handleExport() }}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate PDF Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}