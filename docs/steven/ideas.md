# Ideas de Steven: expansión regional de PYMES con Twin

- **Autor:** Steven Molina
- **Mail:** stevmolina.me@gmail.com
- **Estado:** propuesta en discusión, 7/11/2026 a las 11:12 (Buenos Aires).
- **Origen:** charla de Steven con su IA (Claude). Este archivo resume el camino y
  la idea a la que llegamos.

## En una frase

Una PYME argentina que abre en otro país de LATAM congela parte de sus ARGt y
recibe un préstamo más grande en la moneda del país nuevo (por ejemplo CHLt o
MEXt). Lo devuelve con un porcentaje de lo que vende allá.

**Frase de pitch:** "Congelás 30, te prestamos 100. Tu garantía son tus ventas."

## Cómo llegamos acá

1. **Arrancamos con financiamiento para PYMES con activos tokenizados como
   colateral.** El problema: casi ninguna PYME tiene activos tokenizados, y hay
   que explicar de dónde salen.
2. **Opciones de activo que miramos:**
   - Facturas tokenizadas (factoring onchain). Todas las PYMES tienen facturas.
   - Propiedades de inmobiliarias. Descartado: la inmobiliaria suele intermediar,
     el token no es la escritura y una propiedad tarda meses en venderse.
   - Granos tokenizados (tipo Agrotoken) para productores agro. Muy
     marketinero, pero hoy no tendríamos tokens reales.
   - Dólares tokenizados (USDT/USDC) para pedir pesos sin venderlos.
3. **Qué hay en Twin.** Twin solo emite monedas locales (ARGt y las otras seis).
   En Morpho (Arbitrum) ya hay mercados para pedir ARGt dejando USDC o USDT0 de
   garantía, hasta el 77% del valor. Liquidez muy chica: menos de USD 250
   disponibles al consultarlo.
4. **Sin colateral: financiar con ventas futuras.** Es la idea 2 del brief: el
   comercio cobra en ARGt por nuestro contrato, el historial de cobros define
   cuánto prestar y un porcentaje de cada venta paga la deuda.
5. **Nicho 1 que propusimos: almacenes de barrio ("Fiado").** El préstamo se
   paga directo al distribuidor y se devuelve con el 10% de cada venta.
6. **Nicho elegido: expansión regional.** Una relocación pasa una sola vez y no
   hay ventas para repagar. Abrir en otro país sí: la empresa ya vende en
   Argentina y va a vender en el país nuevo. Usa dos monedas de Twin y junta
   las ideas 2 (crédito) y 3 (FX) del brief.

## Cómo funciona

| Pieza | Qué es |
|---|---|
| Historial | Ventas en ARGt cobradas por el contrato (últimos 90 días) y, si se puede, la Central de Deudores del BCRA por CUIT. Define el límite. |
| Colateral | La empresa congela una parte de sus ARGt en el contrato (por ejemplo 30). |
| Préstamo | Recibe 100 en la moneda del país nuevo (CHLt, MEXt, BRAt...). |
| Repago | De cada venta en el país nuevo, el contrato separa un porcentaje (por ejemplo 10%) hasta saldar la deuda. |
| Si algo sale mal | Si el peso cae o no repaga, el contrato se queda con lo congelado y baja su historial. |

**La pregunta que van a hacer los jueces:** "¿Por qué no cambia sus ARGt
directo a la otra moneda?" Respuesta: porque congela 30 y recibe 100. El resto
lo cubren su historial y sus ventas nuevas.

## Lo que hay que saber antes de construir

| Tema | Estado |
|---|---|
| Mercado en Morpho con ARGt de garantía y préstamo en otra moneda | **No existe.** Los mercados de MEXt, BRAt, CHLt y PERt solo aceptan dólares y tenían 0 disponible. Hay que hacer un contrato propio. |
| Fondos para prestar | Un fondo propio en el contrato. Pedir a los mentores MEXt o CHLt, ARGt y gas en Arbitrum. |
| Precio ARGt contra la otra moneda | Pools de Curve (cada token contra USDT0) o API de belo. La API de belo nos dio 403 desde una máquina; probar desde la app. |
| Si el peso cae | Regla de liquidación: si lo congelado pierde valor y no repone, el contrato se lo queda. |
| Interés | Cobrarlo como comisión del préstamo, no como rendimiento de ARGt (ver el riesgo con la CNV en `docs/ivan/idea.md`). |

**Preguntas para los mentores:**

1. ¿Nos dan MEXt o CHLt, además de ARGt y gas, en Arbitrum?
2. ¿El pool de Curve de esa moneda tiene liquidez para tomar el precio?

## Cómo pitchearlo (3 minutos)

Ejemplo inventado: una cafetería de Mendoza que vende $10M por mes y quiere
abrir en Santiago de Chile.

```
[Historial AR] -> [Congela 30 ARGt] -> [Recibe 100 en CHLt] -> [Vende en Chile] -> [10% paga la deuda]
```

| Tiempo | Qué se dice o se muestra |
|---|---|
| 0:00 a 0:30 | Problema: ningún banco chileno le presta porque no tiene historial allá, y el argentino no financia afuera. |
| 0:30 a 0:50 | La frase: "Congelás 30, te prestamos 100." |
| 0:50 a 2:10 | Demo en vivo, tres pantallas (abajo). |
| 2:10 a 2:40 | Negocio: interés y comisión de apertura. Siete monedas de Twin dan 42 pares de países. |
| 2:40 a 3:00 | Cierre: "Expandirse en LATAM ya no depende de un banco." |

**Las tres pantallas, cada una con su transacción real y el link al
explorador:**

1. **Tu límite:** ventas en ARGt y "Te prestamos hasta 100".
2. **Pedir:** botón "Congelar 30 ARGt". Llegan los CHLt.
3. **Vender:** un cliente paga en CHLt. Animación de 90% a la empresa y 10% a la
   deuda; la barra de deuda baja.

Tener un video grabado de la demo por si falla la red. Montos chicos y
redondos.

## Relación con la idea de Ivan

La propuesta de Ivan (`docs/ivan/idea.md`) también usa colateral en stablecoin
y Chile. Diferencia: Ivan pone el riesgo en la empresa grande que paga
(factoring inverso para proveedores de proyectos RIGI). Esta idea pone el
foco en la PYME que se expande y repaga con sus ventas. Se pueden combinar.

## Fuentes

- Requisitos del track, ideas 2 y 3, vaults de Morpho y pools de Curve:
  [consigna](../sources/2026-11-07-twin-stablecoins.pdf), páginas 1, 2 y 5.
- Mercados de Morpho en Arbitrum (garantías aceptadas, 77%, liquidez): API de
  Morpho (`api.morpho.org/graphql`), consultada el 7/11/2026.
- Twin como emisor de monedas locales; belo como integrador:
  [twin.finance](https://www.twin.finance/) y
  [artículo de Twin sobre LATAM](https://www.twin.finance/article/issuer-orchestrator-or-rails-stablecoins-latam).
- DAMM arma mercados de crédito en Morpho y DIA da precios a cotización real;
  monedas distintas de ARGt con menos de USD 100.000 en circulación:
  [DIA](https://www.diadata.org/blog/post/twin-finance-damm-capital-latin-american-currencies-onchain/).
- Sin verificar: API pública de la Central de Deudores del BCRA; que los bancos
  no presten a PYMES sin historial local.
