# Contributing Guide

## Project Structure

```
rekaz-website-builder/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (Server Component)
│   ├── page.tsx                # Home page (Server Component)
│   ├── loading.tsx             # Global loading state
│   ├── error.tsx               # Global error boundary (Client)
│   ├── not-found.tsx           # 404 page
│   ├── globals.css             # Global styles + Tailwind + animations
│   ├── editor/                 # Editor feature components (Client)
│   │   ├── Editor.tsx          # Main editor orchestrator
│   │   ├── PropertyPanel.tsx   # Section property forms + styles editor
│   │   ├── SectionRenderer.tsx # Section preview renderer (memoized)
│   │   └── SectionSortableItem.tsx # Drag-and-drop wrapper (custom comparator)
│   └── preview/                # Preview route
│       ├── page.tsx            # Preview page (Server Component)
│       └── PreviewContent.tsx  # Preview renderer (Client)
├── components/                 # Reusable components
│   └── ui/                     # UI Primitives (design system)
│       ├── index.ts            # Barrel export
│       ├── button.tsx          # Button with variants/sizes
│       ├── card.tsx            # Card container with variants
│       ├── input.tsx           # Text input
│       ├── textarea.tsx        # Textarea
│       ├── select.tsx          # Select dropdown
│       ├── label.tsx           # Form label with hint support
│       ├── empty-state.tsx     # Empty state placeholder
│       └── badge.tsx           # Badge/tag component
├── lib/                        # Shared utilities and state
│   ├── sections.ts             # Type definitions + section library + styles
│   ├── schemas.ts              # Zod validation schemas
│   ├── store.ts                # Zustand store
│   ├── storage.ts              # LocalStorage + import/export utilities
│   └── __tests__/              # Unit tests
├── public/                     # Static assets
├── eslint.config.mjs           # ESLint configuration
├── prettier.config.mjs         # Prettier configuration
├── tsconfig.json               # TypeScript configuration
├── vitest.config.ts            # Vitest test configuration
└── package.json
```

## Development Commands

| Command              | Description                          |
|---------------------|--------------------------------------|
| `npm run dev`       | Start development server             |
| `npm run build`     | Create production build              |
| `npm run start`     | Run production server                |
| `npm run lint`      | Run ESLint                           |
| `npm run lint:fix`  | Run ESLint with auto-fix             |
| `npm run format`    | Format code with Prettier            |
| `npm run format:check` | Check formatting without writing   |
| `npm run test`      | Run tests in watch mode              |
| `npm run test:run`  | Run tests once                       |
| `npm run typecheck` | Run TypeScript type checking         |

## Coding Conventions

### Server/Client Components

- **Default to Server Components** — No directive needed
- **Use `'use client'` only when required** — For hooks, browser APIs, event handlers
- **Push client components down the tree** — Keep them as leaf nodes

```tsx
// ✅ Good: Server Component by default
export default function Page() {
  return <ClientEditor />;
}

// ✅ Good: Client directive at component that needs it
'use client';
export function ClientEditor() {
  const [state, setState] = useState();
  // ...
}
```

### Type Safety

- **Use discriminated unions** for polymorphic data structures
- **Validate external data with Zod** — See `lib/schemas.ts`
- **No `any` types** — Use `unknown` and type guards instead

```typescript
// ✅ Good: Discriminated union
type Section = 
  | { type: 'hero'; props: HeroProps; styles: SectionStyles }
  | { type: 'footer'; props: FooterProps; styles: SectionStyles };

// ✅ Good: Type guard
function isValidSection(data: unknown): data is Section {
  return sectionSchema.safeParse(data).success;
}
```

### State Management

- **Use Zustand with selective subscriptions** to prevent unnecessary re-renders
- **Create one store per feature domain**

```typescript
// ✅ Good: Selective subscription
const sections = useLayoutStore((state) => state.sections);
const addSection = useLayoutStore((state) => state.addSection);

// ❌ Bad: Subscribes to entire store
const { sections, addSection } = useLayoutStore();
```

### Performance Rules

1. **Use custom memo comparators** for list items that receive objects:
```typescript
function arePropsEqual(prev: Props, next: Props): boolean {
  if (prev.section.id !== next.section.id) return false;
  return JSON.stringify(prev.section) === JSON.stringify(next.section);
}
export const Item = memo(function Item(props) { ... }, arePropsEqual);
```

2. **Avoid creating new objects/arrays in render**:
```typescript
// ❌ Bad: Creates new array every render
<Component items={sections.filter(s => s.type === 'hero')} />

// ✅ Good: Memoize derived data
const heroSections = useMemo(() => 
  sections.filter(s => s.type === 'hero'), 
  [sections]
);
```

3. **Use stable references for callbacks**:
```typescript
// ✅ Good: Stable callback from store
const addSection = useLayoutStore((s) => s.addSection);
```

### Data Fetching & Storage

- **Use `lib/storage.ts`** for all localStorage operations
- **Validate imported data** with Zod schemas before using

### Error Handling

- **Route-level boundaries** — Use `error.tsx` for catch-all
- **Log errors in development** — Use `console.error`
- **Show user-friendly messages** — Avoid exposing technical details to users

### Testing

- **Unit tests** in `__tests__/` directories
- **Name pattern**: `*.test.ts` or `*.test.tsx`
- **Run before committing**: `npm run test:run`

### Styling

- **Use Tailwind CSS** utility classes
- **CSS custom properties** for brand colors (defined in `globals.css`)
- **Responsive design**: mobile-first with `md:` and `lg:` breakpoints
- **Use `100dvh`** instead of `100vh` for iOS Safari compatibility
- **Avoid nested scroll traps**: only one scrollable area per view on mobile

## Adding a New Section Type

Follow these steps to add a new section type (e.g., "Gallery"):

### 1. Update Type Definitions (`lib/sections.ts`)

```typescript
// Add to SectionType union
export type SectionType = 'hero' | 'header' | ... | 'gallery';

// Add props type
export type GalleryProps = {
  title: string;
  images: { url: string; alt: string }[];
};

// Add section type
export type GallerySection = {
  id: string;
  type: 'gallery';
  props: GalleryProps;
  styles: SectionStyles;
};

// Add to SectionInstance union
export type SectionInstance = ... | GallerySection;

// Add to SectionProps union
export type SectionProps = ... | GalleryProps;

// Update SectionDefinition conditional type
export type SectionDefinition<T extends SectionType = SectionType> = {
  // ... add 'gallery' case to defaultProps conditional
};

// Add definition to SECTION_LIBRARY
const galleryDefinition: SectionDefinition<'gallery'> = {
  type: 'gallery',
  label: 'Gallery',
  description: 'Image gallery grid.',
  defaultProps: {
    title: 'Our Work',
    images: [
      { url: 'https://...', alt: 'Image 1' },
    ],
  },
};

export const SECTION_LIBRARY: SectionDefinition[] = [
  ...,
  galleryDefinition,
];

// Add type guard
export function isGallerySection(section: SectionInstance): section is GallerySection {
  return section.type === 'gallery';
}
```

### 2. Update Zod Schemas (`lib/schemas.ts`)

```typescript
// Add props schema
export const galleryPropsSchema = z.object({
  title: z.string(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string(),
  })),
});

// Add section schema
export const gallerySectionSchema = z.object({
  id: z.string(),
  type: z.literal('gallery'),
  props: galleryPropsSchema,
  styles: sectionStylesSchema,
});

// Add to sectionInstanceSchema discriminated union
export const sectionInstanceSchema = z.discriminatedUnion('type', [
  ...,
  gallerySectionSchema,
]);
```

### 3. Update Store (`lib/store.ts`)

```typescript
// Add to createSectionInstance switch
case 'gallery':
  return { id, type: 'gallery', props: props as GalleryProps, styles };
```

### 4. Add Renderer (`app/editor/SectionRenderer.tsx`)

```typescript
case 'gallery': {
  const { title, images } = section.props;
  const { styles } = section;
  // ... render gallery UI
}
```

### 5. Add Property Editor (`app/editor/PropertyPanel.tsx`)

```typescript
case 'gallery': {
  const { title, images } = section.props;
  return (
    <div className="space-y-4">
      <h3>Gallery Settings</h3>
      <Label>Title</Label>
      <Input value={title} onChange={handleChange('title')} />
      {/* Image list editor */}
      <StylesEditor styles={section.styles} onStyleChange={...} />
    </div>
  );
}
```

### 6. Add Preview Renderer (`app/preview/PreviewContent.tsx`)

```typescript
case 'gallery': {
  // ... render fullscreen gallery preview
}
```

### 7. Update Display Names (`app/editor/PropertyPanel.tsx`)

```typescript
const SECTION_DISPLAY_NAMES: Record<SectionType, string> = {
  ...,
  gallery: 'Gallery',
};
```

### 8. Test

1. Add a gallery section in the editor
2. Edit its properties
3. Reorder it via drag & drop
4. Export JSON and verify gallery data is included
5. Import the JSON and verify it loads correctly
6. Check the preview page

## Section Styles

All sections support customizable styles via the `SectionStyles` type:

```typescript
export type SectionStyles = {
  backgroundColor?: string;  // CSS color value
  textColor?: string;        // CSS color value
  paddingY?: PaddingSize;    // 'none' | 'sm' | 'md' | 'lg' | 'xl'
};
```

### Using Styles in Renderers

```typescript
// In SectionRenderer or PreviewContent
const { styles } = section;

// Build inline styles
const inlineStyles: React.CSSProperties = {};
if (styles.backgroundColor) inlineStyles.backgroundColor = styles.backgroundColor;
if (styles.textColor) inlineStyles.color = styles.textColor;

// Get padding class
const paddingClass = PADDING_Y_CLASSES[styles.paddingY ?? 'md'];

// Apply to element
<section className={paddingClass} style={inlineStyles}>
  {/* content */}
</section>
```

### Adding StylesEditor to PropertyPanel

Every section case should include the StylesEditor component:

```typescript
case 'yoursection': {
  return (
    <div className="space-y-4">
      {/* ... property inputs ... */}
      
      <StylesEditor
        styles={section.styles}
        onStyleChange={(styles) => updateSectionStyles(section.id, styles)}
      />
    </div>
  );
}
```

## UI Primitives (`components/ui/`)

Low-level, reusable UI components that form the design system.

### Available Primitives

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant`, `size`, `shape` | Primary, outline, danger variants |
| `Card` | `variant`, `padding`, `rounded` | Container with default/muted/dashed styles |
| `Input` | Standard HTML props | Text input with consistent styling |
| `Textarea` | Standard HTML props | Multi-line text input |
| `Select` | Standard HTML props | Dropdown select |
| `Label` | `hint` | Form label with optional hint text |
| `EmptyState` | `icon`, `title`, `description`, `action` | Placeholder |
| `Badge` | `variant` | Status indicators |

### When to Create New Primitives

Only extract when:
1. **Pattern appears 3+ times**
2. **Has shared behavior** (a11y, keyboard nav)
3. **Would reduce significant duplication**

## Pull Request Checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm run test:run` passes
- [ ] No `any` types added
- [ ] Client components minimized
- [ ] Mobile viewport tested (360×640, 390×844)
- [ ] Breaking changes documented
