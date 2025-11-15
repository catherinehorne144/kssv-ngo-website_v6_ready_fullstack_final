// [file name]: components/programs/admin/TaskMEWizardStep.tsx
// [file content begin]
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface TaskMEWizardStepProps {
  taskData: {
    name: string
    activity_timeline: string
  }
  onUpdate: (data: any) => void
}

export function TaskMEWizardStep({ taskData, onUpdate }: TaskMEWizardStepProps) {
  const [meData, setMeData] = useState({
    evaluation_criteria: '',
    risks: '',
    mitigation_measures: '',
    resource_person: '',
    learning_and_development: '',
    self_evaluation: '',
    notes: ''
  })

  const handleChange = (field: string, value: string) => {
    const newData = { ...meData, [field]: value }
    setMeData(newData)
    onUpdate(newData)
  }

  const riskExamples = [
    "Weather disruptions affecting field work",
    "Budget constraints limiting scope",
    "Staff availability during peak seasons",
    "Community engagement challenges",
    "Logistical delays in material delivery"
  ]

  const evaluationExamples = [
    "90% completion of scheduled activities",
    "80% beneficiary satisfaction rate", 
    "Timely delivery within 2-week window",
    "Quality standards met per checklist",
    "Stakeholder feedback incorporated"
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Task Monitoring & Evaluation
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Set up M&E framework for effective task tracking and evaluation
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Evaluation Criteria */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="evaluation_criteria" className="text-base">
                Evaluation Criteria
              </Label>
              <Badge variant="outline" className="text-xs">
                How success will be measured
              </Badge>
            </div>
            <Textarea
              id="evaluation_criteria"
              placeholder="Define clear, measurable criteria for evaluating task success..."
              rows={3}
              value={meData.evaluation_criteria}
              onChange={(e) => handleChange('evaluation_criteria', e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {evaluationExamples.map((example, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="text-xs cursor-pointer hover:bg-primary/10"
                  onClick={() => handleChange('evaluation_criteria', 
                    meData.evaluation_criteria 
                      ? `${meData.evaluation_criteria}; ${example}`
                      : example
                  )}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="risks" className="text-base">
                Potential Risks
              </Label>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Identify challenges
              </Badge>
            </div>
            <Textarea
              id="risks"
              placeholder="Identify potential risks and challenges that could impact task delivery..."
              rows={3}
              value={meData.risks}
              onChange={(e) => handleChange('risks', e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {riskExamples.map((example, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-red-50 text-red-700 border-red-200"
                  onClick={() => handleChange('risks', 
                    meData.risks 
                      ? `${meData.risks}; ${example}`
                      : example
                  )}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>

          {/* Mitigation Measures */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="mitigation_measures" className="text-base">
                Mitigation Measures
              </Label>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Risk prevention
              </Badge>
            </div>
            <Textarea
              id="mitigation_measures"
              placeholder="Describe strategies to mitigate identified risks..."
              rows={3}
              value={meData.mitigation_measures}
              onChange={(e) => handleChange('mitigation_measures', e.target.value)}
            />
            <div className="text-xs text-muted-foreground">
              Pro tip: Link each mitigation measure to specific risks identified above
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resource Person */}
            <div className="space-y-2">
              <Label htmlFor="resource_person">Resource Person</Label>
              <Input
                id="resource_person"
                placeholder="Person responsible for M&E"
                value={meData.resource_person}
                onChange={(e) => handleChange('resource_person', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Who will monitor and evaluate this task?
              </p>
            </div>

            {/* Learning & Development Focus */}
            <div className="space-y-2">
              <Label htmlFor="learning_and_development">Learning Focus</Label>
              <Select 
                value={meData.learning_and_development} 
                onValueChange={(value) => handleChange('learning_and_development', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select learning focus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="community-engagement">Community Engagement</SelectItem>
                  <SelectItem value="technical-skills">Technical Skills</SelectItem>
                  <SelectItem value="leadership">Leadership Development</SelectItem>
                  <SelectItem value="monitoring">Monitoring Techniques</SelectItem>
                  <SelectItem value="stakeholder-management">Stakeholder Management</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                What skills or knowledge will be developed?
              </p>
            </div>
          </div>

          {/* Self-Evaluation Framework */}
          <div className="space-y-3">
            <Label htmlFor="self_evaluation" className="text-base">
              Self-Evaluation Framework
            </Label>
            <Textarea
              id="self_evaluation"
              placeholder="Guidelines for team self-assessment and reflection..."
              rows={2}
              value={meData.self_evaluation}
              onChange={(e) => handleChange('self_evaluation', e.target.value)}
            />
            <div className="text-xs text-muted-foreground">
              Provide questions or criteria for the team to evaluate their own performance
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional M&E Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional monitoring requirements, reporting formats, or special considerations..."
              rows={2}
              value={meData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>

          {/* M&E Checklist Preview */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-blue-800 mb-3">M&E Checklist Preview</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Evaluation criteria defined: {meData.evaluation_criteria ? '✅' : '❌'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Risks identified: {meData.risks ? '✅' : '❌'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Mitigation measures planned: {meData.mitigation_measures ? '✅' : '❌'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Resource person assigned: {meData.resource_person ? '✅' : '❌'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
// [file content end]