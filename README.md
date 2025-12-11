# Rekaz Website Builder

> A modern, intuitive drag-and-drop website builder built with Next.js 16 and React 19

[![Next.js](https://img.shields.io/badge/Next.js-16.0.8-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## Features

- **Visual Editor** - Intuitive drag-and-drop interface for building websites
- **Responsive Design** - Mobile-first approach with responsive breakpoints
- **Live Preview** - Real-time preview of your website as you build
- **Auto-Save** - Automatic localStorage persistence of your work
- **Import/Export** - Save and load layouts as JSON files
- **Section Library** - Pre-built sections (Hero, Header, Features, Footer)
- **Property Editor** - Dynamic property editing for each section
- **SSR Ready** - Built with Next.js for optimal performance and SEO

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **Drag & Drop:** @dnd-kit
- **Build Tool:** Next.js built-in bundler

## Screenshots

<!-- TODO: Add actual screenshots when available -->
*Coming soon - Screenshots of the editor interface and example websites*

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rekaz-website-builder.git
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

## Usage

### Building Your First Website

1. **Add Sections** - Click on any section from the library (Hero, Header, Features, Footer) to add it to your page
2. **Edit Properties** - Select a section to edit its properties in the sidebar panel
3. **Reorder Sections** - Drag and drop sections to reorder them
4. **Preview** - See your changes in real-time in the preview panel
5. **Export** - Save your layout as a JSON file for later use

### Section Types

- **Hero** - Large banner with title, subtitle, and call-to-action button
- **Header** - Navigation bar with logo and menu items
- **Features** - Three-column feature showcase
- **Footer** - Simple footer with copyright text

### Import/Export

- **Export:** Click "Export JSON" to download your layout as a `.json` file
- **Import:** Click "Import JSON" to load a previously saved layout
- **Clear:** Remove all sections and start fresh

## Architecture

The application follows a modular architecture:

```
app/
├── page.tsx              # Main homepage
├── layout.tsx            # Root layout
├── globals.css           # Global styles
└── editor/               # Editor components
    ├── Editor.tsx        # Main editor interface
    ├── SectionRenderer.tsx
    ├── PropertyPanel.tsx
    └── SectionSortableItem.tsx

lib/
├── store.ts              # Zustand state management
└── sections.ts           # Section definitions
```

### Key Features

- **State Management:** Zustand store handles all layout state with localStorage persistence
- **Type Safety:** Full TypeScript coverage with proper type definitions
- **Performance:** React memoization and efficient re-rendering
- **Responsive:** Mobile-first design with Tailwind CSS

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Add TypeScript types for new features
- Test your changes thoroughly
- Update documentation as needed

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Known Issues

- Limited section types - could be expanded with more components

## Roadmap

- [ ] Add more section types (testimonials, pricing, contact)
- [ ] Implement custom CSS editing
- [ ] Add theme system
- [ ] Implement undo/redo functionality
- [ ] Add collaborative editing
- [ ] Export to static HTML

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Drag and drop powered by [@dnd-kit](https://dndkit.com/)
- State management with [Zustand](https://zustand-demo.pmnd.rs/)

## Contact

- **Project Link:** [https://github.com/yourusername/rekaz-website-builder](https://github.com/yourusername/rekaz-website-builder)
- **Issues:** [https://github.com/yourusername/rekaz-website-builder/issues](https://github.com/yourusername/rekaz-website-builder/issues)

---

<div align="center">
  <sub>Built with ❤️ using Next.js and React</sub>
</div>