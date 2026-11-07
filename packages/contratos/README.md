# contratos

Contrato que guarda el pago comprometido de la empresa (USDC) por orden de
compra y lo libera al vencimiento. Es el colateral del adelanto.

- **Dueño:** a definir (avisar en `mensajes/` y anotarse en `AGENTS.md`).
- **Estado:** sin empezar.
- **Redes:** Avalanche Fuji (track Avalanche, verificado, con KYB de KUMPLY) y
  Arbitrum (ARGt, Morpho y Curve). Confirmar con los mentores si ARGt está en
  Avalanche.
- **Tiene que exponer:** el saldo comprometido por orden de compra, que el
  agente lee para su chequeo de saldo.
- **Entrega:** direcciones de contrato y hash de una transacción real, para el
  README de la raíz.
