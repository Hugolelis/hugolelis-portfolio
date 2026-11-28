import type { TimelineEntry } from '../types'

// Ordered newest -> oldest.
export const timeline: TimelineEntry[] = [
  {
    id: 'metta-innovations',
    role: { pt: 'Desenvolvedor de Software', en: 'Software Developer' },
    org: { pt: 'Metta Innovations · Estágio', en: 'Metta Innovations · Internship' },
    period: { pt: 'Jul 2025', en: 'Jul 2025' },
    current: true,
    category: 'work',
    description: {
      pt: ['Empresa de visão computacional, onde desenvolvo em Python e C++'],
      en: ['Computer vision company, where I build with Python and C++'],
    },
    details: {
      pt: [
        'Desenvolvi e mantive aplicações em C++ e Python, com integração a 2 bancos de dados: MySQL e PostgreSQL',
        'Construí interfaces com Qt/QML e containerizei serviços com Docker, padronizando os ambientes',
        'Escrevi testes unitários e atuei em time Scrumban (Scrum e Kanban), contribuindo para a qualidade do código',
      ],
      en: [
        'Built and maintained C++ and Python applications integrated with 2 databases: MySQL and PostgreSQL',
        'Built interfaces with Qt/QML and containerized services with Docker, standardizing the environments',
        'Wrote unit tests and worked in a Scrumban team (Scrum and Kanban), contributing to code quality',
      ],
    },
    skills: ['C++', 'Python', 'Qt/QML', 'MySQL', 'PostgreSQL', 'Docker', 'Unit tests', 'Scrumban'],
  },
  {
    id: 'unifoa',
    role: { pt: 'Sistemas de Informação', en: 'Information Systems' },
    org: { pt: 'UniFoa', en: 'UniFoa' },
    period: { pt: '2024 – 2027', en: '2024 – 2027' },
    current: true,
    category: 'education',
    description: {
      pt: ['Graduação em Sistemas de Informação, com foco em arquitetura, algoritmos e desenvolvimento de software'],
      en: ['Information Systems degree, focused on architecture, algorithms, and software development'],
    },
    details: {
      pt: [
        'Previsão de conclusão em 2027, com coeficiente de rendimento de 8,9/10',
        'Monitor bolsista de 3 disciplinas: Programação Backend, Banco de Dados e Estruturas de Dados e Algoritmos',
      ],
      en: [
        'Expected graduation in 2027, with a GPA of 8.9/10',
        'Scholarship teaching assistant for 3 courses: Backend Programming, Databases, and Data Structures and Algorithms',
      ],
    },
    skills: ['Data structures', 'Algorithms', 'Backend', 'Databases'],
  },
  {
    id: 'python2-inatel',
    role: { pt: 'Python 2.0', en: 'Python 2.0' },
    org: { pt: 'Inatel', en: 'Inatel' },
    period: { pt: '2023', en: '2023' },
    category: 'competition',
    description: {
      pt: ['Competição nacional de programação em Python, realizada na faculdade Inatel, meu primeiro contato com programação'],
      en: ['National Python programming competition, held at Inatel college, my first contact with programming'],
    },
  },
]
