// =============================================================================
// UI Primitives - Design System Components
// =============================================================================
//
// These are reusable, low-level UI components that form the foundation of
// the application's design system. They should be:
//
// - Stateless (or minimal local state)
// - Styled consistently with the brand
// - Accessible by default
// - Composable with other primitives
//
// Usage:
//   import { Button, Input, Card } from '@/components/ui';
//
// =============================================================================

// Form Controls
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './button';
export { Input, type InputProps, inputBaseStyles } from './input';
export { Textarea, type TextareaProps } from './textarea';
export { Select, type SelectProps } from './select';
export { Label, type LabelProps } from './label';

// Layout
export { Card, type CardProps, type CardVariant } from './card';

// Feedback
export { EmptyState, type EmptyStateProps } from './empty-state';
export { Badge, type BadgeProps, type BadgeVariant } from './badge';
