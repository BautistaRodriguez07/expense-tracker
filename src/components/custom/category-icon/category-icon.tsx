"use client";

import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import * as ReactIcons from "react-icons/fa";
import type { LucideProps } from "lucide-react";

type CategoryIconProps = {
  /** Icon name from Lucide or React Icons (e.g., "Home", "FaSquareParking") */
  iconName?: string | null;
  /** Hex color code for the icon (e.g., "#F97316") */
  color?: string;
  /** Total size of the icon container in pixels */
  size?: number;
  /** Additional CSS classes for the container */
  className?: string;
};

/**
 * CategoryIcon - Dynamically renders icons based on string names from the API
 * 
 * Features:
 * - Loads Lucide icons by name (e.g., "Home", "Zap", "Coffee")
 * - Falls back to React Icons for special cases (e.g., "FaSquareParking")
 * - Applies background color with 20% opacity
 * - Provides a Circle icon as final fallback
 * 
 * @example
 * ```tsx
 * <CategoryIcon 
 *   iconName="Home" 
 *   color="#F97316" 
 *   size={40} 
 * />
 * ```
 */
export const CategoryIcon = ({
  iconName,
  color = "#6B7280",
  size = 40,
  className,
}: CategoryIconProps) => {
  if (!iconName) {
    // Default fallback icon
    const CircleIcon = LucideIcons.Circle;
    return (
      <div
        className={cn("p-2 rounded-full", className)}
        style={{ backgroundColor: `${color}20` }}
      >
        <CircleIcon size={size - 16} style={{ color }} />
      </div>
    );
  }

  // Try to load from Lucide icons first
  const LucideIcon = (LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>)[
    iconName
  ];

  if (LucideIcon) {
    return (
      <div
        className={cn("p-2 rounded-full", className)}
        style={{ backgroundColor: `${color}20` }}
      >
        <LucideIcon size={size - 16} style={{ color }} />
      </div>
    );
  }

  // Fallback to react-icons (for icons like FaSquareParking)
  const ReactIcon = (ReactIcons as unknown as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>)[
    iconName
  ];

  if (ReactIcon) {
    return (
      <div
        className={cn("p-2 rounded-full", className)}
        style={{ backgroundColor: `${color}20` }}
      >
        <ReactIcon size={size - 16} style={{ color }} />
      </div>
    );
  }

  // Final fallback if icon not found
  const CircleIcon = LucideIcons.Circle;
  return (
    <div
      className={cn("p-2 rounded-full", className)}
      style={{ backgroundColor: `${color}20` }}
    >
      <CircleIcon size={size - 16} style={{ color }} />
    </div>
  );
};

export default CategoryIcon;

