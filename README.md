# hackatwin-mixtoC

Proyecto del equipo Mixto C para la HackaTwin (7 de noviembre de 2026).

## Modelo de negocio

**Cobramos a la empresa de afuera que llega a operar en Argentina. No prestamos
nosotros: la conectamos con el crédito onchain que ya existe (Morpho) y le
resolvemos lo argentino.**

| Ingreso | Precio* | Qué recibe la empresa |
|---|---|---|
| Apertura del crédito en ARGt | 1% del monto | Pesos desde el día uno, sin banco ni historial local |
| Pago a proveedor con factura validada | 0,3% del pago | Factura y proveedor revisados, impuestos en regla y comprobante de pagada |
| Plan para empresas grandes | mensual, a definir | Reporte de compras locales y control de muchos proveedores |

El interés del crédito es del mercado de Morpho, no nuestro. El proveedor no
paga nada.

**¿De dónde sale la plata para prestar?** Hoy el mercado de Morpho donde se
pide ARGt tiene poco disponible (unos 155.000 ARGt, alrededor de US$ 100), así
que la demo usa montos chicos. El vault «Prime» de ARGt, que alimenta esos
mercados, tiene unos US$ 9,7 M en ARGt (dashboard de Twin, 7/11/2026). El
primer paso comercial es acordar con Twin y el curador del vault un cupo para
este mercado a medida que lleguen empresas; más adelante, sumar depositantes
propios (por ejemplo, la tesorería de la misma empresa o socios). Si algún día
prestamos con fondos propios, nos inscribimos como proveedores no financieros
de crédito en el BCRA.

| Escenario* | Ingreso al año |
|---|---|
| Una empresa mediana: US$ 100.000 en ARGt y US$ 300.000 pagados a proveedores | US$ 1.900 |
| 100 empresas medianas | US$ 190.000 |
| Una empresa grande de un proyecto RIGI con US$ 100 M de compras locales | US$ 300.000 |

**Mercado:** 1.158 empresas chilenas le exportaron a Argentina en 2024 y Chile
tiene unos US$ 6.500 M invertidos acá; el RIGI suma US$ 49.766 M aprobados
(9/9/2026).

**Contra quién competimos:** el banco argentino pide historial local; traer la
plata de la casa matriz choca con el cepo para empresas; Bitso Business, BVNK
o Bridge mueven plata pero no prestan en pesos ni validan facturas
argentinas; Morpho o Aave directo no tienen interfaz ni cumplimiento local.
Nosotros: fintech adelante, DeFi atrás, para empresas que llegan.

**Regulación:** al no prestar, no nos inscribimos como prestamistas (BCRA);
las billeteras son del usuario (Privy), sin custodia nuestra; ARGt nunca se
presenta como algo que rinde. A validar con un abogado antes de vender: la
parte cambiaria y si la billetera embebida nos deja fuera del registro de PSAV
de la CNV.

\* Precios y escenarios son supuestos nuestros. Fuentes y detalle:
[docs/investigacion/negocio.md](docs/investigacion/negocio.md) y
[docs/investigacion/numeros.md](docs/investigacion/numeros.md).

## Cómo está armado

Monorepo con workspaces de npm: un solo `npm install` en la raíz.

```
apps/web/             front de la demo
packages/agente/      agente que valida la factura y compara el adelanto
packages/circuito/    circuito CHLt → colateral en Morpho → ARGt → repago
packages/contratos/   contrato que guarda el pago comprometido (colateral)
packages/comun/       redes, direcciones de tokens y tipos compartidos
docs/estado.md        estado del equipo, una sección por persona
docs/ideas/           ideas en discusión, una por archivo
docs/investigacion/   regulación, competencia y números
mensajes/             canal entre las IAs del equipo
```

Las reglas para trabajar (personas e IAs) están en [AGENTS.md](AGENTS.md).

## Material previo al evento

La carpeta `plantilla/` es una plantilla de trabajo armada antes del evento (método, specs, guías y un ejemplo de WebMCP). No es parte del producto. Todo lo que está fuera de `plantilla/` se construye durante el evento.

## Track Twin Stablecoins

Participamos en el track de Twin Stablecoins.

- [Consigna original del track](docs/sources/2026-11-07-twin-stablecoins.pdf).
- [Investigación, requisitos de entrega y recursos técnicos](docs/research.md).
- [Registro de integridad del PDF](docs/sources/manifest.json).

La entrega cierra el 7 de noviembre de 2026 a las 18:00, hora de Buenos Aires.
El producto debe usar al menos una Twin Stablecoin elegible y demostrar una
transacción onchain real con hash verificable. Los detalles están en la consigna.

## Contacto
Bri: araceliaponte2007@gmail.com
Ivan: ivancharczuk@gmail.com
Steven Molina: stevmolina.me@gmail.com

