# SPEC — Agente que valida y compara el adelanto

- **Dueño:** Ivan
- **Rama:** `ivan/mac` (el código entra a `main` por PR)
- **Estado:** borrador, 7/11/2026 11:45

## Objetivo

Cuando un proveedor manda una factura en pesos, el agente decide si se le puede
adelantar, cuánto, y le explica en castellano por qué conviene (o no) frente a
descontar la factura de crédito o esperar al vencimiento. Es lo que el mentor
validó: chequear que haya plata para depositar, tomar el préstamo y pagar en
pesos, y tener el control del colateral.

## Cómo decide

Entrada: la factura (proveedor, monto en pesos, vencimiento) y el pago que la
empresa comprometió en el contrato (USDC).

| Chequeo | Regla | Si falla |
|---|---|---|
| V1 Saldo | USDC comprometido, pasado a pesos, cubre la factura | Rechaza: falta fondear |
| V2 Colateral | Adelanto / valor del colateral en pesos ≤ 70% (Morpho liquida a 77%) | Recorta el adelanto al 70% |
| V3 Liquidez | Hay ARGt disponible para prestar (mercado de Morpho en Arbitrum) | Recorta a lo disponible o recomienda la factura de crédito |
| V4 Identidad | Proveedor con KYB (KUMPLY; simulado si no hay clave) | Rechaza hasta verificar |
| V5 Plazo | Factura no vencida y a 120 días o menos | Rechaza |

Después compara el costo para el proveedor:

- **Adelanto onchain:** tasa de préstamo del mercado de Morpho por los días que
  faltan, más nuestra comisión.
- **Factura de crédito:** tasa de descuento de referencia (configurable; dato
  público: 18% anual para una de YPF a menos de 30 días).
- **Esperar:** costo cero, cobra al vencimiento.

Devuelve una decisión en JSON y un texto corto que la explica. No ejecuta
nada: la transacción la confirma una persona.

## Alcance

**Dentro:**

- Las cinco reglas y la comparación, con los umbrales en un archivo de
  configuración.
- Lectura en vivo de la liquidez y la tasa del mercado ARGt de Morpho
  (`api.morpho.org/graphql`) y del precio de ARGt (pool de Curve o API de
  belo; si falla, precio fijo de configuración y el texto lo dice).
- Tres casos de ejemplo: uno aprobado, uno recortado y uno rechazado.

**Fuera:**

- Firmar o mandar transacciones.
- El contrato que guarda el pago (otra pieza) y el front.
- KYB real si KUMPLY no da acceso a tiempo.
- Prometer rendimiento: el costo se presenta como descuento sobre la factura,
  nunca como interés de ARGt (ver el riesgo con la CNV en `idea.md`).

## Criterios de aceptación

Stack recomendado: TypeScript con Node, para compartirlo con el front.

- **CA-1** — El caso aprobado da `aprobado`, con un adelanto de 70% o menos del
  colateral y una explicación que nombra las tres opciones.
  `npm test -- aprobado`
- **CA-2** — Sin saldo suficiente, rechaza y dice cuánto falta fondear.
  `npm test -- saldo`
- **CA-3** — Con liquidez menor al pedido, recorta a lo disponible o recomienda
  la factura de crédito.
  `npm test -- liquidez`
- **CA-4** — Un pedido por encima del 70% del colateral se recorta al 70%.
  `npm test -- colateral`
- **CA-5** — La lectura en vivo de Morpho devuelve la liquidez y la tasa del
  mercado ARGt, o falla con un mensaje claro.
  `npm run leer-morpho`

## Notas

- Steven ya consultó Morpho: hay mercados para pedir ARGt con USDC o USDT0 de
  garantía hasta 77%, con menos de USD 250 disponibles. Para la demo, montos
  chicos, o pedirles liquidez a los mentores de Twin.
- El texto lo arma una plantilla; un modelo de lenguaje es opcional y su clave
  va en `.env`, nunca en el repo.
- Combina con la idea de Steven (`docs/steven/ideas.md`): las mismas reglas
  sirven para su préstamo en otra moneda.
