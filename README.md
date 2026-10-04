# teste-estudio
teste

## PWA

O app é um PWA instalável (via `vite-plugin-pwa`): o service worker (workbox)
faz cache dos assets estáticos e o jogo funciona 100% offline após a primeira
visita. O manifest fica em `public/manifest.webmanifest`.

**Ícones:** para não introduzir dependências de geração de imagem, os ícones
(`public/icons/icon-192x192.svg`, `icon-512x512.svg` e `maskable-512x512.svg`)
são SVG (`purpose: "any"`/`"maskable"`). Navegadores baseados em Chromium usam
esses SVG normalmente no manifest. O `apple-touch-icon` do iOS também aponta
para o SVG; caso seja necessário suporte ideal ao iOS, substitua por PNGs de
mesmo nome nos tamanhos correspondentes.
