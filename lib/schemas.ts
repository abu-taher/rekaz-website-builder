import { z } from 'zod';

// =============================================================================
// Zod Schemas for Section Validation
// =============================================================================

/**
 * Schema for section styles (shared across all sections).
 */
export const sectionStylesSchema = z.object({
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  paddingY: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
});

/**
 * Schema for navigation items in header sections.
 */
export const navItemSchema = z.object({
  label: z.string(),
  link: z.string(),
});

/**
 * Schema for feature items in features sections.
 */
export const featureItemSchema = z.object({
  title: z.string(),
  description: z.string(),
});

/**
 * Schema for Hero section props.
 */
export const heroPropsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  buttonLabel: z.string().optional(),
  imageUrl: z.string().optional(),
});

/**
 * Schema for Header section props.
 */
export const headerPropsSchema = z.object({
  logoText: z.string(),
  navItems: z.array(navItemSchema),
});

/**
 * Schema for Features section props.
 */
export const featuresPropsSchema = z.object({
  heading: z.string(),
  items: z.array(featureItemSchema),
});

/**
 * Schema for Footer section props.
 */
export const footerPropsSchema = z.object({
  text: z.string(),
});

/**
 * Schema for CTA section props.
 */
export const ctaPropsSchema = z.object({
  heading: z.string(),
  description: z.string().optional(),
  buttonLabel: z.string(),
});

/**
 * Schema for Testimonial section props.
 */
export const testimonialPropsSchema = z.object({
  quote: z.string(),
  authorName: z.string(),
  authorTitle: z.string().optional(),
});

/**
 * Schema for Hero section instance.
 */
export const heroSectionSchema = z.object({
  id: z.string(),
  type: z.literal('hero'),
  props: heroPropsSchema,
  styles: sectionStylesSchema,
});

/**
 * Schema for Header section instance.
 */
export const headerSectionSchema = z.object({
  id: z.string(),
  type: z.literal('header'),
  props: headerPropsSchema,
  styles: sectionStylesSchema,
});

/**
 * Schema for Features section instance.
 */
export const featuresSectionSchema = z.object({
  id: z.string(),
  type: z.literal('features'),
  props: featuresPropsSchema,
  styles: sectionStylesSchema,
});

/**
 * Schema for Footer section instance.
 */
export const footerSectionSchema = z.object({
  id: z.string(),
  type: z.literal('footer'),
  props: footerPropsSchema,
  styles: sectionStylesSchema,
});

/**
 * Schema for CTA section instance.
 */
export const ctaSectionSchema = z.object({
  id: z.string(),
  type: z.literal('cta'),
  props: ctaPropsSchema,
  styles: sectionStylesSchema,
});

/**
 * Schema for Testimonial section instance.
 */
export const testimonialSectionSchema = z.object({
  id: z.string(),
  type: z.literal('testimonial'),
  props: testimonialPropsSchema,
  styles: sectionStylesSchema,
});

/**
 * Schema for any section instance (discriminated union).
 */
export const sectionInstanceSchema = z.discriminatedUnion('type', [
  heroSectionSchema,
  headerSectionSchema,
  featuresSectionSchema,
  footerSectionSchema,
  ctaSectionSchema,
  testimonialSectionSchema,
]);

/**
 * Schema for an array of section instances.
 */
export const sectionsArraySchema = z.array(sectionInstanceSchema);

// =============================================================================
// Type inference from schemas (optional, we already have types)
// =============================================================================

export type ZodSectionInstance = z.infer<typeof sectionInstanceSchema>;
export type ZodSectionsArray = z.infer<typeof sectionsArraySchema>;

// =============================================================================
// Validation helpers
// =============================================================================

/**
 * Validates and parses an array of sections.
 * Returns the valid sections, filtering out invalid ones.
 */
export function parseSections(data: unknown): ZodSectionInstance[] {
  if (!Array.isArray(data)) {
    return [];
  }

  const validSections: ZodSectionInstance[] = [];

  for (const item of data) {
    const result = sectionInstanceSchema.safeParse(item);
    if (result.success) {
      validSections.push(result.data);
    }
  }

  return validSections;
}

/**
 * Validates a single section instance.
 * Returns the section if valid, null otherwise.
 */
export function parseSection(data: unknown): ZodSectionInstance | null {
  const result = sectionInstanceSchema.safeParse(data);
  return result.success ? result.data : null;
}

/**
 * Strictly validates an array of sections.
 * Throws if any section is invalid.
 */
export function parseSectionsStrict(data: unknown): ZodSectionInstance[] {
  return sectionsArraySchema.parse(data);
}
