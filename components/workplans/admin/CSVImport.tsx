"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface CSVImportProps {
  onImportComplete: () => void
}

export function CSVImport({ onImportComplete }: CSVImportProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    message: string
    count?: number
  } | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setImportResult({
        success: false,
        message: 'Please upload a CSV file'
      })
      return
    }

    setIsImporting(true)
    setImportResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/workplans/import', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setImportResult({
          success: true,
          message: result.message,
          count: result.imported?.length
        })
        onImportComplete()
      } else {
        setImportResult({
          success: false,
          message: result.error || 'Import failed'
        })
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Failed to upload file'
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handlePasteCSV = async () => {
    try {
      const csvText = await navigator.clipboard.readText()
      if (!csvText.trim()) {
        setImportResult({
          success: false,
          message: 'No CSV data found in clipboard'
        })
        return
      }

      setIsImporting(true)
      setImportResult(null)

      const response = await fetch('/api/workplans', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/csv',
        },
        body: csvText,
      })

      const result = await response.json()

      if (response.ok) {
        setImportResult({
          success: true,
          message: result.message,
          count: result.imported?.length
        })
        onImportComplete()
      } else {
        setImportResult({
          success: false,
          message: result.error || 'Import failed'
        })
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Failed to import from clipboard'
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Workplans from CSV
        </CardTitle>
        <CardDescription>
          Bulk import workplans using CSV data. Use the provided CSV format.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Upload CSV File</label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              Drag and drop your CSV file here, or click to browse
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isImporting}
              className="hidden"
              id="csv-upload"
            />
            <Button 
              asChild 
              variant="outline" 
              disabled={isImporting}
            >
              <label htmlFor="csv-upload">
                {isImporting ? 'Importing...' : 'Choose CSV File'}
              </label>
            </Button>
          </div>
        </div>

        {/* Or Paste CSV */}
        <div className="text-center text-muted-foreground">or</div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Paste CSV Data</label>
          <Button 
            variant="outline" 
            onClick={handlePasteCSV}
            disabled={isImporting}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? 'Importing from Clipboard...' : 'Paste CSV from Clipboard'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Copy your CSV data and click to import
          </p>
        </div>

        {/* Import Result */}
        {importResult && (
          <div className={`p-3 rounded-lg flex items-center gap-3 ${
            importResult.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {importResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className={`text-sm font-medium ${
                importResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {importResult.message}
              </p>
              {importResult.count !== undefined && (
                <p className="text-sm text-green-700">
                  Imported {importResult.count} workplans
                </p>
              )}
            </div>
          </div>
        )}

        {/* CSV Format Info */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">Expected CSV Format:</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Required columns:</strong> focus_area, activity_name, timeline_text, tasks_description</p>
            <p><strong>Optional columns:</strong> quarter, target, budget_allocated, output, outcome, kpi, etc.</p>
            <p><strong>Status values:</strong> planned, in-progress, completed</p>
            <p><strong>Boolean values:</strong> true/false for public_visible</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}