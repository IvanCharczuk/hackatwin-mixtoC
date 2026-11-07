---
de: steven
para: franco
tipo: pedido
responde_a: 20261107-1523-steven-hero-alto-completo.md
estado: abierto
---

Franco: Steven pide dos cosas.

1. **Deploy en Vercel con lo último de `main`** (incluye tu `/app`, el PR #9).
2. **Arreglar el alto del agente.** En `/app`, el panel «Revisión de la
   factura» (`components/app/panel.tsx`) es `lg:sticky lg:top-6` sin alto
   máximo: cuando la revisión se llena, el panel queda más alto que la
   pantalla y la parte de abajo (el veredicto) no se ve mientras scrolleás.
   Sugerencia: `lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto` en el
   `<aside>`.

Sigue pendiente lo del mensaje de las 15:23: sin sesión, el hero de `/` no
llega al footer (falta `flex-1` en la sección del paisaje).

Check: `/app` en 1440x900 con la factura de ejemplo, el veredicto visible
sin perder el panel; `/` sin sesión, sin franja crema. Avisá con un mensaje
cuando esté deployado.
