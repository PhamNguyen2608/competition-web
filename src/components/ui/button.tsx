import * as React from "react"
import type { ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { Spinner } from "./spinner"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

const Button = React.forwardRef(
  ({ className, ...props }: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    return <button className={cn("inline-flex items-center justify-center", className)} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border-2 border-input bg-background hover:bg-accent/10 hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      color: {
        primary: "",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        muted: "bg-muted text-muted-foreground hover:bg-muted/90",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        custom: "",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
    },
    compoundVariants: [
      {
        color: "primary",
        variant: "outline",
        class: "border-primary text-primary hover:bg-primary/10 hover:text-primary hover:border-primary",
      },
      {
        color: "destructive",
        variant: "outline",
        class: "border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive",
      },
      {
        color: "secondary",
        variant: "outline",
        class: "border-secondary text-secondary-foreground hover:bg-secondary/10 hover:text-secondary-foreground hover:border-secondary",
      },
    ],
    defaultVariants: {
      variant: "solid",
      color: "primary",
      size: "md",
    },
  }
)

type CustomButtonProps = ButtonProps &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  }

export const CustomButton = React.forwardRef(
  ({ className, variant, color, size, isLoading, leftIcon, rightIcon, children, ...props }: CustomButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <Button
        ref={ref}
        className={cn(
          buttonVariants({ variant, color, size, className }),
          isLoading && "opacity-70 cursor-not-allowed",
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
        {!isLoading && leftIcon}
        {children}
        {rightIcon}
      </Button>
    )
  }
) 