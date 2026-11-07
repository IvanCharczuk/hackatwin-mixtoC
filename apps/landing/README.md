# landing

Landing de [Nombre]: crédito para PYMES que abren en otro país de LATAM. Es el
diseño **C · Amanecer** de `design/expandir-hackatwin.pen` (desktop y mobile).

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
| `src/App.tsx` | Las 8 secciones: hero, problema, pasos, calculadora, ejemplo, monedas, cierre, footer |
| `src/data.ts` | Monedas, países, tipos de cambio ilustrativos y la cuenta del préstamo |
| `src/index.css` | Tokens de color y tipografía (Tailwind v4 `@theme`) |
| `public/` | Sol de Mayo, Andes, foto del ejemplo y logos de las 7 monedas |

La cuenta: límite = 3 meses de ventas; se congela el 30% del préstamo; se
repaga con el 10% de cada venta en el país nuevo.

Es una app aparte de `apps/web` (la demo con wallet de Franco) para no pisarla.
Está hecha con React + Tailwind sin nada de Vite en los componentes, así que se
puede mover a una ruta de la app de Next cuando el equipo lo decida.
