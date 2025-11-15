// [file name]: components/programs/admin/ProgramAnalytics.tsx
// [file content begin]
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress, SegmentedProgress } from '@/components/ui/progress'
import { MetricCard, ProgressMetricCard } from '@/components/ui/metric-card'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ProgramWithDetails } from '@/lib/types/program'

interface ProgramAnalyticsProps {
  programs: ProgramWithDetails[]
  selectedProgramId?: string
}

interface AnalyticsData {
  overview: {
    total_programs: number
    overall_completion: number
    budget_utilization_rate: number
    total_beneficiaries: number
  }
  task_performance: {
    on_track: number
    behind: number
    at_risk: number
    completed: number
  }
  focus_area_performance: {
    area: string
    completion_rate: number
    budget_utilization: number
    task_success: number
  }[]
  common_challenges: {
    challenge: string
    frequency: number
    impact: 'low' | 'medium' | 'high'
  }[]
  risk_analysis: {
    risk_type: string
    probability: number
    severity: number
    mitigation_effectiveness: number
  }[]
  trends: {
    period: string
    completion_rate: number
    budget_utilization: number
    beneficiary_reach: number
  }[]
}

export function ProgramAnalytics({ programs, selectedProgramId }: ProgramAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('quarter')
  const [focusAreaFilter, setFocusAreaFilter] = useState<string>('all')

  useEffect(() => {
    loadAnalytics()
  }, [programs, timeRange, focusAreaFilter])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedProgramId && selectedProgramId !== 'all') {
        params.append('programId', selectedProgramId)
      }
      if (focusAreaFilter !== 'all') {
        params.append('focusArea', focusAreaFilter)
      }
      params.append('timeRange', timeRange)

      const response = await fetch(`/api/analytics?${params}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !analyticsData) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <BarChart3 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading analytics...</p>
        </div>
      </div>
    )
  }

  const { 
    overview, 
    task_performance, 
    focus_area_performance, 
    common_challenges, 
    risk_analysis,
    trends 
  } = analyticsData

  const totalTasks = Object.values(task_performance).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={timeRange} onValueChange={(value: 'month' | 'quarter' | 'year') => setTimeRange(value)}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={focusAreaFilter} onValueChange={setFocusAreaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Focus Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Focus Areas</SelectItem>
                  <SelectItem value="GBV Management">GBV Management</SelectItem>
                  <SelectItem value="Survivor Empowerment">Survivor Empowerment</SelectItem>
                  <SelectItem value="Institutional Development">Institutional Development</SelectItem>
                  <SelectItem value="SRH Rights">SRH Rights</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risks">Risks & Challenges</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Overall Completion"
              value={`${overview.overall_completion}%`}
              description="Program completion rate"
              icon={<Target className="h-4 w-4 text-muted-foreground" />}
              trend={{
                value: 5,
                isPositive: true,
                label: "+5% from last period"
              }}
            />

            <ProgressMetricCard
              title="Budget Utilization"
              current={overview.budget_utilization_rate}
              target={100}
              unit="%"
              description="KES 2.1M / 2.5M utilized"
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              showProgress={false}
            />

            <MetricCard
              title="Beneficiaries Reached"
              value={overview.total_beneficiaries.toLocaleString()}
              description="Total beneficiaries served"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              trend={{
                value: 12,
                isPositive: true,
                label: "+12% growth"
              }}
            />

            <MetricCard
              title="Active Programs"
              value={overview.total_programs}
              description="Programs in progress"
              icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          {/* Performance by Focus Area */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Focus Area</CardTitle>
              <CardDescription>
                Completion rates and budget utilization across focus areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {focus_area_performance.map((area) => (
                  <div key={area.area} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{area.area}</span>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Completion: {area.completion_rate}%</span>
                        <span>Budget: {area.budget_utilization}%</span>
                        <span>Success: {area.task_success}%</span>
                      </div>
                    </div>
                    <SegmentedProgress
                      segments={[
                        { value: area.completion_rate, color: '#10b981', label: 'Completion' },
                        { value: area.budget_utilization, color: '#3b82f6', label: 'Budget' },
                        { value: area.task_success, color: '#8b5cf6', label: 'Success' }
                      ]}
                      max={100}
                      showLabels={false}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Task Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Performance</CardTitle>
                <CardDescription>Current status of all tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Completed</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{task_performance.completed}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        ({Math.round((task_performance.completed / totalTasks) * 100)}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span>On Track</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{task_performance.on_track}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        ({Math.round((task_performance.on_track / totalTasks) * 100)}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span>Behind</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{task_performance.behind}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        ({Math.round((task_performance.behind / totalTasks) * 100)}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span>At Risk</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{task_performance.at_risk}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        ({Math.round((task_performance.at_risk / totalTasks) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
                <CardDescription>Key findings from M&E data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-800">Strong Performance</div>
                        <div className="text-green-700 text-sm">
                          GBV Management programs show 92% completion rate
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-800">Community Engagement</div>
                        <div className="text-blue-700 text-sm">
                          High beneficiary satisfaction reported in 85% of activities
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-yellow-800">Attention Needed</div>
                        <div className="text-yellow-700 text-sm">
                          Survivor Empowerment programs lagging at 75% completion
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Focus Area Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Focus Area Performance</CardTitle>
                <CardDescription>Detailed metrics by program area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {focus_area_performance.map((area) => (
                    <div key={area.area} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{area.area}</span>
                        <Badge variant={
                          area.completion_rate >= 85 ? "default" :
                          area.completion_rate >= 70 ? "secondary" : "outline"
                        }>
                          {area.completion_rate}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Budget Utilization</span>
                          <span>{area.budget_utilization}%</span>
                        </div>
                        <Progress value={area.budget_utilization} variant={
                          area.budget_utilization >= 85 ? "success" :
                          area.budget_utilization >= 70 ? "warning" : "danger"
                        } />

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Task Success Rate</span>
                          <span>{area.task_success}%</span>
                        </div>
                        <Progress value={area.task_success} variant={
                          area.task_success >= 85 ? "success" :
                          area.task_success >= 70 ? "warning" : "danger"
                        } />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Performance Details */}
            <Card>
              <CardHeader>
                <CardTitle>Task Performance Analysis</CardTitle>
                <CardDescription>Breakdown of task status and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Performance Distribution */}
                  <div>
                    <h4 className="font-medium mb-3">Task Status Distribution</h4>
                    <SegmentedProgress
                      segments={[
                        { value: task_performance.completed, color: '#10b981', label: 'Completed' },
                        { value: task_performance.on_track, color: '#3b82f6', label: 'On Track' },
                        { value: task_performance.behind, color: '#f59e0b', label: 'Behind' },
                        { value: task_performance.at_risk, color: '#ef4444', label: 'At Risk' }
                      ]}
                      max={totalTasks}
                      showLabels={true}
                    />
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{task_performance.completed}</div>
                      <div className="text-sm text-green-700">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{task_performance.on_track}</div>
                      <div className="text-sm text-blue-700">On Track</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{task_performance.behind}</div>
                      <div className="text-sm text-yellow-700">Behind</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{task_performance.at_risk}</div>
                      <div className="text-sm text-red-700">At Risk</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risks & Challenges Tab */}
        <TabsContent value="risks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Common Challenges */}
            <Card>
              <CardHeader>
                <CardTitle>Common Challenges</CardTitle>
                <CardDescription>Most frequently reported issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {common_challenges.map((challenge, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{challenge.challenge}</div>
                        <div className="text-sm text-muted-foreground">
                          Reported in {challenge.frequency}% of activities
                        </div>
                      </div>
                      <Badge variant={
                        challenge.impact === 'high' ? 'destructive' :
                        challenge.impact === 'medium' ? 'secondary' : 'outline'
                      }>
                        {challenge.impact} impact
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
                <CardDescription>Identified risks and mitigation effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {risk_analysis.map((risk, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="font-medium mb-2">{risk.risk_type}</div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-muted-foreground">Probability</div>
                          <div className="font-semibold">{risk.probability}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Severity</div>
                          <div className="font-semibold">{risk.severity}/10</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Mitigation</div>
                          <div className="font-semibold">{risk.mitigation_effectiveness}/10</div>
                        </div>
                      </div>
                      <Progress 
                        value={risk.mitigation_effectiveness * 10} 
                        variant={
                          risk.mitigation_effectiveness >= 8 ? "success" :
                          risk.mitigation_effectiveness >= 6 ? "warning" : "danger"
                        }
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* M&E Insights */}
          <Card>
            <CardHeader>
              <CardTitle>M&E Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Success Factors</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Strong community engagement in GBV programs</li>
                    <li>• Effective stakeholder coordination</li>
                    <li>• Timely budget disbursement and utilization</li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Areas for Improvement</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Enhance monitoring of Survivor Empowerment programs</li>
                    <li>• Address weather-related disruptions in field activities</li>
                    <li>• Improve risk mitigation strategies for budget constraints</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Recommendations</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Scale successful GBV Management approaches to other areas</li>
                    <li>• Implement contingency planning for weather disruptions</li>
                    <li>• Strengthen M&E capacity for real-time tracking</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Key metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trends.map((trend, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{trend.period}</span>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Completion: {trend.completion_rate}%</span>
                        <span>Budget: {trend.budget_utilization}%</span>
                        <span>Beneficiaries: {trend.beneficiary_reach}</span>
                      </div>
                    </div>
                    <SegmentedProgress
                      segments={[
                        { value: trend.completion_rate, color: '#10b981', label: 'Completion' },
                        { value: trend.budget_utilization, color: '#3b82f6', label: 'Budget' },
                        { value: Math.min(100, trend.beneficiary_reach / 10), color: '#8b5cf6', label: 'Reach' }
                      ]}
                      max={100}
                      showLabels={false}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trend Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Completion Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+8%</div>
                <p className="text-xs text-muted-foreground">Improved over last period</p>
                <TrendingUp className="h-8 w-8 text-green-500 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Budget Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">+5%</div>
                <p className="text-xs text-muted-foreground">Better utilization</p>
                <TrendingUp className="h-8 w-8 text-blue-500 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Beneficiary Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">+15%</div>
                <p className="text-xs text-muted-foreground">Increased coverage</p>
                <TrendingUp className="h-8 w-8 text-purple-500 mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
// [file content end]