export type SectionType = 'hero' | 'header' | 'features' | 'footer';

export type HeroProps = {
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  imageUrl?: string;
};

export type HeaderProps = {
  logoText: string;
  navItems: string[];
};

export type FeaturesProps = {
  heading: string;
  items: { title: string; description: string }[];
};

export type FooterProps = {
  text: string;
};

export type SectionProps =
  | HeroProps
  | HeaderProps
  | FeaturesProps
  | FooterProps;

export interface SectionInstance {
  id: string;
  type: SectionType;
  props: any; // we’ll refine later if needed
}

export interface SectionDefinition {
  type: SectionType;
  label: string;
  description: string;
  defaultProps: any;
}

export const SECTION_LIBRARY: SectionDefinition[] = [
  {
    type: 'hero',
    label: 'Hero',
    description: 'Big headline with supporting text and a call-to-action.',
    defaultProps: {
      title: 'Welcome to your new landing page 👋',
      subtitle: 'Build your website visually with the Rekaz mini builder.',
      buttonLabel: 'Get Started',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop',
    } satisfies HeroProps,
  },
  {
    type: 'header',
    label: 'Header',
    description: 'Logo and simple navigation links.',
    defaultProps: {
      logoText: 'Rekaz',
      navItems: ['Home', 'Features', 'Pricing'],
    } satisfies HeaderProps,
  },
  {
    type: 'features',
    label: 'Features',
    description: 'Three-column feature highlight section.',
    defaultProps: {
      heading: 'Why teams love this builder',
      items: [
        { title: 'Fast', description: 'Minimal UI with instant preview.' },
        { title: 'Typed', description: 'Built with TypeScript and Next.js.' },
        { title: 'Structured', description: 'Git-friendly and SSR-ready.' },
      ],
    } satisfies FeaturesProps,
  },
  {
    type: 'footer',
    label: 'Footer',
    description: 'Simple site footer.',
    defaultProps: {
      text: '© 2025 Rekaz Mini Builder. All rights reserved.',
    } satisfies FooterProps,
  },
];
