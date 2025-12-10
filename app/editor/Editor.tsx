'use client';

import React from 'react';

export function Editor() {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] gap-4">
      {/* Sidebar */}
      <aside className="w-full md:w-1/3 lg:w-1/4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3">Section Library</h2>
        <div className="text-sm text-slate-400">
          Pre-made sections will appear here. Click to add them.
        </div>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3">Preview</h2>

        <div className="border border-dashed border-slate-700 rounded-lg p-6 text-sm text-slate-400 flex items-center justify-center min-h-[300px]">
          No sections yet. Add one from the library.
        </div>
      </main>
    </div>
  );
}
