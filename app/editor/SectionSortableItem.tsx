'use client';

import React, { memo } from 'react';
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

  const isSelected = section.id === selectedSectionId;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    cursor: isDragging ? 'grabbing' : 'default',
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
          selectSection(section.id);
        }
      }}
      className={[
        'w-full text-left border-2 rounded-xl p-4 bg-white transition group cursor-pointer',
        isSelected
          ? 'border-[#F17265] shadow-lg ring-2 ring-[#F17265] ring-opacity-20'
          : 'border-gray-200 hover:border-[#F17265] hover:shadow-md',
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
