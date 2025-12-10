'use client';

import { SECTION_LIBRARY } from '@/lib/sections';
import { useLayoutStore } from '@/lib/store';
import { SectionRenderer } from './SectionRenderer';

export function Editor() {
  const sections = useLayoutStore((state) => state.sections);
  const addSection = useLayoutStore((state) => state.addSection);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] gap-4">
      {/* Sidebar */}
      <aside className="w-full md:w-1/3 lg:w-1/4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3">Section Library</h2>

        <div className="space-y-2">
          {SECTION_LIBRARY.map((def) => (
            <button
              key={def.type}
              type="button"
              onClick={() => addSection(def.type)}
              className="w-full text-left border border-slate-700 rounded-lg p-3 hover:border-sky-500 hover:bg-slate-800/60 transition"
            >
              <div className="font-medium">{def.label}</div>
              <div className="text-xs text-slate-400">{def.description}</div>
            </button>
          ))}
        </div>
      </aside>

      {/* Preview */}
      <main className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3">Preview</h2>

        {sections.length === 0 ? (
          <div className="border border-dashed border-slate-700 rounded-lg p-6 text-sm text-slate-400 flex items-center justify-center min-h-[300px]">
            No sections yet. Add one from the library.
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="group border border-slate-700 rounded-xl p-4 bg-slate-900/60 hover:border-sky-500/70 transition"
              >
                {/* Later we’ll add drag handle + delete + select here */}
                <SectionRenderer section={section} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
