# Portfolio

<div align="left">

[![Status](https://img.shields.io/badge/Status-Live-407a50?style=for-the-badge&labelColor=1a1a1a&logoColor=white)]()
[![Version](https://img.shields.io/badge/Version-1.0.0-0f766e?style=for-the-badge&labelColor=1a1a1a&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-0f766e?style=for-the-badge&labelColor=1a1a1a&logoColor=white)](LICENSE)

</div>

> **Portfolio** is a personal portfolio website built with React and TypeScript. It showcases professional experience, projects and certificates, with bilingual support (Portuguese and English), dark/light themes and a terminal-inspired design.

<details>
<summary><strong>Table of Contents</strong></summary>

- [About](#about)
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Author](#author)
- [License](#license)

</details>

---

## About

Most portfolio sites are static one-pagers with a resume bolted on. This one is built as a small React application on purpose: full bilingual support (PT/EN) with auto-detection, persisted theme preference, and a terminal-inspired hero meant to signal the kind of engineer behind it before a recruiter reads a single word.

<!-- Adjust this paragraph to your actual motivation. This is a draft based on the feature list, not your own words. -->

---

## Features

| Capability | Description |
|---|---|
| **Bilingual** | Full Portuguese and English support with browser auto-detection and manual toggle |
| **Dark/Light theme** | Persists preference via `localStorage` and respects `prefers-color-scheme` |
| **Terminal hero** | Animated code editor display with typewriter effect |
| **Interactive timeline** | Career and education history with dark mode support |
| **Project showcase** | Cards with type badges (API, CLI), tech tags, and GitHub links |
| **Certificate viewer** | Inline PDF modal with mobile download fallback |
| **CV download** | PDF preview directly in the browser |
| **Responsive design** | Adaptive layout, hamburger menu, and mobile-friendly components |
| **Interactive hero** | Animated ShapeGrid background with cursor hover trail |

---

## Tech Stack

![React](https://img.shields.io/badge/React-52719d?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-52719d?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-52719d?style=for-the-badge&logo=vite&logoColor=white)
![CSS Modules](https://img.shields.io/badge/CSS_Modules-52719d?style=for-the-badge&logo=cssmodules&logoColor=white)

| | |
|---|---|
| **Framework** | [React 19](https://react.dev) |
| **Language** | [TypeScript](https://www.typescriptlang.org) |
| **Bundler** | [Vite](https://vitejs.dev) |
| **Styling** | [CSS Modules](https://github.com/css-modules/css-modules) |
| **Linter** | [ESLint](https://eslint.org) |
| **Fonts** | DM Serif Display, DM Sans, JetBrains Mono |
| **Deploy** | [Vercel](https://vercel.com) |

---

## Architecture & Design Decisions

```
src/
├── components/
│   ├── About.tsx            # About me section with skills
│   ├── Certificates.tsx     # Certificate grid
│   ├── Contact.tsx          # Contact information
│   ├── Footer.tsx           # Footer
│   ├── Hero.tsx              # Terminal-inspired hero section
│   ├── Nav.tsx               # Navigation with scroll spy
│   ├── PdfModal.tsx          # PDF viewer modal
│   ├── ProjectCard.tsx       # Individual project card
│   ├── Projects.tsx          # Projects section
│   ├── ShapeGrid.tsx         # Interactive hero background
│   └── Timeline.tsx          # Career timeline
├── context/                  # React Context (theme, language, translations)
├── data/                     # Static data (projects, skills)
├── hooks/                    # Custom hooks
│   ├── useActiveSection.ts   # IntersectionObserver for nav
│   └── useScrollY.ts         # Scroll position tracking
├── i18n/                     # Translations (pt.ts, en.ts)
├── pages/                    # Projects and certificates pages
├── types/                    # TypeScript interfaces
├── App.tsx                   # Root component
├── index.css                 # Global styles and CSS custom properties
└── main.tsx                  # Entry point
```

**Why this shape:** CSS Modules over Tailwind/styled-components keeps styling scoped per component with zero runtime cost, with no CSS-in-JS overhead for a site that's mostly static content. Theme and language live in React Context rather than a state library, since both are small, low-frequency, app-wide values. A full store would be overkill. Active-section highlighting in the nav uses `IntersectionObserver` (`useActiveSection`) instead of a router, since the whole site is a single scrollable page rather than distinct routed views.

**Known limitations:**
- No automated tests yet.
- Translations live as hand-written objects per language (`i18n/pt.ts`, `i18n/en.ts`) rather than an external i18n framework: fine at two languages, would need a real library beyond that.
- Certificate PDFs render inline via modal; very large files may be slow to load on mobile.

<!-- Adjust "Why this shape" and "Known limitations" to match your actual reasoning, draft based on the code structure. -->

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Hugolelis/Portfolio.git
cd Portfolio
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
| `npm run build` | Run `tsc -b` and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## Deployment

The project is configured for **Vercel** deployment with SPA rewrites via `vercel.json`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Hugolelis/Portfolio)

---

## Author

[Hugolelis](https://github.com/Hugolelis)

---

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

<!-- Confirm this repo actually has a LICENSE file with MIT. Added to match your other repos, remove/adjust if it's not really open-sourced under MIT. -->
