'use client'

import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Shield, CheckCircle, HelpCircle } from 'lucide-react'

interface RiskIndicatorProps {
  riskLevel: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showText?: boolean
}

export function RiskIndicator({ riskLevel, size = 'md', showIcon = true, showText = true }: RiskIndicatorProps) {
  const getRiskConfig = (level: string) => {
    switch (level) {
      case 'LOW':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          text: 'Low Risk',
          description: 'Stable situation with minimal immediate concerns'
        }
      case 'MEDIUM':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Shield,
          text: 'Medium Risk',
          description: 'Some concerns requiring monitoring and support'
        }
      case 'HIGH':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: AlertTriangle,
          text: 'High Risk',
          description: 'Significant concerns requiring immediate attention'
        }
      case 'CRITICAL':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertTriangle,
          text: 'Critical Risk',
          description: 'Emergency situation requiring immediate intervention'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: HelpCircle,
          text: 'Unknown Risk',
          description: 'Risk level not assessed'
        }
    }
  }

  const config = getRiskConfig(riskLevel)
  const IconComponent = config.icon

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className={`${config.color} ${sizeClasses[size]} font-semibold border-2 rounded-full flex items-center gap-1`}
      >
        {showIcon && <IconComponent className="w-3 h-3" />}
        {showText && config.text}
      </Badge>
      
      {/* Tooltip-like description on hover */}
      <div className="relative group">
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
          <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
            {config.description}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  )
}