# Amrendra Singh — Product Design Portfolio

A responsive product-design portfolio built with Next.js, React, TypeScript, and Framer Motion. It includes a restrained landing page, reusable case-study layouts, a draggable playground, and responsive navigation.

## Tech stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Framer Motion
- Plain CSS in one global stylesheet
- Local PP Neue Montreal font files

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Create and run a production build:

```bash
npm run build
npm start
```

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Type-check and create an optimized production build |
| `npm start` | Serve the completed production build |

## Routes

| Route | Page |
| --- | --- |
| `/` | Landing hero and project grid |
| `/work` | Landing hero and project grid |
| `/work/[slug]` | Individual case study |
| `/playground` | Draggable visual experiments and prototype |

About content opens as a panel from the shared navigation and footer rather
than as a separate route.

## Project structure

```text
app/
├── layout.tsx              Shared navigation and page shell
├── page.tsx                Re-exports the landing/work experience
├── globals.css             Design tokens and all site styling
├── playground/page.tsx     Playground page
└── work/
    ├── page.tsx            Landing hero and project-card grid
    ├── projects.ts         Project metadata and shared portfolio content
    └── [slug]/page.tsx     Dynamic case-study page

components/
├── SiteNav.tsx             Desktop and mobile navigation
├── SiteFooter.tsx          Shared footer links
├── ProjectCardMedia.tsx    Folder-style project-card media
├── PlaygroundCanvas.tsx    Draggable playground layout
└── ...                     Case-study carousels, boards, and navigation

public/
├── about/                  About-page photography
├── brand/                  Navigation logo animations
├── icons/                  Case-study interface icons
├── playground/             Playground artwork
└── projects/               Project thumbnails, videos, and case-study media
```

## How the main experience works

### Landing hero

`app/work/page.tsx` composes the interactive hero, Selected Work rail,
testimonials, and footer used by both `/` and `/work`. The Works navigation
link scrolls directly to `#selected-work`.

## Editing portfolio content

### Change landing-page copy

Edit the hero in `components/InteractiveWorkHero.tsx`.

### Add or edit a project

Project cards and basic case-study metadata share one source of truth: `app/work/projects.ts`.

Each project can define:

- `slug`
- `title` and `description`
- project-card and hero media
- client, team, timeline, and scope
- badges
- overview, challenge, and strategy content

The detailed case-study presentation is rendered by `app/work/[slug]/page.tsx`. Some project-specific content and media collections currently live in that file.

### Change navigation or footer links

- Navigation: `components/SiteNav.tsx`
- Footer: `components/SiteFooter.tsx`

Both Resume links use the same Google Drive destination and open in a new tab with `noopener noreferrer`.

### Replace an image or video

Place the optimized file in the appropriate `public/` subfolder and reference it with a root-relative URL:

```tsx
<img src="/projects/example.webp" alt="Description" />
```

Keep filenames stable when replacing existing media. This avoids unnecessary code changes and broken references.

## Styling and responsive behavior

All styling lives in `app/globals.css`.

The top of the file contains reusable design tokens for colors, typography, spacing, and layer order. Component styles are grouped by page or feature below those tokens.

Important responsive behavior includes:

- the navigation becomes a hamburger menu at `640px` and below;
- the closed mobile menu is both invisible and non-interactive;
- the mobile navigation layer stays above draggable Playground content;
- hero objects reposition and simplify on narrower screens;
- case-study and Playground grids collapse progressively for tablet and mobile.

## Accessibility and motion

- Project grids and hidden transition states use `inert` and `aria-hidden`.
- Navigation, carousels, and interactive boards include keyboard behavior.
- Visible focus outlines are defined globally.
- Decorative media uses empty alternative text or `aria-hidden`.
- The primary motion components respect the user’s reduced-motion preference.

## Before publishing

Run a production build:

```bash
npm run build
```

Then check:

1. `/`, `/work`, and `/playground`.
2. Every canonical project URL.
3. Mobile navigation in both open and closed states.
4. Hero-to-project and logo-to-hero transitions.
5. Images, videos, carousels, and external links.

Keep unused media out of `public/`: every file in that directory is directly deployable and can increase the site’s published size even when no component references it.
