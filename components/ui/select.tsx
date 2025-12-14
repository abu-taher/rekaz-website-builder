import { forwardRef, type SelectHTMLAttributes } from 'react';
import { inputBaseStyles } from './input';

// =============================================================================
// Types
// =============================================================================

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Additional class names */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Select component with consistent styling.
 *
 * @example
 * <Select value={value} onChange={handleChange}>
 *   <option value="">Select an option</option>
 *   <option value="1">Option 1</option>
 * </Select>
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className = '', children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={`${inputBaseStyles} cursor-pointer min-h-[44px] ${className}`.trim()}
        {...props}
      >
        {children}
      </select>
    );
  }
);
