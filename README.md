<div align="center">

# Rekaz Website Builder

**A high-performance, SSR-friendly drag-and-drop website builder**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-success?style=for-the-badge)](https://rekaz-website-builder-pi.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Assignment Requirements Checklist

| Req | Requirement | Status | Implementation |
|-----|-------------|:------:|----------------|
| A | Section Library (Click-to-Add) | ✅ | 6 pre-made sections: Hero, Header, Features, Footer, CTA, Testimonial |
| B | Live Preview Area | ✅ | Real-time inline preview + fullscreen preview page (`/preview`) |
| C | Import/Export JSON | ✅ | Download/upload with Zod validation + user feedback on errors |
| D | Editable Sections | ✅ | Property panel with inline editing, delete, style customization |
| E | Drag & Drop Reorder | ✅ | @dnd-kit with touch support (150ms hold to drag) |
| F | Fully Responsive | ✅ | Mobile-first design, iOS viewport fix (`100dvh`), no scroll traps |
| G | Performance Optimized | ✅ | Zustand selectors, memoization with custom comparators |
| H | Subtle Animations | ✅ | CSS transitions, fade/scale animations, drag feedback |
| I | SSR Friendly | ✅ | Server Components at top, client pushed to leaves |
| J | Deployment | ✅ | Deployed on Vercel (see Deploy section) |
| K | Contributing Guide | ✅ | Comprehensive `CONTRIBUTING.md` |

---

## 🎯 Key Features

### Core Functionality
- **Section Library** — Click to add 6 section types (Hero, Header, Features, Footer, CTA, Testimonial)
- **Live Preview** — See changes instantly as you edit, plus fullscreen preview
- **Drag & Drop** — Intuitive section reordering with visual feedback (touch + mouse)
- **Property Editor** — Edit titles, descriptions, images, navigation items, and more
- **Style Customization** — Background color, text color, and padding per section
- **Persistence** — Auto-save to localStorage + JSON import/export

### Technical Highlights
- **Zero Unnecessary Re-renders** — Selective Zustand subscriptions + custom memo comparators
- **SSR Architecture** — Server components at the top, client components pushed to leaves
- **Mobile-First** — iOS-safe viewport units, touch DnD, 44px touch targets
- **Validated Import** — Zod schemas validate imported JSON with user-friendly error messages
- **Smooth Animations** — GPU-accelerated CSS animations for 60fps transitions

---

## 🛠️ Tech Stack

| Category | Technology | Why? |
|----------|------------|------|
| **Framework** | Next.js 16 (App Router) | SSR, file-based routing, React Server Components |
| **UI Library** | React 19 | Latest concurrent features, improved performance |
| **Language** | TypeScript 5 | Type safety, discriminated unions, better DX |
| **Styling** | Tailwind CSS 4 | Utility-first, zero runtime CSS |
| **State** | Zustand | Lightweight, selective subscriptions |
| **Drag & Drop** | @dnd-kit | Accessible, touch support, framework-agnostic |
| **Validation** | Zod | Runtime schema validation for import/export |
| **Testing** | Vitest + RTL | Fast unit tests |

---

## 🏛️ Architecture

```
rekaz-website-builder/
├── app/
│   ├── page.tsx                    # Server Component (entry point)
│   ├── layout.tsx                  # Server Component (metadata, fonts)
│   ├── globals.css                 # Global styles + animations
│   ├── error.tsx                   # Error boundary
│   ├── loading.tsx                 # Loading state
│   ├── not-found.tsx               # 404 page
│   ├── editor/                     # Client Components (pushed down)
│   │   ├── Editor.tsx              # Main editor orchestrator
│   │   ├── PropertyPanel.tsx       # Section property forms + styles
│   │   ├── SectionRenderer.tsx     # Memoized section previews
│   │   └── SectionSortableItem.tsx # DnD wrapper with custom comparator
│   └── preview/
│       ├── page.tsx                # Server Component
│       └── PreviewContent.tsx      # Client Component (live preview)
├── components/ui/                  # Reusable UI primitives
├── lib/
│   ├── store.ts                    # Zustand store with selectors
│   ├── sections.ts                 # Type definitions, defaults, styles
│   ├── schemas.ts                  # Zod validation schemas
│   └── storage.ts                  # LocalStorage + import/export
└── CONTRIBUTING.md                 # Developer guide
```

### Design Decisions

**1. SSR-First Architecture**
- Root `page.tsx` and `layout.tsx` are Server Components
- Client interactivity (`"use client"`) only where necessary (Editor, Preview)
- Faster initial page load, better SEO

**2. Performance-Optimized State Management**
```typescript
// ✅ Good: Selective subscription - only re-renders when sections change
const sections = useLayoutStore((state) => state.sections);

// ❌ Bad: Subscribes to entire store - re-renders on any change
const { sections, addSection } = useLayoutStore();
```

**3. Memoization Strategy**
- `React.memo` with custom comparators on section components
- Compares section ID + serialized content (props + styles)
- Editing one section doesn't re-render others

**4. Mobile UX Approach**
- Uses `100dvh` instead of `100vh` for iOS Safari compatibility
- Single primary scroll area on mobile (avoids scroll traps)
- 44px minimum touch targets
- Touch DnD with 150ms hold delay to prevent accidental drags

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/abu-taher/rekaz-website-builder.git
cd rekaz-website-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create optimized production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format with Prettier |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run typecheck` | TypeScript type checking |

---

## 🚢 Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abu-taher/rekaz-website-builder)

### Option 2: Manual Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" → Import your repository
4. Vercel auto-detects Next.js — just click "Deploy"
5. Your site will be live at `your-project.vercel.app`

### Option 3: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

---

## 📖 Usage Guide

### Building a Page

1. **Add Sections** — Click any section type from the library sidebar
2. **Edit Content** — Select a section to reveal the property editor
3. **Style Sections** — Customize background color, text color, and padding
4. **Reorder** — Drag sections using the handle (⠿) to rearrange
5. **Preview** — Click "Live Preview" for a fullscreen view
6. **Save** — Export your layout as JSON to save your work

### Available Sections

| Section | Editable Properties |
|---------|---------------------|
| **Header** | Logo text, navigation items (label + link) |
| **Hero** | Title, subtitle, button label, background image URL |
| **Features** | Heading, feature items (title + description) |
| **CTA** | Heading, description, button label |
| **Testimonial** | Quote, author name, author title |
| **Footer** | Footer text |

All sections support style customization: background color, text color, vertical padding.

---

## 📁 Import/Export

- **Export** — Downloads your layout as a `.json` file
- **Import** — Load any previously exported layout
- **Auto-Save** — Changes persist to localStorage automatically
- **Validation** — Invalid JSON shows user-friendly error message

---

## ⚠️ Known Limitations

- **No undo/redo** — Changes are immediate; use export to save checkpoints
- **No nested sections** — Flat section list only
- **Image URLs only** — No image upload; paste external URLs
- **localStorage only** — No cloud sync; export to backup

---

## 🔮 Future Improvements

- [ ] Undo/redo history
- [ ] More section types (Gallery, Pricing, Contact Form)
- [ ] Cloud storage integration
- [ ] Collaborative editing
- [ ] Export to HTML/CSS

---

## 📄 License

MIT License — feel free to use this project as a reference or starting point.

---

<div align="center">

**Built for the Rekaz Frontend Engineering Assignment**

[View Live Demo](https://rekaz-website-builder-pi.vercel.app) · [Report Issue](https://github.com/abu-taher/rekaz-website-builder/issues)

</div>
