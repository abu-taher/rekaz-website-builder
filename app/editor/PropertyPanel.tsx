'use client';

import React, { memo } from 'react';
import type { SectionInstance } from '@/lib/sections';
import { useLayoutStore } from '@/lib/store';

type PropertyPanelProps = {
  section: SectionInstance | undefined;
};

export const PropertyPanel = memo(function PropertyPanel({
  section,
}: PropertyPanelProps) {
  const updateSection = useLayoutStore((s) => s.updateSection);

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

  const props = section.props ?? {};

  switch (section.type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#030014]">Hero Settings</h3>

          <div className="space-y-2">
            <label htmlFor="hero-title" className="text-sm font-medium text-gray-700 block">Title</label>
            <input
              id="hero-title"
              type="text"
              value={props.title ?? ''}
              onChange={handleChange('title')}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="hero-subtitle" className="text-sm font-medium text-gray-700 block">Subtitle</label>
            <textarea
              id="hero-subtitle"
              value={props.subtitle ?? ''}
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
              value={props.buttonLabel ?? ''}
              onChange={handleChange('buttonLabel')}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="hero-image" className="text-sm font-medium text-gray-700 block">Image URL</label>
            <input
              id="hero-image"
              type="url"
              value={props.imageUrl ?? ''}
              onChange={handleChange('imageUrl')}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all"
            />
            <p className="text-xs text-gray-500">Enter a valid image URL (leave empty to hide image)</p>
          </div>
        </div>
      );

    case 'header': {
      const navItemsString = (props.navItems ?? []).join(', ');

      const handleNavItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const items = raw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        updateSection(section.id, { navItems: items });
      };

      return (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#030014]">Header Settings</h3>

          <div className="space-y-2">
            <label htmlFor="header-logo" className="text-sm font-medium text-gray-700 block">Logo Text</label>
            <input
              id="header-logo"
              type="text"
              value={props.logoText ?? ''}
              onChange={handleChange('logoText')}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="header-nav" className="text-sm font-medium text-gray-700 block">
              Nav Items (comma separated)
            </label>
            <input
              id="header-nav"
              type="text"
              value={navItemsString}
              onChange={handleNavItemsChange}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none transition-all"
            />
          </div>
        </div>
      );
    }

    case 'features': {
      const items: { title: string; description: string }[] = props.items ?? [];

      const handleItemChange = (
        index: number,
        field: 'title' | 'description',
        value: string
      ) => {
        const newItems = items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        );
        updateSection(section.id, { items: newItems });
      };

      const handleAddItem = () => {
        const newItems = [
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
              value={props.heading ?? ''}
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

    case 'footer':
      return (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#030014]">Footer Settings</h3>

          <div className="space-y-2">
            <label htmlFor="footer-text" className="text-sm font-medium text-gray-700 block">Text</label>
            <textarea
              id="footer-text"
              value={props.text ?? ''}
              onChange={handleChange('text')}
              rows={3}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm text-[#030014] focus:border-[#F17265] focus:ring-2 focus:ring-[#F17265] focus:ring-opacity-20 outline-none resize-none transition-all"
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
          No editor defined for type:{' '}
          <span className="font-mono font-semibold text-[#030014]">{section.type}</span>
        </div>
      );
  }
});
