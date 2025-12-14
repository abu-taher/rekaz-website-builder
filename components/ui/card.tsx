import { forwardRef, type HTMLAttributes } from 'react';

// =============================================================================
// Card Variants
// =============================================================================

const variants = {
  default: 'border-2 border-gray-200 bg-white shadow-sm',
  muted: 'border-2 border-gray-200 bg-gray-50',
  dashed: 'border-2 border-dashed border-gray-300 bg-gray-50',
} as const;

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
} as const;

const roundedSizes = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const;

// =============================================================================
// Types
// =============================================================================

export type CardVariant = keyof typeof variants;
export type CardPadding = keyof typeof paddings;
export type CardRounded = keyof typeof roundedSizes;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: CardVariant;
  /** Padding size */
  padding?: CardPadding;
  /** Border radius size */
  rounded?: CardRounded;
  /** Additional class names */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Card component for containing content with consistent styling.
 *
 * @example
 * <Card variant="default" padding="md">Content here</Card>
 * <Card variant="muted" padding="sm" rounded="lg">Nested card</Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'default', padding = 'md', rounded = 'xl', className = '', children, ...props },
  ref
) {
  const baseStyles = [
    roundedSizes[rounded],
    variants[variant],
    paddings[padding],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={baseStyles} {...props}>
      {children}
    </div>
  );
});
