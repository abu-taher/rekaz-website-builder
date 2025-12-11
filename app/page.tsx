import { Editor } from './editor/Editor';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between bg-white shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Rekaz Mini Website Builder
        </h1>
        <span className="text-sm text-gray-600 font-medium">
          SSR Friendly • Assignment Demo
        </span>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <Editor />
        </div>
      </main>
    </div>
  );
}
