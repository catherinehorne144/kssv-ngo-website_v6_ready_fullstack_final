"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Sheet, BarChart3, CheckCircle, AlertCircle, Eye } from "lucide-react"
import type { Workplan } from '@/lib/types/workplan'

interface ExportManagerProps {
  workplans: Workplan[]
  selectedWorkplanId?: string
}

export function ExportManager({ workplans, selectedWorkplanId }: ExportManagerProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv')
  const [exportScope, setExportScope] = useState<'all' | 'selected'>('all')
  const [isExporting, setIsExporting] = useState(false)
  const [lastExport, setLastExport] = useState<{ format: string; count: number; timestamp?: Date } | null>(null)

  const exportData = exportScope === 'selected' && selectedWorkplanId 
    ? workplans.filter(w => w.id === selectedWorkplanId)
    : workplans

  const handleExport = async () => {
    if (exportData.length === 0) {
      alert('No data available to export')
      return
    }

    setIsExporting(true)
    
    try {
      switch (exportFormat) {
        case 'csv':
          await exportToCSV()
          break
        case 'json':
          await exportToJSON()
          break
        case 'pdf':
          await exportToPDF()
          break
      }
      
      setLastExport({
        format: exportFormat.toUpperCase(),
        count: exportData.length,
        timestamp: new Date()
      })
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToCSV = () => {
    return new Promise<void>((resolve) => {
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

      downloadFile(csvContent, `workplans-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
      resolve()
    })
  }

  const exportToJSON = () => {
    return new Promise<void>((resolve) => {
      const jsonContent = JSON.stringify(exportData, null, 2)
      downloadFile(jsonContent, `workplans-${new Date().toISOString().split('T')[0]}.json`, 'application/json')
      resolve()
    })
  }

  const exportToPDF = () => {
    return new Promise<void>((resolve) => {
      alert('PDF export would open print dialog. For full PDF generation, implement a PDF library.')
      window.print()
      resolve()
    })
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

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv': return <Sheet className="h-5 w-5" />
      case 'json': return <FileText className="h-5 w-5" />
      case 'pdf': return <BarChart3 className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'csv': return 'from-green-500 to-emerald-600'
      case 'json': return 'from-blue-500 to-cyan-600'
      case 'pdf': return 'from-red-500 to-orange-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Workplans</p>
                <h3 className="text-2xl font-bold text-blue-900">{workplans.length}</h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Available for Export</p>
                <h3 className="text-2xl font-bold text-green-900">{exportData.length}</h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Selected Format</p>
                <h3 className="text-2xl font-bold text-purple-900 uppercase">{exportFormat}</h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                {getFormatIcon(exportFormat)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Export Settings
            </CardTitle>
            <CardDescription>
              Configure your export preferences and format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700">Export Format</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'csv' as const, label: 'CSV', icon: Sheet, description: 'Spreadsheet format' },
                  { value: 'json' as const, label: 'JSON', icon: FileText, description: 'Structured data' },
                  { value: 'pdf' as const, label: 'PDF', icon: BarChart3, description: 'Printable report' }
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setExportFormat(format.value)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      exportFormat === format.value
                        ? `border-blue-500 bg-gradient-to-r ${getFormatColor(format.value)} text-white shadow-lg`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <format.icon className="h-6 w-6" />
                      <span className="font-semibold text-sm">{format.label}</span>
                      <span className="text-xs opacity-80">{format.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Scope Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Export Scope</label>
              <Select value={exportScope} onValueChange={(value: 'all' | 'selected') => setExportScope(value)}>
                <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-300">
                  <SelectValue placeholder="Select export scope" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-0 shadow-xl">
                  <SelectItem value="all" className="rounded-lg py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <div>
                        <div className="font-medium">All Workplans</div>
                        <div className="text-sm text-gray-600">{workplans.length} records available</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem 
                    value="selected" 
                    className="rounded-lg py-3"
                    disabled={!selectedWorkplanId}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <div>
                        <div className="font-medium">Selected Workplan</div>
                        <div className="text-sm text-gray-600">
                          {selectedWorkplanId ? '1 record available' : 'No workplan selected'}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {!selectedWorkplanId && exportScope === 'selected' && (
                <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  Select a workplan from the Workplans tab to enable this option
                </div>
              )}
            </div>

            {/* Export Button */}
            <Button 
              onClick={handleExport} 
              disabled={isExporting || exportData.length === 0 || (exportScope === 'selected' && !selectedWorkplanId)}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              {isExporting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting {exportData.length} records...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5" />
                  Export {exportData.length} Records as {exportFormat.toUpperCase()}
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Export Preview & History */}
        <div className="space-y-6">
          {/* Preview Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Export Preview
              </CardTitle>
              <CardDescription>
                Preview of the data that will be exported
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="font-medium text-gray-600">Total Records:</span>
                  <div className="font-semibold text-gray-900">{exportData.length}</div>
                </div>
                <div className="space-y-1">
                  <span className="font-medium text-gray-600">File Format:</span>
                  <Badge variant="secondary" className="uppercase font-mono">
                    {exportFormat}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="font-medium text-gray-600">Scope:</span>
                  <div className="font-semibold text-gray-900 capitalize">{exportScope}</div>
                </div>
                <div className="space-y-1">
                  <span className="font-medium text-gray-600">File Size:</span>
                  <div className="font-semibold text-gray-900">~{(exportData.length * 0.5).toFixed(1)} KB</div>
                </div>
              </div>
              
              {exportData.length > 0 && (
                <div className="border-2 border-gray-100 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-700">Sample Data</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Activity:</span>
                      <span className="font-medium text-gray-900 truncate max-w-[200px]">
                        {exportData[0].activity_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Focus Area:</span>
                      <span className="font-medium text-gray-900">{exportData[0].focus_area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge 
                        variant="outline" 
                        className={
                          exportData[0].status === 'completed' ? 'bg-green-100 text-green-800' :
                          exportData[0].status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {exportData[0].status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium text-gray-900">
                        KES {exportData[0].budget_allocated.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Last Export Card */}
          {lastExport && (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Last Export Successful</h3>
                    <p className="text-sm text-green-700">
                      {lastExport.timestamp?.toLocaleTimeString()} • {lastExport.timestamp?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Format:</span>
                    <div className="font-semibold text-green-900">{lastExport.format}</div>
                  </div>
                  <div>
                    <span className="text-green-700">Records:</span>
                    <div className="font-semibold text-green-900">{lastExport.count}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Export Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Quick Export Actions
          </CardTitle>
          <CardDescription>
            One-click exports for common use cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => { setExportFormat('csv'); handleExport(); }}
              disabled={isExporting || exportData.length === 0}
              className="h-16 rounded-xl border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <Sheet className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <div className="font-semibold text-green-800">Export as CSV</div>
                  <div className="text-xs text-green-600">For spreadsheets</div>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              onClick={() => { setExportFormat('json'); handleExport(); }}
              disabled={isExporting || exportData.length === 0}
              className="h-16 rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-semibold text-blue-800">Export as JSON</div>
                  <div className="text-xs text-blue-600">For APIs & apps</div>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              onClick={() => { setExportFormat('pdf'); handleExport(); }}
              disabled={isExporting || exportData.length === 0}
              className="h-16 rounded-xl border-2 border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-red-600" />
                <div className="text-left">
                  <div className="font-semibold text-red-800">Generate PDF</div>
                  <div className="text-xs text-red-600">For reports</div>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
