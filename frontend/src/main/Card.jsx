import React from "react";

// Utility to combine class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Base Card component
const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#D2C1B6] bg-[#F9F3EF] shadow-lg p-6 transition-shadow hover:shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// CardHeader
const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
};

// CardTitle
const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn(
        "text-[#1B3C53] text-xl font-bold leading-snug",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

// CardDescription
const CardDescription = ({ className, children, ...props }) => {
  return (
    <p
      className={cn(
        "text-sm text-[#456882] opacity-80 mt-1",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

// CardContent
const CardContent = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("text-[#456882] text-sm leading-relaxed", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
};
