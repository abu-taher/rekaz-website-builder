'use client';

import React, { memo, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SectionInstance } from '@/lib/sections';
import { SectionRenderer } from './SectionRenderer';
import { useLayoutStore } from '@/lib/store';
import { Button, Badge } from '@/components/ui';

type Props = {
  section: SectionInstance;
  onSelect?: () => void;
};

/**
 * Custom comparator for memo - only re-render if section content actually changed.
 * Compares by ID first (fast path), then by serialized content.
 */
function arePropsEqual(prevProps: Props, nextProps: Props): boolean {
  // Fast path: different IDs means definitely re-render
  if (prevProps.section.id !== nextProps.section.id) return false;
  
  // Compare type
  if (prevProps.section.type !== nextProps.section.type) return false;
  
  // Compare onSelect callback reference to avoid stale closures
  if (prevProps.onSelect !== nextProps.onSelect) return false;
  
  // Deep compare props and styles via JSON (safe for our simple data)
  const prevJson = JSON.stringify({ props: prevProps.section.props, styles: prevProps.section.styles });
  const nextJson = JSON.stringify({ props: nextProps.section.props, styles: nextProps.section.styles });
  
  return prevJson === nextJson;
}

export const SectionSortableItem = memo(function SectionSortableItem({
  section,
  onSelect,
}: Props) {
  const selectedSectionId = useLayoutStore((s) => s.selectedSectionId);
  const selectSection = useLayoutStore((s) => s.selectSection);
  const removeSection = useLayoutStore((s) => s.removeSection);
  const isNewRef = useRef(true);

  const isSelected = section.id === selectedSectionId;

  const handleSelect = () => {
    selectSection(section.id);
    onSelect?.();
  };

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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      }}
      className={[
        'w-full text-left border-2 rounded-xl p-4 group cursor-pointer',
        'transition-all duration-200 ease-out',
        'animate-fade-slide-in',
        isDragging
          ? 'opacity-40 border-dashed border-[#F17265] bg-[#FFF5F4] scale-[0.98]'
          : 'bg-white opacity-100',
        isSelected && !isDragging
          ? 'border-[#F17265] selected-section'
          : !isDragging && 'border-gray-200 hover:border-[#F17265] hover:shadow-md hover:-translate-y-0.5',
      ].filter(Boolean).join(' ')}
    >
      <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          {/* Drag handle - larger on mobile for easier touch */}
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            {...listeners}
            {...attributes}
            className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white min-w-[44px] min-h-[44px] w-11 h-11 md:w-8 md:h-8 md:min-w-[32px] md:min-h-[32px] text-base md:text-sm font-bold text-gray-600 hover:border-[#F17265] hover:text-[#F17265] active:border-[#F17265] active:text-[#F17265] active:bg-[#FFF5F4] cursor-grab active:cursor-grabbing transition-all focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 touch-none select-none"
            aria-label="Hold and drag to reorder section"
          >
            ⠿
          </button>

          <span className="text-xs uppercase tracking-wide font-semibold text-gray-600">
            {section.type}
          </span>

          {isSelected && (
            <Badge variant="primary" className="hidden sm:inline-flex">
              Selected
            </Badge>
          )}
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            removeSection(section.id);
          }}
          aria-label="Delete section"
        >
          Delete
        </Button>
      </div>

      <SectionRenderer section={section} />
    </div>
  );
}, arePropsEqual);
