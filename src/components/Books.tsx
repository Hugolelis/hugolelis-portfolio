import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useApp } from '../context/AppContext'
import { books } from '../data'

// Estante com os livros de lombada para fora. Clique para puxar um livro (ele gira e mostra a capa),
// clique de novo para guardar. Setas navegam entre os livros e Esc guarda.
export function Books() {
  const { t, lang } = useApp()
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
            key={b.cover}
            ref={el => { refs.current[i] = el }}
            type="button"
            className={`bslot${open === i ? ' open' : ''}`}
            aria-pressed={open === i}
            aria-label={`${b.title[lang]}, ${b.author}`}
            style={{ '--c': b.color, '--i': i } as CSSProperties}
            onClick={() => setOpen(o => (o === i ? null : i))}
          >
            <span className="bk">
              <span className="bk-front">
                <img src={b.cover} alt="" decoding="async" draggable={false} />
              </span>
              <span className="bk-spine">
                <span className="bk-band" />
                <span className="bk-stitle">{b.title[lang]}</span>
                <span className="bk-dot" />
              </span>
              <span className="bk-pages" />
            </span>
          </button>
        ))}
      </div>
      {/* todos os textos ficam empilhados na mesma célula: a caixa tem sempre a altura do maior, então a página não pula ao trocar de livro */}
      <div className="binfo" aria-live="polite">
        <p className={`bsub binfo-slot${book ? '' : ' on'}`}>{t.booksPick}</p>
        {books.map((b, i) => (
          <div key={b.cover} className={`binfo-slot${open === i ? ' on' : ''}`}>
            <div className="brow">
              <h3>{b.title[lang]}</h3>
              <span className="bcount">{String(i + 1).padStart(2, '0')} / {String(books.length).padStart(2, '0')}</span>
            </div>
            <p className="bsub">{b.subtitle[lang]}</p>
            <p className="bmeta">
              <span className="bauthor">{b.author}</span>
              <span className="btag">{b.tag[lang]}</span>
            </p>
          </div>
        ))}
      </div>
      <p className="bhint">
        <kbd>←</kbd><kbd>→</kbd> {t.booksNav} <span aria-hidden="true">·</span> <kbd>Esc</kbd> {t.booksPut}
      </p>
    </section>
  )
}
