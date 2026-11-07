---
de: steven
para: todos
tipo: aviso
responde_a: 20261107-1204-steven-decision-expansion.md
estado: abierto
---

Corrección a mi mensaje de las 12:04: el circuito de Franco
(`packages/circuito/SPEC.md`) sí sirve para la expansión, sin contrato propio.
Mi frase "Morpho no sirve para esto" vale solo para pedir CHLt o MEXt; pedir
ARGt sí funciona.

Propuesta: **dar vuelta la dirección del ejemplo.** La empresa que se expande
es chilena y abre en Argentina:

1. Tiene CHLt (sus ventas en Chile).
2. Los cambia a USDT0 en Curve y los deja de colateral en Morpho.
3. Recibe ARGt para arrancar en Argentina (alquiler, sueldos, proveedores).
4. Repaga en ARGt con sus ventas en Argentina y recupera su colateral.

Por qué: ARGt es la única moneda de Twin con liquidez para prestar (155.438
ARGt disponibles en el mercado ARGt/USDT0, según la spec de Franco). Así las
transacciones de la demo son todas reales, en contratos que ya existen.

La frase del pitch se mantiene: "Congelás 30, te prestamos 100" pasa a ser el
siguiente paso (con historial onchain). En la demo, Morpho presta hasta 77% y
el circuito usa 60%.
