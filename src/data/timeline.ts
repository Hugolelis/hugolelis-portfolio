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
  },
  {
    id: 'unifoa',
    role: { pt: 'Sistemas de Informação', en: 'Information Systems' },
    org: { pt: 'UniFoa', en: 'UniFoa' },
    period: { pt: '2024', en: '2024' },
    current: true,
    category: 'education',
    description: {
      pt: ['Graduação em Sistemas de Informação, com foco em arquitetura, algoritmos e desenvolvimento de software'],
      en: ['Information Systems degree, focused on architecture, algorithms, and software development'],
    },
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
