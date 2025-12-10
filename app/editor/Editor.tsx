'use client';

import { useRef, useEffect } from 'react';

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
  const reset = useLayoutStore((state) => state.reset);
  const replaceAll = useLayoutStore((state) => state.replaceAll);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleExport = () => {
    try {
      const data = JSON.stringify(sections, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'rekaz-layout.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export layout:', error);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result?.toString() ?? '';
        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed)) {
          console.warn('Invalid layout file: expected an array');
          return;
        }

        // Very light validation: ensure each item has id, type, props
        const validSections = parsed.filter(
          (item) =>
            item &&
            typeof item.id === 'string' &&
            typeof item.type === 'string' &&
            'props' in item
        );

        replaceAll(validSections);
      } catch (error) {
        console.error('Failed to import layout:', error);
      } finally {
        // reset input value so we can re-upload same file if needed
        if (event.target) {
          event.target.value = '';
        }
      }
    };

    reader.readAsText(file);
  };

  const handleClear = () => {
    reset();
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const raw = window.localStorage.getItem('rekaz-layout');
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      const validSections = parsed.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) =>
          item &&
          typeof item.id === 'string' &&
          typeof item.type === 'string' &&
          'props' in item
      );

      if (validSections.length > 0) {
        replaceAll(validSections);
      }
    } catch (error) {
      console.error('Failed to load layout from localStorage:', error);
    }
  }, [replaceAll]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const data = JSON.stringify(sections);
      window.localStorage.setItem('rekaz-layout', data);
    } catch (error) {
      console.error('Failed to save layout to localStorage:', error);
    }
  }, [sections]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-2 pb-2 border-b border-slate-800">
        <div className="text-xs text-slate-400">
          Build your page by adding sections, editing properties, and reordering
          them.
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="text-xs px-3 py-1.5 rounded-md border border-slate-700 bg-slate-900 hover:border-sky-500 hover:text-sky-300 transition"
          >
            Export JSON
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            className="text-xs px-3 py-1.5 rounded-md border border-slate-700 bg-slate-900 hover:border-emerald-500 hover:text-emerald-300 transition"
          >
            Import JSON
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="text-xs px-3 py-1.5 rounded-md border border-red-600/70 bg-slate-900 text-red-300 hover:bg-red-500/10 hover:border-red-400 transition"
          >
            Clear
          </button>

          {/* hidden file input for import */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Main content: sidebar + preview */}
      <div className="flex flex-col md:flex-row flex-1 gap-4 min-h-0">
        {/* Sidebar */}
        <aside className="w-full md:w-1/3 lg:w-1/4 overflow-y-auto max-h-full min-h-[50vh]">
          <h2 className="text-lg font-semibold mb-3">Section Library</h2>

          <div className="space-y-2 mb-4">
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
        <main className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-y-auto max-h-full min-h-[50vh]">
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
    </div>
  );
}
