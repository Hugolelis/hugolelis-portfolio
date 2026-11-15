export interface Book {
  title: string
  subtitle: string
  /** quem assina o livro, como aparece na capa */
  author: string
  /** assunto, em uma ou duas palavras */
  tag: string
  /** capa real, em public/books */
  cover: string
  /** cor da lombada, tirada da capa */
  color: string
}

// livros que estou lendo (edições em português)
export const books: Book[] = [
  { title: 'Arquitetura Limpa', tag: 'Arquitetura de software', subtitle: 'O Guia do Artesão para Estrutura e Design de Software', author: 'Robert C. Martin', cover: '/books/arquitetura-limpa.webp', color: '#12315a' },
  { title: 'Containers com Docker', tag: 'Containers e DevOps', subtitle: 'Do desenvolvimento à produção', author: 'Daniel Romero', cover: '/books/containers-com-docker.webp', color: '#2f80c0' },
  { title: 'Entendendo Algoritmos', tag: 'Algoritmos', subtitle: 'Um Guia Ilustrado para Programadores e Outros Curiosos', author: 'Aditya Y. Bhargava', cover: '/books/entendendo-algoritmos.webp', color: '#b3261e' },
  { title: 'TDD', tag: 'Testes', subtitle: 'Desenvolvimento Guiado por Testes', author: 'Kent Beck', cover: '/books/tdd.webp', color: '#7a3fa0' },
  { title: 'Introdução a Data Science', tag: 'Ciência de dados', subtitle: 'Algoritmos de machine learning e métodos de análise', author: 'Tatiana Escovedo & Adriano Koshiyama', cover: '/books/introducao-a-data-science.webp', color: '#a85a14' },
]
