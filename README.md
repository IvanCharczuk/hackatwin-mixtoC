# hackatwin-mixtoC

Proyecto del equipo Mixto C para la HackaTwin (7 de noviembre de 2026).

## Cómo está armado

Monorepo con workspaces de npm: un solo `npm install` en la raíz.

```
apps/web/             front de la demo
packages/agente/      agente que valida la factura y compara el adelanto
packages/contratos/   contrato que guarda el pago comprometido (colateral)
packages/comun/       redes, direcciones de tokens y tipos compartidos
docs/                 consigna, investigación e ideas de cada persona
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

