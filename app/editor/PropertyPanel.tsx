'use client';

import React, { memo, useState } from 'react';
import type {
  SectionInstance,
  SectionType,
  NavItem,
  FeatureItem,
} from '@/lib/sections';
import { useLayoutStore } from '@/lib/store';
import { Button, Input, Textarea, Select, Label, Card } from '@/components/ui';

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
      <Card variant="dashed" padding="md" className="rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          Select a section in the preview to edit its content.
        </p>
      </Card>
    );
  }

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      updateSection(section.id, { [field]: e.target.value });
    };

  switch (section.type) {
    case 'hero': {
      const { title, subtitle, buttonLabel, imageUrl } = section.props;
      return (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#030014]">Hero Settings</h3>

          <div className="space-y-2">
            <Label htmlFor="hero-title">Title</Label>
            <Input
              id="hero-title"
              type="text"
              value={title}
              onChange={handleChange('title')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Textarea
              id="hero-subtitle"
              value={subtitle ?? ''}
              onChange={handleChange('subtitle')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-button">Button Label</Label>
            <Input
              id="hero-button"
              type="text"
              value={buttonLabel ?? ''}
              onChange={handleChange('buttonLabel')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-image" hint="Enter a valid image URL (leave empty to hide image)">
              Image URL
            </Label>
            <Input
              id="hero-image"
              type="url"
              value={imageUrl ?? ''}
              onChange={handleChange('imageUrl')}
              placeholder="https://example.com/image.jpg"
            />
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
            <Label htmlFor="header-logo">Logo Text</Label>
            <Input
              id="header-logo"
              type="text"
              value={logoText}
              onChange={handleChange('logoText')}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Navigation Items</span>
              <Button variant="danger" size="sm" onClick={handleAddNavItem}>
                + Add Link
              </Button>
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
              <Card variant="dashed" padding="md" className="rounded-lg">
                <p className="text-xs text-gray-500 text-center">
                  No navigation items. Click &quot;Add Link&quot; to create one.
                </p>
              </Card>
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
            <Label htmlFor="features-heading">Heading</Label>
            <Input
              id="features-heading"
              type="text"
              value={heading}
              onChange={handleChange('heading')}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Feature Items</span>
              <Button variant="danger" size="sm" onClick={handleAddItem}>
                + Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <Card key={index} variant="muted" padding="sm" className="rounded-lg space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Item {index + 1}
                  </span>
                  <Button
                    variant="danger-subtle"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                    aria-label={`Remove feature item ${index + 1}`}
                  >
                    Remove
                  </Button>
                </div>

                <Input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                  placeholder="Feature title"
                />

                <Textarea
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="Feature description"
                  rows={2}
                />
              </Card>
            ))}

            {items.length === 0 && (
              <Card variant="dashed" padding="md" className="rounded-lg">
                <p className="text-xs text-gray-500 text-center">
                  No feature items. Click &quot;Add Item&quot; to create one.
                </p>
              </Card>
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
            <Label htmlFor="footer-text">Text</Label>
            <Textarea
              id="footer-text"
              value={text}
              onChange={handleChange('text')}
              rows={3}
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
      onLinkChange(availableSections[0]?.linkValue || '#');
    } else {
      onLinkChange('https://');
    }
  };

  return (
    <Card variant="muted" padding="sm" className="rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase">
          Link {index + 1}
        </span>
        <Button
          variant="danger-subtle"
          size="sm"
          onClick={onRemove}
          aria-label={`Remove nav item ${index + 1}`}
        >
          Remove
        </Button>
      </div>

      {/* Label Input */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Label</label>
        <Input
          type="text"
          value={item.label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Link label"
        />
      </div>

      {/* Link Type Selector */}
      <div className="space-y-2">
        <label className="text-xs text-gray-500">Link To</label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={linkType === 'section' ? 'danger' : 'outline'}
            size="md"
            onClick={() => handleLinkTypeChange('section')}
            className="flex-1 min-h-[44px]"
          >
            📑 Section
          </Button>
          <Button
            type="button"
            variant={linkType === 'external' ? 'danger' : 'outline'}
            size="md"
            onClick={() => handleLinkTypeChange('external')}
            className="flex-1 min-h-[44px]"
          >
            🔗 External
          </Button>
        </div>
      </div>

      {/* Link Input based on type */}
      {linkType === 'section' ? (
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Select Section</label>
          {availableSections.length > 0 ? (
            <Select
              value={item.link}
              onChange={(e) => onLinkChange(e.target.value)}
            >
              <option value="#">-- Select a section --</option>
              {availableSections.map((sec) => (
                <option key={sec.id} value={sec.linkValue}>
                  {sec.displayName}
                </option>
              ))}
            </Select>
          ) : (
            <Card variant="muted" padding="sm" className="rounded-lg border-amber-200 bg-amber-50">
              <p className="text-xs text-amber-600">
                No sections available. Add Hero, Features, or Footer sections first.
              </p>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <label className="text-xs text-gray-500">External URL</label>
          <Input
            type="url"
            value={item.link}
            onChange={(e) => onLinkChange(e.target.value)}
            placeholder="https://example.com"
            className="min-h-[44px]"
          />
        </div>
      )}
    </Card>
  );
}
