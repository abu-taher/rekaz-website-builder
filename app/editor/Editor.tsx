'use client';

import { useRef, useEffect, useState } from 'react';

import { SECTION_LIBRARY, SectionInstance } from '@/lib/sections';
import { useLayoutStore } from '@/lib/store';
import { PropertyPanel } from './PropertyPanel';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

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
    setActiveId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string | null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveSection(null);
    setActiveId(null);
    setOverId(null);
    
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
            className="text-sm px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-[#030014] font-medium hover:border-[#F17265] hover:text-[#F17265] hover:bg-[#FFF5F4] transition-all focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20"
          >
            Export JSON
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            aria-label="Import layout from JSON"
            className="text-sm px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-[#030014] font-medium hover:border-[#F17265] hover:text-[#F17265] hover:bg-[#FFF5F4] transition-all focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20"
          >
            Import JSON
          </button>

          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear all sections"
            className="text-sm px-4 py-2 rounded-lg border-2 border-[#F17265] bg-white text-[#F17265] font-medium hover:bg-[#F17265] hover:text-white transition-all focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20"
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
            >
              <SortableContext
                items={sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {sections.map((section) => {
                    const activeIndex = activeId ? sections.findIndex(s => s.id === activeId) : -1;
                    const overIndex = overId ? sections.findIndex(s => s.id === overId) : -1;
                    
                    // Show drop indicator above this section if:
                    // - We're dragging (activeId exists)
                    // - This section is the one being hovered over (overId matches)
                    // - The dragged item would be placed above this item
                    const showDropIndicatorAbove = 
                      activeId && 
                      overId === section.id && 
                      activeId !== section.id &&
                      activeIndex > overIndex;
                    
                    // Show drop indicator below this section if:
                    // - We're dragging (activeId exists)
                    // - This section is the one being hovered over (overId matches)
                    // - The dragged item would be placed below this item
                    const showDropIndicatorBelow = 
                      activeId && 
                      overId === section.id && 
                      activeId !== section.id &&
                      activeIndex < overIndex;

                    return (
                      <div key={section.id}>
                        {showDropIndicatorAbove && (
                          <div className="h-1 bg-[#F17265] rounded-full mb-4 animate-pulse" />
                        )}
                        <SectionSortableItem 
                          section={section} 
                          isOver={overId === section.id && activeId !== section.id}
                        />
                        {showDropIndicatorBelow && (
                          <div className="h-1 bg-[#F17265] rounded-full mt-4 animate-pulse" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </SortableContext>
              
              <DragOverlay dropAnimation={{
                duration: 200,
                easing: 'ease-out',
              }}>
                {activeSection ? (
                  <div className="w-full border-2 border-[#F17265] rounded-xl p-4 bg-white shadow-2xl scale-[1.02] ring-2 ring-[#F17265] ring-opacity-30">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center justify-center rounded-lg border-2 border-[#F17265] bg-white w-8 h-8 text-sm font-bold text-[#F17265]">
                        ⠿
                      </span>
                      <span className="text-xs uppercase tracking-wide font-semibold text-gray-600">
                        {activeSection.type}
                      </span>
                    </div>
                    <SectionRenderer section={activeSection} />
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
