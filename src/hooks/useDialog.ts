import { useEffect, type RefObject } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Escape closes, Tab cycles inside the dialog, and focus returns to
// whatever opened it. `onClose` must be stable (useCallback), otherwise
// the effect re-runs and steals focus.
export function useDialog(ref: RefObject<HTMLElement | null>, onClose: () => void, active = true) {
  useEffect(() => {
    const node = ref.current
    if (!active || !node) return

    const opener = document.activeElement as HTMLElement | null
    node.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab') return

      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement

      if (e.shiftKey && (current === first || current === node)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && current === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      opener?.focus()
    }
  }, [ref, onClose, active])
}
