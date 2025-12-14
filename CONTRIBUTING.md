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
├── lib/                        # Shared utilities and state
│   ├── sections.ts             # Type definitions + section library
│   ├── schemas.ts              # Zod validation schemas
│   ├── store.ts                # Zustand store
│   ├── storage.ts              # LocalStorage utilities
│   └── __tests__/              # Unit tests
│       ├── sections.test.ts
│       ├── store.test.ts
│       └── storage.test.ts
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

## Pull Request Checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm run test:run` passes
- [ ] No `any` types added
- [ ] Client components are minimized
- [ ] Breaking changes documented
