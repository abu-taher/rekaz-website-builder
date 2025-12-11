export type SectionType = 'hero' | 'header' | 'features' | 'footer';

export type HeroProps = {
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  imageUrl?: string;
};

export type NavItem = {
  label: string;
  link: string;
};

export type HeaderProps = {
  logoText: string;
  navItems: NavItem[];
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any; // Union type access handled via switch statements in components
}

export interface SectionDefinition {
  type: SectionType;
  label: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultProps: any; // Typed via `satisfies` at definition site
}

export const SECTION_LIBRARY: SectionDefinition[] = [
  {
    type: 'hero',
    label: 'Hero',
    description: 'Big headline with supporting text and a call-to-action.',
    defaultProps: {
      title: 'Build Beautiful Websites Visually',
      subtitle: 'Drag, drop, and customize. Create stunning pages in minutes with our intuitive website builder.',
      buttonLabel: 'Start Building',
      imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=600&fit=crop',
    } satisfies HeroProps,
  },
  {
    type: 'header',
    label: 'Header',
    description: 'Logo and simple navigation links.',
    defaultProps: {
      logoText: 'Rekaz',
      navItems: [
        { label: 'Home', link: '#home' },
        { label: 'Features', link: '#features' },
        { label: 'Pricing', link: '#pricing' },
      ],
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
