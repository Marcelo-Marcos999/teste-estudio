import React from 'react';

// Ícones SVG inline (stroke-based) para os botões de modo/dificuldade e tema.
// Todos herdam a cor via `currentColor`, permitindo que o CSS controle a tonalidade.

const baseProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export function IconPvp(props) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <path d="M3 20c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      <path d="M13 20c0-2.8 2.2-5 5-5s3 2.2 3 5" />
    </svg>
  );
}

export function IconPvia(props) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="5" y="8" width="14" height="11" rx="2" />
      <path d="M12 4v4" />
      <circle cx="12" cy="3" r="1" />
      <path d="M9 12v2" />
      <path d="M15 12v2" />
      <path d="M9 16h6" />
      <path d="M2 12v3" />
      <path d="M22 12v3" />
    </svg>
  );
}

export function IconFacil(props) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 20V5" />
      <path d="M6 11l6-6 6 6" />
    </svg>
  );
}

export function IconMedio(props) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

export function IconDificil(props) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 2c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1 .3-1.8.8-2.5C7.5 9 7 10.5 7 13a5 5 0 0 0 10 0c0-4-3-6-5-11z" />
    </svg>
  );
}

export function IconImpossivel(props) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 2a8 8 0 0 0-8 8v6l2 2v3h3v-2h6v2h3v-3l2-2v-6a8 8 0 0 0-8-8z" />
      <circle cx="9" cy="11" r="1.4" />
      <circle cx="15" cy="11" r="1.4" />
      <path d="M11 16h2" />
    </svg>
  );
}

export function IconTheme(props) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.9 4.9l1.4 1.4" />
      <path d="M17.7 17.7l1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.9 19.1l1.4-1.4" />
      <path d="M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

// Sol: usado quando o tema claro (Neon Grid) está ativo.
export function SunIcon(props) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.9 4.9l1.4 1.4" />
      <path d="M17.7 17.7l1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.9 19.1l1.4-1.4" />
      <path d="M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

// Lua: usada quando o tema escuro (Synthwave) está ativo.
export function MoonIcon(props) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  );
}
