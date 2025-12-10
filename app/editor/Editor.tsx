'use client';

import { SECTION_LIBRARY } from '@/lib/sections';
import { useLayoutStore } from '@/lib/store';
import { SectionRenderer } from './SectionRenderer';
import { PropertyPanel } from './PropertyPanel';

export function Editor() {
  const sections = useLayoutStore((state) => state.sections);
  const selectedSectionId = useLayoutStore((state) => state.selectedSectionId);
  const addSection = useLayoutStore((state) => state.addSection);
  const selectSection = useLayoutStore((state) => state.selectSection);
  const selectedSection = sections.find(
    (section) => section.id === selectedSectionId
  );

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

        <div className="border-t border-slate-800 pt-3 mt-2 space-y-2">
          <h3 className="text-sm font-semibold">Properties</h3>
          <PropertyPanel section={selectedSection} />
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
            {sections.map((section) => {
              const isSelected = section.id === selectedSectionId;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => selectSection(section.id)}
                  className={[
                    'w-full text-left border rounded-xl p-4 bg-slate-900/60 transition group',
                    isSelected
                      ? 'border-sky-500/80 shadow-[0_0_0_1px_rgba(56,189,248,0.4)]'
                      : 'border-slate-700 hover:border-sky-500/60',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wide text-slate-400">
                      {section.type}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] px-2 py-[2px] rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/40">
                        Selected
                      </span>
                    )}
                  </div>
                  <SectionRenderer section={section} />
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
