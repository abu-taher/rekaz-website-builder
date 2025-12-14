'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

import { SECTION_LIBRARY } from '@/lib/sections';
import type { SectionInstance } from '@/lib/sections';
import { useLayoutStore } from '@/lib/store';
import {
  loadSectionsFromStorage,
  saveSectionsToStorage,
  downloadAsJson,
  parseImportData,
} from '@/lib/storage';
import { Button, Card, EmptyState } from '@/components/ui';
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

type MobileTab = 'library' | 'preview';

export function Editor() {
  const sections = useLayoutStore((state) => state.sections);
  const selectedSectionId = useLayoutStore((state) => state.selectedSectionId);
  const addSection = useLayoutStore((state) => state.addSection);
  const reorderSections = useLayoutStore((state) => state.reorderSections);
  const reset = useLayoutStore((state) => state.reset);
  const replaceAll = useLayoutStore((state) => state.replaceAll);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeSection, setActiveSection] = useState<SectionInstance | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>('library');

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

  // Memoized callback for section selection to maintain stable reference
  const handleSectionSelect = useCallback(() => {
    setMobileTab('library');
  }, []);

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
    downloadAsJson(sections);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous messages
    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result?.toString() ?? '';
      
      // Check if it's valid JSON first
      try {
        JSON.parse(text);
      } catch {
        setImportError('Invalid JSON file. Please select a valid JSON file exported from this builder.');
        if (event.target) event.target.value = '';
        return;
      }

      const validSections = parseImportData(text);

      if (validSections.length > 0) {
        replaceAll(validSections);
        setImportSuccess(`Successfully imported ${validSections.length} section${validSections.length > 1 ? 's' : ''}.`);
        // Auto-hide success message after 3 seconds
        setTimeout(() => setImportSuccess(null), 3000);
      } else {
        setImportError(
          'No valid sections found in the file. Each section must have: id, type (hero, header, features, footer, cta, or testimonial), props, and styles.'
        );
      }

      // Reset input value so we can re-upload same file if needed
      if (event.target) {
        event.target.value = '';
      }
    };

    reader.onerror = () => {
      setImportError('Failed to read file. Please try again.');
      if (event.target) event.target.value = '';
    };

    reader.readAsText(file);
  };

  const handleClear = () => {
    reset();
  };

  const handleLivePreview = () => {
    window.open('/preview', '_blank');
  };

  // Load sections from localStorage on mount
  useEffect(() => {
    const storedSections = loadSectionsFromStorage();
    if (storedSections.length > 0) {
      replaceAll(storedSections);
    }
  }, [replaceAll]);

  // Save sections to localStorage whenever they change
  useEffect(() => {
    saveSectionsToStorage(sections);
  }, [sections]);

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] gap-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-2 pb-3 border-b-2 border-gray-200">
        <div className="text-sm text-gray-600 font-medium">
          Build your page by adding sections, editing properties, and reordering
          them.
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleLivePreview}
            aria-label="Open live preview in new tab"
            className="gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Live Preview
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={handleExport}
            aria-label="Export layout as JSON"
          >
            Export JSON
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={handleImportClick}
            aria-label="Import layout from JSON"
          >
            Import JSON
          </Button>

          <Button
            variant="danger"
            size="md"
            onClick={handleClear}
            aria-label="Clear all sections"
          >
            Clear
          </Button>

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

      {/* Import feedback messages */}
      {importError && (
        <div 
          role="alert"
          className="flex items-center justify-between gap-3 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm animate-fade-slide-in"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span>{importError}</span>
          </div>
          <button
            type="button"
            onClick={() => setImportError(null)}
            className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {importSuccess && (
        <div 
          role="status"
          className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-200 rounded-lg text-green-700 text-sm animate-fade-slide-in"
        >
          <span className="text-lg">✅</span>
          <span>{importSuccess}</span>
        </div>
      )}

      {/* Mobile Tab Switcher - only visible on small screens */}
      <div className="md:hidden flex gap-1 p-1 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => setMobileTab('library')}
          className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${
            mobileTab === 'library'
              ? 'bg-white text-[#F17265] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-pressed={mobileTab === 'library'}
        >
          📚 Library & Edit
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${
            mobileTab === 'preview'
              ? 'bg-white text-[#F17265] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-pressed={mobileTab === 'preview'}
        >
          👁️ Preview {sections.length > 0 && `(${sections.length})`}
        </button>
      </div>

      {/* Main content: sidebar + preview */}
      <div className="flex flex-col md:flex-row flex-1 gap-4 min-h-0">
        {/* Sidebar - hidden on mobile when preview tab is active */}
        <aside 
          className={`w-full md:w-1/3 lg:w-1/4 overflow-y-auto overscroll-contain scrollbar-styled bg-white rounded-xl border-2 border-gray-200 p-4 shadow-sm md:flex-shrink-0 min-h-0 ${
            mobileTab === 'preview' ? 'hidden md:block' : 'block flex-1 md:flex-initial'
          }`}
        >
          <h2 className="text-xl font-bold mb-4 text-[#030014]">Section Library</h2>

          <div className="space-y-2 mb-6">
            {SECTION_LIBRARY.map((def) => (
              <button
                key={def.type}
                type="button"
                onClick={() => {
                  addSection(def.type);
                  // Stay on library tab to edit the new section's properties
                }}
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

        {/* Preview - hidden on mobile when library tab is active */}
        <main 
          className={`bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 overflow-y-auto overscroll-contain scrollbar-styled min-h-0 shadow-sm ${
            mobileTab === 'library' ? 'hidden md:flex md:flex-col md:flex-1' : 'flex flex-col flex-1'
          }`}
          role="main"
          aria-label="Preview area"
        >
          <h2 className="text-xl font-bold mb-4 text-[#030014]">Preview</h2>

          {sections.length === 0 ? (
            <Card variant="dashed" padding="lg" className="min-h-[300px] animate-scale-in">
              <EmptyState
                icon="📦"
                title="No sections yet"
                description="Add one from the library on the left to get started."
              />
            </Card>
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
                    <SectionSortableItem 
                      key={section.id} 
                      section={section}
                      onSelect={handleSectionSelect}
                    />
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
