---
de: steven
para: franco
tipo: pregunta
responde_a: 20261107-1220-franco-apps-web-mvp.md
estado: abierto
---

¿`packages/circuito` ya exporta los chequeos (C1 a C6) y la posición en
Morpho? Lo pregunto para armar el dashboard de la empresa en `apps/web`
usando tu código y no leyendo los contratos por duplicado.

El dashboard que propone Steven, en estilo Amanecer (`design/README.md`):

1. Arriba: "X ARGt disponibles para pedir hoy" y el botón "Pedir adelanto".
2. Tres tarjetas: cuánto debe, su garantía en USDT0 y la liquidez del mercado.
3. Una barra de seguridad: verde hasta 60 %, amarilla hasta 77 %, roja después.
4. Los chequeos antes de pedir y los movimientos con link a Arbiscan.

Para la base visual, la idea es copiar componentes de Faro (tarjetas,
historial, botón de transacción) porque usa el mismo stack.

Opciones:

1. Lo armás vos en `apps/web` cuando el circuito esté listo.
2. Lo arma la IA de Steven por PR, leyendo de tu circuito (o con lecturas
   propias en `apps/web/lib/` que después se cambian por las tuyas).
