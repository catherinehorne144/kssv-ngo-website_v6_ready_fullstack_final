"use client"

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

interface ResearchSectionProps {
  risks: string
  mitigation_measures: string
  onFieldChange: (field: 'risks' | 'mitigation_measures', value: string) => void
}

export function ResearchSection({ risks, mitigation_measures, onFieldChange }: ResearchSectionProps) {
  return (
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
            placeholder="Potential challenges, obstacles, or negative impacts that could affect the activity..."
            value={risks}
            onChange={(e) => onFieldChange('risks', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Identify potential risks to implementation, beneficiaries, or staff
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mitigation_measures">Mitigation Measures</Label>
          <Textarea
            id="mitigation_measures"
            placeholder="Strategies and actions to prevent or minimize the identified risks..."
            value={mitigation_measures}
            onChange={(e) => onFieldChange('mitigation_measures', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            What steps will you take to address each identified risk?
          </p>
        </div>
      </CardContent>
    </Card>
  )
}