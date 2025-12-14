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
│   ├── globals.css             # Global styles + Tailwind
│   ├── editor/                 # Editor feature components
│   │   ├── Editor.tsx          # Main editor orchestrator
│   │   ├── PropertyPanel.tsx   # Section property forms
│   │   ├── SectionRenderer.tsx # Section preview renderer
│   │   └── SectionSortableItem.tsx # Drag-and-drop wrapper
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
│   ├── sections.ts             # Type definitions + section library
│   ├── schemas.ts              # Zod validation schemas
│   ├── store.ts                # Zustand store
│   ├── storage.ts              # LocalStorage utilities
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
  | { type: 'hero'; props: HeroProps }
  | { type: 'footer'; props: FooterProps };

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

### Data Fetching & Storage

- **Use `lib/storage.ts`** for all localStorage operations
- **Validate imported data** with Zod schemas before using

### Error Handling

- **Route-level boundaries** — Use `error.tsx` for catch-all
- **Log errors in development** — Use `console.error`
- **Show user-friendly messages** — Hide technical details in production

### Testing

- **Unit tests** in `__tests__/` directories
- **Name pattern**: `*.test.ts` or `*.test.tsx`
- **Run before committing**: `npm run test:run`

### Styling

- **Use Tailwind CSS** utility classes
- **CSS custom properties** for brand colors (defined in `globals.css`)
- **Responsive design**: mobile-first with `md:` and `lg:` breakpoints

### UI Primitives (`components/ui/`)

The `components/ui/` folder contains low-level, reusable UI components that form the design system. These are:
- **Stateless** (or minimal local state)
- **Styled consistently** with brand colors
- **Accessible by default**
- **Composable** with other primitives

#### Available Primitives

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant`, `size`, `shape` | Primary CTA, outline, danger variants |
| `Card` | `variant`, `padding` | Container with default/muted/dashed styles |
| `Input` | Standard HTML props | Text input with consistent styling |
| `Textarea` | Standard HTML props | Multi-line text input |
| `Select` | Standard HTML props | Dropdown select |
| `Label` | `hint` | Form label with optional hint text |
| `EmptyState` | `icon`, `title`, `description`, `action` | Placeholder for empty content |
| `Badge` | `variant` | Status indicators and labels |

#### Usage

```tsx
import { Button, Card, Input, Label, EmptyState } from '@/components/ui';

// Button variants
<Button variant="primary" size="md">Submit</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="danger" size="sm">Delete</Button>

// Card variants
<Card variant="default" padding="md">Content</Card>
<Card variant="dashed" padding="lg">Empty placeholder</Card>

// Form fields
<Label htmlFor="title" hint="Required field">Title</Label>
<Input id="title" type="text" placeholder="Enter title" />

// Empty state
<EmptyState
  icon="📦"
  title="No items"
  description="Add an item to get started."
  action={<Button>Add Item</Button>}
/>
```

#### When to Create New Primitives

Only extract a new primitive when:
1. **Pattern appears 3+ times** across the codebase
2. **Has shared behavior** (a11y, keyboard nav, animations)
3. **Would reduce significant duplication**

Keep feature-specific components inside feature folders (e.g., `app/editor/`).

#### Adding Variants

To add a new variant to an existing primitive:

1. Add to the `variants` object in the component file
2. Update the TypeScript type union
3. Export the new type from `index.ts`
4. Document in this file

## Pull Request Checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm run test:run` passes
- [ ] No `any` types added
- [ ] Client components are minimized
- [ ] Breaking changes documented
