
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-primary/70 backdrop-blur-xl text-primary-foreground hover:bg-primary/80 border-animation-primary glassmorphism-button transform hover:scale-105 transition-all duration-300 before:content-[''] before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-all before:duration-1000 shadow-[0_8px_20px_rgba(0,0,0,0.1)]",
        destructive:
          "bg-destructive/70 backdrop-blur-xl text-destructive-foreground hover:bg-destructive/80 border-animation-destructive glassmorphism-button transform hover:scale-105 transition-all duration-300 before:content-[''] before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-all before:duration-1000 shadow-[0_8px_20px_rgba(0,0,0,0.1)]",
        outline:
          "border border-input/50 bg-transparent backdrop-blur-xl hover:bg-accent/20 hover:text-accent-foreground border-animation-outline glassmorphism-button transform hover:scale-105 transition-all duration-300 before:content-[''] before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-all before:duration-1000 shadow-[0_8px_20px_rgba(0,0,0,0.05)]",
        secondary:
          "bg-secondary/70 backdrop-blur-xl text-secondary-foreground hover:bg-secondary/80 border-animation-secondary glassmorphism-button transform hover:scale-105 transition-all duration-300 before:content-[''] before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-all before:duration-1000 shadow-[0_8px_20px_rgba(0,0,0,0.1)]",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground border-animation-ghost backdrop-blur-xl transform hover:scale-105 transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline border-animation-link",
        glass: "glassmorphism-button glass-border glass-shine bg-white/10 dark:bg-black/10 backdrop-blur-xl hover:bg-white/20 dark:hover:bg-black/20 transform hover:scale-105 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20 dark:border-white/10 before:content-[''] before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-all before:duration-1000",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
