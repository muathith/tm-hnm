import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#1976d2] text-white shadow-lg shadow-blue-500/25 hover:bg-[#1565c0] hover:shadow-xl hover:shadow-blue-500/30",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30",
        outline:
          "border-2 border-[#1976d2] bg-white text-[#1976d2] shadow-sm hover:bg-[#1976d2] hover:text-white",
        secondary:
          "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-sm hover:from-gray-200 hover:to-gray-300",
        ghost: "hover:bg-[#1976d2]/10 hover:text-[#1976d2]",
        link: "text-[#1976d2] underline-offset-4 hover:underline",
        accent:
          "bg-[#1976d2] text-white shadow-lg shadow-blue-500/25 hover:bg-[#1565c0] hover:shadow-xl hover:shadow-blue-500/30 font-bold",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
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
