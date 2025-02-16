import { cn } from "../../../lib/utils"
import { forwardRef } from "react"

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

export { CardHeader } 