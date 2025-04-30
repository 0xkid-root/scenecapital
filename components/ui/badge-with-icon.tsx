import React from "react";
import { cn } from "@/lib/utils";
import { DivideIcon as LucideIcon } from "lucide-react";

interface BadgeWithIconProps {
  icon: LucideIcon;
  text: string;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

export function BadgeWithIcon({
  icon: Icon,
  text,
  className,
  variant = "default",
}: BadgeWithIconProps) {
  const variantStyles = {
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    outline: "bg-transparent border border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{text}</span>
    </span>
  );
}