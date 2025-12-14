// =============================================================================
// Section Type Definitions
// =============================================================================

export type SectionType = 'hero' | 'header' | 'features' | 'footer' | 'cta' | 'testimonial';

// -----------------------------------------------------------------------------
// Props for each section type
// -----------------------------------------------------------------------------

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

export type FeatureItem = {
  title: string;
  description: string;
};

export type FeaturesProps = {
  heading: string;
  items: FeatureItem[];
};

export type FooterProps = {
  text: string;
};

export type CtaProps = {
  heading: string;
  description?: string;
  buttonLabel: string;
};

export type TestimonialProps = {
  quote: string;
  authorName: string;
  authorTitle?: string;
};

// -----------------------------------------------------------------------------
// Discriminated Union for Section Instances
// This provides type-safe access to props based on section type
// -----------------------------------------------------------------------------

export type HeroSection = {
  id: string;
  type: 'hero';
  props: HeroProps;
};

export type HeaderSection = {
  id: string;
  type: 'header';
  props: HeaderProps;
};

export type FeaturesSection = {
  id: string;
  type: 'features';
  props: FeaturesProps;
};

export type FooterSection = {
  id: string;
  type: 'footer';
  props: FooterProps;
};

export type CtaSection = {
  id: string;
  type: 'cta';
  props: CtaProps;
};

export type TestimonialSection = {
  id: string;
  type: 'testimonial';
  props: TestimonialProps;
};

/** Discriminated union of all section types */
export type SectionInstance =
  | HeroSection
  | HeaderSection
  | FeaturesSection
  | FooterSection
  | CtaSection
  | TestimonialSection;

/** Union of all possible props (for generic handlers) */
export type SectionProps = HeroProps | HeaderProps | FeaturesProps | FooterProps | CtaProps | TestimonialProps;

// -----------------------------------------------------------------------------
// Section Definition (for the library sidebar)
// -----------------------------------------------------------------------------

export type SectionDefinition<T extends SectionType = SectionType> = {
  type: T;
  label: string;
  description: string;
  defaultProps: T extends 'hero'
    ? HeroProps
    : T extends 'header'
    ? HeaderProps
    : T extends 'features'
    ? FeaturesProps
    : T extends 'footer'
    ? FooterProps
    : T extends 'cta'
    ? CtaProps
    : T extends 'testimonial'
    ? TestimonialProps
    : never;
};

// -----------------------------------------------------------------------------
// Section Library (available sections in the sidebar)
// -----------------------------------------------------------------------------

const headerDefinition: SectionDefinition<'header'> = {
  type: 'header',
  label: 'Header',
  description: 'Logo and simple navigation links.',
  defaultProps: {
    logoText: 'Rekaz',
    navItems: [
      { label: 'Home', link: '#hero' },
      { label: 'Features', link: '#features' },
      { label: 'Contact', link: '#footer' },
    ],
  },
};

const heroDefinition: SectionDefinition<'hero'> = {
  type: 'hero',
  label: 'Hero',
  description: 'Big headline with supporting text and a call-to-action.',
  defaultProps: {
    title: 'Build Beautiful Websites Visually',
    subtitle:
      'Drag, drop, and customize. Create stunning pages in minutes with our intuitive website builder.',
    buttonLabel: 'Start Building',
    imageUrl:
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=600&fit=crop',
  },
};

const featuresDefinition: SectionDefinition<'features'> = {
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
  },
};

const footerDefinition: SectionDefinition<'footer'> = {
  type: 'footer',
  label: 'Footer',
  description: 'Simple site footer.',
  defaultProps: {
    text: '© 2025 Rekaz Mini Builder. All rights reserved.',
  },
};

const ctaDefinition: SectionDefinition<'cta'> = {
  type: 'cta',
  label: 'Call to Action',
  description: 'Focused section with heading and action button.',
  defaultProps: {
    heading: 'Ready to get started?',
    description: 'Join thousands of users building amazing websites today.',
    buttonLabel: 'Get Started Free',
  },
};

const testimonialDefinition: SectionDefinition<'testimonial'> = {
  type: 'testimonial',
  label: 'Testimonial',
  description: 'Customer quote with author attribution.',
  defaultProps: {
    quote: 'This builder transformed our workflow. We shipped our landing page in hours instead of weeks.',
    authorName: 'Sarah Chen',
    authorTitle: 'Product Manager at TechCorp',
  },
};

/** All available section definitions for the library sidebar */
export const SECTION_LIBRARY: SectionDefinition[] = [
  headerDefinition,
  heroDefinition,
  featuresDefinition,
  ctaDefinition,
  testimonialDefinition,
  footerDefinition,
];

// -----------------------------------------------------------------------------
// Type Guards for narrowing SectionInstance
// -----------------------------------------------------------------------------

export function isHeroSection(section: SectionInstance): section is HeroSection {
  return section.type === 'hero';
}

export function isHeaderSection(section: SectionInstance): section is HeaderSection {
  return section.type === 'header';
}

export function isFeaturesSection(section: SectionInstance): section is FeaturesSection {
  return section.type === 'features';
}

export function isFooterSection(section: SectionInstance): section is FooterSection {
  return section.type === 'footer';
}

export function isCtaSection(section: SectionInstance): section is CtaSection {
  return section.type === 'cta';
}

export function isTestimonialSection(section: SectionInstance): section is TestimonialSection {
  return section.type === 'testimonial';
}

// -----------------------------------------------------------------------------
// Helper to get default props by type
// -----------------------------------------------------------------------------

export function getDefaultPropsForType(type: SectionType): SectionProps {
  const definition = SECTION_LIBRARY.find((d) => d.type === type);
  if (!definition) {
    throw new Error(`Unknown section type: ${type}`);
  }
  return definition.defaultProps;
}
