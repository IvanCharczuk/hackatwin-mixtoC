# Modelo de negocio: research y respuestas a las preguntas del equipo

Bri (ALIS), 7/11/2026, noche. Búsqueda web y lectura de fuentes primarias
cuando fue posible. Lo marcado **verificado** se leyó en la fuente; **a
verificar** significa que hay una sola fuente secundaria o falta leer el texto
vigente. Nada de esto es asesoramiento legal.

## Resumen

1. **El plan mensual (agente de facturas) es viable, pero el costo por
   consulta de buró no estaba en el modelo.** Nosis cobra unos $ 21.200 por
   informe (con IVA), unos US$ 13 al tipo de referencia de Notion. Eso es mucho
   más que los ~US$ 5 por KYB que usamos. Hay que decidir si consultamos buró
   para cada proveedor o sólo para la empresa.
2. **El 20% de proveedores locales del RIGI hoy no tiene sanción.** Pero el
   Súper RIGI, en tratamiento en el Senado, pondría una multa de hasta 3% del
   déficit de contratación. Si pasa, la empresa grande necesita **prueba** de
   compras locales. Ese es un producto B2B con más ticket que la pyme.
3. **El swap CHLt → USDT0 es el punto de riesgo regulatorio, no el crédito.**
   Un servicio que coordina intercambio de activos virtuales entra en las
   categorías del PSAV. Una comisión sólo por revisar facturas, sin custodia ni
   intercambio, es más defendible. Hay que decidir si el swap lo hace el
   usuario en Curve o nosotros.
4. **Xepelin no es canal en Argentina.** Su programa de socios existe en Chile
   y México. Un referido ahí no sirve hoy.
5. **Si Saltar fuera curador de un vault en Morpho, el ingreso sería un
   porcentaje del interés.** Gauntlet cobra 5% a sus vaults Prime y 10% a otros.
   Es una fuente de ingreso sin costo para la empresa, pero hoy no tenemos
   vault ni cupo, y el encuadre legal es zona gris.

## 1. Plan mensual con agente de facturas

- **Costo de la IA por factura:** la tarifa de Claude Haiku 5.5 es US$ 0,10
  por millón de tokens de entrada y US$ 0,50 por millón de salida (según la
  página de Notion; no leí la tarifa oficial de Anthropic). Una factura de 2.000
  tokens de entrada cuesta una fracción de centavo; el PDF escaneado puede
  costar bastante más. **A verificar** con una factura real.
- **Costo de buró:** Nosis publica $ 21.195 con IVA por informe (precio de su
  web al 12/10/2026, según ModoScoring, fuente secundaria). Hay packs que bajan
  el precio por informe. La web de Nosis muestra $ 21.598 en el resultado de
  búsqueda (snippet, no leí la página). El precio de la API no está publicado en
  lo que leí.
- **Implicancia:** un plan mensual de US$ 50 cubre la IA y la infraestructura,
  pero no un informe de buró por proveedor. Propuesta: el buró se cobra aparte
  o se incluye sólo en el plan grande.

## 2. RIGI y compras locales

- **Hoy:** el artículo de la Ley 27.742 fija un mínimo de 20% en bienes y obras
  sin sanción por incumplir. El Observatorio del RIGI lo confirma: no hay
  sanciones por incumplimiento, y la obligación desaparece cuando la empresa
  acredita que no había oferta local. [Observatorio del RIGI](https://observatoriorigi.org/del-rigi-al-super-rigi-profundizacion-de-las-excepciones-a-favor-de-las-grandes-corporaciones/). **Verificado.**
- **Súper RIGI:** el Senado hizo cambios; el inciso o) del artículo 17 suma una
  sanción de hasta 3% del déficit de contratación verificado, y el titular debe
  probar que no había oferta local. [Shale24](https://www.shale24.com/mineria/super-rigi-senado-hizo-cambios-ahora-exige-respaldo-electrico-proyectos-electrointensivos-fija-piso-20-proveedores-nacionales-n1659). **A verificar:** si ya es ley. No lo confirmé.
- **Oportunidad:** un reporte de compras locales con facturas validadas y
  proveedores verificados le sirve a la minera para probar el 20%. Es la
  pregunta de Steven: qué precio cobrar. No tengo un dato de mercado para
  ese precio; propongo una prueba con 2 o 3 mineras antes de fijarlo.

## 3. Operación PSAV

- **Lo que dice la RG 1058/2025 (texto original, Boletín Oficial 14/3/2025):**
  las categorías incluyen intercambio entre activos virtuales, transferencia,
  custodia y servicios financieros de emisión. Quedan fuera los protocolos
  descentralizados sin proveedor identificable y los proveedores de billeteras
  de autocustodia. [CNV RG 1058](https://www.argentina.gob.ar/normativa/nacional/norma-410635/texto). **Verificado.**
- **Lo que cambió:** la RG 1172/2026 reemplazó el capítulo de PSAV. La categoría
  4 excluye los servicios en los que el usuario mantiene el control exclusivo de
  sus activos. [JFC Attorneys](https://jfcattorneys.com/es/news/cnv-rg-1172-2026-psav-cambios). **A verificar:** leer el texto de la RG 1172 antes de
  usar esta conclusión.
- **Lectura para nosotros:** el paso CHLt → USDT0 en Curve, si lo ejecuta
  Saltar, es un intercambio de activos virtuales. Si lo hace el usuario con su
  wallet, nosotros sólo coordinamos. Lo segundo es más defendible. El crédito
  en ARGt es un préstamo en un protocolo, pero la parte cambiaria sigue en zona
  gris (ya lo marca la sección de regulación de Notion).
- **Decisión sugerida:** no cobrar por el swap. Sí cobrar por la revisión de
  facturas y los pagos. Antes de vender, abogado sobre la RG 1172.

## 4. Referidos y canales

- **Xepelin:** tiene un programa de socios comerciales para asesores financieros
  y un portal gratuito para asesores, en Chile y México. Para Argentina no
  encontré nada. [LinkedIn Xepelin](https://es.linkedin.com/posts/xepelinofficial_programa-de-socios-comerciales-xepelin-activity-7199206446989795329-4tuB). **Verificado para Chile y México; Argentina no encontrado.**
- **Otros canales a evaluar:** estudios de comercio exterior, contadores de
  empresas chilenas que se expanden, ProChile y cámaras mineras. No hay datos de
  tasa de conversión de ninguno. Lo que sí podemos hacer es fijar un referido
  de 10% de la comisión de apertura para el primer año: US$ 100 por una empresa
  mediana. **Supuesto nuestro.**

## 5. Ingreso por liquidez (curador de vault)

- **Gauntlet, vaults de Morpho:** el 16/9/2026 los vaults USDC Prime, Core y
  Frontier de Ethereum cobraban 5% de performance fee; otros vaults de Gauntlet,
  10%. [Eco](https://eco.com/support/en/articles/14745602-gauntlet-vaults-risk-managed-yield). **Verificado para Ethereum; no leí el vault ARGt en Arbitrum.**
- **Lectura:** el curador se queda con un porcentaje del interés que pagan los
  deudores. El interés de Saltar sale de ahí, no de la empresa. Pero hoy no hay
  vault ARGt con Saltar como curador, y el cupo de liquidez no está acordado.
  Es una opción para después del cupo con Twin.

## Números que cambian con esta investigación

| Supuesto anterior | Lo que encontré | Efecto |
|---|---|---|
| KYB ~US$ 5 por cliente | Nosis ~US$ 13 por informe (con IVA) | Subir costo de KYB si consultamos buró por proveedor |
| 20% de compras locales sin sanción | Súper RIGI propone multa 3% (a verificar) | Oportunidad de producto B2B más fuerte |
| Swap en Curve dentro de Saltar | Puede caer en PSAV | Que el usuario haga el swap, o abogado |
| Xepelin como referido | Sólo Chile y México | Quitarlo como canal en Argentina |

## Fuentes

- [CNV RG 1058/2025, texto](https://www.argentina.gob.ar/normativa/nacional/norma-410635/texto)
- [JFC Attorneys, RG CNV 1172/2026](https://jfcattorneys.com/es/news/cnv-rg-1172-2026-psav-cambios)
- [Observatorio del RIGI, Súper RIGI](https://observatoriorigi.org/del-rigi-al-super-rigi-profundizacion-de-las-excepciones-a-favor-de-las-grandes-corporaciones/)
- [Shale24, cambios del Senado al Súper RIGI](https://www.shale24.com/mineria/super-rigi-senado-hizo-cambios-ahora-exige-respaldo-electrico-proyectos-electrointensivos-fija-piso-20-proveedores-nacionales-n1659)
- [Nosis](https://www.nosis.com/) y [ModoScoring, precio de referencia](https://modoscoring.com.ar/alternativa-nosis)
- [Gauntlet vaults, fees](https://eco.com/support/en/articles/14745602-gauntlet-vaults-risk-managed-yield)
- [Xepelin, programa de socios](https://es.linkedin.com/posts/xepelinofficial_programa-de-socios-comerciales-xepelin-activity-7199206446989795329-4tuB)

## Qué no verificamos

- Si el Súper RIGI es ley y cuál es el texto final.
- El texto de la RG 1172/2026 completo.
- El precio de la API de Nosis (no publicado) y la tasa de conversión de referidos.
- El vault de ARGt y su performance fee en Arbitrum.
