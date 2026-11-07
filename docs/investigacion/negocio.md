# Competencia, regulación y modelo de negocio

Versión rápida para el pitch, 7/11/2026 12:45. La profundiza después el
proyecto de Ivan. Lo marcado **a verificar** no está confirmado en la fuente
oficial; lo marcado **supuesto** es nuestro.

## La idea sobre la que se analiza

La del equipo (decisión de las 12:04, `mensajes/`): una empresa de afuera (el
ejemplo es chilena) que abre en Argentina deja sus stablecoins como colateral
en Morpho y recibe ARGt para operar acá (alquiler, sueldos, proveedores); lo
devuelve con sus ventas en Argentina. Circuito en `packages/circuito/SPEC.md`.
El agente de `packages/agente/` se suma como el paso de pagar a proveedores:
cada pago atado a una factura validada.

## Cliente

- **Quién paga:** la empresa que llega. Primero, empresas chilenas medianas y
  grandes que ya le venden a Argentina y quieren operar acá.
- **Cuántas hay:** 1.158 empresas chilenas exportaron a Argentina en 2024.
  Chile tiene un stock de inversión directa en Argentina de unos US$ 6.500 M;
  en 2024 invirtió US$ 434 M (+33%).
  [Forbes](https://www.forbesargentina.com/negocios/chile-va-mas-mercado-argentina-plan-sumar-exportaciones-radiografia-ventas-us-452-millones-n75578).
- **Las grandes:** los proyectos del RIGI (US$ 49.766 M aprobados al 9/9/2026,
  ver `numeros.md`) traen empresas y contratistas de afuera con cientos de
  proveedores locales.

## Su problema al llegar

1. **Pesos para arrancar sin historial local:** un banco argentino no le presta
   a una empresa recién llegada, y traer dólares por el mercado oficial es
   lento y con reglas del BCRA que siguen vigentes para empresas (el titular
   del BCRA dijo en mayo de 2026 que levantarlas no es prioridad).
   [Bloomberg Línea](https://www.bloomberglinea.com/latinoamerica/argentina/bcra-anticipo-que-no-tiene-como-prioridad-levantar-el-cepo-cambiario-a-empresas-en-argentina/).
2. **No conoce a los proveedores** y no sabe si sus facturas son reales.
3. **Reglas impositivas propias:** factura de crédito electrónica obligatoria
   cuando le factura una pyme por más de $ 5.549.862, retenciones y
   comprobantes que cierren con ARCA (`regulacion-y-competencia.md`).

## Competencia

| Alternativa | Qué resuelve | Qué no |
|---|---|---|
| Banco argentino | Crédito y cuenta local | Pide historial y entidad local con tiempo; lento |
| Aporte de capital o préstamo de la casa matriz por el mercado oficial | Pesos al tipo oficial | Trámite y reglas del BCRA; sacar la plata después tiene restricciones |
| Pagos B2B con stablecoins (Bitso Business, BVNK, Bridge de Stripe) | Mover plata entre países | No dan crédito en pesos ni validan facturas argentinas; Bitso en Chile tiene sólo conexión institucional |
| Morpho o Aave directo | El crédito onchain | Sin interfaz para una empresa, sin cumplimiento local ni facturas |
| Fintechs que ya usan DeFi (Lemon, Ripio, belo con Aave) | Ahorro y rendimiento para personas | No crédito para empresas; no hay casos documentados de capital de trabajo |
| Revisión de proveedores (Nosis, Veraz) | Informe de crédito | No paga ni ata el pago a la factura |
| Crédito pyme local (SGR, factura de crédito en el MAV) | Financiamiento barato | Para empresas con historial argentino |

**Nuestro lugar:** el modelo «fintech adelante, DeFi atrás» que ya usan Lemon,
Ripio y belo con Aave para ahorro, pero para crédito y pagos de empresas que
llegan. Aave y Morpho tienen unos US$ 7.900 M y US$ 7.500 M en stablecoins
depositadas (octubre 2026).
[Crowdfund Insider](https://www.crowdfundinsider.com/2026/05/278534-defi-protocol-aave-teams-up-with-latam-fintechs-to-enable-greater-financial-inclusion/),
[Crypto Briefing](https://cryptobriefing.com/morpho-blue-nears-aave-v3-stablecoin-supply/).

## Regulación

| Tema | Qué dice | Qué hacemos |
|---|---|---|
| Operar en Argentina | Una sociedad extranjera que actúa habitualmente se inscribe en la IGJ (art. 118; RG IGJ 4/2026 simplificó requisitos) | No lo evitamos: la empresa igual se inscribe; nosotros le damos pesos y pagos desde el día uno. [RG 4/2026](https://www.argentina.gob.ar/normativa/nacional/norma-426091/texto) |
| Prestar (BCRA) | Quien otorga créditos por más de $ 10 M se inscribe como proveedor no financiero de crédito | **No prestamos:** presta el mercado de Morpho. Si algún día prestamos con fondos propios, hay que inscribirse |
| Custodia (CNV, PSAV) | Custodiar activos virtuales de terceros es actividad PSAV | Billeteras embebidas de Privy: la clave es del usuario. Confirmar que eso nos deja fuera del registro (**a verificar**) |
| Cambiaria (BCRA) | Las reglas para empresas siguen; un préstamo onchain en ARGt no encaja en las categorías clásicas | Zona gris: **a verificar** con un abogado antes de vender, no para la demo |
| ARGt (CNV) | Medio de pago, sin intereses (condición de la CNV desde marzo 2026) | El interés lo cobra el mercado de Morpho al que toma prestado; nunca decimos que ARGt rinde |
| Impuestos (ARCA) | Factura de crédito electrónica, retenciones, comprobantes | El agente valida cada factura y deja el comprobante de pagada |

## Modelo de negocio

**Quién paga:** la empresa que llega. El proveedor no paga nada.

| Ingreso | Precio (supuesto) | Por qué lo paga |
|---|---|---|
| Apertura del crédito en ARGt | 1% del monto | Pesos desde el día uno sin banco local |
| Pago a proveedor con factura validada | 0,3% del pago | Factura revisada, proveedor revisado, impuestos en regla y comprobante |
| Plan para empresas grandes | Mensual, a definir | Reportes de compras locales (útil para el RIGI) y control de muchos proveedores |

El interés del crédito es de Morpho y de quien deposita ahí, no nuestro.

**Liquidez para prestar (riesgo principal):** el mercado de Morpho donde se pide
ARGt tiene unos 155.438 ARGt disponibles (spec del circuito; cerca de US$ 100
al cambio del dashboard de Twin: 16.000 M ARGt = 9,7 M USDT). El vault Prime
de ARGt tiene unos US$ 9,7 M. Respuesta para el jurado: hoy la liquidez es
chica y la demo usa montos chicos; el primer paso comercial es un cupo
acordado con Twin y el curador del vault, y después depositantes propios. Si
prestamos con fondos propios, inscripción en el BCRA.

**Ejemplo (supuesto):** una empresa chilena abre en Mendoza, toma el
equivalente a US$ 100.000 en ARGt (deja unos US$ 167.000 de colateral, al 60%)
y paga US$ 300.000 en el año a proveedores.

| Concepto | Ingreso al año |
|---|---|
| Apertura (1% de US$ 100.000) | US$ 1.000 |
| Pagos a proveedores (0,3% de US$ 300.000) | US$ 900 |
| **Total por empresa mediana** | **US$ 1.900** |

Con 100 empresas medianas: unos US$ 190.000 al año. Una sola empresa grande
de un proyecto RIGI que pase por nosotros US$ 100 M de compras locales: unos
US$ 300.000 al año. **Primer cliente:** una empresa chilena que ya le vende a
Argentina y abre oficina o depósito acá; la buscamos entre los exportadores
chilenos y los contratistas que miran San Juan.

## Para decir en el pitch

- «No prestamos nosotros: conectamos a la empresa con el crédito onchain que
  ya existe y le resolvemos lo argentino.»
- «Cobramos a la empresa que llega, por abrir el crédito y por cada pago a
  proveedores con su factura validada.»
- Riesgos que reconocemos: la zona gris cambiaria y si la billetera embebida
  nos deja fuera del registro de PSAV. Se validan con un abogado antes de
  vender.
