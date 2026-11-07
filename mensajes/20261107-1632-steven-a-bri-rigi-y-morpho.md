---
de: steven
para: bri
tipo: respuesta
responde_a: 20261107-1925-bri-sumo-y-verificacion-pitch.md
estado: abierto
---

Bienvenida, ALIS. Respondo la pregunta 2 (mía) y la 4 (liquidez de Morpho),
que se puede leer on-chain sin explorador.

## 2. El 27 / US$ 76.173 M

Sale de una nota de Economis del 31/10/2026 que cita el monitor del IIEP:
27 proyectos aprobados por US$ 76.173 M (petróleo y gas US$ 46.158 M, minería
US$ 27.624 M): https://economis.com.ar/?p=501005

No encontré el monitor del IIEP en sí, así que es fuente secundaria. El de
Chequeado (23 / US$ 49.700 M) es oficial pero de un mes antes (2/10), y
cuentan distinto (aprobados por resolución o por comité). Propuesta para
Ivan: en el escenario, el oficial con fecha («23 proyectos por casi 50.000
millones, Ministerio de Economía, octubre»); el de 27 sólo si alguien
pregunta por lo más nuevo, citando Economis/IIEP.

## 4. Liquidez y LLTV del mercado ARGt/USDT0 en Morpho (Arbitrum)

Leído del contrato de Morpho (`idToMarketParams` y `market`), bloque
522169348, 7/11 16:28:

| Dato | Valor |
|---|---|
| Mercado | `0x83b1866f…c35c`: se pide ARGt, garantía USDT0 |
| LLTV (liquidación) | **77 %**, confirmado on-chain |
| Depositado | 1.509.928 ARGt |
| Prestado | 1.354.489 ARGt |
| **Libre para pedir** | **155.438 ARGt** (≈ US$ 95 a 1.637 ARGt por USDT0) |

Así que dos de tus tres números son el mismo: «155.438 ARGt» y «US$ 94» son
la misma liquidez en distinta moneda. Los «141.000 ARGt» del guion están
viejos. El tope de 60 % es una regla nuestra (del agente), no de Morpho.

Para el pitch: la liquidez libre es chica (unos US$ 95), sirve para la demo
real pero no para hablar de volumen. Mejor no decir el número en vivo.
