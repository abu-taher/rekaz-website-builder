import Link from 'next/link';

/**
 * Custom 404 page shown when a route is not found.
 * This is a Server Component (no "use client" directive).
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-bold text-[#F17265] mb-4">404</div>
        <h1 className="text-2xl font-bold text-[#030014] mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#F17265] text-white rounded-full font-semibold hover:bg-[#E25C4F] transition-all shadow-md hover:shadow-lg"
        >
          Go to Editor
        </Link>
      </div>
    </div>
  );
}
