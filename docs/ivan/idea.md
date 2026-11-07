# Idea: la cuenta a pagar en Argentina para empresas grandes que llegan a invertir

Propuesta de Ivan, validada por un mentor a las 11:33. Estado al 7/11/2026 a las 12:10.

## En una frase

Una empresa grande de afuera que entra a invertir en Argentina (por ejemplo una
minera chilena por el RIGI) paga a sus proveedores locales desde afuera, en
stablecoins, sin abrir un banco acá: cada factura que recibe pasa por un agente
que la valida, revisa al proveedor y deja todo en regla con la ley impositiva.
Como el pago queda comprometido en un contrato, el proveedor puede cobrar antes,
y eso le permite a la empresa negociar mejores precios y plazos.

## Cliente y problema

- **El cliente es la empresa grande que llega a invertir.** Caso ancla: Vicuña
  (BHP y Lundin, binacional Chile-Argentina), aprobada en el RIGI por
  US$ 9.700 millones, con obras desde 2027. Contratistas chilenos como Excon,
  ICV, Vecchiola y Mas Errázuriz evalúan entrar a San Juan. Ella paga el
  servicio.
- **Su dolor al llegar:**
  - Tiene que pagarle a cientos de proveedores locales sin cuenta bancaria ni
    historial acá, y moviendo plata desde afuera.
  - No conoce a esos proveedores: necesita saber si la factura es real y si el
    proveedor es confiable (deudas, cheques rechazados, identidad).
  - Las reglas impositivas son propias: factura de crédito electrónica
    obligatoria por encima de $ 5.549.862 cuando le factura una pyme,
    retenciones, y comprobantes que tienen que cerrar con ARCA.
  - Quiere poder mostrar cuánto compra localmente (el 20% del RIGI es un
    extra: no tiene sanción clara y el Súper RIGI lo eliminaría).
- **Los proveedores pymes son la otra punta:** cobran a 60 o 90 días y se
  financian caro. Que cobren antes es lo que hace atractiva a la empresa como
  cliente y lo que le da poder de negociación.

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

- Se vende a la empresa grande, en el momento en que decide invertir: una
  trae a todos sus proveedores.
- A la empresa le damos: pagar desde afuera sin banco local, cada factura
  validada y cada proveedor revisado, el cumplimiento impositivo resuelto y
  mejores condiciones con proveedores que cobran antes.
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
