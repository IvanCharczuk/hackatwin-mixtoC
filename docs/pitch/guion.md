# Pitch de Saltar

Para Ivan, que presenta. 7/11/2026. Formato: un video de 1 minuto y después
la demo en vivo (2,5 minutos en total), y preguntas. El jurado de Twin puntúa por igual idea, problema, negocio y pitch.

Frase que se repite en todo: **«Llegás a Argentina y operás en pesos desde el
primer día.»**

## Formato: video de 1 minuto y demo en vivo

Primero corre el video (cuenta problema, solución, circuito y negocio). Después
Ivan hace la demo en vivo, unos 90 segundos, y siguen las preguntas.

## Video de 1 minuto (guion para la spec 0135)

Texto en pantalla, con la marca de Saltar. Una idea por escena.

| Tiempo | Escena | Texto en pantalla |
|---|---|---|
| 0:00 a 0:10 | El problema | «Una minera de Chile abre en San Juan.» · «Necesita pesos para operar.» · «El banco no la conoce. Traer dólares choca con el cepo. Vender sus stablecoins la deja sin respaldo.» |
| 0:10 a 0:22 | La solución | «Saltar» · «Dejás CHLt de garantía → recibís ARGt, pesos digitales de Twin.» · «Operá en pesos desde el primer día.» |
| 0:22 a 0:40 | El circuito | CHLt → Curve → USDT0 de garantía en Morpho → préstamo en ARGt → el agente revisa la factura → el proveedor cobra → devolvés y recuperás tu garantía. |
| 0:40 a 0:52 | El negocio | «No prestamos plata propia: el crédito sale de Morpho.» · «1% por abrir el crédito · 0,3% por cada pago validado.» · «1.158 empresas chilenas ya le venden a Argentina.» |
| 0:52 a 1:00 | Cierre | «Saltar. Llegás a Argentina y operás en pesos desde el primer día.» · Twin · Morpho · Curve · Arbitrum |

## Demo en vivo (unos 90 segundos)

> [Tu agente] Esta es la empresa. El agente la consultó en el BCRA y en
> Arbitrum, y le dice cuánto puede pedir y por qué.
> [Perfil con atrasos] Si tuviera atrasos, baja el tope y lo explica.
> [Subir la factura] Llega la factura de un proveedor. El agente la lee,
> chequea el CAE, que sea para nuestra empresa, al proveedor en el BCRA y si
> alcanza la plata. Todo en verde.
> [Financiar] Deja la garantía en Morpho, pide los pesos y el proveedor cobra.
> [Arbiscan] Este es el hash: la transacción es real, en Arbitrum.
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
