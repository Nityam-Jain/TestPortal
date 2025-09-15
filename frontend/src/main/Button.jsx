import React, { forwardRef } from "react"

// Simple class merging utility (replacement for `cn`)
function mergeClasses(...classes) {
  return classes.filter(Boolean).join(" ")
}

// Manual variant handler (replacement for `cva`)
function getButtonClasses(variant = "default", size = "default") {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-[#1B3C53] text-[#F9F3EF] hover:bg-[#456882] shadow-md",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline:
      "border border-[#1B3C53] text-[#1B3C53] bg-transparent hover:bg-[#F9F3EF]",
    secondary: "bg-[#456882] text-[#F9F3EF] hover:bg-[#1B3C53]",
    ghost: "text-[#1B3C53] hover:bg-[#F9F3EF]",
    link: "text-[#456882] underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return mergeClasses(base, variants[variant], sizes[size])
}

const Button = forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={mergeClasses(getButtonClasses(variant, size), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
