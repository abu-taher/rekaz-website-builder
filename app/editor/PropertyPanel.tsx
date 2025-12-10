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
      <div className="text-xs text-slate-400 border border-dashed border-slate-700 rounded-lg p-3">
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
        <div className="space-y-3">
          <h3 className="text-sm font-semibold mb-1">Hero Settings</h3>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Title</label>
            <input
              type="text"
              value={props.title ?? ''}
              onChange={handleChange('title')}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Subtitle</label>
            <textarea
              value={props.subtitle ?? ''}
              onChange={handleChange('subtitle')}
              rows={3}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs outline-none focus:border-sky-500 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Button Label</label>
            <input
              type="text"
              value={props.buttonLabel ?? ''}
              onChange={handleChange('buttonLabel')}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs outline-none focus:border-sky-500"
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
        <div className="space-y-3">
          <h3 className="text-sm font-semibold mb-1">Header Settings</h3>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Logo Text</label>
            <input
              type="text"
              value={props.logoText ?? ''}
              onChange={handleChange('logoText')}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">
              Nav Items (comma separated)
            </label>
            <input
              type="text"
              value={navItemsString}
              onChange={handleNavItemsChange}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs outline-none focus:border-sky-500"
            />
          </div>
        </div>
      );
    }

    case 'features':
      return (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold mb-1">Features Settings</h3>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Heading</label>
            <input
              type="text"
              value={props.heading ?? ''}
              onChange={handleChange('heading')}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs outline-none focus:border-sky-500"
            />
          </div>

          {/* For assignment scope, we keep items static.
              Could extend later with repeater UI. */}
          <p className="text-[11px] text-slate-500">
            Feature items are pre-defined for now. You can extend this to edit
            individual items.
          </p>
        </div>
      );

    case 'footer':
      return (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold mb-1">Footer Settings</h3>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Text</label>
            <textarea
              value={props.text ?? ''}
              onChange={handleChange('text')}
              rows={3}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs outline-none focus:border-sky-500 resize-none"
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="text-xs text-slate-400">
          No editor defined for type:{' '}
          <span className="font-mono">{section.type}</span>
        </div>
      );
  }
});
