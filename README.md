# Portfolio

<div align="left">

[![Status](https://img.shields.io/badge/Status-Live-407a50?style=for-the-badge&labelColor=1a1a1a&logoColor=white)](https://hugolelis-dev.vercel.app/)
[![Version](https://img.shields.io/badge/Version-1.0.0-0f766e?style=for-the-badge&labelColor=1a1a1a&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-0f766e?style=for-the-badge&labelColor=1a1a1a&logoColor=white)](LICENSE)

</div>

> **Portfolio** is a personal portfolio website built with React and TypeScript, live at [hugolelis-dev.vercel.app](https://hugolelis-dev.vercel.app/). It showcases professional experience, projects, certificates and GitHub activity, with bilingual support (Portuguese and English), light and dark themes and a terminal-inspired design.

<details>
<summary><strong>Table of Contents</strong></summary>

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Editing the Content](#editing-the-content)
- [Deployment](#deployment)
- [Author](#author)
- [License](#license)

</details>

---

## About

Most portfolio sites are static one-pagers with a resume bolted on. This one is built as a small React application on purpose: full bilingual support (PT/EN), a persisted theme preference, a live GitHub activity heatmap and a terminal-inspired hero, meant to signal the kind of engineer behind it before a recruiter reads a single word.

---

## Features

| Capability | Description |
|---|---|
| **Bilingual** | Full Portuguese and English content with a manual toggle; the choice is saved in `localStorage` (English by default) |
| **Light/Dark theme** | Manual toggle, saved in `localStorage` (light by default) |
| **Terminal hero** | Typewriter title over an interactive ShapeGrid background that reacts to the cursor, with a CV preview modal |
| **Career timeline** | Work, education and competition entries; scrolls horizontally while pinned on desktop and becomes a stacked list on small screens |
| **Stack & GitHub activity** | Tech stack grouped by area, next to a contribution heatmap fed by a public GitHub contributions API |
| **Project showcase** | Cards with type badges (API, CLI, AI, TOOL), tech tags and a screenshot or text banner. Each card opens a modal with Overview and Features tabs and a short case study (the problem and the engineering decision), plus GitHub links. A dedicated `/projetos` page adds search, type filter and "show more" |
| **Certificate viewer** | Inline PDF modal for each certificate |
| **Scroll polish** | Scroll progress bar, reveal-on-scroll animations, active-section highlight in the nav and a back-to-top button |
| **SEO & routing** | Page titles and meta tags via `react-helmet-async`, a 404 page and SPA rewrites on Vercel |
| **Responsive design** | Adaptive layout and a mobile navigation menu |

---

## Tech Stack

![React](https://img.shields.io/badge/React-52719d?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-52719d?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-52719d?style=for-the-badge&logo=vite&logoColor=white)
![CSS Modules](https://img.shields.io/badge/CSS_Modules-52719d?style=for-the-badge&logo=cssmodules&logoColor=white)

| | |
|---|---|
| **Framework** | [React 19](https://react.dev) |
| **Language** | [TypeScript 6](https://www.typescriptlang.org) |
| **Bundler** | [Vite 8](https://vite.dev) |
| **Styling** | [CSS Modules](https://github.com/css-modules/css-modules) |
| **Animation** | [Motion](https://motion.dev) |
| **Head management** | [react-helmet-async](https://github.com/staylor/react-helmet-async) |
| **Linter** | [ESLint 10](https://eslint.org) with `typescript-eslint` |
| **Fonts** | DM Serif Display, DM Sans, JetBrains Mono (Google Fonts) |
| **Deploy** | [Vercel](https://vercel.com) |

---

## Architecture & Design Decisions

```
src/
├── components/
│   ├── sections/            # Page sections (Nav, Hero, About, Timeline, StackSection,
│   │                        #   ActivityHeatmap, ProjectsSection, CertificatesSection, Footer)
│   ├── modals/              # ImageModal, PdfModal, ProjectModal
│   ├── project/             # ProjectCard
│   └── ui/                  # Shared pieces (ShapeGrid, Reveal, ScrollProgress, Expandable, Loading, icons)
├── context/
│   └── AppContext.tsx       # Theme, language and translations
├── data/                    # Static content: projects, timeline, certificates
├── hooks/                   # useActiveSection, useGithubContributions, useHorizontalPin,
│                            #   useMediaQuery, useReveal, useScrollFade, useScrollProgress, ...
├── i18n/                    # Translations (pt.ts, en.ts)
├── pages/
│   └── ProjectsPage.tsx     # /projetos (lazy loaded)
├── types/                   # TypeScript interfaces
├── utils/                   # Badge and project-type color helpers
├── App.tsx                  # Routing by pathname, scroll-to-hash handling, 404
├── index.css                # Global styles and CSS custom properties
└── main.tsx                 # Entry point
public/                      # Avatar, CV, project screenshots and certificate PDFs
vercel.json                  # SPA rewrite to index.html
```

**Why this shape:** CSS Modules over Tailwind/styled-components keeps styling scoped per component with zero runtime cost, with no CSS-in-JS overhead for a site that's mostly static content. Theme and language live in React Context rather than a state library, since both are small, low-frequency, app-wide values. A full store would be overkill. The site has only two real routes (`/` and `/projetos`), so `App.tsx` reads the pathname directly instead of pulling in a router, and `vercel.json` rewrites every path to `index.html`. Active-section highlighting in the nav uses `IntersectionObserver` (`useActiveSection`). All content (projects, timeline, certificates) is plain data under `src/data` and `src/i18n`, so updating the site never means touching components.

**Known limitations:**
- No automated tests yet.
- Translations live as hand-written objects per language (`i18n/pt.ts`, `i18n/en.ts`) rather than an external i18n framework: fine at two languages, would need a real library beyond that.
- The language and theme do not follow the browser: they start as English/light until the visitor toggles them.
- The activity heatmap depends on a third-party public API (`github-contributions-api.jogruber.de`); if it is down, the heatmap shows an error state.
- Fonts are loaded from Google Fonts at runtime, and certificate PDFs are loaded inline in a modal, which can be slow for large files on mobile.

---

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (required by Vite 8)
- npm

### Installation

```bash
git clone https://github.com/Hugolelis/hugolelis-portfolio.git
cd hugolelis-portfolio
npm install
```

### Running locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run `tsc -b` and build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## Editing the Content

| To change | Edit |
|---|---|
| Projects (cards, modal case study and `/projetos` page) | `src/data/projects.ts` (including `features` and `caseStudy`), with screenshots in `public/projects/` |
| Career, education and competitions | `src/data/timeline.ts` |
| Certificates | `src/data/certificates.ts`, with the PDFs in `public/courses/` |
| Texts and labels | `src/i18n/pt.ts` and `src/i18n/en.ts` |
| CV | `public/Hugolelis_cv.pdf` |
| GitHub user for the heatmap | `GITHUB_USERNAME` in `src/components/sections/StackSection.tsx` |

---

## Deployment

The project is configured for **Vercel** deployment with SPA rewrites via `vercel.json`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Hugolelis/hugolelis-portfolio)

---

## Author

[Hugolelis](https://github.com/Hugolelis)

---

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.
