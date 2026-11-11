// Tiny "what has finished loading" registry the <Preloader> waits on.
const done = new Set<string>()
const listeners = new Set<() => void>()

export function markReady(key: string) {
  if (done.has(key)) return
  done.add(key)
  listeners.forEach(fn => fn())
}
export const isReady = (key: string) => done.has(key)
export function onReadyChange(fn: () => void) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}
