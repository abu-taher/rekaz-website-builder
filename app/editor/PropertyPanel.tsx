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

    case 'features':
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

          {/* For assignment scope, we keep items static.
              Could extend later with repeater UI. */}
          <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
            Feature items are pre-defined for now. You can extend this to edit
            individual items.
          </p>
        </div>
      );

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
