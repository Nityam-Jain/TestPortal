import React from "react";

function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled = false,
  type = "button",
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return "border border-[#1B3C53] text-[#1B3C53] bg-transparent hover:bg-[#1B3C53] hover:text-[#F9F3EF] focus:ring-[#1B3C53]";
      case "secondary":
        return "bg-[#D2C1B6] text-[#1B3C53] hover:bg-[#D2C1B6] hover:bg-opacity-80 focus:ring-[#D2C1B6]";
      case "ghost":
        return "text-[#1B3C53] hover:bg-[#F9F3EF] hover:text-[#1B3C53] focus:ring-[#1B3C53]";
      case "link":
        return "text-[#1B3C53] underline-offset-4 hover:underline focus:ring-[#1B3C53]";
      default:
        return "bg-[#1B3C53] text-[#F9F3EF] hover:bg-[#1B3C53] hover:bg-opacity-90 focus:ring-[#1B3C53]";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "h-9 rounded-md px-3 text-sm";
      case "lg":
        return "h-11 rounded-md px-8 text-base";
      case "icon":
        return "h-10 w-10 rounded-md";
      default:
        return "h-10 px-4 py-2 rounded-md text-sm";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
