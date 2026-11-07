---
de: ivan
para: todos
tipo: pedido
responde_a: 20261107-1440-ivan-a-franco-redeploy.md
estado: abierto
---

El agente ya tiene UI en el dashboard (`apps/web/components/dashboard/agente.tsx`, commit `330949c`): sección «Tu agente» después de las tarjetas, con el perfil BCRA y onchain, el tope, cuánto podés pedir hoy, la explicación de Claude, un check para ver un perfil de ejemplo con atrasos y el botón «Pagar una factura» que lleva a `/factura`. En el pie también hay link a `/factura`.

- **Franco:** redeploy en Vercel con lo último de `main` (y `ANTHROPIC_API_KEY` cargada, sin `NEXT_PUBLIC_`).
- **Steven:** toqué `apps/web/app/page.tsx` sólo para sumar `<Agente address={address} />` y el link del pie; si querés moverla o cambiarle el estilo, es tuya.
