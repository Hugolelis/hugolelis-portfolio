import type { Lang } from '../types'

export interface Book {
  /** nome da edição em português, como está na capa */
  title: string
  subtitle: Record<Lang, string>
  /** quem assina o livro, como aparece na capa */
  author: string
  /** assunto, em uma ou duas palavras */
  tag: Record<Lang, string>
  /** capa real, em public/books */
  cover: string
  /** cor da lombada, tirada da capa */
  color: string
}

// livros que estou lendo (edições em português)
export const books: Book[] = [
  { title: 'Arquitetura Limpa', tag: { pt: 'Arquitetura de software', en: 'Software architecture' }, subtitle: { pt: 'O Guia do Artesão para Estrutura e Design de Software', en: "A Craftsman's Guide to Software Structure and Design" }, author: 'Robert C. Martin', cover: '/books/arquitetura-limpa.webp', color: '#12315a' },
  { title: 'Containers com Docker', tag: { pt: 'Containers e DevOps', en: 'Containers and DevOps' }, subtitle: { pt: 'Do desenvolvimento à produção', en: 'From development to production' }, author: 'Daniel Romero', cover: '/books/containers-com-docker.webp', color: '#2f80c0' },
  { title: 'Entendendo Algoritmos', tag: { pt: 'Algoritmos', en: 'Algorithms' }, subtitle: { pt: 'Um Guia Ilustrado para Programadores e Outros Curiosos', en: 'An Illustrated Guide for Programmers and Other Curious People' }, author: 'Aditya Y. Bhargava', cover: '/books/entendendo-algoritmos.webp', color: '#b3261e' },
  { title: 'TDD', tag: { pt: 'Testes', en: 'Testing' }, subtitle: { pt: 'Desenvolvimento Guiado por Testes', en: 'Test-Driven Development' }, author: 'Kent Beck', cover: '/books/tdd.webp', color: '#7a3fa0' },
  { title: 'Introdução a Data Science', tag: { pt: 'Ciência de dados', en: 'Data science' }, subtitle: { pt: 'Algoritmos de machine learning e métodos de análise', en: 'Machine learning algorithms and analysis methods' }, author: 'Tatiana Escovedo & Adriano Koshiyama', cover: '/books/introducao-a-data-science.webp', color: '#a85a14' },
]
