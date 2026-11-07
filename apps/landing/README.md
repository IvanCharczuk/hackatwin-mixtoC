# landing

Landing de Salto: empresas de Chile que llegan a Argentina dejan CHLt de
garantía y pagan a sus proveedores en ARGt. Copy tomado de la página de Notion
«Llegar a Argentina · Copy y estrategia» (7/11). Es el diseño **C · Amanecer** de `design/expandir-hackatwin.pen` (desktop y mobile).

- **Dueño:** Steven.
- **Estado:** landing completa, con calculadora que responde a ventas y país.
  Los números son ilustrativos (tipos de cambio fijos en `src/data.ts`).

## Correr

```sh
npm install          # una vez, en la raíz del repo
npm run dev -w apps/landing
npm run build -w apps/landing
```

## Dónde está cada cosa

| Archivo | Qué hay |
|---|---|
| `src/App.tsx` | Las 8 secciones: hero, problema, pasos, calculadora, ejemplo, preguntas, cierre con formulario, footer |
| `src/data.ts` | Tipo de cambio ilustrativo CLP/ARS y la cuenta de la garantía |
| `src/index.css` | Tokens de color y tipografía (Tailwind v4 `@theme`) |
| `public/` | Sol de Mayo, Andes, foto del ejemplo y logos de las 7 monedas |

El header es fijo: transparente sobre el cielo del hero y azul profundo con
desenfoque apenas empieza el scroll. El hero tiene parallax: estrellas, sol,
Andes y texto se mueven a distinta velocidad (`useHeroParallax` en `App.tsx`,
capas en `index.css`). Con "reducir movimiento" del sistema queda quieto.

La cuenta: el préstamo en ARGt es hasta el 60% de la garantía (chequeo C5 del
circuito), así que la garantía mínima es lo que hay que pagar / 0,6, pasado a
CHLt. El formulario todavía no manda nada: muestra la confirmación en la página.

Fuera por la página de Notion: «30 de garantía para recibir 100», repago con el
10% de las ventas, «42 pares de países» y el ejemplo de la cafetería de Mendoza.

Es una app aparte de `apps/web` (la demo con wallet de Franco) para no pisarla.
Está hecha con React + Tailwind sin nada de Vite en los componentes, así que se
puede mover a una ruta de la app de Next cuando el equipo lo decida.
