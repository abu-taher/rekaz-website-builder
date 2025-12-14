import type { HTMLAttributes, ReactNode } from 'react';

// =============================================================================
// Badge Variants
// =============================================================================

const variants = {
  default: 'bg-gray-100 text-gray-600 border-gray-200',
  primary: 'bg-[#FFF5F4] text-[#F17265] border-[#F17265]',
  success: 'bg-green-50 text-green-600 border-green-200',
  warning: 'bg-amber-50 text-amber-600 border-amber-200',
} as const;

// =============================================================================
// Types
// =============================================================================

export type BadgeVariant = keyof typeof variants;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Badge content */
  children: ReactNode;
  /** Additional class names */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Badge component for status indicators and labels.
 *
 * @example
 * <Badge variant="primary">Selected</Badge>
 * <Badge variant="default">Draft</Badge>
 */
export function Badge({
  variant = 'default',
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border font-medium ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
