# Idea: pagos y adelantos con stablecoins para proveedores de proyectos RIGI

Propuesta de Ivan, en discusión. Estado al 7/11/2026 a las 10:52.

## En una frase

Una empresa extranjera que entra a Argentina por el RIGI (por ejemplo una
minera chilena) paga desde afuera, en stablecoins, a sus proveedores pymes
argentinos; y esos proveedores pueden cobrar por adelantado usando como
colateral el pago que la empresa ya comprometió.

## Usuario y problema

- **Quien paga:** empresas grandes de afuera que se expanden a Argentina con el
  RIGI. Caso ancla: Vicuña (BHP y Lundin, binacional Chile-Argentina), aprobada
  en el RIGI por US$ 9.700 millones, con obras desde 2027. Contratistas chilenos
  como Excon, ICV, Vecchiola y Mas Errázuriz evalúan entrar a San Juan.
- **Quien cobra:** las pymes argentinas que le venden (catering, construcción,
  transporte). El RIGI exige un plan de proveedores locales con al menos 20% de
  la inversión en bienes y obras (el proyecto de Súper RIGI lo eliminaría: a
  verificar).
- **El dolor:** la empresa necesita pagar desde afuera y demostrar compras
  locales; la pyme espera 60 a 90 días para cobrar y se financia caro.

## Mecanismo

1. **La empresa compromete el pago:** deposita USDC o USDT en un contrato,
   atado a la orden de compra. Ese depósito es el colateral.
2. **El proveedor pide un adelanto** contra ese pago comprometido y lo recibe
   en ARGt (Twin), que puede pasar a pesos (belo). El riesgo es el de la
   empresa grande, no el de la pyme.
3. **Un agente compara** las opciones del proveedor (descontar la factura de
   crédito electrónica, adelanto onchain, esperar) y explica cuál conviene.
4. **Al vencimiento, el contrato paga solo:** cancela el adelanto y gira el
   resto al proveedor.

Es factoring inverso (riesgo del comprador), onchain y transfronterizo.

## Adopción

- Se entra por la empresa grande: una trae a todos sus proveedores.
- A la empresa le damos: pago desde afuera sin banco intermedio, y proveedores
  que cobran antes y pueden cotizarle mejor. El registro de compras locales para
  el RIGI es un extra: el 20% no tiene sanción clara y el Súper RIGI lo
  eliminaría, así que la adopción no puede depender de esa regla.
- Al proveedor: cobra antes y más barato. Alta una vez, con KYB.

## Moat

- La red: cada empresa ancla trae sus proveedores, y cada proveedor hace más
  útil la plataforma para la próxima empresa.
- Datos propios: historial de pagos y cumplimiento de cada proveedor.
- Integración con el sistema de compras de la empresa y con el reporte del
  RIGI: una vez adentro, cambiar cuesta.

## Demo de hoy, por track

| Track | Qué mostramos |
|---|---|
| Twin | Adelanto en ARGt con transacción real (Arbitrum: Morpho o Curve con USDT0) |
| Avalanche | Contrato de escrow verificado en Fuji, con KYB de KUMPLY |
| belo | El agente que compara, decide y explica |

## Riesgos y preguntas abiertas

- El proveedor factura en pesos ante ARCA: cómo se registra un cobro en ARGt.
- Si custodiamos el colateral, hay que registrarse como PSAV (CNV). Un
  contrato sin custodia nuestra es más defendible.
- Si prestamos nosotros por más de $10 millones, registro de proveedor no
  financiero de crédito (BCRA).
- Twin: sus stablecoins no generan intereses; no prometer rendimiento. En
  marzo de 2026 la CNV frenó ARGt por un producto vinculado con 32% anual y
  levantó la sanción con la condición de que sea sólo medio de pago. El
  adelanto se cobra como descuento sobre la factura, no como interés de ARGt.
- ¿Se puede tomar crédito en ARGt hoy, o sólo depositar en el vault de Morpho?
  Define si el paso 2 es real o simulado. Preguntar a los mentores.

Investigación y fuentes: [investigacion.md](investigacion.md).
