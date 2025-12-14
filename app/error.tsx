'use client';

import { useEffect } from 'react';
import { Button, Card } from '@/components/ui';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Global error boundary for the application.
 * Catches unhandled errors and provides a recovery UI.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to console in development
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-[#030014] mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          An unexpected error occurred. Please try again or refresh the page.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <Card variant="muted" padding="md" className="mb-6 border-red-200 bg-red-50 text-left">
            <p className="text-sm font-mono text-red-700 break-words">
              {error.message}
            </p>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" size="lg" shape="pill" onClick={reset}>
            Try Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            shape="pill"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
}
