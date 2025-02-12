import * as React from "react"
import { type HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
  {
    variants: {
      size: {
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-3",
        xl: "h-12 w-12 border-4",
      },
      color: {
        primary: "text-blue-600",
        secondary: "text-gray-600",
        success: "text-green-600", 
        warning: "text-yellow-600",
        danger: "text-red-600",
        white: "text-white",
      }
    },
    defaultVariants: {
      size: "md",
      color: "primary"
    }
  }
)

interface SpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>, VariantProps<typeof spinnerVariants> {}

export const Spinner = React.forwardRef(
  ({ className, size, color, ...props }: SpinnerProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ size, color }), className)}
        {...props}
      />
    )
  }
)

Spinner.displayName = "Spinner" 