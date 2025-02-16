import { cn } from "../../../lib/utils"
import { forwardRef } from "react"

type CardProps = {
  className?: string
  image?: {
    src: string
    alt: string
    className?: string
    width?: number
    height?: number
  }
  header?: React.ReactNode
  footer?: React.ReactNode
  bodyClassName?: string
} & React.HTMLAttributes<HTMLDivElement>

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, image, header, footer, children, bodyClassName, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {image && (
          <div className={cn("relative mx-auto", image.className)}>
            <img
              src={image.src}
              alt={image.alt}
              className="object-cover w-full h-full"
              width={image.width}
              height={image.height}
            />
          </div>
        )}
        
        {(header || children) && (
          <div className={cn("p-6", bodyClassName)}>
            {header && <div className="mb-4">{header}</div>}
            {children}
          </div>
        )}
        
        {footer && <div className="p-6 pt-0">{footer}</div>}
      </div>
    )
  }
)
Card.displayName = "Card"

export { Card } 