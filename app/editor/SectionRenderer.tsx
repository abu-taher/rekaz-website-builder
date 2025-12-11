'use client';

import React, { memo } from 'react';
import type { SectionInstance } from '@/lib/sections';

type SectionRendererProps = {
  section: SectionInstance;
};

export const SectionRenderer = memo(
  function SectionRenderer({ section }: SectionRendererProps) {
    const { type, props } = section;

    switch (type) {
      case 'hero': {
        const { title, subtitle, buttonLabel } = props ?? {};
        return (
          <section className="py-14 md:py-16 text-center bg-gradient-to-b from-[#FFF5F4] to-white rounded-xl shadow-lg border-2 border-gray-200">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-[#030014]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-sm md:text-base mb-6 max-w-xl mx-auto">
                {subtitle}
              </p>
            )}
            {buttonLabel && (
              <button className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#F17265] text-white text-sm font-semibold hover:bg-[#E25C4F] transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#F17265] focus:ring-offset-2">
                {buttonLabel}
              </button>
            )}
          </section>
        );
      }

      case 'header': {
        const { logoText, navItems = [] } = props ?? {};
        return (
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-4 border-b-2 border-gray-200">
            <div className="font-bold text-xl text-[#030014]">{logoText}</div>
            <nav className="flex flex-wrap gap-4 text-sm" role="navigation">
              {navItems.map((item: string) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-700 hover:text-[#F17265] font-medium cursor-pointer transition text-sm md:text-base focus:outline-none focus:underline focus:decoration-[#F17265] focus:decoration-2 focus:underline-offset-4"
                >
                  {item}
                </a>
              ))}
            </nav>
          </header>
        );
      }

      case 'features': {
        const { heading, items = [] } = props ?? {};
        return (
          <section className="py-8 md:py-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-[#030014]">
              {heading}
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {items.map(
                (item: { title: string; description: string }, idx: number) => (
                  <div
                    key={idx}
                    className="border-2 border-gray-200 rounded-xl p-5 bg-white hover:border-[#F17265] hover:shadow-md transition-all"
                  >
                    <div className="font-bold text-lg mb-2 text-[#030014]">{item.title}</div>
                    <p className="text-sm md:text-base text-gray-600">
                      {item.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        );
      }

      case 'footer': {
        const { text } = props ?? {};
        return (
          <footer className="py-6 text-sm md:text-base text-gray-600 text-center border-t-2 border-gray-200 mt-6">
            {text}
          </footer>
        );
      }

      default:
        return (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
            Unknown section type: <span className="font-mono font-semibold text-[#030014]">{type}</span>
          </div>
        );
    }
  },
  (prev, next) => JSON.stringify(prev.section) === JSON.stringify(next.section)
);
