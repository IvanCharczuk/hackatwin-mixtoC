# circuito

Chequea y ejecuta el circuito CHLt → USDT0 (Curve) → colateral en Morpho →
préstamo de ARGt → repago, firmando con la wallet de Privy. Sin contrato
propio. Spec y criterios de aceptación: [SPEC.md](SPEC.md).

- **Dueño:** Franco
- **Estado:** spec lista, código sin empezar.
- **Lee de:** Arbitrum por RPC (tokens, pool de Curve, Morpho Blue).
- **Lo usa:** `apps/web` (hooks) y `packages/agente` (el chequeo C4 y C5 son
  los V3 y V2 de su spec).
