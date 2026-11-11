# Changelog

All notable changes to this project. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioned with [SemVer](https://semver.org/).

## [2.0.0] - 2026-11-10

The home becomes an interactive 3D desk on laptops and desktops. Phones and tablets keep the single scrolling page, unchanged.

### Added
- **3D desk room** (three.js) as the home on laptop/desktop. It only loads when the whole room fits: mouse, WebGL, at least 900×600 and wider than 5:4. The camera pulls back to fit any aspect ratio.
- **Live portfolio on the monitor**: the real site runs inside the screen (CSS3D iframe, hero only to stay light). Clicking it zooms in and opens `/portfolio`.
- **Interactive objects**: the laptop plays a person-detector loop and opens that repo; the sticky note is a real QR code (own ISO/IEC 18004 encoder, `src/utils/qr.ts`) to GitHub; the framed code opens `leetcodes-study`; the ASCII portrait, certificate, clock and books jump to their section; the phone opens the contact modal and the camera stays zoomed until it closes; the monitor light bar toggles on click.
- **`/portfolio` page** with the hero and every section.
- **Smooth navigation**: client-side routing with View Transitions (no page reloads), a camera zoom-out when coming back to the desk, and an eased, interruptible scroll to sections.
- **Loaders**: first-load screen that waits for fonts, page and 3D scene; a spinner on the monitor while the site loads; a spinner on the GitHub activity card.
- **"Back to desk"** pill on `/portfolio`, and a footer on the room page and `/projetos`.

### Changed
- Desktop home is the room alone; the hero and sections moved to `/portfolio`.
- Hero fills the screen, and uses the phone layout whenever the room isn't shown (no in-between layout).
- Projects section shows the 5 newest projects plus a large "see more on GitHub" button.
- Theme and language stay in sync between the room and the monitor.
- Main bundle 424 kB → 289 kB: the GitHub heatmap (and `motion`) loads on demand and the 3D scene is its own chunk.
- Version bumped to 2.0.0 (`package.json` and `package-lock.json`).

### Removed
- Unused code: `ImageModal`, `useScrollFade`, `useScrollProgress`, the terminal component with its commands and strings, and the CSS tokens only it used.

### Fixed
- ESLint error in `useGithubContributions` and the `exhaustive-deps` warning in `ActivityHeatmap`.

## [1.0.0]

First public version: bilingual (PT/EN) single-page portfolio with light/dark theme, hero with an interactive ShapeGrid, stack and GitHub activity heatmap, project showcase with case studies, career timeline, certificate viewer and a `/projetos` page with search and filters.
