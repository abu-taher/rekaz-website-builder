import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { inputBaseStyles } from './input';

// =============================================================================
// Types
// =============================================================================

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Additional class names */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Textarea component with consistent styling.
 *
 * @example
 * <Textarea rows={3} placeholder="Enter description" />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className = '', ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={`${inputBaseStyles} resize-none ${className}`.trim()}
        {...props}
      />
    );
  }
);
