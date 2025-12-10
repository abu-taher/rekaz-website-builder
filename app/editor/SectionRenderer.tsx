'use client';

import React, { memo } from 'react';
import type { SectionInstance } from '@/lib/sections';

type SectionRendererProps = {
  section: SectionInstance;
};

export const SectionRenderer = memo(function SectionRenderer({
  section,
}: SectionRendererProps) {
  const { type, props } = section;

  switch (type) {
    case 'hero': {
      const { title, subtitle, buttonLabel } = props ?? {};
      return (
        <section className="py-14 md:py-16 text-center bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl shadow-sm">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-300 text-sm md:text-base mb-6 max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
          {buttonLabel && (
            <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-sky-500/80 text-sm font-medium hover:bg-sky-500/10 hover:border-sky-400 transition">
              {buttonLabel}
            </button>
          )}
        </section>
      );
    }

    case 'header': {
      const { logoText, navItems = [] } = props ?? {};
      return (
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-3">
          <div className="font-semibold text-lg">{logoText}</div>
          <nav className="flex flex-wrap gap-3 text-sm text-slate-300">
            {navItems.map((item: string) => (
              <span
                key={item}
                className="hover:text-sky-400 cursor-pointer transition text-xs md:text-sm"
              >
                {item}
              </span>
            ))}
          </nav>
        </header>
      );
    }

    case 'features': {
      const { heading, items = [] } = props ?? {};
      return (
        <section className="py-8 md:py-10">
          <h3 className="text-xl md:text-2xl font-semibold mb-6">{heading}</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {items.map(
              (item: { title: string; description: string }, idx: number) => (
                <div
                  key={idx}
                  className="border border-slate-700 rounded-lg p-4 bg-slate-900/80 hover:border-sky-500/70 transition"
                >
                  <div className="font-medium mb-1">{item.title}</div>
                  <p className="text-xs md:text-sm text-slate-300">
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
        <footer className="py-5 text-[11px] md:text-xs text-slate-400 text-center border-t border-slate-800 mt-4">
          {text}
        </footer>
      );
    }

    default:
      return (
        <div className="text-xs text-slate-400">
          Unknown section type: {type}
        </div>
      );
  }
});
