import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type PointerEvent } from 'react'
import { useApp } from '../../context/AppContext'
import { COMMANDS, runCommand, welcomeLines, type Part, type TermLine } from '../../utils/terminalCommands'
import styles from './Terminal.module.css'

const WIDTH = 620
const HEIGHT = 420

// keeps the whole window on screen, and never under the nav (88px tall)
const NAV_CLEARANCE = 100
const clamp = (el: HTMLElement | null, x: number, y: number) => {
  // a maximized window's own size says nothing about where the small one goes
  const sized = el && !el.dataset.full
  const w = sized ? el.offsetWidth : WIDTH
  const h = sized ? el.offsetHeight : HEIGHT
  const maxX = document.documentElement.clientWidth - w
  const maxY = window.innerHeight - h
  return {
    x: Math.min(Math.max(x, 0), Math.max(maxX, 0)),
    y: Math.min(Math.max(y, NAV_CLEARANCE), Math.max(maxY, NAV_CLEARANCE)),
  }
}

export function Terminal() {
  const { t, lang, toggleTheme, toggleLang } = useApp()
  const tt = t.terminal
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [lines, setLines] = useState<TermLine[]>(() => welcomeLines(tt.welcome))
  const [input, setInput] = useState('')
  const history = useRef<string[]>([])
  const cursor = useRef(0)
  const drag = useRef<{ dx: number; dy: number } | null>(null)
  const winRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const pendingScroll = useRef<number | null>(null)
  const outRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleOpen = () => {
    if (!open) {
      setMinimized(false)
      // beside the corner buttons (32px margin + 44px button + gap), bottom-aligned with them
      setPos(clamp(null, document.documentElement.clientWidth - WIDTH - 92, window.innerHeight - HEIGHT - 32))
    }
    setOpen(o => !o)
  }

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus({ preventScroll: true })
  }, [open, minimized, maximized])

  // after a command, show the START of its output (like reading with `less`);
  // the prompt follows below and is reached by scrolling or by typing
  useEffect(() => {
    const out = outRef.current
    const idx = pendingScroll.current
    if (!out || idx === null) return
    pendingScroll.current = null
    const first = out.querySelector<HTMLElement>(`[data-line="${idx}"]`)
    out.scrollTop = first ? first.offsetTop - 12 : 0
  }, [lines])

  // opening / restoring: land on the prompt
  useEffect(() => {
    if (open && !minimized && outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
  }, [open, minimized])

  // typing brings the prompt back into view, the way a terminal follows the cursor
  const showPrompt = () => {
    const out = outRef.current
    const form = formRef.current
    if (!out || !form) return
    const bottom = form.offsetTop + form.offsetHeight + 12
    if (bottom > out.scrollTop + out.clientHeight) out.scrollTop = bottom - out.clientHeight
  }

  useEffect(() => {
    const onResize = () => setPos(p => clamp(winRef.current, p.x, p.y))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const toggleMinimize = () => {
    if (minimized) setPos(p => clamp(null, p.x, p.y))
    setMinimized(m => !m)
  }

  // minimizing wins over maximized: the bar shrinks back to its small floating size
  const full = maximized && !minimized

  const onBarDown = (e: PointerEvent<HTMLDivElement>) => {
    if (full || (e.target as HTMLElement).closest('button')) return
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onBarMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current) setPos(clamp(winRef.current, e.clientX - drag.current.dx, e.clientY - drag.current.dy))
  }

  const execute = (raw: string) => {
    if (!raw) return
    history.current.push(raw)
    cursor.current = history.current.length

    pendingScroll.current = lines.length
    const { lines: next, action } = runCommand(raw, { lang, t })
    setLines(prev => (action === 'clear' ? [] : [...prev, ...next]))
    if (action === 'exit') setOpen(false)
    if (action === 'theme') toggleTheme()
    if (action === 'lang') toggleLang()
    if (typeof action === 'object') document.getElementById(action.goto)?.scrollIntoView()
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const raw = input.trim()
    setInput('')
    execute(raw)
  }

  const renderPart = (part: Part, i: number) => {
    const cls = [part.tone && styles[part.tone], part.bold && styles.bold, (part.run || part.fill) && styles.action].filter(Boolean).join(' ')
    if (part.href) {
      return <a key={i} href={part.href} target={part.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" className={cls}>{part.text}</a>
    }
    if (part.run || part.fill) {
      return (
        <button
          key={i}
          type="button"
          className={cls}
          onClick={e => {
            e.stopPropagation()
            if (part.run) execute(part.run)
            else { setInput(part.fill ?? ''); inputRef.current?.focus() }
          }}
        >
          {part.text}
        </button>
      )
    }
    return <span key={i} className={cls || undefined}>{part.text}</span>
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && input && !input.includes(' ')) {
      const matches = COMMANDS.filter(c => c.startsWith(input.toLowerCase()))
      if (matches.length === 1) {
        e.preventDefault()
        setInput(matches[0] + ' ')
      }
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const h = history.current
      cursor.current = Math.min(Math.max(cursor.current + (e.key === 'ArrowUp' ? -1 : 1), 0), h.length)
      setInput(h[cursor.current] ?? '')
    }
  }

  const cls = [styles.window, minimized && styles.minimized, full && styles.maximized].filter(Boolean).join(' ')

  return (
    <>
      <button
        type="button"
        className={`${styles.fab} ${open ? styles.fabOpen : ''}`}
        onClick={toggleOpen}
        aria-label={open ? tt.close : tt.open}
        aria-expanded={open}
        title={open ? tt.close : tt.open}
      >
        &gt;_
      </button>

      {open && (
        <div
          ref={winRef}
          data-full={full || undefined}
          className={cls}
          style={full ? undefined : { left: pos.x, top: pos.y }}
          role="dialog"
          aria-label="Terminal"
          onClick={() => {
            if (!window.getSelection()?.toString()) inputRef.current?.focus()
          }}
        >
          <div
            className={styles.bar}
            onPointerDown={onBarDown}
            onPointerMove={onBarMove}
            onPointerUp={() => { drag.current = null }}
            onDoubleClick={() => setMaximized(m => !m)}
          >
            <span className={styles.title}>hugo@portfolio: ~</span>
            <div className={styles.controls}>
              <button type="button" onClick={toggleMinimize} aria-label={minimized ? tt.restore : tt.minimize} title={minimized ? tt.restore : tt.minimize}>
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 8h8" stroke="currentColor" strokeWidth="1.4" /></svg>
              </button>
              <button type="button" onClick={() => { setMaximized(m => !m); setMinimized(false) }} aria-label={maximized ? tt.restore : tt.maximize} title={maximized ? tt.restore : tt.maximize}>
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
              </button>
              <button type="button" className={styles.closeBtn} onClick={() => setOpen(false)} aria-label={tt.close} title={tt.close}>
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.4" /></svg>
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              <div ref={outRef} className={styles.output}>
                <div role="log" aria-live="polite">
                  {lines.map((l, i) => (
                    <p key={i} data-line={i} className={[styles.line, styles[l.kind]].filter(Boolean).join(' ')}>
                      {l.kind === 'in' && <span className={styles.prompt}>$ </span>}
                      {l.parts.map(renderPart)}
                    </p>
                  ))}
                </div>

                <form ref={formRef} className={styles.form} onSubmit={submit}>
                  <span className={styles.prompt} aria-hidden="true">$</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => { setInput(e.target.value); showPrompt() }}
                    onKeyDown={onKeyDown}
                    placeholder={tt.placeholder}
                    aria-label="Terminal"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
