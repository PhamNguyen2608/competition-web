import { cn } from "../../../lib/utils"
import { forwardRef, HTMLAttributes } from "react"

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))

CardDescription.displayName = "CardDescription"

export { CardDescription }