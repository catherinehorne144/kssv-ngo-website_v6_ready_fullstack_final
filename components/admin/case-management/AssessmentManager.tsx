'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Plus } from 'lucide-react'

export function AssessmentManager() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Assessments Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Assessments Management
              </h3>
              <p className="text-gray-600 mb-6">
                Comprehensive assessment tools coming soon...
              </p>
              <Button className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Create Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}