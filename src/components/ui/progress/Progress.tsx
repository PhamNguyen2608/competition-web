import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../../lib/utils"

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full transition-all",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-2", 
        lg: "h-3",
        xl: "h-4"
      },
      variant: {
        default: "bg-muted",
        success: "bg-green-100",
        warning: "bg-yellow-100",
        error: "bg-red-100"
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default" 
    }
  }
)

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-green-600",
        warning: "bg-yellow-600", 
        error: "bg-red-600"
      },
      animated: {
        true: "transition-transform duration-300 ease-in-out",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      animated: true
    }
  }
)

interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  /** Giá trị hiện tại (0-100) */
  value?: number
  /** Có animation khi thay đổi giá trị */
  animated?: boolean
  /** Hiển thị label % */
  showLabel?: boolean
  /** Custom indicator styles */
  indicatorClassName?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className,
    value = 0,
    size,
    variant,
    animated = true,
    showLabel = false,
    indicatorClassName,
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max(value, 0), 100)

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(progressVariants({ size, variant }), className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            progressIndicatorVariants({ variant, animated }),
            indicatorClassName
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        >
          {showLabel && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
    )
  }
)

Progress.displayName = "Progress"

export { Progress, type ProgressProps } 