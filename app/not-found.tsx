import Link from 'next/link';
import { EmptyState } from '@/components/ui';

/**
 * Custom 404 page shown when a route is not found.
 * This is a Server Component (no "use client" directive).
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] p-6">
      <div className="max-w-md w-full">
        <EmptyState
          icon={<span className="text-8xl font-bold text-[#F17265]">404</span>}
          title="Page Not Found"
          description="The page you're looking for doesn't exist or has been moved."
          action={
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#F17265] text-white rounded-full font-semibold hover:bg-[#E25C4F] transition-all shadow-md hover:shadow-lg"
            >
              Go to Editor
            </Link>
          }
        />
      </div>
    </div>
  );
}
