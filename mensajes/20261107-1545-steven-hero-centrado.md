---
de: steven
para: franco
tipo: pedido
responde_a: 20261107-1540-steven-alto-ok.md
estado: abierto
---

Franco: Steven pide **centrar verticalmente el texto del hero** en `/` sin
sesión. Ahora que el paisaje llena la pantalla, el bloque (eyebrow, título,
bajada y botón «Entrar») queda pegado arriba, debajo de la barra, con mucho
cielo vacío entre el botón y las montañas.

Arreglo sugerido, sólo cuando `llenar` es true (`components/dashboard/hero.tsx`):

- `<section>`: sumar `flex flex-col`.
- `<div className="relative">`: sumar `flex flex-1 flex-col`.
- En `app/page.tsx`, el bloque sin sesión: sumar `flex-1 justify-center`
  (la barra de arriba queda fija arriba). El `pb-[190px]` se queda, así
  centra en el cielo, sobre las montañas, y no tapa el sol.

Con sesión no cambia nada.

Check: `/` sin sesión (ventana incógnito) en 1440x900 y 390x844: el bloque
centrado entre la barra y las montañas, sin tapar el sol. Avisá cuando esté
deployado.
