# Portfolio

Portfólio pessoal de Hugo Lelis, feito com React, TypeScript e Vite.

- **Home:** foto, apresentação, botões para Projetos e Certificados e links (GitHub, LinkedIn, e-mail).
- **Projetos:** galeria em 3 colunas; cada card abre uma página com problema, decisão e funcionalidades.
- **Certificados:** galeria em 3 colunas; cada card abre o PDF em um modal.
- **Idioma (PT/EN) e tema (claro/escuro):** botões no topo, a escolha fica salva no navegador.

## Stack

React 19 · TypeScript · Vite · CSS puro. Sem biblioteca de rotas: a navegação é um `pushState` mínimo em [src/router.ts](src/router.ts), e o [vercel.json](vercel.json) manda todo caminho para o `index.html`.

## Rodar

```bash
npm install
npm run dev
```

| Script | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | checa os tipos e gera `dist/` |
| `npm run preview` | serve o build local |
| `npm run lint` | ESLint |

## Editar o conteúdo

- Projetos: [src/data/projects.ts](src/data/projects.ts) (textos em PT e EN).
- Certificados: [src/data/certificates.ts](src/data/certificates.ts); o PDF e a prévia `.webp` ficam em `public/courses/`.
- Textos da home e das páginas: [src/i18n.ts](src/i18n.ts).
- Cores e layout: [src/index.css](src/index.css).

## Deploy

Vercel, sem configuração extra (`npm run build`, saída em `dist/`).

## Licença

[MIT](LICENSE)
