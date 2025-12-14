import type { LabelHTMLAttributes, ReactNode } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Hint text shown below the label */
  hint?: ReactNode;
  /** Additional class names */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Label component for form fields with optional hint text.
 *
 * @example
 * <Label htmlFor="title">Title</Label>
 * <Label htmlFor="image" hint="Enter a valid image URL">Image URL</Label>
 */
export function Label({
  children,
  hint,
  className = '',
  ...props
}: LabelProps) {
  return (
    <div className="space-y-1">
      <label
        className={`text-sm font-medium text-gray-700 block ${className}`.trim()}
        {...props}
      >
        {children}
      </label>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
