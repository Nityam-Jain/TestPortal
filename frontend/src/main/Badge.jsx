import React from "react"

// Simple class merging utility
function mergeClasses(...classes) {
  return classes.filter(Boolean).join(" ")
}

// Manual badge variant logic
function getBadgeClasses(variant = "default") {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variants = {
    default: "border-transparent bg-[#1B3C53] text-[#F9F3EF] hover:bg-[#456882]",
    secondary: "border-transparent bg-[#456882] text-[#F9F3EF] hover:bg-[#1B3C53]",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
    outline: "text-[#1B3C53] border-[#1B3C53]",
    success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
    warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    info: "border-transparent bg-[#D2C1B6] text-[#1B3C53] hover:bg-[#456882] hover:text-[#F9F3EF]",
  }

  return mergeClasses(base, variants[variant])
}

function Badge({ className = "", variant = "default", ...props }) {
  return (
    <div
      className={mergeClasses(getBadgeClasses(variant), className)}
      {...props}
    />
  )
}

export { Badge }
