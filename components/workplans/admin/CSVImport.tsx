"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, CheckCircle, AlertCircle, Clipboard, Download, X, CloudUpload } from 'lucide-react'

interface CSVImportProps {
  onImportComplete: () => void
}

export function CSVImport({ onImportComplete }: CSVImportProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    message: string
    count?: number
    errors?: string[]
  } | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    await processFileUpload(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      await processFileUpload(file)
    }
  }

  const processFileUpload = async (file: File) => {
    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setImportResult({
        success: false,
        message: 'Please upload a CSV file',
        errors: ['Invalid file type. Only CSV files are supported.']
      })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setImportResult({
        success: false,
        message: 'File too large',
        errors: ['File size exceeds 5MB limit.']
      })
      return
    }

    setIsImporting(true)
    setImportResult(null)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/workplans/import', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()

      if (response.ok) {
        setImportResult({
          success: true,
          message: result.message,
          count: result.imported?.length
        })
        setTimeout(() => {
          onImportComplete()
        }, 1500)
      } else {
        setImportResult({
          success: false,
          message: result.error || 'Import failed',
          errors: result.errors || ['Unknown error occurred']
        })
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Failed to upload file',
        errors: ['Network error or server unavailable']
      })
    } finally {
      setIsImporting(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  const handlePasteCSV = async () => {
    try {
      const csvText = await navigator.clipboard.readText()
      if (!csvText.trim()) {
        setImportResult({
          success: false,
          message: 'No CSV data found in clipboard',
          errors: ['Clipboard is empty or does not contain CSV data']
        })
        return
      }

      setIsImporting(true)
      setImportResult(null)
      setUploadProgress(50)

      const response = await fetch('/api/workplans', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/csv',
        },
        body: csvText,
      })

      setUploadProgress(100)

      const result = await response.json()

      if (response.ok) {
        setImportResult({
          success: true,
          message: result.message,
          count: result.imported?.length
        })
        setTimeout(() => {
          onImportComplete()
        }, 1500)
      } else {
        setImportResult({
          success: false,
          message: result.error || 'Import failed',
          errors: result.errors || ['Unknown error occurred']
        })
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Failed to import from clipboard',
        errors: ['Clipboard access denied or network error']
      })
    } finally {
      setIsImporting(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  const downloadTemplate = () => {
    const templateHeaders = [
      'focus_area',
      'activity_name', 
      'timeline_text',
      'quarter',
      'tasks_description',
      'target',
      'budget_allocated',
      'resource_person',
      'status',
      'progress',
      'public_visible'
    ].join(',')

    const exampleData = [
      templateHeaders,
      'Comprehensive Gender-based Violence GBV Management,Monthly group saving,Monthly,Q1,Meeting at specified time...,50 beneficiaries,50000,Claris,planned,0,true',
      'Survivors Livelihood Support Services,Training of support groups,Quarterly,Q2,Identify training needs...,20 participants,75000,Leah,in-progress,50,true',
      'Institutional Development and Growth,Monthly member meetings,Monthly,Q3,Regular organizational meetings...,All members,25000,Equator,completed,100,true'
    ].join('\n')

    const blob = new Blob([exampleData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'workplans-template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearResult = () => {
    setImportResult(null)
  }

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Import Methods</p>
                <h3 className="text-2xl font-bold text-blue-900">2 Options</h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <CloudUpload className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Supported Format</p>
                <h3 className="text-2xl font-bold text-green-900">CSV Only</h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* File Upload Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Upload CSV File
            </CardTitle>
            <CardDescription>
              Drag and drop your CSV file or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drag and Drop Area */}
            <div
              className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                isDragging
                  ? 'border-blue-400 bg-blue-50 scale-105'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
              } ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isImporting && fileInputRef.current?.click()}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                  {isImporting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">
                    {isImporting ? 'Uploading File...' : 'Drop your CSV file here'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    or click to select from your computer
                  </p>
                </div>

                {isImporting && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2 bg-gray-200" />
                    <p className="text-xs text-gray-600">{uploadProgress}% uploaded</p>
                  </div>
                )}

                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  Max file size: 5MB
                </Badge>
              </div>
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isImporting}
              className="hidden"
              ref={fileInputRef}
            />

            {/* File Requirements */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                File Requirements
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• CSV format with UTF-8 encoding</li>
                <li>• First row must contain column headers</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Supported columns: focus_area, activity_name, timeline_text, etc.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Paste CSV Section */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Paste CSV Data
              </CardTitle>
              <CardDescription>
                Copy and paste CSV data directly from your clipboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                onClick={handlePasteCSV}
                disabled={isImporting}
                className="w-full h-14 rounded-xl border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  {isImporting ? (
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Clipboard className="w-5 h-5 text-green-600" />
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-green-800">
                      {isImporting ? 'Importing from Clipboard...' : 'Paste CSV from Clipboard'}
                    </div>
                    <div className="text-xs text-green-600">Copy your CSV data first</div>
                  </div>
                </div>
              </Button>

              {isImporting && uploadProgress > 0 && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2 bg-gray-200" />
                  <p className="text-xs text-gray-600 text-center">{uploadProgress}% processed</p>
                </div>
              )}

              {/* Download Template */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Need a Template?
                </h4>
                <p className="text-sm text-amber-800 mb-3">
                  Download our CSV template with example data and proper column formatting.
                </p>
                <Button 
                  variant="outline" 
                  onClick={downloadTemplate}
                  className="w-full h-10 rounded-lg border-amber-300 text-amber-700 hover:bg-amber-100"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CSV Format Guide */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-purple-900">
                CSV Format Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-purple-700">Required Columns:</span>
                  <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                    Required
                  </Badge>
                </div>
                <p className="text-xs text-purple-600">
                  focus_area, activity_name, timeline_text, tasks_description
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-purple-700">Optional Columns:</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                    Optional
                  </Badge>
                </div>
                <p className="text-xs text-purple-600">
                  quarter, target, budget_allocated, resource_person, status, progress, public_visible
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-purple-700">Status Values:</span>
                  <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                    planned, in-progress, completed
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-purple-700">Boolean Values:</span>
                  <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                    true/false
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Import Result */}
      {importResult && (
        <Card className={`border-0 shadow-xl rounded-3xl overflow-hidden ${
          importResult.success 
            ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200' 
            : 'bg-gradient-to-br from-red-50 to-orange-100 border-red-200'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  importResult.success 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {importResult.success ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <AlertCircle className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${
                    importResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {importResult.message}
                  </h3>
                  {importResult.count !== undefined && (
                    <p className="text-green-700 mt-1">
                      Successfully imported {importResult.count} workplan{importResult.count !== 1 ? 's' : ''}
                    </p>
                  )}
                  {importResult.errors && importResult.errors.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {importResult.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-700">
                          • {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearResult}
                className={`hover:bg-white/50 ${
                  importResult.success ? 'text-green-700' : 'text-red-700'
                }`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
