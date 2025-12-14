'use client';

import React, { useEffect, useState, memo } from 'react';
import Link from 'next/link';
import type {
  SectionInstance,
  SectionStyles,
  HeaderProps,
  NavItem,
  FeatureItem,
} from '@/lib/sections';
import { PADDING_Y_CLASSES } from '@/lib/sections';
import { loadSectionsFromStorage } from '@/lib/storage';
import { Button, EmptyState } from '@/components/ui';

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
function getPaddingClass(styles: SectionStyles, defaultSize: 'sm' | 'md' | 'lg' | 'xl' = 'md'): string {
  return PADDING_Y_CLASSES[styles.paddingY ?? defaultSize];
}

/** Section instance with computed anchor ID */
type SectionWithAnchor = SectionInstance & { sectionId: string };

/**
 * Custom hook to load sections from storage.
 * Uses useSyncExternalStore for SSR-safe data loading.
 */
function useSectionsFromStorage(): { sections: SectionInstance[]; isLoading: boolean } {
  const [state, setState] = useState<{ sections: SectionInstance[]; isLoading: boolean }>({
    sections: [],
    isLoading: true,
  });

  useEffect(() => {
    let cancelled = false;

    // Defer to next tick to avoid synchronous setState warning
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        const storedSections = loadSectionsFromStorage();
        setState({ sections: storedSections, isLoading: false });
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  return state;
}

export function PreviewContent() {
  const { sections, isLoading } = useSectionsFromStorage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#F17265] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 animate-pulse">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <EmptyState
          icon="📭"
          title="No Content Yet"
          description="Add some sections in the editor to see your website preview here."
          action={
            <Link href="/">
              <Button variant="primary" size="lg" shape="pill">
                Go to Editor
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  // Count sections by type to create unique IDs (e.g., hero, hero-2, hero-3)
  const sectionCounts: Record<string, number> = {};
  const sectionsWithIds: SectionWithAnchor[] = sections.map((section) => {
    const count = (sectionCounts[section.type] || 0) + 1;
    sectionCounts[section.type] = count;
    const sectionId = count === 1 ? section.type : `${section.type}-${count}`;
    return { ...section, sectionId };
  });

  return (
    <div className="min-h-screen bg-white scroll-smooth">
      {sectionsWithIds.map((section) => (
        <PreviewSection key={section.id} section={section} />
      ))}
    </div>
  );
}

/**
 * Renders a section in preview mode based on its type.
 * Uses discriminated union narrowing for type-safe prop access.
 */
function PreviewSection({ section }: { section: SectionWithAnchor }) {
  const { sectionId } = section;

  switch (section.type) {
    case 'hero': {
      const { title, subtitle, buttonLabel, imageUrl } = section.props;
      const { styles } = section;
      const paddingClass = getPaddingClass(styles, 'xl');
      const inlineStyles = buildInlineStyles(styles);
      const hasCustomBg = Boolean(styles.backgroundColor);
      
      return (
        <section
          id={sectionId}
          className={`relative ${paddingClass} text-center ${!hasCustomBg ? 'bg-gradient-to-b from-[#FFF5F4] to-white' : ''} scroll-mt-16 md:scroll-mt-20`}
          style={inlineStyles}
        >
          {imageUrl && !hasCustomBg && (
            <div className="absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt=""
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/90" />
            </div>
          )}
          <div className="relative max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-80">
                {subtitle}
              </p>
            )}
            {buttonLabel && (
              <Button
                variant="primary"
                size="lg"
                shape="pill"
                className="text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {buttonLabel}
              </Button>
            )}
          </div>
        </section>
      );
    }

    case 'header': {
      return <HeaderSectionPreview props={section.props} styles={section.styles} />;
    }

    case 'features': {
      const { heading, items } = section.props;
      const { styles } = section;
      const paddingClass = getPaddingClass(styles, 'lg');
      const inlineStyles = buildInlineStyles(styles);
      
      return (
        <section
          id={sectionId}
          className={`${paddingClass} scroll-mt-16 md:scroll-mt-20`}
          style={inlineStyles}
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {heading}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {items.map((item: FeatureItem, idx: number) => (
                <div
                  key={idx}
                  className="group p-8 rounded-2xl bg-gray-50 hover:bg-[#FFF5F4] border-2 border-transparent hover:border-[#F17265] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F17265] text-white flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-[#030014]">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'footer': {
      const { text } = section.props;
      const { styles } = section;
      const paddingClass = getPaddingClass(styles, 'md');
      const inlineStyles = buildInlineStyles(styles);
      const hasCustomBg = Boolean(styles.backgroundColor);
      
      return (
        <footer
          id={sectionId}
          className={`${paddingClass} ${!hasCustomBg ? 'bg-[#030014] text-gray-400' : ''} scroll-mt-16 md:scroll-mt-20`}
          style={inlineStyles}
        >
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p>{text}</p>
          </div>
        </footer>
      );
    }

    case 'cta': {
      const { heading, description, buttonLabel } = section.props;
      const { styles } = section;
      const paddingClass = getPaddingClass(styles, 'lg');
      const inlineStyles = buildInlineStyles(styles);
      const hasCustomBg = Boolean(styles.backgroundColor);
      
      return (
        <section
          id={sectionId}
          className={`${paddingClass} scroll-mt-16 md:scroll-mt-20`}
          style={!hasCustomBg ? {} : inlineStyles}
        >
          <div className="max-w-4xl mx-auto px-6">
            <div 
              className={`text-center py-16 px-8 ${!hasCustomBg ? 'bg-gradient-to-r from-[#F17265] to-[#E25C4F]' : ''} rounded-3xl shadow-xl`}
              style={hasCustomBg ? inlineStyles : {}}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {heading}
              </h2>
              {description && (
                <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto opacity-90">
                  {description}
                </p>
              )}
              <Button
                variant="outline"
                size="lg"
                shape="pill"
                className={hasCustomBg ? '' : 'bg-white text-[#F17265] border-white hover:bg-gray-100 hover:border-gray-100 text-lg shadow-lg'}
              >
                {buttonLabel}
              </Button>
            </div>
          </div>
        </section>
      );
    }

    case 'testimonial': {
      const { quote, authorName, authorTitle } = section.props;
      const { styles } = section;
      const paddingClass = getPaddingClass(styles, 'lg');
      const inlineStyles = buildInlineStyles(styles);
      const hasCustomBg = Boolean(styles.backgroundColor);
      
      return (
        <section
          id={sectionId}
          className={`${paddingClass} ${!hasCustomBg ? 'bg-gray-50' : ''} scroll-mt-16 md:scroll-mt-20`}
          style={inlineStyles}
        >
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="text-6xl text-[#F17265] mb-6">&ldquo;</div>
            <blockquote className="text-xl md:text-2xl italic mb-8 leading-relaxed opacity-90">
              {quote}
            </blockquote>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F17265] to-[#E25C4F] rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <cite className="not-italic">
                <div className="font-semibold text-lg">{authorName}</div>
                {authorTitle && (
                  <div className="opacity-70">{authorTitle}</div>
                )}
              </cite>
            </div>
          </div>
        </section>
      );
    }
  }
}

/**
 * Header section with mobile menu support.
 * Separated to manage local menu open/close state.
 */
const HeaderSectionPreview = memo(function HeaderSectionPreview({
  props,
  styles,
}: {
  props: HeaderProps;
  styles: SectionStyles;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logoText, navItems } = props;
  const inlineStyles = buildInlineStyles(styles);
  const hasCustomBg = Boolean(styles.backgroundColor);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: string
  ) => {
    // Check if it's a hash link (e.g., #features, #hero)
    if (link.startsWith('#')) {
      e.preventDefault();
      const targetId = link.slice(1); // Remove the #
      const targetElement = document.getElementById(targetId);

      // Close mobile menu first
      setIsMobileMenuOpen(false);

      if (targetElement) {
        // Delay scroll to allow menu to close first (fixes mobile scroll position)
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    }
  };

  return (
    <header
      id="header"
      className={`sticky top-0 z-50 ${!hasCustomBg ? 'bg-white/80' : ''} backdrop-blur-md border-b border-gray-200`}
      style={inlineStyles}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-2xl">{logoText}</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item: NavItem, idx: number) => (
            <a
              key={idx}
              href={item.link || '#'}
              onClick={(e) => handleNavClick(e, item.link || '#')}
              className="hover:text-[#F17265] font-medium transition cursor-pointer opacity-80 hover:opacity-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors opacity-80"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav 
          className="md:hidden border-t border-gray-200 backdrop-blur-md animate-fade-slide-in"
          style={hasCustomBg ? { backgroundColor: styles.backgroundColor } : { backgroundColor: 'rgba(255,255,255,0.95)' }}
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-2">
            {navItems.map((item: NavItem, idx: number) => (
              <a
                key={idx}
                href={item.link || '#'}
                onClick={(e) => handleNavClick(e, item.link || '#')}
                className="hover:text-[#F17265] hover:bg-[#FFF5F4] font-medium py-3 px-4 rounded-lg transition-all cursor-pointer opacity-80 hover:opacity-100"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
});
