"use client"

import { Button } from '@/components/ui/button'
import { FileText, Plus, Eye, Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface MERLButtonProps {
  workplanId: string
  hasExistingMERL?: boolean
  merlStatus?: 'draft' | 'in-review' | 'approved'
  onOpenMERL: () => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function MERLButton({ 
  workplanId, 
  hasExistingMERL = false, 
  merlStatus = 'draft',
  onOpenMERL,
  variant = 'outline',
  size = 'sm'
}: MERLButtonProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-review': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'draft': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approved'
      case 'in-review': return 'In Review'
      case 'draft': return 'Draft'
      default: return 'Draft'
    }
  }

  const getButtonText = () => {
    if (hasExistingMERL) {
      return 'View MERL'
    }
    return 'Add MERL'
  }

  const getButtonIcon = () => {
    if (hasExistingMERL) {
      return <Eye className="h-3.5 w-3.5" />
    }
    return <Plus className="h-3.5 w-3.5" />
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={variant}
        size={size}
        onClick={onOpenMERL}
        className="flex items-center gap-1.5"
        title={hasExistingMERL ? 'View MERL Framework' : 'Add MERL Framework'}
      >
        <FileText className="h-3.5 w-3.5" />
        {size !== 'icon' && getButtonText()}
      </Button>
      
      {hasExistingMERL && size !== 'icon' && (
        <Badge 
          variant="outline" 
          className={`text-xs font-medium ${getStatusColor(merlStatus)}`}
        >
          {getStatusText(merlStatus)}
        </Badge>
      )}
    </div>
  )
}