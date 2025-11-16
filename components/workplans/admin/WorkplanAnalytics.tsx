"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import type { Workplan } from '@/lib/types/workplan'

interface WorkplanAnalyticsProps {
  workplans: Workplan[]
  selectedWorkplanId?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function WorkplanAnalytics({ workplans, selectedWorkplanId }: WorkplanAnalyticsProps) {
  // Calculate all analytics data
  const statusData = [
    { name: 'Planned', value: workplans.filter(w => w.status === 'planned').length },
    { name: 'In Progress', value: workplans.filter(w => w.status === 'in-progress').length },
    { name: 'Completed', value: workplans.filter(w => w.status === 'completed').length }
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
    { range: '0-25%', count: workplans.filter(w => (w.progress || 0) <= 25).length },
    { range: '26-50%', count: workplans.filter(w => (w.progress || 0) > 25 && (w.progress || 0) <= 50).length },
    { range: '51-75%', count: workplans.filter(w => (w.progress || 0) > 50 && (w.progress || 0) <= 75).length },
    { range: '76-100%', count: workplans.filter(w => (w.progress || 0) > 75).length }
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
    { type: 'Monthly', count: workplans.filter(w => w.timeline_text?.toLowerCase().includes('monthly')).length },
    { type: 'Quarterly', count: workplans.filter(w => w.timeline_text?.toLowerCase().includes('q') || w.quarter).length },
    { type: 'Case by Case', count: workplans.filter(w => w.timeline_text?.toLowerCase().includes('case')).length },
    { type: 'Specific Dates', count: workplans.filter(w => 
      w.timeline_text && 
      !w.timeline_text.toLowerCase().includes('monthly') &&
      !w.timeline_text.toLowerCase().includes('q') &&
      !w.timeline_text.toLowerCase().includes('case')
    ).length }
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

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Workplans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workplans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalBudget.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Workplans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWorkplans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetUtilization}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Workplan Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {statusData.map((status, index) => (
                <div key={status.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{status.name}: {status.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Focus Area Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Workplans by Focus Area</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={focusAreaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation by Focus Area</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={budgetByFocusArea}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [`KES ${Number(value).toLocaleString()}`, 'Budget']} />
                <Bar dataKey="budget" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progress Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* NEW: Quarterly Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workplans by Quarter</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884D8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget by Quarter</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={quarterlyBudget}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip formatter={(value) => [`KES ${Number(value).toLocaleString()}`, 'Budget']} />
                <Bar dataKey="budget" fill="#82CA9D" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* NEW: Resource Performance */}
      {resourcePerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resource Person Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resourcePerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="person" width={100} />
                <Tooltip formatter={(value, name) => {
                  if (name === 'completionRate' || name === 'avgProgress') return [`${value}%`, name]
                  if (name === 'totalBudget') return [`KES ${Number(value).toLocaleString()}`, 'Total Budget']
                  return [value, name]
                }} />
                <Bar dataKey="completionRate" fill="#0088FE" name="Completion Rate" />
                <Bar dataKey="avgProgress" fill="#00C49F" name="Avg Progress" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}