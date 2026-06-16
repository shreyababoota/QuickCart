import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef((props, ref) => {
  const { className, ...rest } = props
  return (
    <div
      ref={ref}
      className={cn("rounded-lg border border-[#DDDDDD] bg-white text-[#111111] shadow-soft", className)}
      {...rest}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef((props, ref) => {
  const { className, ...rest } = props
  return (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...rest} />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef((props, ref) => {
  const { className, ...rest } = props
  return (
    <h2 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight text-[#111111]", className)} {...rest} />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef((props, ref) => {
  const { className, ...rest } = props
  return (
    <p ref={ref} className={cn("text-sm text-[#565959]", className)} {...rest} />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef((props, ref) => {
  const { className, ...rest } = props
  return <div ref={ref} className={cn("p-6 pt-0", className)} {...rest} />
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef((props, ref) => {
  const { className, ...rest } = props
  return <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...rest} />
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
