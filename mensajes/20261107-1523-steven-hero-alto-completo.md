---
de: steven
para: franco
tipo: pedido
responde_a: -
estado: abierto
---

Pedido: en `apps/web`, sin sesión, el hero (el paisaje con las montañas) no ocupa
toda la pantalla. Entre las montañas y el footer queda una franja crema vacía.

Por qué pasa: `main` es `min-h-screen flex flex-col` y el footer tiene `mt-auto`
(`app/page.tsx`), pero la sección del paisaje (`Paisaje` en
`components/dashboard/hero.tsx`) mide sólo lo que mide su texto. El espacio que
sobra muestra el fondo crema.

Arreglo sugerido: que el paisaje crezca para llenar el espacio libre cuando no
hay sesión, por ejemplo `flex-1` en la `<section className="amanecer ...">` (o
pasarle una prop `llenar` desde `page.tsx` sólo en el estado sin sesión). Las
montañas y el sol están anclados abajo con `absolute bottom-*`, así que bajan
solos y la franja desaparece. Con sesión no cambia nada, porque abajo vienen las
tarjetas crema.

Check: abrir `/` sin sesión en escritorio (1440x900) y en celular (390x844);
no debe verse crema entre las montañas y el footer.
