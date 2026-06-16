import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#232F3E] text-white",
        secondary: "border-transparent bg-[#EAEDED] text-[#111111]",
        destructive: "border-transparent bg-[#FDECEC] text-[#CC0C39] border-[#F5C6CB]",
        outline: "border-[#DDDDDD] text-[#111111] bg-white",
        delivered: "border-transparent bg-[#D5F5E3] text-[#067D62]",
        processing: "border-transparent bg-[#FFF3E0] text-[#C45500]",
        cancelled: "border-transparent bg-[#FDECEC] text-[#CC0C39]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function getStatusVariant(status) {
  const s = status?.toLowerCase() ?? ""
  if (s === "delivered") return "delivered"
  if (s === "cancelled") return "cancelled"
  return "processing"
}

const Badge = React.forwardRef((props, ref) => {
  const { className, variant, status, ...rest } = props
  const resolvedVariant = status ? getStatusVariant(status) : variant
  return (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant: resolvedVariant }), className)}
      {...rest}
    />
  )
})
Badge.displayName = "Badge"

export { Badge, badgeVariants, getStatusVariant }
