import { cn } from "../../../lib/utils"
import { forwardRef, HTMLAttributes } from "react"

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
      />
    )
  }
)

CardFooter.displayName = "CardFooter"

export { CardFooter }
