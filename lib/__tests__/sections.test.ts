import { describe, it, expect } from 'vitest';
import {
  SECTION_LIBRARY,
  isHeroSection,
  isHeaderSection,
  isFeaturesSection,
  isFooterSection,
  getDefaultPropsForType,
  type SectionInstance,
} from '../sections';

describe('SECTION_LIBRARY', () => {
  it('should contain all section types', () => {
    const types = SECTION_LIBRARY.map((def) => def.type);
    expect(types).toContain('hero');
    expect(types).toContain('header');
    expect(types).toContain('features');
    expect(types).toContain('footer');
  });

  it('should have valid defaultProps for each section', () => {
    const heroDef = SECTION_LIBRARY.find((d) => d.type === 'hero');
    expect(heroDef?.defaultProps.title).toBeDefined();

    const headerDef = SECTION_LIBRARY.find((d) => d.type === 'header');
    expect(headerDef?.defaultProps.logoText).toBeDefined();
    expect(headerDef?.defaultProps.navItems).toBeDefined();

    const featuresDef = SECTION_LIBRARY.find((d) => d.type === 'features');
    expect(featuresDef?.defaultProps.heading).toBeDefined();
    expect(featuresDef?.defaultProps.items).toBeDefined();

    const footerDef = SECTION_LIBRARY.find((d) => d.type === 'footer');
    expect(footerDef?.defaultProps.text).toBeDefined();
  });
});

describe('Type guards', () => {
  const heroSection: SectionInstance = {
    id: '1',
    type: 'hero',
    props: { title: 'Test' },
  };

  const headerSection: SectionInstance = {
    id: '2',
    type: 'header',
    props: { logoText: 'Test', navItems: [] },
  };

  const featuresSection: SectionInstance = {
    id: '3',
    type: 'features',
    props: { heading: 'Test', items: [] },
  };

  const footerSection: SectionInstance = {
    id: '4',
    type: 'footer',
    props: { text: 'Test' },
  };

  describe('isHeroSection', () => {
    it('should return true for hero sections', () => {
      expect(isHeroSection(heroSection)).toBe(true);
    });

    it('should return false for non-hero sections', () => {
      expect(isHeroSection(headerSection)).toBe(false);
      expect(isHeroSection(featuresSection)).toBe(false);
      expect(isHeroSection(footerSection)).toBe(false);
    });
  });

  describe('isHeaderSection', () => {
    it('should return true for header sections', () => {
      expect(isHeaderSection(headerSection)).toBe(true);
    });

    it('should return false for non-header sections', () => {
      expect(isHeaderSection(heroSection)).toBe(false);
    });
  });

  describe('isFeaturesSection', () => {
    it('should return true for features sections', () => {
      expect(isFeaturesSection(featuresSection)).toBe(true);
    });

    it('should return false for non-features sections', () => {
      expect(isFeaturesSection(heroSection)).toBe(false);
    });
  });

  describe('isFooterSection', () => {
    it('should return true for footer sections', () => {
      expect(isFooterSection(footerSection)).toBe(true);
    });

    it('should return false for non-footer sections', () => {
      expect(isFooterSection(heroSection)).toBe(false);
    });
  });
});

describe('getDefaultPropsForType', () => {
  it('should return default props for hero', () => {
    const props = getDefaultPropsForType('hero');
    expect(props).toHaveProperty('title');
  });

  it('should return default props for header', () => {
    const props = getDefaultPropsForType('header');
    expect(props).toHaveProperty('logoText');
    expect(props).toHaveProperty('navItems');
  });

  it('should return default props for features', () => {
    const props = getDefaultPropsForType('features');
    expect(props).toHaveProperty('heading');
    expect(props).toHaveProperty('items');
  });

  it('should return default props for footer', () => {
    const props = getDefaultPropsForType('footer');
    expect(props).toHaveProperty('text');
  });

  it('should throw for unknown type', () => {
    expect(() => getDefaultPropsForType('unknown' as never)).toThrow();
  });
});
