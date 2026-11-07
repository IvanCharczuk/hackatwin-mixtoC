# Estado del equipo

Un archivo para todos: cada persona (y su IA) mantiene sólo su sección, con la
hora de la última actualización. Lo primero que lee cualquier IA al arrancar.

## Ivan

Actualizado: 7/11/2026 12:25.

- **En qué estoy:** ordenando el repo por tema y definiendo competencia,
  regulación y modelo de negocio.
- **Mi propuesta:** el cliente es la empresa grande de afuera que llega a
  invertir en Argentina; le resolvemos pagar a proveedores locales desde
  afuera, con cada factura validada por el agente
  ([ideas/adelantos-facturas.md](ideas/adelantos-facturas.md),
  [packages/agente/SPEC.md](../packages/agente/SPEC.md)). Encaja con la
  dirección de Steven de una empresa chilena que abre en Argentina.
- **Investigación:** [investigacion/regulacion-y-competencia.md](investigacion/regulacion-y-competencia.md)
  y [investigacion/numeros.md](investigacion/numeros.md).
- **Necesito de otros:** que los mentores de Twin confirmen liquidez de ARGt y
  si dan CHLt.

## Steven

Actualizado: 7/11/2026 13:29.

- **Decidido:** expansión regional con el circuito de Franco: la empresa
  chilena deja CHLt de colateral en Morpho y recibe ARGt
  ([ideas/expansion-regional.md](ideas/expansion-regional.md)).
- **Hecho:** landing C en `apps/landing` (capturas en
  `apps/landing/capturas/`); modo demo de `apps/web` (corre sin
  `NEXT_PUBLIC_PRIVY_APP_ID`, wallet simulada).
- **En qué estoy:** boceto del dashboard de la empresa (cuánto puede pedir,
  cuánto debe, qué tan seguro está) en estilo Amanecer, para `apps/web`.
- **Necesito de otros:** Franco, si `packages/circuito` ya exporta los
  chequeos, para que el dashboard los use. Nombre del producto (candidatos:
  Paso, Abra).

## Franco

Ver `apps/web/README.md` y `packages/circuito/README.md` hasta que lo pase acá.

## Bri

Sin estado todavía.
