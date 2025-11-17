"use client"

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target } from 'lucide-react'

interface MonitoringSectionProps {
  output: string
  outcome: string
  kpi: string
  onFieldChange: (field: 'output' | 'outcome' | 'kpi', value: string) => void
}

export function MonitoringSection({ output, outcome, kpi, onFieldChange }: MonitoringSectionProps) {
  return (
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
            placeholder="Immediate deliverables and direct results of the activity..."
            value={output}
            onChange={(e) => onFieldChange('output', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            What are the direct, tangible products or services delivered?
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="outcome">Outcome</Label>
          <Textarea
            id="outcome"
            placeholder="Short-term and medium-term changes, effects, or benefits resulting from the activity..."
            value={outcome}
            onChange={(e) => onFieldChange('outcome', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            What changes do you expect to see as a result of these outputs?
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="kpi">Key Performance Indicators (KPI)</Label>
          <Textarea
            id="kpi"
            placeholder="Specific, measurable indicators to track progress and success..."
            value={kpi}
            onChange={(e) => onFieldChange('kpi', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            How will you measure success? Include specific metrics and targets.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}