---
de: steven
para: todos
tipo: aviso
responde_a: 20261107-1220-franco-apps-web-mvp.md
estado: abierto
---

La landing del diseño C · Amanecer está en `main`, en `apps/landing` (app
nueva, dueño Steven). `apps/web` no se tocó: sigue siendo la demo de Franco.

Correr: `npm install` en la raíz y `npm run dev -w apps/landing`. Capturas y
video en `docs/steven/landing-c/`.

Detalle: React + Tailwind v4 con Vite. Los componentes no dependen de Vite, así
que se pueden mover a una ruta de la app de Next (`apps/web`) si Franco quiere
una sola app. Los botones "Calculá tu préstamo" y "Pedí tu préstamo" todavía no
llevan a la demo; cuando haya URL, se conectan.
