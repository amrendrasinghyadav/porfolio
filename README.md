# Amrendra Singh — Product Design Portfolio

A responsive product-design portfolio built with Next.js, React, TypeScript, and Framer Motion. It includes an animated landing experience, a transition from the hero into the project grid, reusable case-study layouts, a draggable playground, and responsive navigation.

## Tech stack

- Next.js 15 with the App Router
- React 19
- TypeScript
- Framer Motion
- Plain CSS in one global stylesheet
- Google Fonts through `next/font`

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

The production build downloads Inter and Instrument Serif through `next/font`, so building requires internet access if the fonts are not already cached.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Type-check and create an optimized production build |
| `npm start` | Serve the completed production build |

## Routes

| Route | Page |
| --- | --- |
| `/` | Animated landing hero |
| `/work` | Project grid |
| `/work/[slug]` | Individual case study |
| `/about` | About page and image gallery |
| `/playground` | Draggable visual experiments and prototype |
| `/contact` | Contact page |

Older project URLs are handled in `app/work/projects.ts`. For example, `/work/common-ground` and `/work/project-4` redirect to the current Project 4 slug.

## Project structure

```text
app/
├── layout.tsx              Shared fonts, background, navigation, footer, and intro
├── page.tsx                Re-exports the landing/work experience
├── globals.css             Design tokens and all site styling
├── about/page.tsx          About page
├── contact/page.tsx        Contact page
├── playground/page.tsx     Playground page
└── work/
    ├── page.tsx            Landing hero and project-card grid
    ├── projects.ts         Project metadata and shared portfolio content
    └── [slug]/page.tsx     Dynamic case-study page

components/
├── SiteNav.tsx             Desktop and mobile navigation
├── SiteFooter.tsx          Shared footer links
├── Intro.tsx               Initial quote overlay
├── HeroTypingText.tsx      Name typing animation and blinking cursor
├── ProjectsTransition.tsx  Hero-to-project-grid and return animation
├── ProjectCardMedia.tsx    Card image and hover-video behavior
├── BackgroundGrid.tsx      Route-aware page background
├── MountainContours.tsx    Interactive landing background
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

`app/work/page.tsx` defines the hero copy and project grid. The same page powers both `/` and `/work`; the visible URL changes according to which part of the experience is active.

`components/HeroTypingText.tsx` animates “I’m Amrendra” one character at a time. It reserves the final phrase width before typing starts, so the text does not jump between lines during the animation. A thin blinking cursor appears only while typing is in progress.

The typing animation waits for the initial quote overlay to finish. It also restarts when the user returns to the hero by clicking the logo.

### Intro overlay

`components/Intro.tsx` displays the quote overlay only on a direct visit to the landing page. When the overlay finishes or is skipped, it emits `portfolio:intro-complete`, which starts the hero typing animation.

### Hero and project-grid transition

`components/ProjectsTransition.tsx` owns the transition between the landing hero and project cards. It:

- animates project previews into the final grid;
- keeps `/` as the hero URL and `/work` as the project-grid URL;
- supports wheel, touch, keyboard, and navigation-triggered transitions;
- restores the hero when the logo is clicked;
- keeps hidden content inert and inaccessible until it becomes visible.

The components communicate through small browser events:

| Event | Purpose |
| --- | --- |
| `portfolio:intro-complete` | Start typing after the intro overlay |
| `portfolio:reveal-work` | Reveal or scroll to the project grid |
| `portfolio:request-hero-return` | Ask the transition system to restore the hero |
| `portfolio:hero-return` | Restart hero typing once the hero is visible |

## Editing portfolio content

### Change landing-page copy

Edit the hero markup in `app/work/page.tsx`.

### Add or edit a project

Project cards and basic case-study metadata share one source of truth: `app/work/projects.ts`.

Each project can define:

- `slug`
- `title` and `description`
- thumbnail and hover media
- client, team, timeline, and scope
- badges
- overview, challenge, and strategy content

When changing a slug, add the previous slug to `legacySlugs` in the same file so old links continue to redirect.

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
- landing annotations are hidden on narrower screens;
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

1. `/`, `/work`, `/about`, `/playground`, and `/contact`.
2. Every canonical project URL.
3. Mobile navigation in both open and closed states.
4. Hero-to-project and logo-to-hero transitions.
5. Images, videos, carousels, and external links.

Keep unused media out of `public/`: every file in that directory is directly deployable and can increase the site’s published size even when no component references it.
