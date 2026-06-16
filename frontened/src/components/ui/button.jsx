import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#FF9900] text-[#111111] hover:bg-[#E68A00]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-[#DDDDDD] bg-white text-[#111111] hover:bg-[#F7F7F7]",
        secondary: "bg-[#232F3E] text-white hover:bg-[#131921]",
        ghost: "text-[#111111] hover:bg-[#EAEDED]",
        link: "text-[#007185] underline-offset-4 hover:underline",
        navy: "bg-[#131921] text-white hover:bg-[#232F3E]",
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

const Button = React.forwardRef((props, ref) => {
  const { className, variant, size, asChild = false, ...rest } = props
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...rest}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
