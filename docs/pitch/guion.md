# Pitch de Saltar

Para Ivan, que presenta. 7/11/2026. Formato: 2,5 minutos; el primer minuto es el pitch con un video de fondo y
después la demo en vivo, y preguntas.

Idea central (de Ivan): hoy muchas empresas tienen problemas para arrancar a
operar en Argentina; nosotros agilizamos los rieles para que den su primer
arranque con financiación desde el día uno.

Frase que se repite en todo: **«Operá en Argentina con financiación desde el
día uno.»**

## Elevator pitch para mentores (30 segundos)

El problema, sin detalle técnico.

> Hoy hay 13 proyectos mineros aprobados en Argentina por 25 billions de
> dólares, y otros 20 de minería y petróleo esperando. Las empresas que
> llegan tienen que pagarles desde el primer día a cientos de proveedores
> locales.
> Pero el banco no las conoce y conseguir pesos desde afuera lleva tiempo y
> trámites. Saltar les da pesos desde el día uno, con
> su propia plata como garantía, y revisa cada factura antes de pagar.

Qué preguntarles después:

1. ¿Podemos acordar un cupo de liquidez de ARGt en el mercado de Morpho? ¿Quién
   es el curador del vault?
2. ¿Nos dan fondos de prueba para la transacción real? ¿Vale una red de
   prueba?
3. ¿Qué le falta al pitch para el jurado?

## Formato

Total 2,5 minutos:

1. **Primer minuto, el pitch:** el caso, el muro, los beneficios, por qué los
   demás no alcanzan y el tamaño. Ivan lo cuenta mientras corre detrás un video de 1 minuto (sin
   voz, pocas palabras en pantalla).
2. **Después, la demo en vivo** (unos 90 segundos): cómo funciona, paso a
   paso.

Siguen las preguntas.

## El minuto del pitch: lo que se ve y lo que decís (video de la spec 0135)

Regla (propuesta de Steven, aceptada por Ivan): primero el caso y los
beneficios, después el cómo. Morpho, Curve y ARGt van en la demo y en las
preguntas. Fuente del caso: Vicuña (BHP y Lundin, US$ 9.700 M en el RIGI,
obras desde 2027) y los proveedores chilenos que miran San Juan
([EconoJournal, 22/5/2026](https://econojournal.com.ar/?p=127981)).

**Show, don't tell:** el video muestra (imágenes, movimiento y palabras
sueltas, nada de frases largas) y Ivan cuenta. El video no tiene voz.

| Tiempo | En pantalla (video) | Lo que decís |
|---|---|---|
| 0:00 a 0:14 | **El caso.** Amanece sobre la cordillera de San Juan. Un camión con el nombre «Excon» cruza de Chile hacia «San Juan · Vicuña · US$ 9,7B». Texto: «Pagar en pesos». | «Excon, una contratista chilena, ya está analizando entrar a San Juan, donde Vicuña invierte casi 10 billions. Para arrancar tiene que pagar sueldos y proveedores en pesos desde el primer día.» |
| 0:14 a 0:22 | **El muro.** Caen dos cruces: «Banco» ✗ «Trámites» ✗. | «Pero el banco no la conoce y conseguir pesos desde afuera lleva tiempo y trámites.» |
| 0:22 a 0:32 | **Los beneficios.** El logo de Saltar despeja el riel; aparecen tres checks: «Día uno» ✓ «Con su garantía» ✓ «Factura revisada» ✓. | «Saltar agiliza los rieles para que tenga pesos desde el día uno, con su propia garantía y cada factura revisada antes de pagar.» |
| 0:32 a 0:44 | **Por qué los demás no alcanzan.** Cuatro columnas: «Banco» ✗, «Bitso · BVNK» ✗, «Lemon · Ripio» ✗, «Saltar» ✓. | «El banco pide historia, Bitso o BVNK mueven plata pero no prestan pesos, y Lemon o Ripio son para ahorro personal. Saltar resuelve las tres cosas.» |
| 0:44 a 0:56 | **Tamaño.** Contadores: «13 proyectos mineros · US$ 25B», «+20 esperando», «7.500 pymes proveedoras». Debajo: «1%» y «0,3%». | «Y no es un caso aislado. Hay 13 proyectos mineros aprobados, 20 esperando y 7.500 pymes proveedoras en Vaca Muerta. Cobramos 1% por abrir y 0,3% por pago.» |
| 0:56 a 1:00 | **Cierre.** El logo de Saltar sobre el sol: «Financiación desde el día uno». | «Les muestro cómo funciona.» |

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
> Saltar: operá en Argentina con financiación desde el día uno.

## Si piden la versión hablada de 30 segundos

> Una empresa de Chile abre en Argentina y necesita pesos para operar. El
> banco no la conoce y conseguir pesos desde afuera lleva tiempo. Con Saltar
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
El banco pide historial local. Traer plata de la casa matriz lleva tiempo y
trámites. Bitso Business, BVNK o Bridge mueven plata pero no prestan en pesos ni
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

Números y fuentes: `docs/investigacion/numeros.md`, `negocio.md` y el
mensaje de Franco `mensajes/20261107-1534-franco-dato-mineria-petroleo.md`
(13 proyectos mineros en el RIGI por US$ 25.230 M a octubre de 2026; 13 de
hidrocarburos y 7 mineros en evaluación; más de 7.500 pymes proveedoras en
Vaca Muerta).
