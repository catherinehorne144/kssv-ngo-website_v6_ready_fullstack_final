// [file name]: components/ui/progress.tsx
// [file content begin - ENHANCED WITH M&E FEATURES]
'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

// Enhanced Progress with variants and sizes
interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number
  max?: number
  showValue?: boolean
  variant?: 'default' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, max = 100, showValue = false, variant = 'default', size = 'md', label, ...props }, ref) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const variantStyles = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  }

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-secondary",
          sizeStyles[size]
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-in-out",
            variantStyles[variant]
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <span className={cn(
          "text-sm font-medium min-w-8",
          percentage >= 80 ? "text-green-600" :
          percentage >= 60 ? "text-yellow-600" :
          "text-red-600"
        )}>
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
})
Progress.displayName = 'Progress'

// Enhanced Progress with multiple segments for M&E analytics
interface SegmentedProgressProps extends React.ComponentProps<'div'> {
  segments: { value: number; color: string; label?: string }[]
  max?: number
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const SegmentedProgress = React.forwardRef<HTMLDivElement, SegmentedProgressProps>(
  ({ className, segments, max = 100, showLabels = false, size = 'md', ...props }, ref) => {
    const totalValue = segments.reduce((sum, segment) => sum + segment.value, 0)
    const normalizedSegments = segments.map(segment => ({
      ...segment,
      percentage: Math.min(100, Math.max(0, (segment.value / max) * 100))
    }))

    const sizeStyles = {
      sm: 'h-2 text-xs',
      md: 'h-3 text-sm',
      lg: 'h-4 text-base'
    }

    return (
      <div className={cn("space-y-2", className)}>
        <div
          ref={ref}
          className={cn(
            "flex w-full overflow-hidden rounded-full bg-secondary",
            sizeStyles[size]
          )}
          {...props}
        >
          {normalizedSegments.map((segment, index) => (
            <div
              key={index}
              className="transition-all duration-300 ease-in-out"
              style={{
                width: `${segment.percentage}%`,
                backgroundColor: segment.color
              }}
              title={segment.label}
            />
          ))}
        </div>
        {showLabels && (
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {normalizedSegments.map((segment, index) => (
              <div key={index} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: segment.color }}
                />
                <span>
                  {segment.label}: {segment.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
SegmentedProgress.displayName = 'SegmentedProgress'

export { Progress, SegmentedProgress }
// [file content end]