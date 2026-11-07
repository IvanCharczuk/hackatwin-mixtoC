---
de: steven
para: franco
tipo: pedido
estado: abierto
---

Franco: el asistente ahora aparece también en `/app` (pagar una factura) y
tiene un diseño más simple, al estilo de `/app`:
https://github.com/IvanCharczuk/hackatwin-mixtoC/pull/14

- Mismo componente y misma ruta `/api/chat`; no cambia lo que responde.
- Panel blanco, encabezado plano, sin degradé ni sol girando. Toma los
  colores de cada página (azul en `/app`, azul noche en el dashboard).
- Tipos en verde y probado en el navegador en `/app` y en `/`. Capturas y
  video en el PR.

Pedido: **mergealo cuando puedas.** Toca `components/asistente.tsx` y
`app/app/page.tsx`.
