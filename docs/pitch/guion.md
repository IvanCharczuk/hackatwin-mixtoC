# Pitch de Saltar

Para Ivan, que presenta. 7/11/2026. Formato: 2,5 minutos; el primer minuto es el pitch con un video de fondo y
después la demo en vivo, y preguntas.

Frase que se repite en todo: **«Llegás a Argentina y operás en pesos desde el
primer día.»**

## Formato

Total 2,5 minutos:

1. **Primer minuto, el pitch:** propuesta, problema, solución, mercado y
   diferencia. Ivan lo cuenta mientras corre detrás un video de 1 minuto (sin
   voz, pocas palabras en pantalla).
2. **Después, la demo en vivo** (unos 90 segundos): cómo funciona, paso a
   paso.

Siguen las preguntas.

## El minuto del pitch: lo que se ve y lo que decís (video de la spec 0135)

| Tiempo | En pantalla (video) | Lo que decís |
|---|---|---|
| 0:00 a 0:08 | **Propuesta.** Logo de Saltar: «Pesos desde el primer día». | «Saltar le da pesos desde el primer día a las empresas que llegan a operar a Argentina.» |
| 0:08 a 0:20 | **Problema.** Chile → San Juan; tres cruces: banco, cepo, vender. | «Una minera de Chile abre en San Juan y necesita pesos para arrancar. El banco no la conoce, traer dólares choca con el cepo y vender sus stablecoins la deja sin respaldo.» |
| 0:20 a 0:32 | **Solución.** CHLt de garantía → ARGt; un check sobre una factura. | «Con Saltar deja sus CHLt de garantía y recibe ARGt, los pesos digitales de Twin. Y nuestro agente revisa cada factura antes de pagarle al proveedor.» |
| 0:32 a 0:44 | **Mercado.** 1.158 empresas · US$ 6.500 M · RIGI US$ 50.000 M · 7 monedas. | «Hay 1.158 empresas chilenas que ya le venden a Argentina, y el RIGI aprobó casi 50.000 millones de dólares en proyectos que traen empresas de afuera. Con las siete monedas de Twin, cada país es un corredor.» |
| 0:44 a 0:56 | **Diferencia.** Banco ✗ · Bitso o BVNK ✗ · Saltar ✓. 1% · 0,3%. | «El banco pide historial; los pagos con stablecoins no prestan en pesos ni validan facturas. Nosotros no prestamos plata propia: conectamos el crédito de Morpho con un agente que entiende Argentina. Cobramos 1% por abrir el crédito y 0,3% por cada pago.» |
| 0:56 a 1:00 | Cierre: «Saltar». | «Les muestro cómo funciona.» |

## Demo en vivo: cómo funciona (unos 90 segundos)

> [Tu agente] Esta es la empresa. El agente la consultó en el BCRA y en
> Arbitrum, y le dice cuánto puede pedir y por qué.
> [Perfil con atrasos] Si tuviera atrasos, baja el tope y lo explica.
> [Subir la factura] Llega la factura de un proveedor. El agente la lee,
> chequea el CAE, que sea para nuestra empresa, al proveedor en el BCRA y si
> alcanza la plata. Todo en verde.
> [Financiar] Los CHLt se cambian en Curve, quedan de garantía en Morpho, se
> piden los ARGt y el proveedor cobra.
> [Arbiscan] Este es el hash: la transacción es real, en Arbitrum. Cuando la
> empresa vende acá, devuelve y recupera su garantía.
> Saltar: llegás a Argentina y operás en pesos desde el primer día.

## Si piden la versión hablada de 30 segundos

> Una empresa de Chile abre en Argentina y necesita pesos para operar. El
> banco no la conoce y vender sus stablecoins la deja sin respaldo. Con Saltar
> deja sus CHLt de garantía y recibe ARGt, los pesos digitales de Twin. Cuando
> un proveedor le factura, nuestro agente revisa la factura y al proveedor
> antes de pagar. No prestamos plata propia: el crédito sale de Morpho.

## Demo paso a paso

Antes de subir al escenario: pestañas abiertas (landing, web con la sesión
iniciada, `/factura`, Arbiscan del hash), la factura de ejemplo descargada y
el celu con el plan B.

1. **Landing** (5 segundos): el título «Expandí tu empresa a Argentina».
2. **Web, «Tu agente»**: CUIT `30-99999902-3`. Mostrar los cuatro datos y el
   texto del agente.
3. **Tildar «perfil de ejemplo con atrasos»**: el tope baja y el agente lo
   explica. Destildar.
4. **`/factura`**: subir `factura-ejemplo.pdf` con 10 USDT0 de colateral.
   Cuatro checks en verde y el texto del agente.
5. **Financiar**: el circuito de Franco (garantía, préstamo y pago al
   proveedor) y el hash en Arbiscan.

Montos chicos: CHLt casi no tiene liquidez (unos US$ 3.000 en Curve) y el
mercado de ARGt presta hasta unos 141.000 ARGt.

**Plan B si falla la red o Vercel:** capturas de cada paso de la demo y los
hashes del servidor de prueba. Decirlo con calma: «les muestro la
grabación de hace un rato».

## Preguntas del jurado

**¿De dónde sale la plata que se presta?**
De un mercado abierto de Morpho. Hoy tiene poco disponible, por eso la demo
usa montos chicos; el vault de ARGt que lo alimenta tiene unos US$ 9,7
millones. El primer paso comercial es acordar un cupo con Twin y el curador
del vault.

**¿Por qué la empresa no vende sus stablecoins y listo?**
Porque se queda sin respaldo y paga el cambio. Con Saltar mantiene sus CHLt,
recibe pesos para operar y recupera la garantía cuando devuelve.

**¿Qué pasa si baja el valor de la garantía?**
Se pide hasta el 60% y Morpho liquida recién al 77%: hay 17 puntos de margen.
Si se acerca, la empresa repone garantía o devuelve una parte.

**¿Cómo evalúan a una empresa que recién llega y no figura en el BCRA?**
Con su garantía y su historial onchain, que trae de afuera. El BCRA sirve
para los proveedores y para empresas con historia acá. El próximo paso es
sumar su historial de crédito en Chile y la verificación de empresa (KYB).

**¿Qué hace exactamente la IA?**
Lee la factura, valida el CAE y que esté hecha a la empresa, consulta al
proveedor y a la empresa en el BCRA, calcula si alcanza y de dónde sale la
plata, y lo explica en castellano. No firma nada: decide una persona.

**¿Y la regulación?**
No prestamos (no somos prestamistas ante el BCRA) y no custodiamos (la
billetera es del usuario). ARGt es un medio de pago, sin intereses, como
pidió la CNV. La empresa igual se inscribe en la IGJ. La parte cambiaria la
validamos con un abogado antes de vender.

**¿Quién es la competencia?**
El banco pide historial local. Traer plata de la casa matriz choca con el
cepo. Bitso Business, BVNK o Bridge mueven plata pero no prestan en pesos ni
validan facturas argentinas. Lemon, Ripio y belo usan DeFi para ahorro de
personas, no crédito para empresas.

**¿Qué los protege de que los copien?**
La red: cada empresa trae a sus proveedores, y cada pago suma datos de
facturas y cumplimiento. Y el agente, que conoce las reglas argentinas.

**¿Cuánto le cuesta a la empresa?**
La tasa del mercado de Morpho, que se ve antes de firmar (hoy en el orden de
25% anual en pesos), más el 1% de apertura.

**¿Por qué CHLt?**
Porque la empresa chilena cobra en pesos chilenos. En Morpho la garantía es
USDT0: el CHLt se cambia en Curve. También puede dejar USDC o USDT0 directo.

## Antes de las 17:30

- [ ] `ANTHROPIC_API_KEY` en Vercel y redeploy (Franco).
- [ ] Una transacción real con hash en Arbiscan, con los fondos de prueba de
      los mentores de Twin.
- [ ] El video de 1 minuto (spec 0135): es la primera mitad del pitch.
- [ ] Ensayar la demo dos veces con el cronómetro.

Números y fuentes: `docs/investigacion/numeros.md` y `negocio.md`.
