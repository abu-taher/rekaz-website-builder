<div align="center">

# Rekaz Website Builder

**A high-performance, SSR-friendly drag-and-drop website builder**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-success?style=for-the-badge)](https://your-deployment-url.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Assignment Requirements

| Requirement | Status | Implementation |
|-------------|:------:|----------------|
| Section Library (Click-to-Add) | ✅ | Pre-made sections: Hero, Header, Features, Footer |
| Live Preview Area | ✅ | Real-time preview + dedicated fullscreen preview page |
| Import/Export JSON | ✅ | Download/upload configuration files |
| Editable Sections | ✅ | Property panel with inline editing |
| Delete Sections | ✅ | One-click removal with confirmation |
| Drag & Drop Reorder | ✅ | Smooth reordering with @dnd-kit |
| Fully Responsive | ✅ | Mobile-first design with adaptive layouts |
| Performance Optimized | ✅ | Zero unnecessary re-renders (see details below) |
| Subtle Animations | ✅ | CSS transitions & keyframe animations |
| SSR Friendly | ✅ | Client components pushed down the tree |

---

## 🎯 Key Features

### Core Functionality
- **Section Library** — Click to add pre-built sections (Hero, Header, Features, Footer)
- **Live Preview** — See changes instantly as you edit
- **Drag & Drop** — Intuitive section reordering with visual feedback
- **Property Editor** — Edit titles, descriptions, images, and more
- **Persistence** — Auto-save to localStorage + JSON import/export

### Technical Highlights
- **Zero Unnecessary Re-renders** — Selective Zustand subscriptions ensure components only update when their specific data changes
- **SSR Architecture** — Server components at the top, client components pushed to leaves
- **Optimized Memoization** — Custom comparison functions prevent wasteful renders
- **Smooth Animations** — GPU-accelerated CSS animations for 60fps transitions

---

## 🛠️ Tech Stack

| Category | Technology | Why? |
|----------|------------|------|
| **Framework** | Next.js 16 (App Router) | SSR support, file-based routing, React Server Components |
| **UI Library** | React 19 | Latest concurrent features, improved performance |
| **Language** | TypeScript 5 | Type safety, better DX, fewer runtime errors |
| **Styling** | Tailwind CSS 4 | Utility-first, zero runtime CSS, tree-shakeable |
| **State** | Zustand | Lightweight, selective subscriptions, no boilerplate |
| **Drag & Drop** | @dnd-kit | Accessible, performant, framework-agnostic |

---

## 🏛️ Architecture

```
rekaz-website-builder/
├── app/
│   ├── page.tsx                    # Server Component (entry point)
│   ├── layout.tsx                  # Server Component (metadata, fonts)
│   ├── globals.css                 # Global styles + animations
│   ├── editor/                     # Client Components (pushed down)
│   │   ├── Editor.tsx              # Main editor orchestrator
│   │   ├── PropertyPanel.tsx       # Section property forms
│   │   ├── SectionRenderer.tsx     # Memoized section previews
│   │   └── SectionSortableItem.tsx # Drag-and-drop wrapper
│   └── preview/
│       ├── page.tsx                # Server Component (preview route)
│       └── PreviewContent.tsx      # Client Component (live preview)
└── lib/
    ├── store.ts                    # Zustand store with selectors
    └── sections.ts                 # Type definitions & defaults
```

### Design Decisions

**1. SSR-First Architecture**
- Root `page.tsx` and `layout.tsx` are Server Components
- Client interactivity (`"use client"`) only where necessary
- Faster initial page load, better SEO potential

**2. Performance-Optimized State Management**
```typescript
// ❌ Bad: Component re-renders on ANY store change
const { sections, addSection } = useStore();

// ✅ Good: Component only re-renders when sections change
const sections = useStore((state) => state.sections);
const addSection = useStore((state) => state.addSection);
```

**3. Memoization Strategy**
- `React.memo` with custom comparators on section components
- Editing one section doesn't re-render others
- Drag operations don't trigger content re-renders

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
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint for code quality |

---

## 📖 Usage Guide

### Building a Page

1. **Add Sections** — Click any section type from the library sidebar
2. **Edit Content** — Select a section to reveal the property editor
3. **Reorder** — Drag sections using the handle (⠿) to rearrange
4. **Preview** — Click "Open Preview" for a fullscreen view
5. **Save** — Export your layout as JSON to save your work

### Editable Properties

| Section | Properties |
|---------|-----------|
| **Header** | Logo text, navigation items |
| **Hero** | Title, subtitle, button label, background image URL |
| **Features** | Section heading, feature items (add/remove dynamically) |
| **Footer** | Footer text content |

---

## 📁 Import/Export

The builder supports JSON-based persistence:

- **Export** — Downloads your current layout as a `.json` file
- **Import** — Load any previously exported layout
- **Auto-Save** — Changes persist to localStorage automatically

---

## 🎨 UI/UX Details

- **Light Theme** — Clean, professional interface
- **Responsive Layout** — Works on desktop, tablet, and mobile
- **Visual Feedback** — Hover states, active indicators, drag previews
- **Smooth Transitions** — Subtle animations enhance the experience

---

## 📄 License

MIT License — feel free to use this project as a reference or starting point.

---

<div align="center">

**Built for the Rekaz Frontend Engineering Assignment**

[View Live Demo](https://your-deployment-url.vercel.app) · [Report Issue](https://github.com/abu-taher/rekaz-website-builder/issues)

</div>
