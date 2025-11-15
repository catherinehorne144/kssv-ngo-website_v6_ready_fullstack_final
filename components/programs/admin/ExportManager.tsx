// [file name]: components/programs/admin/ExportManager.tsx
// [file content begin - FIXED VERSION]
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, Sheet, FileSpreadsheet, Calendar, Filter, AlertCircle } from 'lucide-react'
import type { ExportConfig } from '@/lib/types/program'

interface ExportManagerProps {
  programs: any[]
  selectedProgramId?: string
}

export function ExportManager({ programs, selectedProgramId }: ExportManagerProps) {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    includeProgramDetails: true,
    includeActivities: true,
    includeTasks: true,
    includeMEData: true,
    includeAnalytics: true,
    format: 'csv',
    scope: 'current',
    programId: selectedProgramId
  })

  const [isExporting, setIsExporting] = useState(false)
  const [exportHistory, setExportHistory] = useState<any[]>([])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportConfig),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Export failed with status ${response.status}`)
      }

      const result = await response.json()
      
      // For CSV format, create download links
      if (exportConfig.format === 'csv' && result.files) {
        Object.entries(result.files).forEach(([filename, content]) => {
          const blob = new Blob([content as string], { type: 'text/csv' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        })
        
        // Add to export history
        setExportHistory(prev => [{
          id: Date.now(),
          timestamp: new Date().toISOString(),
          config: exportConfig,
          status: 'success',
          files: Object.keys(result.files)
        }, ...prev.slice(0, 4)])

        alert(`Export completed successfully! ${Object.keys(result.files).length} file(s) downloaded.`)
      } else {
        // Handle other formats or responses
        console.log('Export result:', result)
        alert(`Export completed: ${result.message || 'Check console for details'}`)
      }

    } catch (error) {
      console.error('Export error:', error)
      
      // Add to export history as failed
      setExportHistory(prev => [{
        id: Date.now(),
        timestamp: new Date().toISOString(),
        config: exportConfig,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, ...prev.slice(0, 4)])

      alert(error instanceof Error ? error.message : 'Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv': return <FileText className="h-4 w-4" />
      case 'excel': return <Sheet className="h-4 w-4" />
      case 'pdf': return <FileSpreadsheet className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getScopeLabel = (scope: string) => {
    switch (scope) {
      case 'current': return 'Current Program'
      case 'all': return 'All Programs'
      case 'dateRange': return 'Date Range'
      default: return scope
    }
  }

  const selectedProgram = programs.find(p => p.id === exportConfig.programId)

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Export Configuration</CardTitle>
          <CardDescription>
            Select what data to include and configure export options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Selection */}
          <div>
            <h3 className="text-lg font-medium mb-4">Data to Include</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="program-details"
                  checked={exportConfig.includeProgramDetails}
                  onCheckedChange={(checked) => 
                    setExportConfig(prev => ({ ...prev, includeProgramDetails: !!checked }))
                  }
                />
                <Label htmlFor="program-details" className="flex-1">
                  Program Details
                  <p className="text-sm text-muted-foreground">
                    Basic program information and metadata
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activities"
                  checked={exportConfig.includeActivities}
                  onCheckedChange={(checked) => 
                    setExportConfig(prev => ({ ...prev, includeActivities: !!checked }))
                  }
                />
                <Label htmlFor="activities" className="flex-1">
                  Activities
                  <p className="text-sm text-muted-foreground">
                    All activities with progress and budget data
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tasks"
                  checked={exportConfig.includeTasks}
                  onCheckedChange={(checked) => 
                    setExportConfig(prev => ({ ...prev, includeTasks: !!checked }))
                  }
                />
                <Label htmlFor="tasks" className="flex-1">
                  Tasks
                  <p className="text-sm text-muted-foreground">
                    Detailed task information and status
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="me-data"
                  checked={exportConfig.includeMEData}
                  onCheckedChange={(checked) => 
                    setExportConfig(prev => ({ ...prev, includeMEData: !!checked }))
                  }
                />
                <Label htmlFor="me-data" className="flex-1">
                  M&E Data
                  <p className="text-sm text-muted-foreground">
                    Evaluations, risks, and monitoring data
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analytics"
                  checked={exportConfig.includeAnalytics}
                  onCheckedChange={(checked) => 
                    setExportConfig(prev => ({ ...prev, includeAnalytics: !!checked }))
                  }
                />
                <Label htmlFor="analytics" className="flex-1">
                  Analytics
                  <p className="text-sm text-muted-foreground">
                    Performance metrics and insights
                  </p>
                </Label>
              </div>
            </div>
          </div>

          {/* Export Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Format Selection */}
            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select 
                value={exportConfig.format} 
                onValueChange={(value: 'csv' | 'excel' | 'pdf') =>
                  setExportConfig(prev => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    {getFormatIcon(exportConfig.format)}
                    <SelectValue placeholder="Select format" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CSV
                    </div>
                  </SelectItem>
                  <SelectItem value="excel" disabled>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sheet className="h-4 w-4" />
                      Excel (Coming Soon)
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf" disabled>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileSpreadsheet className="h-4 w-4" />
                      PDF (Coming Soon)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <AlertCircle className="h-3 w-3" />
                Only CSV format is currently available
              </div>
            </div>

            {/* Scope Selection */}
            <div className="space-y-2">
              <Label htmlFor="scope">Export Scope</Label>
              <Select 
                value={exportConfig.scope} 
                onValueChange={(value: 'current' | 'all' | 'dateRange') => {
                  const updates: Partial<ExportConfig> = { scope: value }
                  if (value !== 'dateRange') {
                    updates.startDate = undefined
                    updates.endDate = undefined
                  }
                  setExportConfig(prev => ({ ...prev, ...updates }))
                }}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Select scope" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Program</SelectItem>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="dateRange">Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Program Selection */}
            {exportConfig.scope === 'current' && (
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select 
                  value={exportConfig.programId} 
                  onValueChange={(value) =>
                    setExportConfig(prev => ({ ...prev, programId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Date Range */}
          {exportConfig.scope === 'dateRange' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={exportConfig.startDate || ''}
                  onChange={(e) => 
                    setExportConfig(prev => ({ ...prev, startDate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={exportConfig.endDate || ''}
                  onChange={(e) => 
                    setExportConfig(prev => ({ ...prev, endDate: e.target.value }))
                  }
                />
              </div>
            </div>
          )}

          {/* Export Summary */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3">Export Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Format:</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getFormatIcon(exportConfig.format)}
                    {exportConfig.format.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Scope:</span>
                  <span>{getScopeLabel(exportConfig.scope)}</span>
                </div>
                {exportConfig.scope === 'current' && selectedProgram && (
                  <div className="flex justify-between">
                    <span>Program:</span>
                    <span className="font-medium">{selectedProgram.name}</span>
                  </div>
                )}
                {exportConfig.scope === 'dateRange' && (
                  <div className="flex justify-between">
                    <span>Date Range:</span>
                    <span>
                      {exportConfig.startDate} to {exportConfig.endDate}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Data Sheets:</span>
                  <span>
                    {[
                      exportConfig.includeProgramDetails && 'Programs',
                      exportConfig.includeActivities && 'Activities',
                      exportConfig.includeTasks && 'Tasks',
                      exportConfig.includeMEData && 'M&E Data',
                      exportConfig.includeAnalytics && 'Analytics'
                    ].filter(Boolean).join(', ')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Button */}
          <Button 
            onClick={handleExport} 
            disabled={isExporting || exportConfig.format !== 'csv'}
            size="lg"
            className="w-full"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating Export...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {exportConfig.format === 'csv' ? 'Generate CSV Export' : 'Format Not Available'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Exports */}
      {exportHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Exports</CardTitle>
            <CardDescription>Your last 5 export operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportHistory.map((exportItem) => (
                <div key={exportItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFormatIcon(exportItem.config.format)}
                    <div>
                      <div className="font-medium">
                        {getScopeLabel(exportItem.config.scope)} Export
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(exportItem.timestamp).toLocaleString()}
                      </div>
                      {exportItem.files && (
                        <div className="text-xs text-muted-foreground">
                          {exportItem.files.length} file(s)
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant={exportItem.status === 'success' ? 'default' : 'destructive'}>
                    {exportItem.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Export Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span><strong>CSV Format:</strong> Currently available - best for data analysis in spreadsheet software</span>
            </div>
            <div className="flex items-start gap-2">
              <Sheet className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span><strong>Excel Format:</strong> Coming soon - will include multiple sheets with formatting</span>
            </div>
            <div className="flex items-start gap-2">
              <FileSpreadsheet className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span><strong>PDF Format:</strong> Coming soon - ideal for reports and presentations</span>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span><strong>Date Range:</strong> Export data from specific time periods for analysis</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
// [file content end]