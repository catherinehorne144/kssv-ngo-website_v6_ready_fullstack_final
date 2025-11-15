// [file name]: components/programs/admin/TaskMEPanel.tsx
// [file content begin]
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, Trash2, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import type { TaskEvaluation, RiskAssessment } from '@/lib/types/program'

interface TaskMEPanelProps {
  taskId: string
  taskName: string
  evaluations: TaskEvaluation[]
  risks: RiskAssessment[]
  onEvaluationSubmit?: (evaluation: Omit<TaskEvaluation, 'id' | 'created_at'>) => void
  onRiskSubmit?: (risk: Omit<RiskAssessment, 'id' | 'created_at'>) => void
  onRiskUpdate?: (riskId: string, updates: Partial<RiskAssessment>) => void
}

export function TaskMEPanel({ 
  taskId, 
  taskName, 
  evaluations = [], 
  risks = [], 
  onEvaluationSubmit, 
  onRiskSubmit,
  onRiskUpdate 
}: TaskMEPanelProps) {
  const [activeTab, setActiveTab] = useState<'evaluation' | 'risks' | 'insights'>('evaluation')
  
  // Evaluation form state
  const [evaluationForm, setEvaluationForm] = useState({
    progress_rating: 5,
    quality_rating: 5,
    challenges_encountered: '',
    success_factors: '',
    adjustments_made: '',
    lessons_learned: '',
    recommendations: '',
    evaluator_name: '',
    next_evaluation_date: ''
  })

  // Risk form state
  const [riskForm, setRiskForm] = useState({
    risk_description: '',
    probability: 'medium' as 'low' | 'medium' | 'high',
    impact: 'medium' as 'low' | 'medium' | 'high',
    mitigation_strategy: '',
    assigned_to: ''
  })

  const handleEvaluationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEvaluationSubmit?.({
      task_id: taskId,
      evaluation_date: new Date().toISOString(),
      ...evaluationForm,
      next_evaluation_date: evaluationForm.next_evaluation_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    })
    
    // Reset form
    setEvaluationForm({
      progress_rating: 5,
      quality_rating: 5,
      challenges_encountered: '',
      success_factors: '',
      adjustments_made: '',
      lessons_learned: '',
      recommendations: '',
      evaluator_name: '',
      next_evaluation_date: ''
    })
  }

  const handleRiskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRiskSubmit?.({
      task_id: taskId,
      ...riskForm,
      status: 'open'
    })
    
    // Reset form
    setRiskForm({
      risk_description: '',
      probability: 'medium',
      impact: 'medium',
      mitigation_strategy: '',
      assigned_to: ''
    })
  }

  const getRiskSeverity = (probability: string, impact: string) => {
    const scores = { low: 1, medium: 2, high: 3 }
    const total = scores[probability as keyof typeof scores] + scores[impact as keyof typeof scores]
    return total >= 5 ? 'high' : total >= 3 ? 'medium' : 'low'
  }

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const latestEvaluation = evaluations[0]
  const openRisks = risks.filter(risk => risk.status === 'open')
  const mitigatedRisks = risks.filter(risk => risk.status === 'mitigated')

  return (
    <div className="space-y-6">
      {/* Header with quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluations</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.length}</div>
            <p className="text-xs text-muted-foreground">
              {latestEvaluation ? `Last: ${new Date(latestEvaluation.evaluation_date).toLocaleDateString()}` : 'No evaluations'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openRisks.length}</div>
            <p className="text-xs text-muted-foreground">
              {mitigatedRisks.length} mitigated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {evaluations.length > 0 
                ? ((evaluations.reduce((sum, e) => sum + e.progress_rating, 0) / evaluations.length)).toFixed(1)
                : 'N/A'
              }/10
            </div>
            <p className="text-xs text-muted-foreground">
              Progress rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'evaluation' as const, name: 'Evaluation', count: evaluations.length },
            { id: 'risks' as const, name: 'Risk Assessment', count: risks.length },
            { id: 'insights' as const, name: 'Insights', count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium
                ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-gray-700'
                }
              `}
            >
              {tab.name}
              {tab.count > 0 && (
                <Badge variant="secondary" className="ml-2 rounded-full px-2 py-0 text-xs">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Evaluation Tab */}
      {activeTab === 'evaluation' && (
        <div className="space-y-6">
          {/* Evaluation Form */}
          <Card>
            <CardHeader>
              <CardTitle>New Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEvaluationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="progress_rating">Progress Rating (1-10)</Label>
                    <div className="space-y-2">
                      <Input
                        id="progress_rating"
                        type="range"
                        min="1"
                        max="10"
                        value={evaluationForm.progress_rating}
                        onChange={(e) => setEvaluationForm(prev => ({ ...prev, progress_rating: parseInt(e.target.value) }))}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1 - Poor</span>
                        <span className="font-medium">{evaluationForm.progress_rating}/10</span>
                        <span>10 - Excellent</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quality_rating">Quality Rating (1-10)</Label>
                    <div className="space-y-2">
                      <Input
                        id="quality_rating"
                        type="range"
                        min="1"
                        max="10"
                        value={evaluationForm.quality_rating}
                        onChange={(e) => setEvaluationForm(prev => ({ ...prev, quality_rating: parseInt(e.target.value) }))}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1 - Poor</span>
                        <span className="font-medium">{evaluationForm.quality_rating}/10</span>
                        <span>10 - Excellent</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evaluator_name">Evaluator Name</Label>
                    <Input
                      id="evaluator_name"
                      value={evaluationForm.evaluator_name}
                      onChange={(e) => setEvaluationForm(prev => ({ ...prev, evaluator_name: e.target.value }))}
                      placeholder="Enter evaluator name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="next_evaluation_date">Next Evaluation Date</Label>
                    <Input
                      id="next_evaluation_date"
                      type="date"
                      value={evaluationForm.next_evaluation_date}
                      onChange={(e) => setEvaluationForm(prev => ({ ...prev, next_evaluation_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenges_encountered">Challenges Encountered</Label>
                  <Textarea
                    id="challenges_encountered"
                    rows={3}
                    value={evaluationForm.challenges_encountered}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, challenges_encountered: e.target.value }))}
                    placeholder="Describe any challenges faced during task execution..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="success_factors">Success Factors</Label>
                  <Textarea
                    id="success_factors"
                    rows={2}
                    value={evaluationForm.success_factors}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, success_factors: e.target.value }))}
                    placeholder="What contributed to success?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adjustments_made">Adjustments Made</Label>
                  <Textarea
                    id="adjustments_made"
                    rows={2}
                    value={evaluationForm.adjustments_made}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, adjustments_made: e.target.value }))}
                    placeholder="Any adjustments or changes made?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lessons_learned">Lessons Learned</Label>
                  <Textarea
                    id="lessons_learned"
                    rows={2}
                    value={evaluationForm.lessons_learned}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, lessons_learned: e.target.value }))}
                    placeholder="Key lessons learned from this task..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommendations">Recommendations</Label>
                  <Textarea
                    id="recommendations"
                    rows={2}
                    value={evaluationForm.recommendations}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, recommendations: e.target.value }))}
                    placeholder="Recommendations for future improvements..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Evaluation
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Previous Evaluations */}
          {evaluations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Previous Evaluations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evaluations.map((evaluation) => (
                    <div key={evaluation.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">
                            Evaluation on {new Date(evaluation.evaluation_date).toLocaleDateString()}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            By {evaluation.evaluator_name}
                          </p>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div>
                            <span className="font-medium">Progress: </span>
                            <Badge variant="outline">{evaluation.progress_rating}/10</Badge>
                          </div>
                          <div>
                            <span className="font-medium">Quality: </span>
                            <Badge variant="outline">{evaluation.quality_rating}/10</Badge>
                          </div>
                        </div>
                      </div>
                      
                      {evaluation.challenges_encountered && (
                        <div className="mb-2">
                          <span className="font-medium text-sm">Challenges: </span>
                          <span className="text-sm text-muted-foreground">{evaluation.challenges_encountered}</span>
                        </div>
                      )}

                      {evaluation.lessons_learned && (
                        <div className="mb-2">
                          <span className="font-medium text-sm">Lessons: </span>
                          <span className="text-sm text-muted-foreground">{evaluation.lessons_learned}</span>
                        </div>
                      )}

                      {evaluation.recommendations && (
                        <div>
                          <span className="font-medium text-sm">Recommendations: </span>
                          <span className="text-sm text-muted-foreground">{evaluation.recommendations}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Risk Assessment Tab */}
      {activeTab === 'risks' && (
        <div className="space-y-6">
          {/* Risk Form */}
          <Card>
            <CardHeader>
              <CardTitle>New Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRiskSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="risk_description">Risk Description</Label>
                  <Textarea
                    id="risk_description"
                    rows={3}
                    value={riskForm.risk_description}
                    onChange={(e) => setRiskForm(prev => ({ ...prev, risk_description: e.target.value }))}
                    placeholder="Describe the potential risk..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="probability">Probability</Label>
                    <Select value={riskForm.probability} onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setRiskForm(prev => ({ ...prev, probability: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="impact">Impact</Label>
                    <Select value={riskForm.impact} onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setRiskForm(prev => ({ ...prev, impact: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assigned_to">Assigned To</Label>
                    <Input
                      id="assigned_to"
                      value={riskForm.assigned_to}
                      onChange={(e) => setRiskForm(prev => ({ ...prev, assigned_to: e.target.value }))}
                      placeholder="Person responsible"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Risk Severity</Label>
                    <div className="p-2 border rounded-lg bg-muted/30">
                      <Badge className={getRiskColor(getRiskSeverity(riskForm.probability, riskForm.impact))}>
                        {getRiskSeverity(riskForm.probability, riskForm.impact).toUpperCase()} RISK
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mitigation_strategy">Mitigation Strategy</Label>
                  <Textarea
                    id="mitigation_strategy"
                    rows={3}
                    value={riskForm.mitigation_strategy}
                    onChange={(e) => setRiskForm(prev => ({ ...prev, mitigation_strategy: e.target.value }))}
                    placeholder="Describe how this risk will be mitigated..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  Add Risk Assessment
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Risk List */}
          {risks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Risk Register</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {risks.map((risk) => {
                    const severity = getRiskSeverity(risk.probability, risk.impact)
                    return (
                      <div key={risk.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">{risk.risk_description}</h4>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">Probability: </span>
                                <Badge variant="outline">{risk.probability}</Badge>
                              </div>
                              <div>
                                <span className="font-medium">Impact: </span>
                                <Badge variant="outline">{risk.impact}</Badge>
                              </div>
                              <div>
                                <span className="font-medium">Severity: </span>
                                <Badge className={getRiskColor(severity)}>
                                  {severity}
                                </Badge>
                              </div>
                              {risk.assigned_to && (
                                <div>
                                  <span className="font-medium">Assigned: </span>
                                  <span>{risk.assigned_to}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Select 
                              value={risk.status} 
                              onValueChange={(value: 'open' | 'mitigated' | 'closed') => 
                                onRiskUpdate?.(risk.id, { status: value })
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="mitigated">Mitigated</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {risk.mitigation_strategy && (
                          <div>
                            <span className="font-medium text-sm">Mitigation: </span>
                            <span className="text-sm text-muted-foreground">{risk.mitigation_strategy}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <Card>
          <CardHeader>
            <CardTitle>M&E Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evaluations.length === 0 && risks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No M&E data available yet.</p>
                  <p className="text-sm">Start by adding evaluations and risk assessments to generate insights.</p>
                </div>
              ) : (
                <>
                  {/* Performance Trends */}
                  {evaluations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Performance Trends</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Average Progress Rating:</span>
                          <span className="font-medium">
                            {(evaluations.reduce((sum, e) => sum + e.progress_rating, 0) / evaluations.length).toFixed(1)}/10
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Average Quality Rating:</span>
                          <span className="font-medium">
                            {(evaluations.reduce((sum, e) => sum + e.quality_rating, 0) / evaluations.length).toFixed(1)}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Risk Analysis */}
                  {risks.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Risk Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Risks Identified:</span>
                          <span className="font-medium">{risks.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>High Severity Risks:</span>
                          <span className="font-medium text-red-600">
                            {risks.filter(r => getRiskSeverity(r.probability, r.impact) === 'high').length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Risks Mitigated:</span>
                          <span className="font-medium text-green-600">
                            {mitigatedRisks.length} of {risks.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Common Challenges */}
                  {evaluations.some(e => e.challenges_encountered) && (
                    <div>
                      <h4 className="font-semibold mb-2">Common Challenges</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {Array.from(new Set(evaluations.map(e => e.challenges_encountered).filter(Boolean))).slice(0, 3).map((challenge, index) => (
                          <div key={index}>• {challenge}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Lessons */}
                  {evaluations.some(e => e.lessons_learned) && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Lessons Learned</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {Array.from(new Set(evaluations.map(e => e.lessons_learned).filter(Boolean))).slice(0, 3).map((lesson, index) => (
                          <div key={index}>• {lesson}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
// [file content end]