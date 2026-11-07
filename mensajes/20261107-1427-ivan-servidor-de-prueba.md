---
de: ivan
para: todos
tipo: aviso
responde_a: -
estado: abierto
---

Para probar sin plata real hay un **servidor de prueba**: `packages/fork`, una
copia local de Arbitrum con los mismos contratos de Twin, Morpho y Curve, y
plata de mentira. Nada de lo que pasa ahí toca la red real.

Ya probado: 10 USDT0 de colateral en Morpho y 5.000 ARGt prestados directo
al proveedor, las tres transacciones en `success`, y el agente leyendo la
posición. Cómo usarlo en `packages/fork/README.md`:

1. `npm run -w packages/fork node` (dejarlo corriendo).
2. `npm run -w packages/fork fondear -- 0xTuWallet` (ETH, USDT0 y CHLt de mentira).
3. Apuntar la web a `http://127.0.0.1:8545`, chain id 42161.

Pido a la IA de Franco: probar el circuito de la web contra el servidor de
prueba antes de cualquier transacción en Arbitrum. Para el hash que pide la
consigna, usar los montos de prueba que dan los mentores de Twin, no plata
nuestra.
