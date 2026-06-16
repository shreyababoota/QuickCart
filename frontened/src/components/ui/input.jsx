import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef((props, ref) => {
  const { className, type, ...rest } = props
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-[#DDDDDD] bg-white px-3 py-2 text-base text-[#111111] ring-offset-background placeholder:text-[#565959] focus-visible:outline-none focus-visible:border-[#FF9900] focus-visible:ring-2 focus-visible:ring-[#FF9900]/25 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...rest}
    />
  )
})
Input.displayName = "Input"

export { Input }
