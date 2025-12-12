'use client';

import { useEffect, useState, memo } from 'react';
import Link from 'next/link';
import type { SectionInstance } from '@/lib/sections';

export function PreviewContent() {
  const [sections, setSections] = useState<SectionInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('rekaz-layout');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSections(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load preview:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-gray-500">Loading preview...</div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <div className="text-6xl mb-4">📭</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">No Content Yet</h1>
        <p className="text-gray-600 text-center max-w-md">
          Add some sections in the editor to see your website preview here.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-[#F17265] text-white rounded-full font-semibold hover:bg-[#E25C4F] transition-all"
        >
          Go to Editor
        </Link>
      </div>
    );
  }

  // Count sections by type to create unique IDs (e.g., hero, hero-2, hero-3)
  const sectionCounts: Record<string, number> = {};
  const sectionsWithIds = sections.map((section) => {
    const count = (sectionCounts[section.type] || 0) + 1;
    sectionCounts[section.type] = count;
    const sectionId = count === 1 ? section.type : `${section.type}-${count}`;
    return { ...section, sectionId };
  });

  return (
    <div className="min-h-screen bg-white scroll-smooth">
      {sectionsWithIds.map((section) => (
        <PreviewSection key={section.id} section={section} sectionId={section.sectionId} />
      ))}
    </div>
  );
}

function PreviewSection({ section, sectionId }: { section: SectionInstance; sectionId: string }) {
  const { type, props } = section;

  switch (type) {
    case 'hero': {
      const { title, subtitle, buttonLabel, imageUrl } = props ?? {};
      return (
        <section 
          id={sectionId}
          className="relative py-20 md:py-32 text-center bg-gradient-to-b from-[#FFF5F4] to-white scroll-mt-20">
          {imageUrl && (
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
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-[#030014]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
            {buttonLabel && (
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#F17265] text-white text-lg font-semibold hover:bg-[#E25C4F] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                {buttonLabel}
              </button>
            )}
          </div>
        </section>
      );
    }

    case 'header': {
      return <HeaderSection props={props} />;
    }

    case 'features': {
      const { heading, items = [] } = props ?? {};
      return (
        <section id={sectionId} className="py-16 md:py-24 bg-white scroll-mt-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#030014]">
              {heading}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {items.map(
                (item: { title: string; description: string }, idx: number) => (
                  <div
                    key={idx}
                    className="group p-8 rounded-2xl bg-gray-50 hover:bg-[#FFF5F4] border-2 border-transparent hover:border-[#F17265] transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#F17265] text-white flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-[#030014]">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      );
    }

    case 'footer': {
      const { text } = props ?? {};
      return (
        <footer id={sectionId} className="py-8 bg-[#030014] text-gray-400 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p>{text}</p>
          </div>
        </footer>
      );
    }

    default:
      return null;
  }
}

// Separate component for header to manage mobile menu state
const HeaderSection = memo(function HeaderSection({ props }: { props: Record<string, unknown> }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logoText, navItems = [] } = props ?? {};

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    // Check if it's a hash link (e.g., #features, #hero)
    if (link.startsWith('#')) {
      e.preventDefault();
      const targetId = link.slice(1); // Remove the #
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
      
      // Close mobile menu after clicking
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header id="header" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-2xl text-[#030014]">{logoText as string}</div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {(navItems as { label: string; link: string }[]).map((item, idx) => (
            <a
              key={idx}
              href={item.link || '#'}
              onClick={(e) => handleNavClick(e, item.link || '#')}
              className="text-gray-700 hover:text-[#F17265] font-medium transition cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md animate-fade-slide-in">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-2">
            {(navItems as { label: string; link: string }[]).map((item, idx) => (
              <a
                key={idx}
                href={item.link || '#'}
                onClick={(e) => handleNavClick(e, item.link || '#')}
                className="text-gray-700 hover:text-[#F17265] hover:bg-[#FFF5F4] font-medium py-3 px-4 rounded-lg transition-all cursor-pointer"
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
