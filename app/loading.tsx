/**
 * Global loading state shown during navigation.
 * This is a Server Component (no "use client" directive).
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#F17265] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
