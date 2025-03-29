import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground backdrop-blur-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        // New futuristic button styles
        neon: "bg-transparent border border-primary text-primary hover:text-white hover:border-primary/80 shadow-[0_0_10px_rgba(84,33,128,0.5)] hover:shadow-[0_0_20px_rgba(84,33,128,0.8),inset_0_0_20px_rgba(84,33,128,0.4)] hover:bg-primary/20 backdrop-blur-sm",

        cyber:
          "bg-transparent text-white border-0 uppercase tracking-wider font-bold before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600 before:to-purple-600 before:opacity-75 before:-z-10 after:content-[''] after:absolute after:inset-0 after:bg-black after:m-[2px] after:-z-10 hover:before:opacity-100",

        holographic:
          "bg-transparent border border-cyan-400/30 text-cyan-300 backdrop-blur-sm hover:bg-cyan-900/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-500/10 before:to-blue-500/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",

        glitch:
          "bg-transparent border border-pink-500/50 text-pink-400 hover:text-white shadow-[0_0_10px_rgba(236,72,153,0.4)] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:border-pink-400 backdrop-blur-sm hover:bg-pink-500/20 after:content-[''] after:absolute after:h-[40%] after:w-full after:left-0 after:top-0 after:bg-white/10 after:skew-y-[45deg] after:translate-y-[-100%] hover:after:translate-y-[200%] after:transition-transform after:duration-500",

        matrix:
          "bg-transparent border-2 border-green-500 text-green-400 font-mono hover:text-white shadow-[0_0_10px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6),inset_0_0_20px_rgba(34,197,94,0.4)] hover:bg-green-500/20 backdrop-blur-sm before:content-['01101'] before:absolute before:inset-0 before:text-green-500/20 before:text-xs before:overflow-hidden before:pointer-events-none",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = "Button"

export { Button, buttonVariants }

