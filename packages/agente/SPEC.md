# SPEC — Agente que valida y compara el adelanto

- **Dueño:** Ivan
- **Rama:** `ivan/mac` (el código entra a `main` por PR)
- **Estado:** borrador, 7/11/2026 11:45

## Objetivo

Trabaja para la empresa grande que llega a invertir en Argentina: es su
cuenta a pagar local. El proveedor manda la factura y nada más. El agente la lee, hace todos los
chequeos, arma el perfil de la empresa que la emite (y de la que paga) con
fuentes públicas, y decide si se le puede adelantar, cuánto, y por qué conviene
(o no) frente a descontar la factura de crédito o esperar al vencimiento. Es lo
que el mentor validó: chequear que haya plata para depositar, tomar el préstamo
y pagar en pesos, y tener el control del colateral.

## Flujo

1. **Lee la factura** (PDF o foto): CUIT del emisor y del receptor, monto,
   fecha, CAE y vencimiento. Si la factura trae el QR de ARCA, lo usa.
2. **Valida la factura:** CAE autorizado por ARCA (constatación de
   comprobantes; el web service pide certificado, así que para la demo se
   valida con los datos del QR y queda marcado como simulado si no hay acceso).
3. **Arma el perfil del proveedor:**
   - Central de Deudores del BCRA por CUIT: situación (1 a 5), deudas por
     entidad y cheques rechazados. API pública y gratuita, sin clave
     ([BCRA](https://www.bcra.gob.ar/apis-banco-central/)).
   - **Identidad onchain:** la billetera del proveedor tiene una atestación
     verificable (KYB de KUMPLY o una propia) que la une a su CUIT y a su
     descripción como empresa (razón social, actividad, provincia). El agente
     verifica que la billetera que cobra es la de la empresa que emitió la
     factura.
   - **Historial onchain:** cobros previos en ARGt por nuestro contrato, días
     de atraso y adelantos ya repagados.
4. **Mira a la empresa que paga:** su pago comprometido en el contrato y su
   propio perfil en el BCRA.
5. **Hace los chequeos financieros** (tabla de abajo) y compara opciones.
6. **Responde con el perfil, la decisión y la explicación.** No ejecuta nada.

## Cómo decide

Entrada: lo que salió de la factura y del perfil, y el pago que la empresa
comprometió en el contrato (USDC).

| Chequeo | Regla | Si falla |
|---|---|---|
| V1 Saldo | USDC comprometido, pasado a pesos, cubre la factura | Rechaza: falta fondear |
| V2 Colateral | Adelanto / valor del colateral en pesos ≤ el límite del nivel onchain del proveedor (tabla de abajo; Morpho liquida a 77%) | Recorta el adelanto a ese límite |
| V3 Liquidez | Hay ARGt disponible para prestar (mercado de Morpho en Arbitrum) | Recorta a lo disponible o recomienda la factura de crédito |
| V4 Identidad | Billetera del proveedor con atestación onchain que la une al CUIT de la factura (KUMPLY; simulada si no hay clave) | Rechaza hasta verificar |
| V5 Plazo | Factura no vencida y a 120 días o menos | Rechaza |
| V6 Factura | CAE válido y CUIT del receptor igual al de la empresa que comprometió el pago | Rechaza: factura no corresponde |
| V7 Perfil | Proveedor en situación 1 o 2 del BCRA y sin cheques rechazados recientes | Situación 3 o peor: rechaza; cheques rechazados: recorta y lo explica |

### El historial onchain baja la colateralización

Cuanto mejor es el historial onchain del proveedor, más se le adelanta contra
el mismo pago comprometido (o, en la idea de Steven, menos tiene que congelar).
Los umbrales son configurables; estos son los de la demo:

| Nivel | Condición | Adelanto máximo sobre el colateral |
|---|---|---|
| 0 | Sin historial onchain | 50% |
| 1 | 3 cobros o más, sin atrasos | 60% |
| 2 | 10 cobros o más y al menos un adelanto repagado a tiempo | 70% |

Un atraso de más de 7 días baja un nivel. El tope del nivel 2 queda debajo
del 77% en que liquida Morpho. El texto de la respuesta le dice al proveedor
en qué nivel está y qué le falta para subir.

Después compara el costo para el proveedor:

- **Adelanto onchain:** tasa de préstamo del mercado de Morpho por los días que
  faltan, más nuestra comisión.
- **Factura de crédito:** tasa de descuento de referencia (configurable; dato
  público: 18% anual para una de YPF a menos de 30 días).
- **Esperar:** costo cero, cobra al vencimiento.

Devuelve una decisión en JSON y un texto corto que la explica. No ejecuta
nada: la transacción la confirma una persona.

### Toda la plata queda atada a una factura

Por seguridad y por la ley impositiva, ningún movimiento existe sin su
factura:

- **Identificador de la factura:** `id = hash(CUIT emisor, tipo, punto de
  venta, número, CAE)`. En la cadena va sólo el hash; los datos fiscales
  quedan fuera de la cadena (el repo y la red son públicos).
- **Cada movimiento lleva el `id`:** depósito de la empresa, adelanto, pago
  parcial, repago y liberación. Así cada peso se rastrea hasta su comprobante.
- **Seguridad:**
  - Un solo adelanto por factura: un `id` ya adelantado se rechaza (evita
    financiar dos veces la misma factura).
  - El adelanto nunca supera el total de la factura.
  - Sólo cobra la billetera atestada para el CUIT emisor.
- **Ley impositiva:**
  - Si una MiPyME le factura a una empresa grande por encima de
    $ 5.549.862 (desde el 14/4/2026), la ley obliga a emitir **factura de
    crédito electrónica** (Ley 27.440). Esa factura está registrada en ARCA, se
    acepta (o queda aceptada a los 25 días) y puede cederse para negociarla.
    El agente marca si la factura es de crédito y chequea que no esté ya
    cedida o negociada en otro lado (en la demo, simulado).
  - Las empresas grandes suelen retener impuestos al pagar: el agente calcula
    el adelanto sobre el **neto a cobrar** (total menos retenciones
    configurables), no sobre el total.
  - Exporta, por proveedor, el registro de movimientos con su `id` y los datos
    del comprobante, para la contabilidad.

| Chequeo | Regla | Si falla |
|---|---|---|
| V8 Vínculo | El `id` de la factura no tiene un adelanto previo y, si es de crédito, no está cedida ni negociada | Rechaza: factura ya financiada |

### Dos documentos por factura: la factura a pagar y el comprobante de pagada

- **Entrada, la factura a pagar:** la que manda el proveedor; arranca todo.
- **Salida, el comprobante de pagada:** cuando la factura se cancela (por el
  contrato al vencimiento, o por pagos parciales que la completan), el agente
  genera un comprobante atado al mismo `id`: datos del comprobante original,
  total, retenciones, neto, adelanto, comisión, fecha de cancelación y el hash
  de cada transacción con su link al explorador. Le sirve al proveedor para
  emitir su recibo y a la empresa para su contabilidad; si la factura es de
  crédito electrónica, es lo que respalda informar la cancelación en ARCA.
- **Si se pagó por fuera** (transferencia bancaria), la empresa o el proveedor
  sube el comprobante de pago; el agente lo concilia con la factura (mismo
  CUIT, monto y número) y recién ahí libera el colateral de esa factura.

### Repago y liberación del colateral, factura por factura

Cada factura es una posición propia, con su deuda y su colateral. El agente
muestra el estado de cada una y lo que pasa en cada paso:

| Estado | Qué pasa | Deuda | Colateral de esa factura |
|---|---|---|---|
| Comprometida | La empresa deposita el pago de la orden de compra | 0 | Bloqueado entero |
| Adelantada | El proveedor recibe el adelanto en ARGt | Adelanto + comisión | Bloqueado entero |
| Pago parcial | La empresa paga una parte de la factura | Baja en ese monto | Se libera en proporción a lo repagado |
| Repagada | Se cubre la deuda completa | 0 | El sobrante va al proveedor; el resto, a la empresa si sobra |
| Vencida sin pago | Pasa el vencimiento y no se cubrió | Lo que falte | Se ejecuta lo necesario para cancelar; el resto se libera |

- El colateral de una factura nunca cubre la deuda de otra: si una se atrasa,
  las demás siguen liberándose normalmente.
- Cada repago a tiempo suma al historial onchain del proveedor y puede
  subirlo de nivel (menos colateralización en la próxima factura).
- Para el resumen, el agente suma por proveedor: deuda viva, colateral
  bloqueado, colateral liberado y próxima factura que vence.

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
  nunca como interés de ARGt (ver el riesgo con la CNV en `docs/ideas/adelantos-facturas.md`).

## Criterios de aceptación

Stack recomendado: TypeScript con Node, para compartirlo con el front.

- **CA-1** — El caso aprobado da `aprobado`, con un adelanto dentro del límite de su nivel sobre el
  colateral y una explicación que nombra las tres opciones.
  `npm test -- aprobado`
- **CA-2** — Sin saldo suficiente, rechaza y dice cuánto falta fondear.
  `npm test -- saldo`
- **CA-3** — Con liquidez menor al pedido, recorta a lo disponible o recomienda
  la factura de crédito.
  `npm test -- liquidez`
- **CA-4** — Un pedido por encima del límite del nivel se recorta a ese límite.
  `npm test -- colateral`
- **CA-5** — La lectura en vivo de Morpho devuelve la liquidez y la tasa del
  mercado ARGt, o falla con un mensaje claro.
  `npm run leer-morpho`
- **CA-7** — El mismo pedido da 50%, 60% y 70% de adelanto máximo para
  proveedores de nivel 0, 1 y 2, y la explicación nombra el nivel y qué le
  falta para subir.
  `npm test -- nivel`
- **CA-8** — Con dos facturas del mismo proveedor, un pago parcial de la
  primera libera colateral en proporción a lo repagado, el atraso de una no
  bloquea la liberación de la otra, y el resumen por proveedor cuadra (deuda
  viva + repagado = adelantado + comisión).
  `npm test -- repago`
- **CA-9** — Una segunda solicitud con la misma factura se rechaza, el adelanto
  se calcula sobre el neto después de retenciones, y el registro exportado
  tiene cada movimiento con el `id` de su factura.
  `npm test -- vinculo`
- **CA-10** — Al cancelarse una factura de ejemplo, el agente genera el
  comprobante de pagada con el mismo `id`, los montos y los hashes; y un pago
  por fuera que no coincide en CUIT, monto o número no libera el colateral.
  `npm test -- pagada`
- **CA-6** — Con una factura de ejemplo, el agente extrae CUIT, monto, CAE y
  vencimiento, consulta la Central de Deudores del BCRA por ese CUIT y
  devuelve el perfil junto con la decisión.
  `npm run validar -- ejemplos/factura-1.pdf`

## Notas

- Steven ya consultó Morpho: hay mercados para pedir ARGt con USDC o USDT0 de
  garantía hasta 77%, con menos de USD 250 disponibles. Para la demo, montos
  chicos, o pedirles liquidez a los mentores de Twin.
- El texto lo arma una plantilla; un modelo de lenguaje es opcional y su clave
  va en `.env`, nunca en el repo.
- Combina con la idea de Steven (`docs/steven/ideas.md`): las mismas reglas
  sirven para su préstamo en otra moneda.
