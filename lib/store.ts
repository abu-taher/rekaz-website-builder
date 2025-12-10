import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { SECTION_LIBRARY, SectionInstance, SectionType } from './sections';

type LayoutState = {
  sections: SectionInstance[];
  addSection: (type: SectionType) => void;
  updateSection: (id: string, patch: Partial<SectionInstance['props']>) => void;
  removeSection: (id: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  replaceAll: (sections: SectionInstance[]) => void;
  reset: () => void;
};

const moveItem = <T>(arr: T[], from: number, to: number): T[] => {
  const clone = [...arr];
  const [item] = clone.splice(from, 1);
  clone.splice(to, 0, item);
  return clone;
};

export const useLayoutStore = create<LayoutState>((set) => ({
  sections: [],
  addSection: (type) =>
    set((state) => {
      const def = SECTION_LIBRARY.find((d) => d.type === type);
      if (!def) return state;

      const instance: SectionInstance = {
        id: nanoid(),
        type,
        props: def.defaultProps,
      };

      return { sections: [...state.sections, instance] };
    }),
  updateSection: (id, patch) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, props: { ...s.props, ...patch } } : s
      ),
    })),
  removeSection: (id) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
    })),
  reorderSections: (fromIndex, toIndex) =>
    set((state) => ({
      sections: moveItem(state.sections, fromIndex, toIndex),
    })),
  replaceAll: (sections) => set({ sections }),
  reset: () => set({ sections: [] }),
}));
