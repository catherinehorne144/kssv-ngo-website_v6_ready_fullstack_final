"use client"

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText } from 'lucide-react'

interface EvaluationSectionProps {
  means_of_verification: string
  merl_status: 'draft' | 'in-review' | 'approved'
  onFieldChange: (field: 'means_of_verification' | 'merl_status', value: string) => void
}

export function EvaluationSection({ 
  means_of_verification, 
  merl_status, 
  onFieldChange 
}: EvaluationSectionProps) {
  return (
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
            placeholder="Sources of information and methods to verify the reported results..."
            value={means_of_verification}
            onChange={(e) => onFieldChange('means_of_verification', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            How will you prove the results? (e.g., reports, surveys, attendance records, photos)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="merl_status">MERL Status</Label>
          <Select
            value={merl_status}
            onValueChange={(value: 'draft' | 'in-review' | 'approved') => 
              onFieldChange('merl_status', value)
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
          <p className="text-xs text-muted-foreground">
            Track the status of your MERL framework development
          </p>
        </div>
      </CardContent>
    </Card>
  )
}