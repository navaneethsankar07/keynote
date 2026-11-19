# KEYNOTE

> **Discover the music behind the music.**

Keynote is an AI-powered music discovery, analysis, and learning platform designed to help music lovers, producers, and musicians understand the musical ideas and elements inside the songs they listen to.

---

## Product Vision

Music is more than just sound—it is rhythm, harmony, tempo, frequency, modal tension, and narrative structure. Keynote bridges the gap between passive listening and active musical comprehension by translating acoustic audio into understandable musical elements:

- **Tempo & Rhythm**: BPM tracking, meter shifts, syncopation, and micro-timing analysis.
- **Harmony & Keys**: Tonal centers, scale modes (Dorian, Lydian, etc.), and Roman numeral chord progressions.
- **Interactive Theory**: Visualizing circle of fifths, voice leading, and cadence structures tied to real songs.
- **Audio Intelligence**: Real-time frequency spectrum analysis, stem isolation, and interactive musical utilities.

---

## Current Development Phase: Phase 2 — The Animated Musical Hero

The project is being developed in disciplined engineering phases:

- **Phase 1: Foundation & Design System** *(Complete)*
  - Next.js App Router & strict TypeScript configuration
  - Dark-first design system with custom tokens (deep charcoal, electric violet, cyan accents)
  - Responsive global layout with desktop and mobile navigation header & footer
  - Initial landing page shell with interactive audio visualizer & feature previews
  - Structured placeholder routes for upcoming workspaces (`/analyze`, `/learn`, `/audio-lab`)
- **Phase 2: The Animated Musical Hero** *(Complete)*
  - Original code-synthesized ambient musical soundscape (no pre-rendered videos)
  - Multi-layered harmonic waveforms (fundamental, counter-melody, overtones) with sampling ticks
  - Concentric acoustic radiation rings and drifting harmonic resonance particles
  - Staggered CSS entrance sequence with accessibility safeguards and `prefers-reduced-motion` static fallback
  - Dynamic spectral visualizer with tempo-synced frequency bar oscillations and interactive presets
  - High-performance, high-DPI Canvas with tab visibility lifecycle and subtle cursor parallax
- **Phase 3: Audio Engine & Song Analyzer** *(Upcoming)*
  - Client-side audio ingestion (MP3, WAV, FLAC) and waveform rendering
  - Signal processing algorithms for BPM and beat-grid tracking
  - Musical key, scale mode, and chord progression detection pipeline
- **Phase 4: Theory Hub & Interactive Audio Lab** *(Planned)*
  - Interactive Circle of Fifths and modal harmonic wheels
  - Virtual piano key pitch mapper and real-time FFT spectrum scope
  - Song-grounded music theory learning curriculum

---

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type checking)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Dark-first theme tokens)
- **Typography**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (Display headers), [Geist](https://vercel.com/font) (Body sans & mono)
- **Icons**: Custom accessible SVG musical icon system
- **Linting**: ESLint with `eslint-config-next`

---

## Prerequisites

Before running the project locally, ensure you have:

- **Node.js**: `v20.x` or later (tested on Node v20.20.2)
- **npm**: `v10.x` or later (or compatible package manager)
- **Git**: Configured for your environment

---

## Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/navaneethsankar07/keynote.git

# Navigate to the project directory
cd keynote

# Switch to the development branch
git checkout develop

# Install dependencies
npm install
```

---

## Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Build & Production

To run a production build and verify static page generation:

```bash
# Compile and build the production bundle
npm run build

# Start the production server
npm run start
```

To run lint checks:

```bash
npm run lint
```

---

## Project Structure

```
keynote/
├── public/                 # Static assets and favicons
├── src/
│   ├── app/                # Next.js App Router routes
│   │   ├── globals.css     # Tailwind CSS theme tokens & base styles
│   │   ├── layout.tsx      # Global root layout (Navbar, Footer, Fonts)
│   │   ├── page.tsx        # Landing page shell (Hero, Features, Roadmap)
│   │   ├── not-found.tsx   # Custom 404 error page
│   │   ├── analyze/        # Song Analyzer placeholder route
│   │   │   └── page.tsx
│   │   ├── learn/          # Music Theory Hub placeholder route
│   │   │   └── page.tsx
│   │   └── audio-lab/      # Audio Tools & Lab placeholder route
│   │       └── page.tsx
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Application shell components
│   │   │   ├── Navbar.tsx  # Responsive navigation header
│   │   │   └── Footer.tsx  # Global footer with brand info & links
│   │   ├── ui/             # Reusable design system primitives
│   │   │   ├── Badge.tsx   # Category and status badges
│   │   │   ├── Button.tsx  # Action buttons and links
│   │   │   ├── Card.tsx    # Surface cards with border states
│   │   │   └── Icons.tsx   # Musical & UI SVG icon library
│   │   ├── shared/         # Shared compound components
│   │   │   ├── PlaceholderPage.tsx # Wireframe shell for upcoming routes
│   │   │   └── SectionHeading.tsx  # Standardized section headings
│   │   └── features/       # Feature-specific components
│   │       └── home/       # Landing page sections
│   │           ├── HeroSection.tsx
│   │           ├── FeaturePreview.tsx
│   │           ├── MusicalVisualizer.tsx
│   │           └── RoadmapSection.tsx
│   ├── lib/                # Shared utilities and configurations
│   │   ├── constants.ts    # Brand constants, navigation items, roadmap data
│   │   └── utils.ts        # Class merging and styling utilities
│   └── types/              # TypeScript interfaces and type definitions
│       └── index.ts
├── eslint.config.mjs       # ESLint flat config
├── next.config.ts          # Next.js configuration
├── package.json            # Project manifest & dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

---

## Design System Principles

- **Dark-First Identity**: Deep charcoal/near-black canvas (`#090a0f`) with subtly elevated neutral surfaces (`#11131c`, `#171a26`) to give focus to musical data.
- **Musical Accents**: Electric violet (`#8b5cf6`) and cyan (`#06b6d4`) represent melodic and harmonic frequencies without overwhelming the UI.
- **Refined Typography**: High-character `Space Grotesk` display typography paired with readable, high-legibility `Geist` body text and monospace counters.
- **Restrained Visuals**: Purposeful waveform lines, beat indicators, and harmonic meters without gratuitous SaaS gradients or heavy glassmorphism.

---

## Git Workflow

- **`main`**: Production-ready, stable releases.
- **`develop`**: Active development branch. All feature work branches off and merges into `develop`.
- **Commit Conventions**: Conventional Commits standard (`feat:`, `chore:`, `docs:`, `fix:`).

---

## License

Private project. © 2026 Keynote. All rights reserved.
