'use client';

import React, { memo, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SectionInstance } from '@/lib/sections';
import { SectionRenderer } from './SectionRenderer';
import { useLayoutStore } from '@/lib/store';

type Props = {
  section: SectionInstance;
};

export const SectionSortableItem = memo(function SectionSortableItem({
  section,
}: Props) {
  const selectedSectionId = useLayoutStore((s) => s.selectedSectionId);
  const selectSection = useLayoutStore((s) => s.selectSection);
  const removeSection = useLayoutStore((s) => s.removeSection);
  const isNewRef = useRef(true);

  const isSelected = section.id === selectedSectionId;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  // Mark as not new after first render
  useEffect(() => {
    const timer = setTimeout(() => {
      isNewRef.current = false;
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 0.2s ease',
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectSection(section.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectSection(section.id);
        }
      }}
      className={[
        'w-full text-left border-2 rounded-xl p-4 bg-white group cursor-pointer',
        'transition-all duration-200 ease-out',
        'animate-fade-slide-in',
        isDragging
          ? 'dragging-overlay opacity-90 border-[#F17265]'
          : 'opacity-100',
        isSelected
          ? 'border-[#F17265] selected-section'
          : 'border-gray-200 hover:border-[#F17265] hover:shadow-md hover:-translate-y-0.5',
      ].join(' ')}
    >
      <div className="flex items-center justify-between mb-3 gap-2">
        <span className="text-xs uppercase tracking-wide font-semibold text-gray-600">
          {section.type}
        </span>

        <div className="flex items-center gap-2">
          {isSelected && (
            <span className="text-xs px-3 py-1 rounded-full bg-[#FFF5F4] text-[#F17265] border-2 border-[#F17265] font-medium">
              Selected
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeSection(section.id);
            }}
            aria-label="Delete section"
            className="inline-flex items-center justify-center rounded-lg border-2 border-[#F17265] bg-white px-3 py-1 text-xs font-medium text-[#F17265] hover:bg-[#F17265] hover:text-white transition-all focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20"
          >
            Delete
          </button>

          {/* Drag handle */}
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            {...listeners}
            {...attributes}
            className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-3 py-1 text-xs font-bold text-gray-600 hover:border-[#F17265] hover:text-[#F17265] cursor-grab active:cursor-grabbing transition-all focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20"
            aria-label="Drag to reorder section"
          >
            ⠿
          </button>
        </div>
      </div>

      <SectionRenderer section={section} />
    </div>
  );
});
