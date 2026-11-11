import { useMediaQuery } from './useMediaQuery'

// Laptop/desktop (mouse, big enough to show the whole room) with WebGL: home is the 3D room only; hero + every section live on /portfolio.
// Phones/tablets keep the single scrolling page.
const hasWebGL = (() => {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!gl
  } catch {
    return false
  }
})()

export function useDeskMode() {
  const wide = useMediaQuery(
    // mouse, and a viewport that can show the whole room at once: wide enough, tall enough and not too
    // square (DeskScene pulls the camera back to fit the aspect, down to 5:4 — beyond that items would be tiny)
    '(min-width: 900px) and (min-height: 600px) and (min-aspect-ratio: 5/4) and (hover: hover) and (pointer: fine)',
  )
  return wide && hasWebGL
}

// /portfolio?embed=1 is the page shown inside the monitor's iframe: it must never navigate
// back to the room (that would nest a desk inside the desk), so its links stay in-page.
export const isEmbed = new URLSearchParams(window.location.search).has('embed')

/** Where a section link should point, given the current layout. */
export function sectionHref(id: string, deskMode: boolean, onSubPage: boolean) {
  if (isEmbed) return window.location.pathname === '/portfolio' ? `#${id}` : `/portfolio?embed=1#${id}`
  if (deskMode) return `/portfolio#${id}`
  return onSubPage ? `/#${id}` : `#${id}`
}
