// [file name]: components/ui/metric-card.tsx
// [file content begin - FIXED VERSION]
'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

// Define variantStyles at the top level
const variantStyles = {
  default: 'border-border',
  success: 'border-green-200 bg-green-50',
  warning: 'border-yellow-200 bg-yellow-50', 
  danger: 'border-red-200 bg-red-50'
}

const trendStyles = {
  positive: 'text-green-600',
  negative: 'text-red-600',
  neutral: 'text-gray-600'
}

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    isPositive: boolean
    label: string
  }
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

export function MetricCard({
  title,
  value,
  description,
  trend,
  icon,
  variant = 'default',
  className
}: MetricCardProps) {
  const getTrendIcon = (isPositive: boolean | undefined) => {
    if (isPositive === undefined) return <Minus className="h-4 w-4" />
    return isPositive ? 
      <TrendingUp className="h-4 w-4" /> : 
      <TrendingDown className="h-4 w-4" />
  }

  const getTrendColor = (isPositive: boolean | undefined) => {
    if (isPositive === undefined) return trendStyles.neutral
    return isPositive ? trendStyles.positive : trendStyles.negative
  }

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className={cn("flex items-center gap-1 text-xs font-medium mt-2", getTrendColor(trend.isPositive))}>
            {getTrendIcon(trend.isPositive)}
            <span>{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Enhanced metric card for progress display
interface ProgressMetricCardProps extends Omit<MetricCardProps, 'value'> {
  current: number
  target: number
  unit?: string
  showProgress?: boolean
}

export function ProgressMetricCard({
  title,
  current,
  target,
  unit = '',
  showProgress = true,
  description,
  trend,
  icon,
  variant = 'default',
  className
}: ProgressMetricCardProps) {
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0
  const value = `${current.toLocaleString()}${unit} / ${target.toLocaleString()}${unit}`

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {showProgress && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all",
                  percentage >= 80 ? "bg-green-500" :
                  percentage >= 60 ? "bg-yellow-500" :
                  "bg-red-500"
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium mt-2",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {getTrendIcon(trend.isPositive)}
            <span>{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
// [file content end]