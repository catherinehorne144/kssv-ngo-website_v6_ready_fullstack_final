"use client"

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

interface LearningSectionProps {
  learning_development: string
  self_evaluation: string
  notes: string
  onFieldChange: (field: 'learning_development' | 'self_evaluation' | 'notes', value: string) => void
}

export function LearningSection({ 
  learning_development, 
  self_evaluation, 
  notes, 
  onFieldChange 
}: LearningSectionProps) {
  return (
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
            placeholder="Skills, knowledge, or capacities gained through implementing this activity..."
            value={learning_development}
            onChange={(e) => onFieldChange('learning_development', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            What did the team or organization learn from this activity?
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="self_evaluation">Self Evaluation</Label>
          <Textarea
            id="self_evaluation"
            placeholder="Team reflection on successes, challenges, and areas for improvement..."
            value={self_evaluation}
            onChange={(e) => onFieldChange('self_evaluation', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            How would you rate the implementation and outcomes of this activity?
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Additional observations, contextual information, or special considerations..."
            value={notes}
            onChange={(e) => onFieldChange('notes', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Any other relevant information about this activity
          </p>
        </div>
      </CardContent>
    </Card>
  )
}