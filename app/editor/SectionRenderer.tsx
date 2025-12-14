'use client';

import React, { memo } from 'react';
import type { SectionInstance, SectionStyles, NavItem, FeatureItem } from '@/lib/sections';
import { PADDING_Y_CLASSES } from '@/lib/sections';
import { Button, Card } from '@/components/ui';

type SectionRendererProps = {
  section: SectionInstance;
};

/** Helper to build inline styles from section styles */
function buildInlineStyles(styles: SectionStyles): React.CSSProperties {
  const inlineStyles: React.CSSProperties = {};
  if (styles.backgroundColor) {
    inlineStyles.backgroundColor = styles.backgroundColor;
  }
  if (styles.textColor) {
    inlineStyles.color = styles.textColor;
  }
  return inlineStyles;
}

/** Helper to get padding class from styles */
function getPaddingClass(styles: SectionStyles): string {
  return PADDING_Y_CLASSES[styles.paddingY ?? 'md'];
}

/**
 * Renders a section based on its type.
 * Uses discriminated union narrowing for type-safe prop access.
 */
export const SectionRenderer = memo(function SectionRenderer({
  section,
}: SectionRendererProps) {
  switch (section.type) {
    case 'hero': {
      const { title, subtitle, buttonLabel, imageUrl } = section.props;
      const { styles } = section;
      const paddingClass = getPaddingClass(styles);
      const inlineStyles = buildInlineStyles(styles);
      const hasCustomBg = Boolean(styles.backgroundColor);
      
      return (
        <section 
          className={`relative ${paddingClass} text-center ${!hasCustomBg ? 'bg-gradient-to-b from-[#FFF5F4] to-white' : ''} rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden`}
          style={inlineStyles}
        >
          {imageUrl && !hasCustomBg && (
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt=""
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/90" />
            </div>
          )}
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 px-6">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm md:text-base mb-6 max-w-xl mx-auto px-6 opacity-80">
                {subtitle}
              </p>
            )}
            {buttonLabel && (
              <Button variant="primary" size="md" shape="pill">
                {buttonLabel}
              </Button>
            )}
          </div>
        </section>
      );
    }

    case 'header': {
      const { logoText, navItems } = section.props;
      const { styles } = section;
      const inlineStyles = buildInlineStyles(styles);
      
      return (
        <header 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-4 border-b-2 border-gray-200"
          style={inlineStyles}
        >
          <div className="font-bold text-xl">{logoText}</div>
          <nav className="flex flex-wrap gap-4 text-sm" role="navigation">
            {navItems.map((item: NavItem, idx: number) => (
              <a
                key={idx}
                href={item.link || '#'}
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#F17265] font-medium cursor-pointer transition text-sm md:text-base focus:outline-none focus:underline focus:decoration-[#F17265] focus:decoration-2 focus:underline-offset-4 opacity-80 hover:opacity-100"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>
      );
    }

    case 'features': {
      const { heading, items } = section.props;
      const { styles } = section;
      const paddingClass = getPaddingClass(styles);
      const inlineStyles = buildInlineStyles(styles);
      
      return (
        <section className={paddingClass} style={inlineStyles}>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">
            {heading}
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((item: FeatureItem, idx: number) => (
              <Card
                key={idx}
                variant="default"
                padding="md"
                className="hover:border-[#F17265] hover:shadow-md"
              >
                <div className="font-bold text-lg mb-2 text-[#030014]">
                  {item.title}
                </div>
                <p className="text-sm md:text-base text-gray-600">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </section>
      );
    }

    case 'footer': {
      const { text } = section.props;
      const { styles } = section;
      const paddingClass = getPaddingClass(styles);
      const inlineStyles = buildInlineStyles(styles);
      
      return (
        <footer 
          className={`${paddingClass} text-sm md:text-base text-center border-t-2 border-gray-200 mt-6`}
          style={inlineStyles}
        >
          {text}
        </footer>
      );
    }

    case 'cta': {
      const { heading, description, buttonLabel } = section.props;
      const { styles } = section;
      const paddingClass = getPaddingClass(styles);
      const inlineStyles = buildInlineStyles(styles);
      const hasCustomBg = Boolean(styles.backgroundColor);
      
      return (
        <section 
          className={`${paddingClass} text-center ${!hasCustomBg ? 'bg-gradient-to-r from-[#F17265] to-[#E25C4F]' : ''} rounded-xl shadow-lg`}
          style={inlineStyles}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4 px-6">
            {heading}
          </h3>
          {description && (
            <p className="text-sm md:text-base mb-6 max-w-xl mx-auto px-6 opacity-90">
              {description}
            </p>
          )}
          <Button
            variant="outline"
            size="lg"
            shape="pill"
            className={hasCustomBg ? '' : 'bg-white text-[#F17265] border-white hover:bg-gray-100 hover:border-gray-100'}
          >
            {buttonLabel}
          </Button>
        </section>
      );
    }

    case 'testimonial': {
      const { quote, authorName, authorTitle } = section.props;
      const { styles } = section;
      const paddingClass = getPaddingClass(styles);
      const inlineStyles = buildInlineStyles(styles);
      
      return (
        <section className={paddingClass} style={inlineStyles}>
          <Card variant="default" padding="lg" className="max-w-2xl mx-auto text-center">
            <div className="text-4xl text-[#F17265] mb-4">&ldquo;</div>
            <blockquote className="text-lg md:text-xl text-gray-700 italic mb-6 leading-relaxed">
              {quote}
            </blockquote>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F17265] to-[#E25C4F] rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <cite className="not-italic">
                <div className="font-semibold text-[#030014]">{authorName}</div>
                {authorTitle && (
                  <div className="text-sm text-gray-500">{authorTitle}</div>
                )}
              </cite>
            </div>
          </Card>
        </section>
      );
    }
  }
});
