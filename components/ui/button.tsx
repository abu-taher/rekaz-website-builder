import { forwardRef, type ButtonHTMLAttributes } from 'react';

// =============================================================================
// Button Variants & Sizes
// =============================================================================

const variants = {
  primary:
    'bg-[#F17265] text-white hover:bg-[#E25C4F] shadow-md hover:shadow-lg',
  outline:
    'border-2 border-gray-300 bg-white text-[#030014] hover:border-[#F17265] hover:text-[#F17265] hover:bg-[#FFF5F4]',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-[#030014]',
  danger:
    'border-2 border-[#F17265] bg-white text-[#F17265] hover:bg-[#F17265] hover:text-white',
  'danger-subtle':
    'border border-red-300 text-red-500 hover:bg-red-50',
} as const;

const sizes = {
  sm: 'text-xs px-3 py-1.5 min-h-[32px]',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
} as const;

const shapes = {
  rounded: 'rounded-lg',
  pill: 'rounded-full',
} as const;

// =============================================================================
// Types
// =============================================================================

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;
export type ButtonShape = keyof typeof shapes;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Shape of button corners */
  shape?: ButtonShape;
  /** Additional class names */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Button component with consistent styling across the app.
 *
 * @example
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="outline" size="sm">Cancel</Button>
 * <Button variant="danger" size="sm">Delete</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      shape = 'rounded',
      className = '',
      children,
      ...props
    },
    ref
  ) {
    const baseStyles = [
      'inline-flex items-center justify-center font-medium',
      'transition-all focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variants[variant],
      sizes[size],
      shapes[shape],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={baseStyles} {...props}>
        {children}
      </button>
    );
  }
);
