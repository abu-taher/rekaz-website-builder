import { Editor } from './editor/Editor';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          Rekaz Mini Website Builder
        </h1>
        <span className="text-xs text-slate-400">
          SSR Friendly • Assignment Demo
        </span>
      </header>

      <main className="p-4">
        <Editor />
      </main>
    </div>
  );
}
