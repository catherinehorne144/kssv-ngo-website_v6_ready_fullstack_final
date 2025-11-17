"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Save, FileText, Shield, BookOpen, Target } from 'lucide-react'
import type { MerlEntry, Workplan } from '@/lib/types/workplan'

interface MERLCardProps {
  workplan: Workplan
  isOpen: boolean
  onClose: () => void
  onSave: (merlData: MerlEntry) => void
}

export function MERLCard({ workplan, isOpen, onClose, onSave }: MERLCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [existingMerl, setExistingMerl] = useState<MerlEntry | null>(null)
  
  const [formData, setFormData] = useState({
    output: '',
    outcome: '',
    kpi: '',
    means_of_verification: '',
    risks: '',
    mitigation_measures: '',
    learning_development: '',
    self_evaluation: '',
    notes: '',
    merl_status: 'draft' as const
  })

  // Load existing MERL data
  useEffect(() => {
    if (isOpen && workplan.id) {
      loadMerlData()
    }
  }, [isOpen, workplan.id])

  const loadMerlData = async () => {
    try {
      const response = await fetch(`/api/merl?workplan_id=${workplan.id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setExistingMerl(data[0])
          setFormData({
            output: data[0].output || '',
            outcome: data[0].outcome || '',
            kpi: data[0].kpi || '',
            means_of_verification: data[0].means_of_verification || '',
            risks: data[0].risks || '',
            mitigation_measures: data[0].mitigation_measures || '',
            learning_development: data[0].learning_development || '',
            self_evaluation: data[0].self_evaluation || '',
            notes: data[0].notes || '',
            merl_status: data[0].merl_status
          })
        } else {
          setExistingMerl(null)
          resetForm()
        }
      }
    } catch (error) {
      console.error('Error loading MERL data:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      output: '',
      outcome: '',
      kpi: '',
      means_of_verification: '',
      risks: '',
      mitigation_measures: '',
      learning_development: '',
      self_evaluation: '',
      notes: '',
      merl_status: 'draft'
    })
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const merlData = {
        workplan_id: workplan.id,
        ...formData
      }

      const url = existingMerl ? `/api/merl/${existingMerl.id}` : '/api/merl'
      const method = existingMerl ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merlData)
      })

      if (!response.ok) {
        throw new Error('Failed to save MERL data')
      }

      const result = await response.json()
      onSave(result)
      onClose()
      
    } catch (error) {
      console.error('Error saving MERL data:', error)
      alert('Failed to save MERL data')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">MERL Card - {workplan.activity_name}</h2>
            <p className="text-sm text-muted-foreground">{workplan.focus_area}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Monitoring & Research */}
            <div className="space-y-6">
              {/* Monitoring Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4" />
                    MONITORING
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="output">Output</Label>
                    <Textarea
                      id="output"
                      placeholder="Immediate deliverables and direct results..."
                      value={formData.output}
                      onChange={(e) => handleChange('output', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outcome">Outcome</Label>
                    <Textarea
                      id="outcome"
                      placeholder="Short-term and medium-term changes, effects, or benefits..."
                      value={formData.outcome}
                      onChange={(e) => handleChange('outcome', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kpi">Key Performance Indicators (KPI)</Label>
                    <Textarea
                      id="kpi"
                      placeholder="Specific, measurable indicators to track progress..."
                      value={formData.kpi}
                      onChange={(e) => handleChange('kpi', e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Research Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4" />
                    RESEARCH
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="risks">Risks</Label>
                    <Textarea
                      id="risks"
                      placeholder="Potential challenges, obstacles, or negative impacts..."
                      value={formData.risks}
                      onChange={(e) => handleChange('risks', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mitigation_measures">Mitigation Measures</Label>
                    <Textarea
                      id="mitigation_measures"
                      placeholder="Strategies and actions to prevent or minimize risks..."
                      value={formData.mitigation_measures}
                      onChange={(e) => handleChange('mitigation_measures', e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Evaluation & Learning */}
            <div className="space-y-6">
              {/* Evaluation Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    EVALUATION
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="means_of_verification">Means of Verification</Label>
                    <Textarea
                      id="means_of_verification"
                      placeholder="Sources of information and methods to verify results..."
                      value={formData.means_of_verification}
                      onChange={(e) => handleChange('means_of_verification', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="merl_status">MERL Status</Label>
                    <Select
                      value={formData.merl_status}
                      onValueChange={(value: 'draft' | 'in-review' | 'approved') => 
                        handleChange('merl_status', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="in-review">In Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4" />
                    LEARNING & ADAPTATION
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="learning_development">Learning & Development</Label>
                    <Textarea
                      id="learning_development"
                      placeholder="Skills, knowledge, or capacities gained..."
                      value={formData.learning_development}
                      onChange={(e) => handleChange('learning_development', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="self_evaluation">Self Evaluation</Label>
                    <Textarea
                      id="self_evaluation"
                      placeholder="Team reflection on successes, challenges, and improvements..."
                      value={formData.self_evaluation}
                      onChange={(e) => handleChange('self_evaluation', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional observations, contextual information..."
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : existingMerl ? 'Update MERL' : 'Save MERL'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}