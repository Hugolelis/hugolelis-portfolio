// Tiny client-side navigation: push the URL, then tell <App> to re-render.
// No reload, so the page can crossfade (View Transitions) instead of flashing.
export const NAV_EVENT = 'app:navigate'
export const ROUTES = ['/', '/portfolio', '/projetos']
// a project's own page lives under /projetos/<slug> (see projectSlug)
export const isRoute = (path: string) => ROUTES.includes(path) || path.startsWith('/projetos/')

export function navigate(to: string) {
  window.history.pushState(null, '', to)
  window.dispatchEvent(new Event(NAV_EVENT))
}
