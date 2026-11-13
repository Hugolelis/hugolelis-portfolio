// texto no lugar da imagem, para projetos sem captura de tela
export function Banner({ text }: { text: string }) {
  return <pre className="banner" aria-hidden="true">{text}</pre>
}
