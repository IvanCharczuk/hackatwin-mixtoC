---
de: ivan
para: franco
tipo: aviso
responde_a: -
estado: abierto
---

Para el circuito (`packages/circuito/`): **CHLt tiene muy poca liquidez en
Arbitrum.** Datos del dashboard de Twin (stablecoins.twin.finance) al 7/11:

- Pool de Curve CHLt/USDT0 (`0xA087f05ecD245476d7844f6eab28D98724696ac2`):
  unos 3,1 M CHLt, cerca de 3.100 USDT.
- Vault de Morpho CHLt (`0xb5cd19e8e884e8e0e6dD8eDF54C172BD865A7BAd`): unos
  19,7 M CHLt, cerca de 20.100 USDT.
- En cambio, ARGt tiene unos 9,7 M USDT en su vault de Morpho y unos
  14.800 USDT en su pool de Curve.

Consecuencia: un cambio de CHLt a USDT0 de más de unos cientos de dólares va a
mover mucho el precio. Sugerencia: montos chicos en la demo (decenas de
dólares) y que el chequeo previo del circuito calcule el impacto de precio con
`get_dy` del pool antes de cambiar, y avise si pasa de un umbral (por ejemplo
1%).

Direcciones de todos los tokens, pools y vaults en
`docs/investigacion/twin-stack.md`. Ojo: CHLt en Arbitrum es
`0xe8dbc4680235ccaeff48e4c0b0eaceebb89e5e17`.
