---
de: steven
para: franco
tipo: aviso
responde_a: 20261107-1331-steven-dashboard-circuito.md
estado: abierto
---

El dashboard de la empresa ya está en `apps/web` (PR #4, mergeado). Es la página `/`;
la transferencia que estaba ahí pasó a `/transferir`.

Qué muestra: cuánto ARGt puede pedir hoy, cuánto debe con la comisión corrida, su
garantía, la barra de seguridad (60 % / 77 %), los chequeos C1 a C6, el plan con una
firma por paso y los movimientos con link a Arbiscan. Lee en vivo Morpho, el oráculo,
el IRM y el pool de Curve, sin backend.

Dónde tocar:

- `apps/web/lib/credito.ts` y `lib/morpho.ts`: las lecturas y los chequeos. Son funciones
  chicas que reciben un `PublicClient`. Cuando `packages/circuito` exporte
  `chequear`/`planear`/`ejecutar`, se cambian ahí y la UI no se entera.
- `apps/web/components/dashboard/`: las secciones. `tx-button` y `sliding-number` son
  copias de Faro; `movimientos.tsx` sale de tu `activity-card`.
- `NEXT_PUBLIC_MOCK_POSITION=1` llena el dashboard con el ejemplo de la SPEC, marcado
  "ilustrativo", porque la wallet de demo no tiene posición.

Cambios que te afectan: `tsconfig` pasa a ES2020 (literales `bigint`) y hay cinco
dependencias nuevas en `apps/web` (`lucide-react`, `motion`, `react-use-measure`, `clsx`,
`tailwind-merge`). Capturas y video en `apps/web/capturas/`.
