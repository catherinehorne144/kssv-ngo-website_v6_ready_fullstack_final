'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, AlertTriangle, Activity, FileText, TrendingUp } from 'lucide-react'

export function CaseManagementDashboard() {
  // Mock stats - in real app, fetch from API
  const stats = {
    totalCases: 24,
    activeCases: 18,
    highRiskCases: 3,
    servicesThisMonth: 47,
    pendingAssessments: 6
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-2">Total Cases</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.totalCases}</h3>
                  <p className="text-xs text-green-600 mt-1">
                    +{stats.activeCases} active
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-red-50 border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 mb-2">High Risk Cases</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.highRiskCases}</h3>
                  <p className="text-xs text-red-600 mt-1">
                    Needs immediate attention
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-2">Services This Month</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.servicesThisMonth}</h3>
                  <p className="text-xs text-green-600 mt-1">
                    Support provided
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-2">Pending Assessments</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.pendingAssessments}</h3>
                  <p className="text-xs text-purple-600 mt-1">
                    Need evaluation
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                asChild
                className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4"
              >
                <a href="/admin/case-management/register">
                  <Users className="w-5 h-5 mr-2" />
                  View All Cases
                </a>
              </Button>
              
              <Button 
                asChild
                className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4"
              >
                <a href="/admin/case-management/register/new">
                  <FileText className="w-5 h-5 mr-2" />
                  Register New Case
                </a>
              </Button>
              
              <Button 
                asChild
                className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4"
              >
                <a href="/admin/case-management/assessment">
                  <Activity className="w-5 h-5 mr-2" />
                  Manage Assessments
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle>Case Management Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome to Case Management
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Track survivor cases, conduct assessments, and manage services in one centralized system.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                <Button asChild variant="outline" className="rounded-xl">
                  <a href="/admin/case-management/register">
                    View Case Register
                  </a>
                </Button>
                <Button asChild className="rounded-xl">
                  <a href="/admin/case-management/register/new">
                    Register New Case
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}