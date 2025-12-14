import { forwardRef, type InputHTMLAttributes } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Additional class names */
  className?: string;
}

// =============================================================================
// Shared Styles
// =============================================================================

/** Base input styles shared between Input, Textarea, and Select */
export const inputBaseStyles = [
  'w-full rounded-lg border-2 border-gray-300 bg-white',
  'px-3 py-2 text-sm text-[#030014]',
  'focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20',
  'outline-none transition-all',
  'placeholder:text-gray-400',
  'disabled:bg-gray-100 disabled:cursor-not-allowed',
].join(' ');

// =============================================================================
// Component
// =============================================================================

/**
 * Input component with consistent styling.
 *
 * @example
 * <Input type="text" placeholder="Enter title" />
 * <Input type="url" placeholder="https://example.com" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`${inputBaseStyles} ${className}`.trim()}
      {...props}
    />
  );
});
