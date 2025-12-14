'use client';

import React, { memo, useState } from 'react';
import type {
  SectionInstance,
  SectionType,
  NavItem,
  FeatureItem,
} from '@/lib/sections';
import { useLayoutStore } from '@/lib/store';

type PropertyPanelProps = {
  section: SectionInstance | undefined;
};

/** Map of section types to display names */
const SECTION_DISPLAY_NAMES: Record<SectionType, string> = {
  hero: 'Hero',
  header: 'Header',
  features: 'Features',
  footer: 'Footer',
};

/** Get a display-friendly name for a section, with index suffix for duplicates */
function getSectionDisplayName(type: SectionType, index: number): string {
  const baseName = SECTION_DISPLAY_NAMES[type] ?? type;
  return index > 0 ? `${baseName} ${index + 1}` : baseName;
}

export const PropertyPanel = memo(function PropertyPanel({
  section,
}: PropertyPanelProps) {
  const updateSection = useLayoutStore((s) => s.updateSection);
  const allSections = useLayoutStore((s) => s.sections);

  if (!section) {
    return (
      <div className="text-sm text-gray-600 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        Select a section in the preview to edit its content.
      </div>
    );
  }

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateSection(section.id, { [field]: e.target.value });
    };

  switch (section.type) {
    case 'hero': {
      const { title, subtitle, buttonLabel, imageUrl } = section.props;
      return (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#030014]">Hero Settings</h3>

          <div className="space-y-2">
            <label htmlFor="hero-title" className="text-sm font-medium text-gray-700 block">Title</label>
            <input
              id="hero-title"
              type="text"
              value={title}
              onChange={handleChange('title')}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="hero-subtitle" className="text-sm font-medium text-gray-700 block">Subtitle</label>
            <textarea
              id="hero-subtitle"
              value={subtitle ?? ''}
              onChange={handleChange('subtitle')}
              rows={3}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none resize-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="hero-button" className="text-sm font-medium text-gray-700 block">Button Label</label>
            <input
              id="hero-button"
              type="text"
              value={buttonLabel ?? ''}
              onChange={handleChange('buttonLabel')}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="hero-image" className="text-sm font-medium text-gray-700 block">Image URL</label>
            <input
              id="hero-image"
              type="url"
              value={imageUrl ?? ''}
              onChange={handleChange('imageUrl')}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all"
            />
            <p className="text-xs text-gray-500">Enter a valid image URL (leave empty to hide image)</p>
          </div>
        </div>
      );
    }

    case 'header': {
      const { logoText, navItems } = section.props;

      // Get available sections for linking (exclude current header)
      const availableSections = allSections
        .filter((s) => s.type !== 'header')
        .map((s, idx, arr) => {
          // Count how many of this type came before
          const typeCount = arr.slice(0, idx).filter((prev) => prev.type === s.type).length;
          return {
            id: s.id,
            type: s.type,
            displayName: getSectionDisplayName(s.type, typeCount),
            linkValue: typeCount > 0 ? `#${s.type}-${typeCount + 1}` : `#${s.type}`,
          };
        });

      const handleNavItemChange = (
        index: number,
        field: 'label' | 'link',
        value: string
      ) => {
        const newItems: NavItem[] = navItems.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        );
        updateSection(section.id, { navItems: newItems });
      };

      const handleAddNavItem = () => {
        const newItems: NavItem[] = [
          ...navItems,
          { label: 'New Link', link: '#' },
        ];
        updateSection(section.id, { navItems: newItems });
      };

      const handleRemoveNavItem = (index: number) => {
        const newItems = navItems.filter((_, i) => i !== index);
        updateSection(section.id, { navItems: newItems });
      };

      // Check if a link is a section link or external
      const isExternalLink = (link: string): boolean => {
        return Boolean(link && !link.startsWith('#'));
      };

      return (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#030014]">Header Settings</h3>

          <div className="space-y-2">
            <label htmlFor="header-logo" className="text-sm font-medium text-gray-700 block">Logo Text</label>
            <input
              id="header-logo"
              type="text"
              value={logoText}
              onChange={handleChange('logoText')}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Navigation Items</label>
              <button
                type="button"
                onClick={handleAddNavItem}
                className="text-xs px-3 py-1 rounded-lg border-2 border-[#F17265] text-[#F17265] font-medium hover:bg-[#F17265] hover:text-white transition-all"
              >
                + Add Link
              </button>
            </div>

            {navItems.map((item, index) => (
              <NavItemEditor
                key={index}
                index={index}
                item={item}
                availableSections={availableSections}
                isExternal={isExternalLink(item.link)}
                onLabelChange={(value) => handleNavItemChange(index, 'label', value)}
                onLinkChange={(value) => handleNavItemChange(index, 'link', value)}
                onRemove={() => handleRemoveNavItem(index)}
              />
            ))}

            {navItems.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                No navigation items. Click &quot;Add Link&quot; to create one.
              </p>
            )}
          </div>
        </div>
      );
    }

    case 'features': {
      const { heading, items } = section.props;

      const handleItemChange = (
        index: number,
        field: 'title' | 'description',
        value: string
      ) => {
        const newItems: FeatureItem[] = items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        );
        updateSection(section.id, { items: newItems });
      };

      const handleAddItem = () => {
        const newItems: FeatureItem[] = [
          ...items,
          { title: 'New Feature', description: 'Feature description' },
        ];
        updateSection(section.id, { items: newItems });
      };

      const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        updateSection(section.id, { items: newItems });
      };

      return (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#030014]">Features Settings</h3>

          <div className="space-y-2">
            <label htmlFor="features-heading" className="text-sm font-medium text-gray-700 block">Heading</label>
            <input
              id="features-heading"
              type="text"
              value={heading}
              onChange={handleChange('heading')}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Feature Items</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs px-3 py-1 rounded-lg border-2 border-[#F17265] text-[#F17265] font-medium hover:bg-[#F17265] hover:text-white transition-all"
              >
                + Add Item
              </button>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Item {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-xs px-2 py-1 rounded border border-red-300 text-red-500 hover:bg-red-50 transition-all"
                    aria-label={`Remove feature item ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>

                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                  placeholder="Feature title"
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all"
                />

                <textarea
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="Feature description"
                  rows={2}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none resize-none transition-all"
                />
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                No feature items. Click &quot;Add Item&quot; to create one.
              </p>
            )}
          </div>
        </div>
      );
    }

    case 'footer': {
      const { text } = section.props;
      return (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#030014]">Footer Settings</h3>

          <div className="space-y-2">
            <label htmlFor="footer-text" className="text-sm font-medium text-gray-700 block">Text</label>
            <textarea
              id="footer-text"
              value={text}
              onChange={handleChange('text')}
              rows={3}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none resize-none transition-all"
            />
          </div>
        </div>
      );
    }
  }
});

// -----------------------------------------------------------------------------
// NavItemEditor - Component for editing individual navigation items
// -----------------------------------------------------------------------------

type AvailableSectionLink = {
  id: string;
  type: SectionType;
  displayName: string;
  linkValue: string;
};

type NavItemEditorProps = {
  index: number;
  item: NavItem;
  availableSections: AvailableSectionLink[];
  isExternal: boolean;
  onLabelChange: (value: string) => void;
  onLinkChange: (value: string) => void;
  onRemove: () => void;
};

function NavItemEditor({
  index,
  item,
  availableSections,
  isExternal,
  onLabelChange,
  onLinkChange,
  onRemove,
}: NavItemEditorProps) {
  const [linkType, setLinkType] = useState<'section' | 'external'>(
    isExternal ? 'external' : 'section'
  );

  const handleLinkTypeChange = (type: 'section' | 'external') => {
    setLinkType(type);
    if (type === 'section') {
      // Reset to first available section or empty
      onLinkChange(availableSections[0]?.linkValue || '#');
    } else {
      // Reset to empty for external URL
      onLinkChange('https://');
    }
  };

  return (
    <div className="border-2 border-gray-200 rounded-lg p-3 space-y-3 bg-gray-50">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase">
          Link {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs px-3 py-1.5 rounded border border-red-300 text-red-500 hover:bg-red-50 active:bg-red-100 transition-all min-h-[32px]"
          aria-label={`Remove nav item ${index + 1}`}
        >
          Remove
        </button>
      </div>

      {/* Label Input */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Label</label>
        <input
          type="text"
          value={item.label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Link label"
          className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all"
        />
      </div>

      {/* Link Type Selector */}
      <div className="space-y-2">
        <label className="text-xs text-gray-500">Link To</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleLinkTypeChange('section')}
            className={`flex-1 text-xs sm:text-sm py-3 px-3 rounded-lg border-2 font-medium transition-all min-h-[44px] ${
              linkType === 'section'
                ? 'border-[#F17265] bg-[#FFF5F4] text-[#F17265]'
                : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 active:bg-gray-50'
            }`}
          >
            📑 Section
          </button>
          <button
            type="button"
            onClick={() => handleLinkTypeChange('external')}
            className={`flex-1 text-xs sm:text-sm py-3 px-3 rounded-lg border-2 font-medium transition-all min-h-[44px] ${
              linkType === 'external'
                ? 'border-[#F17265] bg-[#FFF5F4] text-[#F17265]'
                : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 active:bg-gray-50'
            }`}
          >
            🔗 External
          </button>
        </div>
      </div>

      {/* Link Input based on type */}
      {linkType === 'section' ? (
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Select Section</label>
          {availableSections.length > 0 ? (
            <select
              value={item.link}
              onChange={(e) => onLinkChange(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2.5 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all cursor-pointer min-h-[44px]"
            >
              <option value="#">-- Select a section --</option>
              {availableSections.map((sec) => (
                <option key={sec.id} value={sec.linkValue}>
                  {sec.displayName}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              No sections available. Add Hero, Features, or Footer sections first.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <label className="text-xs text-gray-500">External URL</label>
          <input
            type="url"
            value={item.link}
            onChange={(e) => onLinkChange(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2.5 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all min-h-[44px]"
          />
        </div>
      )}
    </div>
  );
}
