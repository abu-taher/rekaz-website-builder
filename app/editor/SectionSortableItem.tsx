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
      className={[
        'w-full text-left border rounded-xl p-4 bg-slate-900/60 transition group',
        isSelected
          ? 'border-sky-500/80 shadow-[0_0_0_1px_rgba(56,189,248,0.4)]'
          : 'border-slate-700 hover:border-sky-500/60',
      ].join(' ')}
    >
      <div className="flex items-center justify-between mb-2 gap-2">
        <span className="text-[11px] uppercase tracking-wide text-slate-400">
          {section.type}
        </span>

        <div className="flex items-center gap-2">
          {isSelected && (
            <span className="text-[10px] px-2 py-[2px] rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/40">
              Selected
            </span>
          )}

          {/* Drag handle */}
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            {...listeners}
            {...attributes}
            className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-300 hover:border-sky-500/70 hover:text-sky-300 cursor-grab active:cursor-grabbing"
            aria-label="Drag section"
          >
            ⠿
          </button>
        </div>
      </div>

      <SectionRenderer section={section} />
    </div>
  );
});
