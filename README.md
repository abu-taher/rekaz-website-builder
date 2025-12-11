# Rekaz Website Builder

> A modern, intuitive drag-and-drop website builder built with Next.js 16 and React 19

[![Next.js](https://img.shields.io/badge/Next.js-16.0.8-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## Live Demo

🚀 **[View Live Demo](https://your-deployment-url.vercel.app)** *(Update with your deployment URL)*

## Features

- **Section Library (Click-to-Add)** - Pre-made sections (Hero, Header, Features, Footer) that users can click to add
- **Live Preview** - Real-time preview of your website as you build
- **Import/Export JSON** - Save and load layouts as JSON files for persistence
- **Editable Sections** - Edit section properties including titles, descriptions, and image URLs
- **Drag & Drop Reorder** - Reorder sections by dragging and dropping
- **Delete Sections** - Remove unwanted sections with one click
- **Auto-Save** - Automatic localStorage persistence of your work
- **Responsive Design** - Mobile-first approach with responsive breakpoints
- **Subtle Animations** - Smooth transitions and animations throughout the app
- **SSR Friendly** - Built with Next.js App Router, client components pushed down the tree

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand (with selective subscriptions to prevent re-renders)
- **Drag & Drop:** @dnd-kit
- **Performance:** React.memo with custom comparison functions

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/rekaz-website-builder.git
   cd rekaz-website-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/rekaz-website-builder)

Or deploy manually:
```bash
npm run build
npm run start
```

## Usage

### Building Your First Website

1. **Add Sections** - Click on any section from the library (Hero, Header, Features, Footer) to add it to your page
2. **Edit Properties** - Select a section to edit its properties in the sidebar panel (title, description, image URL, etc.)
3. **Reorder Sections** - Drag and drop sections using the drag handle (⠿) to reorder them
4. **Delete Sections** - Click the "Delete" button on any section to remove it
5. **Preview** - See your changes in real-time in the preview panel
6. **Export** - Save your layout as a JSON file for later use

### Section Types

| Section | Editable Properties |
|---------|---------------------|
| **Hero** | Title, Subtitle, Button Label, Image URL |
| **Header** | Logo Text, Navigation Items |
| **Features** | Heading, Feature Items (title + description each) |
| **Footer** | Footer Text |

### Import/Export

- **Export:** Click "Export JSON" to download your layout as a `.json` file
- **Import:** Click "Import JSON" to load a previously saved layout
- **Clear:** Remove all sections and start fresh

## Architecture

The application follows a modular architecture with SSR-friendly patterns:

```
app/
├── page.tsx              # Server Component - Main homepage
├── layout.tsx            # Server Component - Root layout with metadata
├── globals.css           # Global styles with animations
└── editor/               # Client Components (pushed down)
    ├── Editor.tsx        # Main editor interface
    ├── SectionRenderer.tsx   # Renders section previews
    ├── PropertyPanel.tsx     # Property editing forms
    └── SectionSortableItem.tsx  # Drag-and-drop wrapper

lib/
├── store.ts              # Zustand store with selective subscriptions
└── sections.ts           # Section type definitions and defaults
```

### Performance Optimizations

- **Selective State Subscriptions:** Components only subscribe to the specific state they need
- **React.memo:** All section components are memoized with custom comparison functions
- **Efficient Re-renders:** Updates to one section don't cause re-renders of others
- **CSS Animations:** Using CSS keyframes instead of JS for smooth animations

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Roadmap

- [ ] Add more section types (testimonials, pricing, contact)
- [ ] Implement undo/redo functionality
- [ ] Add theme/color customization
- [ ] Export to static HTML
- [ ] Add more image positioning options

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Drag and drop powered by [@dnd-kit](https://dndkit.com/)
- State management with [Zustand](https://zustand-demo.pmnd.rs/)

---

<div align="center">
  <sub>Built with ❤️ for the Rekaz Frontend Assignment</sub>
</div>
