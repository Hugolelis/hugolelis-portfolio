<img src="public/favicon.svg" alt="Hugo Lelis logo" width="120">

# Hugo Lelis Portfolio

> Bilingual (PT/EN) personal portfolio of a backend-focused software developer, built with React and TypeScript, with dark and light themes and no UI or routing library.

<div align="left">

[![Status](https://img.shields.io/badge/Status-Live-0f766e?style=for-the-badge&labelColor=1a1a1a&logoColor=white)](https://hugolelis-dev.vercel.app)
[![Version](https://img.shields.io/badge/Version-3.0.0-0f766e?style=for-the-badge&labelColor=1a1a1a&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-0f766e?style=for-the-badge&labelColor=1a1a1a&logoColor=white)](LICENSE)

</div>

<details>
<summary><strong>Table of Contents</strong></summary>

- [About](#about)
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Getting Started](#getting-started)
- [Editing the Content](#editing-the-content)
- [Author](#author)
- [License](#license)

</details>

---

## About

This is the site I use to present my projects, certificates and background. I built it as a small single-page app with as few moving parts as possible: React is the only runtime dependency, routing is a few lines of `pushState`, and all content lives in typed data files, so adding a project or a certificate never touches a component.

The main goal was to keep the site fast and easy to maintain while still supporting two languages and two themes, with every page reachable by its own URL.

---

## Demo

**Live site:** [hugolelis-dev.vercel.app](https://hugolelis-dev.vercel.app)

---

## Features

| Capability | Description |
|---|---|
| **Projects** | Gallery of case studies; each card opens its own page with the problem, the decision behind the solution, the key features and links to the code and the deploy |
| **Certificates** | Gallery of courses; each card opens the PDF in a modal, with a `.webp` preview for the card |
| **Home** | Introduction, tech stack, featured projects and certificates, and the books I'm currently reading |
| **About** | Short bio, interests and a career timeline |
| **Contact** | Modal with GitHub, LinkedIn, email and the résumé (opens in a PDF viewer) |
| **i18n** | Portuguese and English, switched from the header |
| **Themes** | Light and dark; the first visit follows the browser language and the system theme, and the choice is then saved in the browser |

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [React 19](https://react.dev) | UI (the only runtime dependency) |
| [TypeScript](https://www.typescriptlang.org) | Type checking, including the content data files |
| [Vite](https://vite.dev) | Dev server and production build |
| [ESLint](https://eslint.org) | Linting |
| [Vercel](https://vercel.com) | Hosting |

---

## Architecture & Design Decisions

```
.
├── public/            # Static files: favicon, résumé, certificate PDFs, project images, book covers
├── src/
│   ├── components/    # Shared UI: cards, modals, footer, icons
│   ├── pages/         # Home, About, Projects, Project, Certificates
│   ├── data/          # Projects, certificates, stack, timeline and books
│   ├── context/       # Language and theme state
│   ├── hooks/         # Small reusable hooks
│   ├── i18n.ts        # All interface text, in Portuguese and English
│   ├── router.ts      # Client-side routing
│   └── index.css      # Colors, typography and layout
├── vercel.json        # Sends every path to index.html
└── README.md
```

**Why this shape:**

- **Content as data:** projects, certificates and books are typed objects in `src/data/`. Each project carries its texts in both languages, and its URL (`/projetos/<slug>`) is derived from the English title, so a new project needs no extra field.
- **Minimal router:** the site has five routes, so a routing library would be more code than the problem needs. `router.ts` changes the URL with `pushState` and notifies `App`, and `vercel.json` rewrites every path to `index.html` so deep links work on refresh.
- **Plain CSS:** colors are CSS variables switched by a `data-theme` attribute. A small inline script in `index.html` sets the theme before React loads, which avoids a flash of the wrong theme.
- **Context for preferences:** language and theme live in one context and are saved to `localStorage` (wrapped in `try/catch` for private mode).

**Known limitations:**

- Routes are in Portuguese (`/projetos`, `/certificados`, `/sobre`) and are the same for both languages.
- There is no server side rendering or prerendering, so the page content is only available after JavaScript runs.
- There are no automated tests; type checking and linting are the only checks.

---

## Getting Started

### Prerequisites

- Node.js 20.19 or newer (required by Vite 8)
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

| Script | What it does |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Type-checks and builds to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

### Deployment

Connect the repository to Vercel. No extra configuration is needed: the build command is `npm run build` and the output directory is `dist/`.

---

## Editing the Content

| What | Where |
|---|---|
| Projects | [src/data/projects.ts](src/data/projects.ts) (texts in PT and EN) |
| Certificates | [src/data/certificates.ts](src/data/certificates.ts); put the PDF and its `.webp` preview in `public/courses/` |
| Stack, timeline and books | [src/data/](src/data/) |
| Interface text | [src/i18n.ts](src/i18n.ts) |
| Colors and layout | [src/index.css](src/index.css) |

---

## Author

[Hugolelis](https://github.com/Hugolelis)

---

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.
