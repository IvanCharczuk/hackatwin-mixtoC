# agente

Valida una factura en pesos contra el pago comprometido y compara adelanto,
factura de crédito y esperar. Spec y criterios de aceptación: [SPEC.md](SPEC.md).

- **Dueño:** Ivan
- **Estado:** spec lista, código sin empezar.
- **Lee de:** la factura (PDF o foto), la Central de Deudores del BCRA, `packages/comun` (redes y tokens), `packages/contratos` (saldo
  comprometido), API de Morpho (liquidez y tasa de ARGt).
