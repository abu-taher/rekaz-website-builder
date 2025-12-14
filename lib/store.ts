import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  SECTION_LIBRARY,
  SectionInstance,
  SectionType,
  SectionProps,
  HeroProps,
  HeaderProps,
  FeaturesProps,
  FooterProps,
  CtaProps,
  TestimonialProps,
} from './sections';

// =============================================================================
// Store Types
// =============================================================================

type LayoutState = {
  sections: SectionInstance[];
  selectedSectionId: string | null;
  addSection: (type: SectionType) => void;
  updateSection: (id: string, patch: Partial<SectionProps>) => void;
  removeSection: (id: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  replaceAll: (sections: SectionInstance[]) => void;
  reset: () => void;
  selectSection: (id: string | null) => void;
};

// =============================================================================
// Utility Functions
// =============================================================================

/** Move an item in an array from one index to another (immutably) */
function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const clone = [...arr];
  const [item] = clone.splice(from, 1);
  clone.splice(to, 0, item);
  return clone;
}

/**
 * Create a new section instance with the given type.
 * Uses the default props from the section library.
 */
function createSectionInstance(type: SectionType): SectionInstance | null {
  const definition = SECTION_LIBRARY.find((d) => d.type === type);
  if (!definition) return null;

  const id = nanoid();
  // Deep copy the default props to avoid mutations
  const props = JSON.parse(JSON.stringify(definition.defaultProps));

  // Type-safe section creation using discriminated union
  switch (type) {
    case 'hero':
      return { id, type: 'hero', props: props as HeroProps };
    case 'header':
      return { id, type: 'header', props: props as HeaderProps };
    case 'features':
      return { id, type: 'features', props: props as FeaturesProps };
    case 'footer':
      return { id, type: 'footer', props: props as FooterProps };
    case 'cta':
      return { id, type: 'cta', props: props as CtaProps };
    case 'testimonial':
      return { id, type: 'testimonial', props: props as TestimonialProps };
    default:
      return null;
  }
}

// =============================================================================
// Zustand Store
// =============================================================================

export const useLayoutStore = create<LayoutState>((set) => ({
  sections: [],
  selectedSectionId: null,

  addSection: (type) =>
    set((state) => {
      const instance = createSectionInstance(type);
      if (!instance) return state;

      return {
        sections: [...state.sections, instance],
        selectedSectionId: instance.id,
      };
    }),

  updateSection: (id, patch) =>
    set((state) => ({
      sections: state.sections.map((section) => {
        if (section.id !== id) return section;
        // Merge props while preserving the discriminated union structure
        return { ...section, props: { ...section.props, ...patch } } as SectionInstance;
      }),
    })),

  removeSection: (id) =>
    set((state) => {
      const filtered = state.sections.filter((s) => s.id !== id);
      const selectedSectionId =
        state.selectedSectionId === id ? null : state.selectedSectionId;

      return { sections: filtered, selectedSectionId };
    }),

  reorderSections: (fromIndex, toIndex) =>
    set((state) => ({
      sections: moveItem(state.sections, fromIndex, toIndex),
    })),

  replaceAll: (sections) =>
    set(() => ({
      sections,
      selectedSectionId: sections.length > 0 ? sections[0].id : null,
    })),

  reset: () => set({ sections: [], selectedSectionId: null }),

  selectSection: (id) => set({ selectedSectionId: id }),
}));
