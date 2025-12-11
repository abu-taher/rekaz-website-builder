'use client';

import { useRef, useEffect, useState } from 'react';

import { SECTION_LIBRARY, SectionInstance } from '@/lib/sections';
import { useLayoutStore } from '@/lib/store';
import { PropertyPanel } from './PropertyPanel';
import {
  DndContext,
  closestCenter,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SectionSortableItem } from './SectionSortableItem';
import { SectionRenderer } from './SectionRenderer';

export function Editor() {
  const sections = useLayoutStore((state) => state.sections);
  const selectedSectionId = useLayoutStore((state) => state.selectedSectionId);
  const addSection = useLayoutStore((state) => state.addSection);
  const reorderSections = useLayoutStore((state) => state.reorderSections);
  const reset = useLayoutStore((state) => state.reset);
  const replaceAll = useLayoutStore((state) => state.replaceAll);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeSection, setActiveSection] = useState<SectionInstance | null>(null);

  // Configure sensors for both mouse and touch support
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // Require 10px movement before drag starts
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150, // Hold for 150ms before drag starts on touch
      tolerance: 5,
    },
  });
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor, pointerSensor);

  const selectedSection = sections.find(
    (section) => section.id === selectedSectionId
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const section = sections.find((s) => s.id === active.id);
    setActiveSection(section || null);
    
    // Prevent body scroll on mobile during drag
    document.body.classList.add('dragging');
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;
    if (oldIndex === newIndex) return;

    // Move sections in real-time during drag
    reorderSections(oldIndex, newIndex);
  };

  const handleDragEnd = () => {
    setActiveSection(null);
    // Re-enable body scroll on mobile
    document.body.classList.remove('dragging');
  };

  const handleDragCancel = () => {
    setActiveSection(null);
    document.body.classList.remove('dragging');
  };

  const handleExport = () => {
    try {
      const data = JSON.stringify(sections, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const filename = `rekaz-layout-${new Date().toISOString().slice(0, 10)}.json`;

      // Check if Web Share API is available (better for mobile)
      if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        const file = new File([blob], filename, { type: 'application/json' });
        navigator.share({
          files: [file],
          title: 'Rekaz Layout',
          text: 'My website layout from Rekaz Builder',
        }).catch(() => {
          // Fallback to download if share fails
          downloadFile(url, filename);
        });
      } else {
        downloadFile(url, filename);
      }
    } catch (error) {
      console.error('Failed to export layout:', error);
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // Use setTimeout for better mobile compatibility
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
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

  const handleLivePreview = () => {
    window.open('/preview', '_blank');
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-2 pb-3 border-b-2 border-gray-200">
        <div className="text-sm text-gray-600 font-medium">
          Build your page by adding sections, editing properties, and reordering
          them.
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleLivePreview}
            aria-label="Open live preview in new tab"
            className="text-sm px-4 py-2 rounded-lg bg-[#F17265] text-white font-medium hover:bg-[#E25C4F] transition-all focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Live Preview
          </button>

          <button
            type="button"
            onClick={handleExport}
            aria-label="Export layout as JSON"
            className="text-sm px-3 py-2 md:px-4 rounded-lg border-2 border-gray-300 bg-white text-[#030014] font-medium hover:border-[#F17265] hover:text-[#F17265] hover:bg-[#FFF5F4] active:bg-[#FFF5F4] transition-all focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            aria-label="Import layout from JSON"
            className="text-sm px-3 py-2 md:px-4 rounded-lg border-2 border-gray-300 bg-white text-[#030014] font-medium hover:border-[#F17265] hover:text-[#F17265] hover:bg-[#FFF5F4] active:bg-[#FFF5F4] transition-all focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="hidden sm:inline">Import</span>
            <span className="sm:hidden">Import</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear all sections"
            className="text-sm px-3 py-2 md:px-4 rounded-lg border-2 border-[#F17265] bg-white text-[#F17265] font-medium hover:bg-[#F17265] hover:text-white active:bg-[#E25C4F] transition-all focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline">Clear</span>
            <span className="sm:hidden">Clear</span>
          </button>

          {/* hidden file input for import - accept both MIME type and extension for mobile compatibility */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json,text/plain"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="File input for importing JSON"
          />
        </div>
      </div>

      {/* Main content: sidebar + preview */}
      <div className="flex flex-col md:flex-row flex-1 gap-4 min-h-0">
        {/* Sidebar */}
        <aside className="w-full md:w-1/3 lg:w-1/4 overflow-y-auto scrollbar-styled max-h-full min-h-[50vh] bg-white rounded-xl border-2 border-gray-200 p-4 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-[#030014]">Section Library</h2>

          <div className="space-y-2 mb-6">
            {SECTION_LIBRARY.map((def) => (
              <button
                key={def.type}
                type="button"
                onClick={() => addSection(def.type)}
                aria-label={`Add ${def.label} section`}
                className="section-library-item w-full text-left border-2 border-gray-200 rounded-lg p-3 hover:border-[#F17265] hover:bg-[#FFF5F4] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 bg-white"
              >
                <div className="font-semibold text-[#030014]">{def.label}</div>
                <div className="text-sm text-gray-600 mt-1">{def.description}</div>
              </button>
            ))}
          </div>

          <div className="border-t-2 border-gray-200 pt-4 mt-4 space-y-3">
            <h3 className="text-base font-bold text-[#030014]">Properties</h3>
            <PropertyPanel section={selectedSection} />
          </div>
        </aside>

        {/* Preview */}
        <main 
          className="flex-1 bg-white border-2 border-gray-200 rounded-xl p-6 overflow-y-auto scrollbar-styled max-h-full min-h-[50vh] shadow-sm"
          role="main"
          aria-label="Preview area"
        >
          <h2 className="text-xl font-bold mb-4 text-[#030014]">Preview</h2>

          {sections.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-base text-gray-600 flex flex-col items-center justify-center min-h-[300px] bg-gray-50 animate-scale-in">
              <span className="text-4xl mb-3">📦</span>
              <span>No sections yet. Add one from the library.</span>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
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
              
              <DragOverlay dropAnimation={{
                duration: 200,
                easing: 'ease-out',
              }}>
                {activeSection ? (
                  <div className="w-full border-2 border-[#F17265] rounded-xl p-3 md:p-4 bg-white shadow-2xl scale-[1.02] ring-2 ring-[#F17265] ring-opacity-30 max-w-[calc(100vw-3rem)]">
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <span className="inline-flex items-center justify-center rounded-lg border-2 border-[#F17265] bg-[#FFF5F4] w-11 h-11 md:w-8 md:h-8 text-base md:text-sm font-bold text-[#F17265]">
                        ⠿
                      </span>
                      <span className="text-xs uppercase tracking-wide font-semibold text-[#F17265]">
                        {activeSection.type}
                      </span>
                      <span className="text-xs text-gray-500 hidden sm:inline">
                        (dragging)
                      </span>
                    </div>
                    <div className="opacity-80">
                      <SectionRenderer section={activeSection} />
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </main>
      </div>
    </div>
  );
}
