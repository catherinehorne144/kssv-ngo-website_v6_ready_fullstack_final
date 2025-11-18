"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import type { Workplan } from '@/lib/types/workplan'

interface WorkplanAnalyticsProps {
  workplans: Workplan[]
  selectedWorkplanId?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']

export function WorkplanAnalytics({ workplans, selectedWorkplanId }: WorkplanAnalyticsProps) {
  // Calculate all analytics data
  const statusData = [
    { name: 'Planned', value: workplans.filter(w => w.status === 'planned').length, color: '#3B82F6' },
    { name: 'In Progress', value: workplans.filter(w => w.status === 'in-progress').length, color: '#F59E0B' },
    { name: 'Completed', value: workplans.filter(w => w.status === 'completed').length, color: '#10B981' }
  ]

  const focusAreaData = Object.entries(
    workplans.reduce((acc, workplan) => {
      acc[workplan.focus_area] = (acc[workplan.focus_area] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const budgetByFocusArea = Object.entries(
    workplans.reduce((acc, workplan) => {
      acc[workplan.focus_area] = (acc[workplan.focus_area] || 0) + (workplan.budget_allocated || 0)
      return acc
    }, {} as Record<string, number>)
  ).map(([name, budget]) => ({ name, budget }))

  const progressData = [
    { range: '0-25%', count: workplans.filter(w => (w.progress || 0) <= 25).length, color: '#EF4444' },
    { range: '26-50%', count: workplans.filter(w => (w.progress || 0) > 25 && (w.progress || 0) <= 50).length, color: '#F59E0B' },
    { range: '51-75%', count: workplans.filter(w => (w.progress || 0) > 50 && (w.progress || 0) <= 75).length, color: '#3B82F6' },
    { range: '76-100%', count: workplans.filter(w => (w.progress || 0) > 75).length, color: '#10B981' }
  ]

  // NEW: Quarterly Analysis
  const quarterlyData = Object.entries(
    workplans.reduce((acc, workplan) => {
      const quarter = workplan.quarter || 'Not Set'
      acc[quarter] = (acc[quarter] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([quarter, count]) => ({ quarter, count }))

  const quarterlyBudget = Object.entries(
    workplans.reduce((acc, workplan) => {
      const quarter = workplan.quarter || 'Not Set'
      acc[quarter] = (acc[quarter] || 0) + (workplan.budget_allocated || 0)
      return acc
    }, {} as Record<string, number>)
  ).map(([quarter, budget]) => ({ quarter, budget }))

  // NEW: Resource Person Performance
  const resourcePerformance = Object.entries(
    workplans.reduce((acc, workplan) => {
      const person = workplan.resource_person || 'Unassigned'
      if (!acc[person]) {
        acc[person] = { total: 0, completed: 0, totalBudget: 0, totalProgress: 0 }
      }
      acc[person].total++
      acc[person].totalBudget += workplan.budget_allocated || 0
      acc[person].totalProgress += workplan.progress || 0
      if (workplan.status === 'completed') {
        acc[person].completed++
      }
      return acc
    }, {} as Record<string, { total: number; completed: number; totalBudget: number; totalProgress: number }>)
  ).map(([person, data]) => ({
    person,
    total: data.total,
    completed: data.completed,
    completionRate: Math.round((data.completed / data.total) * 100),
    avgProgress: Math.round(data.totalProgress / data.total),
    totalBudget: data.totalBudget
  }))

  // NEW: Timeline Analysis
  const timelineAnalysis = [
    { type: 'Monthly', count: workplans.filter(w => w.timeline_text?.toLowerCase().includes('monthly')).length, color: '#3B82F6' },
    { type: 'Quarterly', count: workplans.filter(w => w.timeline_text?.toLowerCase().includes('q') || w.quarter).length, color: '#10B981' },
    { type: 'Case by Case', count: workplans.filter(w => w.timeline_text?.toLowerCase().includes('case')).length, color: '#F59E0B' },
    { type: 'Specific Dates', count: workplans.filter(w => 
      w.timeline_text && 
      !w.timeline_text.toLowerCase().includes('monthly') &&
      !w.timeline_text.toLowerCase().includes('q') &&
      !w.timeline_text.toLowerCase().includes('case')
    ).length, color: '#EF4444' }
  ]

  // Calculate comprehensive statistics
  const totalBudget = workplans.reduce((sum, w) => sum + (w.budget_allocated || 0), 0)
  const avgProgress = workplans.length > 0 
    ? Math.round(workplans.reduce((sum, w) => sum + (w.progress || 0), 0) / workplans.length) 
    : 0
  const completionRate = workplans.length > 0 
    ? Math.round((workplans.filter(w => w.status === 'completed').length / workplans.length) * 100) 
    : 0
  const activeWorkplans = workplans.filter(w => w.status === 'in-progress').length
  const budgetUtilization = totalBudget > 0 
    ? Math.round((workplans.reduce((sum, w) => sum + ((w.budget_allocated || 0) * (w.progress || 0)) / 100, 0) / totalBudget) * 100)
    : 0

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Budget') || entry.name.includes('KES') ? `KES ${Number(entry.value).toLocaleString()}` : entry.value}
              {entry.name.includes('Rate') || entry.name.includes('Progress') ? '%' : ''}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (workplans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-xl rounded-3xl">
          <CardContent className="py-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BarChart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Data Available</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-lg">
              Create some workplans to see beautiful analytics and insights about your programs.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Summary Stats with Beautiful Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Workplans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{workplans.length}</div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">KES {totalBudget.toLocaleString()}</div>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min(100, budgetUtilization)}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{avgProgress}%</div>
            <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${avgProgress}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{completionRate}%</div>
            <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${completionRate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Active Workplans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{activeWorkplans}</div>
            <div className="w-full bg-red-200 rounded-full h-2 mt-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: `${Math.min(100, (activeWorkplans / workplans.length) * 100)}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900">{budgetUtilization}%</div>
            <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${budgetUtilization}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Workplan Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Focus Area Distribution */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Workplans by Focus Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={focusAreaData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                >
                  {focusAreaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Budget and Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budget Allocation */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Budget Allocation by Focus Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetByFocusArea} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any) => [`KES ${Number(value).toLocaleString()}`, 'Budget']}
                  content={<CustomTooltip />}
                />
                <Bar 
                  dataKey="budget" 
                  fill="#00C49F" 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                >
                  {budgetByFocusArea.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progress Distribution */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Progress Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quarterly Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Workplans by Quarter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="#8884D8" 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
              Budget by Quarter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyBudget} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any) => [`KES ${Number(value).toLocaleString()}`, 'Budget']}
                  content={<CustomTooltip />}
                />
                <Bar 
                  dataKey="budget" 
                  fill="#82CA9D" 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resource Performance */}
      {resourcePerformance.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Resource Person Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={resourcePerformance} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="person" 
                  width={80} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'completionRate' || name === 'avgProgress') return [`${value}%`, name]
                    if (name === 'totalBudget') return [`KES ${Number(value).toLocaleString()}`, 'Total Budget']
                    return [value, name]
                  }}
                  content={<CustomTooltip />}
                />
                <Legend />
                <Bar 
                  dataKey="completionRate" 
                  fill="#0088FE" 
                  name="Completion Rate" 
                  radius={[0, 4, 4, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
                <Bar 
                  dataKey="avgProgress" 
                  fill="#00C49F" 
                  name="Avg Progress" 
                  radius={[0, 4, 4, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
