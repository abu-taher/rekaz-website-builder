import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  STORAGE_KEY,
  isValidSectionShape,
  validateSections,
  loadSectionsFromStorage,
  saveSectionsToStorage,
  parseImportData,
  exportToJson,
} from '../storage';
import type { SectionInstance } from '../sections';
import { DEFAULT_SECTION_STYLES } from '../sections';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Helper to create valid section with styles
const createValidSection = (overrides = {}): Record<string, unknown> => ({
  id: '1',
  type: 'hero',
  props: { title: 'Test' },
  styles: { ...DEFAULT_SECTION_STYLES },
  ...overrides,
});

describe('STORAGE_KEY', () => {
  it('should be defined', () => {
    expect(STORAGE_KEY).toBe('rekaz-layout');
  });
});

describe('isValidSectionShape', () => {
  it('should return true for valid section shape', () => {
    const valid = createValidSection();
    expect(isValidSectionShape(valid)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isValidSectionShape(null)).toBe(false);
  });

  it('should return false for non-object', () => {
    expect(isValidSectionShape('string')).toBe(false);
    expect(isValidSectionShape(123)).toBe(false);
  });

  it('should return false for missing id', () => {
    expect(isValidSectionShape({ type: 'hero', props: {}, styles: {} })).toBe(false);
  });

  it('should return false for non-string id', () => {
    expect(isValidSectionShape({ id: 123, type: 'hero', props: {}, styles: {} })).toBe(false);
  });

  it('should return false for missing type', () => {
    expect(isValidSectionShape({ id: '1', props: {}, styles: {} })).toBe(false);
  });

  it('should return false for missing props', () => {
    expect(isValidSectionShape({ id: '1', type: 'hero', styles: {} })).toBe(false);
  });

  it('should return false for null props', () => {
    expect(isValidSectionShape({ id: '1', type: 'hero', props: null, styles: {} })).toBe(false);
  });
});

describe('validateSections', () => {
  it('should return empty array for non-array input', () => {
    expect(validateSections('not an array')).toEqual([]);
    expect(validateSections(null)).toEqual([]);
    expect(validateSections({})).toEqual([]);
  });

  it('should filter out invalid sections', () => {
    const input = [
      createValidSection({ id: '1' }),
      { invalid: true },
      createValidSection({ id: '2', type: 'footer', props: { text: 'Footer' } }),
      null,
    ];

    const result = validateSections(input);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
  });
});

describe('loadSectionsFromStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty array when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);
    expect(loadSectionsFromStorage()).toEqual([]);
  });

  it('should return parsed sections from localStorage', () => {
    const sections = [createValidSection()];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(sections));

    const result = loadSectionsFromStorage();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should return empty array on JSON parse error', () => {
    localStorageMock.getItem.mockReturnValue('invalid json');
    expect(loadSectionsFromStorage()).toEqual([]);
  });
});

describe('saveSectionsToStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should save sections to localStorage', () => {
    const sections: SectionInstance[] = [
      { id: '1', type: 'hero', props: { title: 'Test' }, styles: { ...DEFAULT_SECTION_STYLES } },
    ];

    saveSectionsToStorage(sections);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify(sections)
    );
  });
});

describe('parseImportData', () => {
  it('should parse valid JSON', () => {
    const json = JSON.stringify([createValidSection()]);
    const result = parseImportData(json);
    expect(result).toHaveLength(1);
  });

  it('should return empty array for invalid JSON', () => {
    expect(parseImportData('not json')).toEqual([]);
  });

  it('should filter invalid sections', () => {
    const json = JSON.stringify([
      createValidSection({ id: '1' }),
      { invalid: true },
    ]);
    const result = parseImportData(json);
    expect(result).toHaveLength(1);
  });
});

describe('exportToJson', () => {
  it('should export sections as formatted JSON', () => {
    const sections: SectionInstance[] = [
      { id: '1', type: 'hero', props: { title: 'Test' }, styles: { ...DEFAULT_SECTION_STYLES } },
    ];

    const json = exportToJson(sections);
    expect(JSON.parse(json)).toEqual(sections);
    // Should be formatted with indentation
    expect(json).toContain('\n');
  });
});
