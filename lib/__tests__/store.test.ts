import { describe, it, expect, beforeEach } from 'vitest';
import { useLayoutStore } from '../store';
import type { SectionInstance } from '../sections';

describe('useLayoutStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useLayoutStore.setState({
      sections: [],
      selectedSectionId: null,
    });
  });

  describe('addSection', () => {
    it('should add a hero section with default props', () => {
      const { addSection } = useLayoutStore.getState();
      addSection('hero');

      const { sections, selectedSectionId } = useLayoutStore.getState();
      expect(sections).toHaveLength(1);
      expect(sections[0].type).toBe('hero');
      expect(sections[0].props.title).toBe('Build Beautiful Websites Visually');
      expect(selectedSectionId).toBe(sections[0].id);
    });

    it('should add multiple sections', () => {
      const { addSection } = useLayoutStore.getState();
      addSection('header');
      addSection('hero');
      addSection('footer');

      const { sections } = useLayoutStore.getState();
      expect(sections).toHaveLength(3);
      expect(sections.map((s) => s.type)).toEqual(['header', 'hero', 'footer']);
    });

    it('should auto-select newly added section', () => {
      const { addSection } = useLayoutStore.getState();
      addSection('hero');
      const firstId = useLayoutStore.getState().selectedSectionId;

      addSection('footer');
      const secondId = useLayoutStore.getState().selectedSectionId;

      expect(firstId).not.toBe(secondId);
      expect(secondId).toBe(useLayoutStore.getState().sections[1].id);
    });
  });

  describe('updateSection', () => {
    it('should update section props', () => {
      const { addSection, updateSection } = useLayoutStore.getState();
      addSection('hero');
      const sectionId = useLayoutStore.getState().sections[0].id;

      updateSection(sectionId, { title: 'New Title' });

      const { sections } = useLayoutStore.getState();
      expect(sections[0].props.title).toBe('New Title');
    });

    it('should not affect other sections', () => {
      const { addSection, updateSection } = useLayoutStore.getState();
      addSection('hero');
      addSection('footer');

      const heroId = useLayoutStore.getState().sections[0].id;
      updateSection(heroId, { title: 'Updated Hero' });

      const { sections } = useLayoutStore.getState();
      expect(sections[0].props.title).toBe('Updated Hero');
      expect(sections[1].type).toBe('footer');
    });
  });

  describe('removeSection', () => {
    it('should remove a section by id', () => {
      const { addSection, removeSection } = useLayoutStore.getState();
      addSection('hero');
      addSection('footer');

      const heroId = useLayoutStore.getState().sections[0].id;
      removeSection(heroId);

      const { sections } = useLayoutStore.getState();
      expect(sections).toHaveLength(1);
      expect(sections[0].type).toBe('footer');
    });

    it('should clear selection if selected section is removed', () => {
      const { addSection, removeSection, selectSection } = useLayoutStore.getState();
      addSection('hero');
      addSection('footer');

      const heroId = useLayoutStore.getState().sections[0].id;
      selectSection(heroId);
      removeSection(heroId);

      const { selectedSectionId } = useLayoutStore.getState();
      expect(selectedSectionId).toBeNull();
    });
  });

  describe('reorderSections', () => {
    it('should move section from one position to another', () => {
      const { addSection, reorderSections } = useLayoutStore.getState();
      addSection('header');
      addSection('hero');
      addSection('footer');

      reorderSections(0, 2); // Move header to end

      const { sections } = useLayoutStore.getState();
      expect(sections.map((s) => s.type)).toEqual(['hero', 'footer', 'header']);
    });
  });

  describe('replaceAll', () => {
    it('should replace all sections', () => {
      const { addSection, replaceAll } = useLayoutStore.getState();
      addSection('hero');
      addSection('footer');

      const newSections: SectionInstance[] = [
        { id: 'test-1', type: 'header', props: { logoText: 'Test', navItems: [] } },
      ];
      replaceAll(newSections);

      const { sections, selectedSectionId } = useLayoutStore.getState();
      expect(sections).toHaveLength(1);
      expect(sections[0].id).toBe('test-1');
      expect(selectedSectionId).toBe('test-1');
    });

    it('should handle empty array', () => {
      const { addSection, replaceAll } = useLayoutStore.getState();
      addSection('hero');

      replaceAll([]);

      const { sections, selectedSectionId } = useLayoutStore.getState();
      expect(sections).toHaveLength(0);
      expect(selectedSectionId).toBeNull();
    });
  });

  describe('reset', () => {
    it('should clear all sections', () => {
      const { addSection, reset } = useLayoutStore.getState();
      addSection('hero');
      addSection('footer');

      reset();

      const { sections, selectedSectionId } = useLayoutStore.getState();
      expect(sections).toHaveLength(0);
      expect(selectedSectionId).toBeNull();
    });
  });

  describe('selectSection', () => {
    it('should select a section by id', () => {
      const { addSection, selectSection } = useLayoutStore.getState();
      addSection('hero');
      addSection('footer');

      const footerId = useLayoutStore.getState().sections[1].id;
      selectSection(footerId);

      const { selectedSectionId } = useLayoutStore.getState();
      expect(selectedSectionId).toBe(footerId);
    });

    it('should allow deselection with null', () => {
      const { addSection, selectSection } = useLayoutStore.getState();
      addSection('hero');

      selectSection(null);

      const { selectedSectionId } = useLayoutStore.getState();
      expect(selectedSectionId).toBeNull();
    });
  });
});
