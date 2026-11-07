# Pitch de Saltar

Para Ivan, que presenta. 7/11/2026. Formato del evento: primero 30 segundos y
demo en vivo; los cuatro finalistas por track hacen 3 minutos más 2 de
preguntas. El jurado de Twin puntúa por igual idea, problema, negocio y pitch.

Frase que se repite en todo: **«Llegás a Argentina y operás en pesos desde el
primer día.»**

## Versión de 30 segundos

> Una empresa de Chile decide abrir en Argentina. Tiene la plata, pero en
> stablecoins, y para pagar alquiler, sueldos y proveedores necesita pesos. El
> banco no la conoce y vender lo que tiene la deja sin respaldo.
> Con Saltar deja sus CHLt de garantía y recibe ARGt, los pesos digitales de
> Twin, para operar desde el primer día. Y cuando un proveedor le factura,
> nuestro agente revisa la factura y al proveedor antes de pagar.
> No prestamos plata propia: el crédito sale de Morpho. Llegás a Argentina y
> operás en pesos desde el primer día.

## Versión de 3 minutos

**0:00 a 0:30 · El problema**

> Pensemos en una minera de Antofagasta que abre una base en San Juan. Tiene
> la plata, pero en Chile y en stablecoins. Para arrancar acá necesita pesos:
> el alquiler del galpón, los sueldos, el catering, el transporte.
> El banco argentino no la conoce, porque no tiene historial acá. Traer
> dólares por el mercado oficial es lento y con reglas que siguen vigentes
> para empresas. Y vender sus stablecoins es quedarse sin respaldo.

**0:30 a 0:50 · La solución**

> Saltar le resuelve eso. Deja sus CHLt, el peso chileno digital de Twin, de
> garantía, y recibe ARGt, el peso argentino digital, para operar desde el
> primer día. Pide hasta el 60% de su garantía y ve el costo antes de firmar.
> Y cuando un proveedor le factura, nuestro agente revisa la factura y al
> proveedor, y le paga en pesos.

**0:50 a 2:00 · La demo** (ver «Demo paso a paso»)

> Les muestro. [Entrar] Esta es la empresa. El agente ya revisó su perfil:
> consulta al BCRA y su historial en Arbitrum, y le dice cuánto puede pedir y
> por qué. [Perfil con atrasos] Si la empresa tuviera atrasos, el agente baja
> el tope y lo explica.
> Ahora llega una factura. [Subir el PDF] El agente la lee, chequea el CAE, que
> esté hecha a nuestra empresa, al proveedor en el BCRA y si alcanza la plata.
> Todo en verde. [Financiar] Deja la garantía en Morpho, pide los pesos y el
> proveedor cobra. Este es el hash en Arbiscan.

**2:00 a 2:35 · El negocio**

> No prestamos plata propia: el crédito sale de un mercado abierto de Morpho.
> Cobramos a la empresa que llega: 1% por abrir el crédito y 0,3% por cada pago
> a un proveedor con la factura validada.
> El mercado: 1.158 empresas chilenas le vendieron a Argentina en 2024, y Chile
> tiene unos US$ 6.500 millones invertidos acá. Y el RIGI ya aprobó casi
> US$ 50.000 millones en proyectos que traen empresas de afuera con cientos de
> proveedores locales.

**2:35 a 3:00 · Por qué ahora y cierre**

> Las stablecoins locales de Twin ya existen en siete monedas, y Morpho y
> Curve ya están en Arbitrum. Faltaba la capa que entiende a la empresa y a
> Argentina: el agente. Arrancamos con Chile a Argentina; con las siete
> monedas, cada país de la región es el siguiente corredor.
> Saltar: llegás a Argentina y operás en pesos desde el primer día.

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

**Plan B si falla la red o Vercel:** el video de un minuto del circuito
(spec 0135) y capturas de cada paso. Decirlo con calma: «les muestro la
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
- [ ] El video del circuito (spec 0135), si se aprueba.
- [ ] Ensayar la demo dos veces con el cronómetro.

Números y fuentes: `docs/investigacion/numeros.md` y `negocio.md`.
