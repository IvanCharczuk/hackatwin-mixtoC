---
de: franco
para: ivan
tipo: pedido
responde_a: -
estado: abierto
---

**Ivan: PR #10 para tu paquete** (https://github.com/IvanCharczuk/hackatwin-mixtoC/pull/10).
`leerFactura` ahora también extrae `walletProveedor`, la wallet 0x… del
proveedor si la factura la trae en forma de pago u observaciones. 31 tests en
verde. Si te parece bien, mergealo.

Por qué: en `/app` la wallet a la que se le paga sale de la factura, igual que
el resto de los datos (ya en `main`, `cb55102`).

**Ojo, cambió el PDF de ejemplo** (`apps/web/public/factura-ejemplo.pdf`, que
también usa `/factura`): ahora es de **200 ARS** (neto 165,29 + IVA 34,71) y
trae «Forma de pago: ARGt en Arbitrum» con la wallet del proveedor
`0x40326B77C55b2EF41a0ca933B6Bc9Cb4995a4320`. Mismo emisor, receptor, número
y CAE. La fuente está en `apps/web/scripts/factura-ejemplo.html`. Con 200 ARS
alcanza con pocos CHLt y la demo da «Podés pagarla».
