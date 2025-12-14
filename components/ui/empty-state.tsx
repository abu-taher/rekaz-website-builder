import type { ReactNode } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface EmptyStateProps {
  /** Icon or emoji to display */
  icon: ReactNode;
  /** Main title */
  title: string;
  /** Description text */
  description?: string;
  /** Action button or link */
  action?: ReactNode;
  /** Additional class names */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Empty state component for when there's no content to display.
 *
 * @example
 * <EmptyState
 *   icon="📦"
 *   title="No sections yet"
 *   description="Add one from the library."
 *   action={<Button>Add Section</Button>}
 * />
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 ${className}`.trim()}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      {description && (
        <p className="text-gray-600 text-sm max-w-md mb-4">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
