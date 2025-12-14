import type { SectionInstance } from './sections';
import { parseSections, sectionInstanceSchema } from './schemas';

// =============================================================================
// Constants
// =============================================================================

/** LocalStorage key for storing the layout */
export const STORAGE_KEY = 'rekaz-layout';

// =============================================================================
// Type Guards & Validation
// =============================================================================

/**
 * Validates that a value looks like a SectionInstance.
 * Uses Zod schema for thorough validation.
 */
export function isValidSectionShape(value: unknown): value is SectionInstance {
  return sectionInstanceSchema.safeParse(value).success;
}

/**
 * Validates an array of sections using Zod.
 * Returns only the valid sections, filtering out invalid ones.
 */
export function validateSections(data: unknown): SectionInstance[] {
  return parseSections(data);
}

// =============================================================================
// Storage Operations
// =============================================================================

/**
 * Load sections from localStorage.
 * Returns an empty array if no data exists or data is invalid.
 */
export function loadSectionsFromStorage(): SectionInstance[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    return validateSections(parsed);
  } catch (error) {
    console.error('Failed to load layout from localStorage:', error);
    return [];
  }
}

/**
 * Save sections to localStorage.
 */
export function saveSectionsToStorage(sections: SectionInstance[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const data = JSON.stringify(sections);
    window.localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error('Failed to save layout to localStorage:', error);
  }
}

/**
 * Clear sections from localStorage.
 */
export function clearStoredSections(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear layout from localStorage:', error);
  }
}

// =============================================================================
// Import/Export Operations
// =============================================================================

/**
 * Parse and validate JSON import data using Zod.
 * Returns an array of valid sections.
 */
export function parseImportData(jsonString: string): SectionInstance[] {
  try {
    const parsed: unknown = JSON.parse(jsonString);

    if (!Array.isArray(parsed)) {
      console.warn('Invalid layout file: expected an array');
      return [];
    }

    const sections = parseSections(parsed);

    if (sections.length === 0 && parsed.length > 0) {
      console.warn(
        'Import data contained items but none matched the expected schema. ' +
          'Each section must have: id (string), type (hero|header|features|footer|cta|testimonial), props, and styles.'
      );
    }

    return sections;
  } catch (error) {
    console.error('Failed to parse import data:', error);
    return [];
  }
}

/**
 * Export sections to a JSON string.
 */
export function exportToJson(sections: SectionInstance[]): string {
  return JSON.stringify(sections, null, 2);
}

/**
 * Download sections as a JSON file.
 */
export function downloadAsJson(
  sections: SectionInstance[],
  filename = 'rekaz-layout.json'
): void {
  try {
    const data = exportToJson(sections);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download layout:', error);
  }
}
