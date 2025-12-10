'use client';

import { SECTION_LIBRARY } from '@/lib/sections';
import { useLayoutStore } from '@/lib/store';
import { SectionRenderer } from './SectionRenderer';
import { PropertyPanel } from './PropertyPanel';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SectionSortableItem } from './SectionSortableItem';

export function Editor() {
  const sections = useLayoutStore((state) => state.sections);
  const selectedSectionId = useLayoutStore((state) => state.selectedSectionId);
  const selectSection = useLayoutStore((state) => state.selectSection);
  const addSection = useLayoutStore((state) => state.addSection);
  const reorderSections = useLayoutStore((state) => state.reorderSections);

  const selectedSection = sections.find(
    (section) => section.id === selectedSectionId
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    reorderSections(oldIndex, newIndex);
  };

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
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {sections.map((section) => (
                  <SectionSortableItem key={section.id} section={section} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </main>
    </div>
  );
}
