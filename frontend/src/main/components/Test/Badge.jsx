import React from "react";

function Badge({ children, variant = "default", className = "" }) {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-[#D2C1B6] bg-opacity-30 text-[#1B3C53] border-[#D2C1B6] border-opacity-50";
      case "outline":
        return "border border-[#456882] text-[#456882] bg-transparent hover:bg-[#456882] hover:text-white";
      case "destructive":
        return "bg-red-500 text-white border-red-500";
      default:
        return "bg-[#1B3C53] text-[#F9F3EF] border-[#1B3C53]";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:ring-offset-2 ${getVariantStyles()} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
