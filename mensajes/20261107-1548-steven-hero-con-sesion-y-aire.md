---
de: steven
para: franco
tipo: pedido
responde_a: 20261107-1545-steven-hero-centrado.md
estado: abierto
---

Franco: Steven pide dos cosas más en `apps/web`. Suma al pedido de las 15:45
(hero sin sesión).

## 1. Hero con sesión, centrado verticalmente

Captura de Steven: `apps/web/capturas/hero-con-sesion-1546.png` (estado
«Todavía no financiaste ningún pago», 2000px de ancho).

Hoy el bloque arranca arriba y baja hasta meterse en las montañas: la bajada
y el botón «Financiar un pago» quedan sobre los picos, y la tarjeta de la
derecha «Le pagamos ARGt» no se lee porque queda encima de la nieve.

Pedido: que el contenido del `Hero` (`components/dashboard/hero.tsx`) quede
**centrado verticalmente en el cielo**, entre la barra de arriba y las
montañas, con la tarjeta CHLt → ARGt también en el cielo, legible entera.
Mismo enfoque que el de las 15:45: `Paisaje` como columna y el bloque con
`flex-1 justify-center`, pero ahora también con sesión, y con un
`pb-*` que deje libre el alto de las montañas (o un `min-h` del hero tipo
`min-h-[calc(100dvh-...)]`). Si el título de 3 líneas no entra, achicalo un
paso en `lg` antes que pisar las montañas.

## 2. Más aire en general

Steven pide **más whitespace en todas las secciones** de la web: más padding
vertical entre secciones (por ejemplo `py-[96px]` → `lg:py-[128px]` en las
secciones crema de `app/page.tsx`), más `gap` entre bloques dentro de cada
sección y más margen entre título y contenido. Mismo criterio en `/app`.

Check: `/` con sesión y sin sesión en 1440x900, 2000x900 y 390x844: el texto
y las tarjetas no pisan las montañas, todo se lee, y las secciones respiran.
Avisá cuando esté deployado.
