"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Eye, Trash2, CheckCircle, XCircle, Mail, Download, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { format } from "date-fns"

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

type BulkAction = {
  label: string
  action: (selectedIds: string[]) => void
  variant?: "default" | "destructive" | "outline" | "secondary"
  icon?: React.ComponentType
}

type FilterConfig = {
  key: string
  label: string
  type: "select" | "text" | "date"
  options?: { value: string; label: string }[]
}

type StatItem = {
  label: string
  value: number
  description?: string
  color?: string
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  onView?: (row: any) => void
  onDelete?: (row: any) => void
  onApprove?: (row: any) => void
  onReject?: (row: any) => void
  onEmail?: (row: any) => void
  onCustomAction?: (row: any) => void
  selectedRows?: string[]
  onSelectedRowsChange?: (rows: string[]) => void
  searchPlaceholder?: string
  
  // Enhanced features
  bulkActions?: BulkAction[]
  filters?: FilterConfig[]
  exportFilename?: string
  stats?: StatItem[]
  title?: string
  description?: string
  enableSearch?: boolean
  enableFilters?: boolean
  enableExport?: boolean
  enableStats?: boolean
  onCreate?: () => void
  createButtonLabel?: string
}

export function DataTable({
  data,
  columns,
  onView,
  onDelete,
  onApprove,
  onReject,
  onEmail,
  onCustomAction,
  selectedRows = [],
  onSelectedRowsChange,
  searchPlaceholder = "Search...",
  
  // Enhanced features
  bulkActions = [],
  filters = [],
  exportFilename = "export",
  stats = [],
  title,
  description,
  enableSearch = true,
  enableFilters = true,
  enableExport = true,
  enableStats = false,
  onCreate,
  createButtonLabel = "New Item",
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  const filteredData = data.filter((row) => {
    // Search filter
    const matchesSearch = !searchTerm || 
      Object.values(row || {}).some((value) =>
        String(value ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    // Custom filters
    const matchesFilters = filters.every(filter => {
      if (!filterValues[filter.key]) return true
      return String(row[filter.key] || "").toLowerCase() === filterValues[filter.key].toLowerCase()
    })
    
    return matchesSearch && matchesFilters
  })

  const handleRowSelect = (rowId: string, checked: boolean) => {
    if (checked) {
      onSelectedRowsChange?.([...selectedRows, rowId])
    } else {
      onSelectedRowsChange?.(selectedRows.filter(id => id !== rowId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedRowsChange?.(filteredData.map(row => row.id))
    } else {
      onSelectedRowsChange?.([])
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const exportToCSV = () => {
    const dataToExport = filteredData.length > 0 ? filteredData : data
    
    const headers = columns.map(col => col.label)
    const csvData = dataToExport.map(row => 
      columns.map(col => `"${String(row[col.key] ?? "").replace(/"/g, '""')}"`)
    )
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${exportFilename}-${format(new Date(), "yyyy-MM-dd")}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterValues({})
  }

  const hasFilters = searchTerm || Object.values(filterValues).some(value => value)
  const isAllSelected = filteredData.length > 0 && selectedRows.length === filteredData.length
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < filteredData.length

  return (
    <div className="space-y-6">
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      {/* Statistics Cards */}
      {enableStats && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className={`text-2xl font-bold ${
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'red' ? 'text-red-600' :
                    stat.color === 'yellow' ? 'text-yellow-600' :
                    stat.color === 'blue' ? 'text-blue-600' :
                    'text-foreground'
                  }`}
                >
                  {stat.value}
                </div>
                {stat.description && (
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            {enableSearch && (
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-64"
                />
              </div>
            )}

            {/* Filters */}
            {enableFilters && filters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <Select
                    key={filter.key}
                    value={filterValues[filter.key] || ""}
                    onValueChange={(value) => handleFilterChange(filter.key, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All {filter.label}</SelectItem>
                      {filter.options?.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {onCreate && (
                <Button onClick={onCreate} className="gap-2">
                  <Plus size={18} />
                  {createButtonLabel}
                </Button>
              )}
              {enableExport && (
                <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                </Badge>
              )}
              {filters.map(filter => 
                filterValues[filter.key] && filterValues[filter.key] !== "all" && (
                  <Badge key={filter.key} variant="outline" className="flex items-center gap-1">
                    {filter.label}: {filterValues[filter.key]}
                  </Badge>
                )
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                Clear all
              </Button>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (bulkActions.length > 0 || onDelete) && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-800">
                  {selectedRows.length} item{selectedRows.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex gap-2">
                  {/* Default bulk actions */}
                  {onApprove && (
                    <Button size="sm" onClick={() => selectedRows.forEach(id => onApprove({ id }))}>
                      Approve Selected
                    </Button>
                  )}
                  {onReject && (
                    <Button size="sm" variant="outline" onClick={() => selectedRows.forEach(id => onReject({ id }))}>
                      Reject Selected
                    </Button>
                  )}
                  
                  {/* Custom bulk actions */}
                  {bulkActions.map((action, index) => {
                    const IconComponent = action.icon
                    return (
                      <Button
                        key={index}
                        size="sm"
                        variant={action.variant || "default"}
                        onClick={() => action.action(selectedRows)}
                        className="flex items-center gap-1"
                      >
                        {IconComponent && <IconComponent size={14} />}
                        {action.label}
                      </Button>
                    )
                  })}
                  
                  {onDelete && (
                    <Button size="sm" variant="destructive" onClick={() => selectedRows.forEach(id => onDelete({ id }))}>
                      Delete Selected
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              {onSelectedRowsChange && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              {(onView || onDelete || onApprove || onReject || onEmail || onCustomAction) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={
                    columns.length + 
                    (onSelectedRowsChange ? 1 : 0) + 
                    ((onView || onDelete || onApprove || onReject || onEmail || onCustomAction) ? 1 : 0)
                  } 
                  className="text-center text-muted-foreground py-8"
                >
                  {hasFilters ? "No results match your filters" : "No data found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {onSelectedRowsChange && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onCheckedChange={(checked) => handleRowSelect(row.id, checked as boolean)}
                        aria-label={`Select ${row.name || row.organization_name || 'row'}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render 
                        ? column.render(row[column.key], row) 
                        : String(row[column.key] ?? "")
                      }
                    </TableCell>
                  ))}
                  {(onView || onDelete || onApprove || onReject || onEmail || onCustomAction) && (
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <div className="flex items-center justify-end gap-1">
                          {onView && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => onView(row)}>
                                  <Eye size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View details</TooltipContent>
                            </Tooltip>
                          )}
                          {onEmail && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onEmail(row)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Mail size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Send email</TooltipContent>
                            </Tooltip>
                          )}
                          {onApprove && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onApprove(row)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <CheckCircle size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Approve</TooltipContent>
                            </Tooltip>
                          )}
                          {onReject && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onReject(row)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <XCircle size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Reject</TooltipContent>
                            </Tooltip>
                          )}
                          {onCustomAction && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onCustomAction(row)}
                                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                >
                                  <Plus size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Custom Action</TooltipContent>
                            </Tooltip>
                          )}
                          {onDelete && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onDelete(row)}
                                  className="text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredData.length} of {data.length} items
          {hasFilters && " (filtered)"}
        </span>
        {selectedRows.length > 0 && (
          <span>{selectedRows.length} selected</span>
        )}
      </div>
    </div>
  )
}