import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 6,
    title: { pt: 'Person Detector', en: 'Person Detector' },
    tag: 'Python · YOLOv8 · PySide6 · OpenCV',
    type: 'AI',
    description: {
      pt: [
        'Conta pessoas numa zona demarcada em vídeo ou webcam, usando YOLOv8 e debounce',
        'Vista de profundidade destaca a pessoa mais próxima, cada violação vira um clipe anotado',
      ],
      en: [
        'Counts people inside a user-defined zone in video or webcam feed, using YOLOv8 and debounce',
        'Depth view highlights the closest person, each violation is saved as an annotated clip',
      ],
    },
    year: '2026',
    link: 'https://github.com/Hugolelis/person_detector-ai',
    features: {
      pt: [
        'Contagem por zona: conta quando ≥30% da caixa está dentro da zona',
        'Debounce: começa após N frames acima do limite, termina após M abaixo, com cooldown',
        'Clipes com contexto: segundos antes e depois da violação, gravados em thread separada',
        'Pessoa mais próxima: mapa de profundidade ranqueia e destaca a mais próxima',
        'Janela desktop: vídeo e gráfico ao vivo, editor de zona, iniciar/pausar/parar (PySide6)',
        'Logs e gráfico: series.csv, events.csv e gráfico de ocupação a cada execução',
      ],
      en: [
        'Zone-based counting: a person counts when ≥30% of their box is inside the zone',
        'Debounce: starts after N frames above the limit, ends after M below, with cooldown',
        'Clips with context: seconds before and after each violation, encoded in a background thread',
        'Closest person: a depth map ranks everyone and highlights the closest one',
        'Desktop window: live video and chart, zone editor, start/pause/stop (PySide6)',
        'Logs and chart: series.csv, events.csv and an occupancy chart for every run',
      ],
    },
    caseStudy: {
      problem: {
        pt: 'Contar pessoas num vídeo é fácil; decidir quando a zona realmente passou do limite não é. O detector pisca, e uma checagem ingênua dispara dezenas de alertas falsos num único evento.',
        en: 'Counting people in a video is easy; deciding when a zone is actually over its limit is not. Detectors flicker, so a naive check fires dozens of false alerts on a single event.',
      },
      decision: {
        pt: 'Uma máquina de estados de debounce entre o detector e os alertas, que só enxerga contagens inteiras e por isso é testável sem modelo. A pessoa só conta se uma fração configurável da caixa estiver na zona, e um buffer circular faz cada clipe mostrar o que aconteceu antes do alerta.',
        en: 'A debounce state machine sits between detector and alerts and only sees integer counts, so it is testable without a model. A person counts only when a configurable share of their box is inside the zone, and a rolling buffer makes each clip show what happened before the alert.',
      },
      facts: ['14.8 fps, CPU only', 'Clips + CSV + occupancy chart', 'pytest + Docker'],
    },
    image: '/projects/person-detector.webp',
  },
  {
    id: 1,
    title: { pt: 'Generator API', en: 'Generator API' },
    tag: 'Fastify · TypeScript · Prisma',
    type: 'API',
    description: {
      pt: [
        'Geração de CPF, UUID, senha e números sorteados, além de encurtador de URL com PostgreSQL/Prisma',
        'Fastify + TypeScript com rate limiting, CORS e documentação Swagger interativa em /docs',
      ],
      en: [
        'CPF, UUID, password, and sorted-number generation, plus a URL shortener backed by PostgreSQL/Prisma',
        'Fastify + TypeScript with rate limiting, CORS, and interactive Swagger docs at /docs',
      ],
    },
    year: '2026',
    link: 'https://github.com/Hugolelis/generator-api',
    features: {
      pt: [
        'CPF: números válidos, com ou sem formatação',
        'UUID v4: identificadores aleatórios',
        'Senha: tamanho e conjuntos de caracteres configuráveis',
        'Números sorteados: únicos, dentro de uma faixa, ordenados',
        'Datas: aleatórias, com filtro opcional por dia da semana',
        'Encurtador de URL: cria, resolve e lista, persistido em PostgreSQL',
      ],
      en: [
        'CPF: valid numbers, with or without formatting',
        'UUID v4: random identifiers',
        'Password: configurable length and character sets',
        'Sorted numbers: unique random numbers within a range, sorted',
        'Dates: random dates with an optional day-of-week filter',
        'URL shortener: create, resolve and list, persisted in PostgreSQL',
      ],
    },
    caseStudy: {
      problem: {
        pt: 'Times de dev e QA precisam o tempo todo de dados descartáveis (CPF válido, UUID, senha que respeita política) e acabam espalhando scripts avulsos por cada projeto.',
        en: 'Dev and QA workflows constantly need throwaway data (a valid CPF, a UUID, a policy-compliant password) and end up scattering ad-hoc scripts across projects.',
      },
      decision: {
        pt: 'Geradores sem nenhum conhecimento de HTTP, validação separada da geração e uma única parte com estado: o encurtador de URL, em PostgreSQL via Prisma. O resto da API continua stateless.',
        en: 'Generators with no knowledge of HTTP, validation split from generation, and a single stateful feature: the URL shortener, on PostgreSQL via Prisma. Everything else stays stateless.',
      },
      facts: ['Rate limiting + CORS', 'Swagger /docs', 'Graceful shutdown'],
    },
    banner: {
      pt: 'API REST',
      en: 'REST API',
    },
  },
  {
    id: 4,
    title: { pt: 'QrCode', en: 'QrCode' },
    tag: 'C++17 · ISO/IEC 18004 · Zero Deps',
    type: 'TOOL',
    description: {
      pt: [
        'Implementa a codificação, construção da matriz e padrões de função direto do ISO/IEC 18004',
        'Renderização em terminal e exportação para PBM/PNG, usando apenas C++17 puro',
      ],
      en: [
        'Implements the encoding, matrix construction, and function patterns straight from ISO/IEC 18004',
        'Terminal rendering and PBM/PNG export, using pure C++17 with zero external dependencies',
      ],
    },
    year: '2026',
    link: 'https://github.com/Hugolelis/qrcode-lib',
    features: {
      pt: [
        'Codificação em modo byte: texto para bitstream no formato do QR',
        'Padrões de função: finder, separador, timing, alinhamento e módulo escuro',
        'Reed-Solomon: palavras de correção de erro sobre um corpo de Galois',
        'Posicionamento e máscara: palavras-código na matriz e máscara aplicada',
        'Informação de formato: bits calculados e gravados na área reservada',
        'Saída: renderização no terminal e exportação PBM, sem biblioteca de imagem',
      ],
      en: [
        'Byte-mode encoding: input text to a bitstream in the QR format',
        'Function patterns: finder, separator, timing, alignment and dark module',
        'Reed-Solomon: error correction codewords over a Galois field',
        'Data placement and mask: codewords placed into the matrix, then masked',
        'Format information: bits computed and written to the reserved area',
        'Output: terminal rendering and PBM export, no image library',
      ],
    },
    caseStudy: {
      problem: {
        pt: 'A maioria dos geradores de QR Code é uma chamada de biblioteca que esconde o algoritmo.',
        en: 'Most QR Code generators are a library call that hides the algorithm.',
      },
      decision: {
        pt: 'Implementar a ISO/IEC 18004 direto: codificação, matriz e padrões de função, com cada etapa do pipeline em sua própria unidade de tradução e nenhuma biblioteca de QR ou de imagem.',
        en: 'Implement ISO/IEC 18004 directly: encoding, matrix and function patterns, with each pipeline stage in its own translation unit and no QR or image library.',
      },
      facts: ['C++17, zero deps', 'ISO/IEC 18004', 'Terminal + PBM/PNG'],
    },
    image: '/projects/qrcode.png',
  },
  {
    id: 3,
    title: { pt: 'Lexio', en: 'Lexio' },
    tag: 'Python · Typer · pymupdf · rich',
    type: 'CLI',
    description: {
      pt: [
        'Riqueza vocabular, frequência de palavras e métricas de legibilidade em .txt, .pdf e .docx',
        'Filtro com 300+ stopwords em PT/EN e saída formatada com Rich, construído com Typer',
      ],
      en: [
        'Vocabulary richness, word frequency, and readability metrics across .txt, .pdf, and .docx',
        '300+ built-in PT/EN stopword filtering and Rich-formatted output, built with Typer',
      ],
    },
    year: '2026',
    link: 'https://github.com/Hugolelis/lexio-cli',
    features: {
      pt: [
        'Multiformato: lê .txt, .pdf e .docx',
        'Estatísticas: palavras totais e únicas, sentenças e parágrafos',
        'Legibilidade: type-token ratio, hapax/dis legomena e tamanho médio de palavra',
        'Frequência: top palavras com gráfico de barras e busca exata de qualquer palavra',
        'Stopwords: 300+ em EN/PT ou sua própria lista em ~/.lexio/stopwords.txt',
        'Vocabulário: palavras únicas em ordem alfabética ou por frequência, com --min-length',
      ],
      en: [
        'Multi-format: reads .txt, .pdf and .docx',
        'Lexicometric stats: total and unique words, sentences and paragraphs',
        'Readability: type-token ratio, hapax/dis legomena and average word length',
        'Word frequency: top words with bar charts and an exact lookup of any word',
        'Stopwords: 300+ built in for EN/PT, or your own list in ~/.lexio/stopwords.txt',
        'Vocabulary: unique words alphabetically or by frequency, with --min-length',
      ],
    },
    caseStudy: {
      problem: {
        pt: 'Avaliar frequência de palavras e riqueza vocabular no olho não escala além de uma página.',
        en: 'Eyeballing word frequency and vocabulary richness does not scale past a page.',
      },
      decision: {
        pt: 'Leitores de arquivo isolados atrás de uma interface única (novo formato é só um novo leitor) e um analisador sem nenhuma lógica de apresentação, que fica toda no Rich.',
        en: 'File readers isolated behind a single interface (a new format is just a new reader) and an analyzer with no presentation logic, which lives entirely in Rich.',
      },
      facts: ['300+ stopwords PT/EN', 'TXT · PDF · DOCX', 'Type-token ratio, hapax'],
    },
    image: '/projects/lexio.png',
  },
  {
    id: 2,
    title: { pt: 'YT Downloader', en: 'YT Downloader' },
    tag: 'Python · yt-dlp · Typer · rich',
    type: 'CLI',
    description: {
      pt: [
        'Download de vídeo em MP4 (720p/1080p/1440p) ou extração de áudio em MP3 via FFmpeg',
        'Proteção contra duplicados e validação de URL, construído com yt-dlp, Typer e rich',
      ],
      en: [
        'MP4 video download (720p/1080p/1440p) or MP3 audio extraction via FFmpeg',
        'Duplicate-download protection and URL validation, built with yt-dlp, Typer, and rich',
      ],
    },
    year: '2026',
    link: 'https://github.com/Hugolelis/yt_downloader-cli',
    features: {
      pt: [
        'Download de vídeo: MP4 em 720p, 1080p ou 1440p',
        'Extração de áudio: MP3 a 192 kbps via FFmpeg',
        'Proteção contra duplicados: pula arquivos que já existem',
        'Validação de URL: confere o link antes de baixar',
        'Saída limpa: feedback colorido no terminal com Rich',
      ],
      en: [
        'Video download: MP4 at 720p, 1080p or 1440p',
        'Audio extraction: MP3 at 192 kbps via FFmpeg',
        'Duplicate protection: skips files that already exist',
        'URL validation: checks the link before downloading',
        'Clean output: colored terminal feedback with Rich',
      ],
    },
    caseStudy: {
      problem: {
        pt: 'A CLI do yt-dlp expõe opções demais para o uso do dia a dia: baixar um vídeo numa qualidade ou só o áudio.',
        en: 'The yt-dlp CLI exposes far more options than day-to-day use needs: grab a video at a given quality, or just the audio.',
      },
      decision: {
        pt: 'Envolver só esses dois fluxos, com todas as chamadas ao yt-dlp isoladas num único serviço e a CLI cuidando só de entrada e saída.',
        en: 'Wrap just those two flows, with every yt-dlp call isolated in one service and the CLI handling only input and output.',
      },
      facts: ['MP4 720p/1080p/1440p', 'MP3 192 kbps', 'Duplicate protection'],
    },
    image: '/projects/yt-downloader.png',
  },
]
