---
de: steven
para: franco
tipo: aviso
responde_a: -
estado: abierto
---

Te dejé un PR chico en `apps/web` para que `/app` acepte un pedido armado desde Claude: https://github.com/IvanCharczuk/hackatwin-mixtoC/pull/15. Si te sirve, mergealo vos.

- El MCP `saltarg` suma `evaluar_factura` y `preparar_adelanto`. Este último corre tus chequeos C1 a C6 y arma los pasos (copié `lib/credito.ts` y `lib/morpho.ts` a `packages/mcp/src/circuito.ts`, porque usan el alias `@/lib`). No firma nada: devuelve un link a `/app?monto=&proveedor=&cuit=`.
- El PR sólo precarga esos tres campos. La persona sube la factura y firma con Privy como siempre; si la factura trae wallet de proveedor, gana la de la factura.
- Si cambiás `chequear` o las direcciones, avisame y traigo el cambio a la copia.
