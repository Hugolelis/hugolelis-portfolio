import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useApp } from '../context/AppContext'
import { books } from '../data'

// Estante com os livros de lombada para fora. Clique para puxar um livro (ele gira e mostra a capa),
// clique de novo para guardar. Setas navegam entre os livros e Esc guarda.
export function Books() {
  const { t } = useApp()
  const [open, setOpen] = useState<number | null>(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const book = open === null ? null : books[open]

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') return setOpen(null)
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const start = open ?? (dir === 1 ? -1 : books.length)
    const next = (start + dir + books.length) % books.length
    setOpen(next)
    refs.current[next]?.focus()
  }

  return (
    <section className="tl">
      <h2 className="label"><span>{t.booksTitle}</span><span className="n">{books.length}</span></h2>
      <div className="bshelf" onKeyDown={onKeyDown}>
        {books.map((b, i) => (
          <button
            key={b.title}
            ref={el => { refs.current[i] = el }}
            type="button"
            className={`bslot${open === i ? ' open' : ''}`}
            aria-pressed={open === i}
            aria-label={`${b.title}, ${b.author}`}
            style={{ '--c': b.color } as CSSProperties}
            onClick={() => setOpen(o => (o === i ? null : i))}
          >
            <span className="bk">
              <span className="bk-front">
                <img src={b.cover} alt="" decoding="async" draggable={false} />
              </span>
              <span className="bk-spine">
                <span className="bk-band" />
                <span className="bk-stitle">{b.title}</span>
                <span className="bk-dot" />
              </span>
              <span className="bk-pages" />
            </span>
          </button>
        ))}
      </div>
      <div className="binfo" aria-live="polite">
        {book ? (
          <div key={book.title} className="binfo-in">
            <div className="brow">
              <h3>{book.title}</h3>
              <span className="bcount">{String((open ?? 0) + 1).padStart(2, '0')} / {String(books.length).padStart(2, '0')}</span>
            </div>
            <p className="bsub">{book.subtitle}</p>
            <p className="bmeta">
              <span className="bauthor">{book.author}</span>
              <span className="btag">{book.tag}</span>
            </p>
          </div>
        ) : (
          <p className="bsub">{t.booksPick}</p>
        )}
      </div>
      <p className="bhint">
        <kbd>←</kbd><kbd>→</kbd> {t.booksNav} <span aria-hidden="true">·</span> <kbd>Esc</kbd> {t.booksPut}
      </p>
    </section>
  )
}
